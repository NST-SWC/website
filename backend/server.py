from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
import secrets
import string

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize Firebase Admin
cred = credentials.Certificate(str(ROOT_DIR / 'firebase_admin_config.json'))
firebase_admin.initialize_app(cred)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class UserRegistrationRequest(BaseModel):
    name: str
    email: str
    role: str  # Student Developer, Project Leader, Mentor
    interests: List[str]
    github_username: Optional[str] = None

class PendingUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    role: str
    interests: List[str]
    github_username: Optional[str] = None
    status: str = "pending"  # pending, approved, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ApproveUserRequest(BaseModel):
    user_id: str
    username: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    uid: str  # Firebase UID
    name: str
    email: str
    username: str
    role: str
    interests: List[str]
    github_username: Optional[str] = None
    badges: List[str] = []
    points: int = 0
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: str
    time: str
    location: str
    image_url: Optional[str] = None
    organizer_id: str
    attendees: List[str] = []
    max_attendees: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventCreate(BaseModel):
    title: str
    description: str
    date: str
    time: str
    location: str
    image_url: Optional[str] = None
    max_attendees: Optional[int] = None

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    owner_id: str
    members: List[str] = []
    tech_stack: List[str] = []
    github_url: Optional[str] = None
    status: str = "active"  # active, completed, archived
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectCreate(BaseModel):
    name: str
    description: str
    tech_stack: List[str] = []
    github_url: Optional[str] = None

class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    title: str
    description: str
    assignee_id: Optional[str] = None
    status: str = "todo"  # todo, in_progress, done
    priority: str = "medium"  # low, medium, high
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskCreate(BaseModel):
    project_id: str
    title: str
    description: str
    assignee_id: Optional[str] = None
    priority: str = "medium"

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str
    sender_name: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessageCreate(BaseModel):
    message: str

# Auth Middleware
async def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.split('Bearer ')[1]
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth Routes
@api_router.post("/auth/register-request")
async def register_request(user_data: UserRegistrationRequest):
    # Check if email already exists
    existing = await db.pending_users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Registration request already exists")
    
    pending_user = PendingUser(**user_data.model_dump())
    doc = pending_user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.pending_users.insert_one(doc)
    return {"message": "Registration request submitted. Please wait for admin approval."}

@api_router.get("/admin/pending-requests")
async def get_pending_requests(user: dict = Depends(verify_token)):
    # Check if user is admin (you can add role check here)
    pending = await db.pending_users.find({"status": "pending"}, {"_id": 0}).to_list(1000)
    for user in pending:
        if isinstance(user.get('created_at'), str):
            user['created_at'] = datetime.fromisoformat(user['created_at'])
    return pending

@api_router.post("/admin/approve-user")
async def approve_user(approve_data: ApproveUserRequest, admin: dict = Depends(verify_token)):
    # Get pending user
    pending_user = await db.pending_users.find_one({"id": approve_data.user_id, "status": "pending"})
    if not pending_user:
        raise HTTPException(status_code=404, detail="Pending user not found")
    
    try:
        # Create Firebase user
        firebase_user = firebase_auth.create_user(
            email=pending_user['email'],
            password=approve_data.password,
            display_name=pending_user['name']
        )
        
        # Create user in MongoDB
        user = User(
            id=str(uuid.uuid4()),
            uid=firebase_user.uid,
            name=pending_user['name'],
            email=pending_user['email'],
            username=approve_data.username,
            role=pending_user['role'],
            interests=pending_user['interests'],
            github_username=pending_user.get('github_username')
        )
        
        user_doc = user.model_dump()
        user_doc['joined_at'] = user_doc['joined_at'].isoformat()
        await db.users.insert_one(user_doc)
        
        # Update pending user status
        await db.pending_users.update_one(
            {"id": approve_data.user_id},
            {"$set": {"status": "approved"}}
        )
        
        # TODO: Send email with credentials using nodemailer
        # This will be implemented when nodemailer is configured
        
        return {
            "message": "User approved successfully",
            "credentials": {
                "email": pending_user['email'],
                "password": approve_data.password,
                "username": approve_data.username
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/users/me")
async def get_current_user(token_data: dict = Depends(verify_token)):
    user = await db.users.find_one({"uid": token_data['uid']}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.get("/users")
async def get_users():
    users = await db.users.find({}, {"_id": 0}).to_list(1000)
    return users

@api_router.get("/leaderboard")
async def get_leaderboard():
    users = await db.users.find({}, {"_id": 0}).sort("points", -1).to_list(100)
    return users

# Event Routes
@api_router.post("/events", response_model=Event)
async def create_event(event_data: EventCreate, user: dict = Depends(verify_token)):
    current_user = await db.users.find_one({"uid": user['uid']})
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    event = Event(**event_data.model_dump(), organizer_id=current_user['id'])
    doc = event.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.events.insert_one(doc)
    return event

@api_router.get("/events")
async def get_events():
    events = await db.events.find({}, {"_id": 0}).to_list(1000)
    for event in events:
        if isinstance(event.get('created_at'), str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
    return events

@api_router.post("/events/{event_id}/rsvp")
async def rsvp_event(event_id: str, user: dict = Depends(verify_token)):
    current_user = await db.users.find_one({"uid": user['uid']})
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    event = await db.events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if current_user['id'] in event.get('attendees', []):
        raise HTTPException(status_code=400, detail="Already registered")
    
    if event.get('max_attendees') and len(event.get('attendees', [])) >= event['max_attendees']:
        raise HTTPException(status_code=400, detail="Event is full")
    
    await db.events.update_one(
        {"id": event_id},
        {"$push": {"attendees": current_user['id']}}
    )
    
    return {"message": "RSVP successful"}

# Project Routes
@api_router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate, user: dict = Depends(verify_token)):
    current_user = await db.users.find_one({"uid": user['uid']})
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    project = Project(**project_data.model_dump(), owner_id=current_user['id'], members=[current_user['id']])
    doc = project.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.projects.insert_one(doc)
    return project

@api_router.get("/projects")
async def get_projects():
    projects = await db.projects.find({}, {"_id": 0}).to_list(1000)
    for project in projects:
        if isinstance(project.get('created_at'), str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
    return projects

@api_router.get("/projects/{project_id}")
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# Task Routes
@api_router.post("/tasks", response_model=Task)
async def create_task(task_data: TaskCreate, user: dict = Depends(verify_token)):
    task = Task(**task_data.model_dump())
    doc = task.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.tasks.insert_one(doc)
    return task

@api_router.get("/tasks/{project_id}")
async def get_tasks(project_id: str):
    tasks = await db.tasks.find({"project_id": project_id}, {"_id": 0}).to_list(1000)
    for task in tasks:
        if isinstance(task.get('created_at'), str):
            task['created_at'] = datetime.fromisoformat(task['created_at'])
    return tasks

@api_router.patch("/tasks/{task_id}")
async def update_task(task_id: str, updates: dict, user: dict = Depends(verify_token)):
    await db.tasks.update_one(
        {"id": task_id},
        {"$set": updates}
    )
    return {"message": "Task updated"}

# Chat Routes
@api_router.post("/chat/messages")
async def send_message(message_data: ChatMessageCreate, user: dict = Depends(verify_token)):
    current_user = await db.users.find_one({"uid": user['uid']})
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    message = ChatMessage(
        sender_id=current_user['id'],
        sender_name=current_user['name'],
        message=message_data.message
    )
    doc = message.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.chat_messages.insert_one(doc)
    return message

@api_router.get("/chat/messages")
async def get_messages(limit: int = 100):
    messages = await db.chat_messages.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    for msg in messages:
        if isinstance(msg.get('timestamp'), str):
            msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
    return list(reversed(messages))

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()