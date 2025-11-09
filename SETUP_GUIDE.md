# NSTSWC Dev Club - Setup Guide

## Overview
A comprehensive developer community platform with Firebase authentication, real-time chat, project management with Kanban boards, event management, and gamification features.

## Tech Stack
- **Frontend**: React.js, TailwindCSS, Shadcn UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB + Firebase Firestore
- **Authentication**: Firebase Auth (Custom email/password flow)
- **Real-time**: Firebase Firestore listeners

## Features Implemented

### 1. **Custom Authentication Flow**
- User submits registration form (name, email, role, interests, GitHub)
- Request stored in MongoDB `pending_users` collection
- Admin reviews and approves from Admin Portal
- Backend generates username/password and creates Firebase Auth account
- Credentials sent via email (nodemailer - to be configured)
- User logs in with email/password

### 2. **Homepage**
- Animated gradient background with floating particles
- Hero section with stats
- Feature cards with hover effects
- Tech stack showcase
- Responsive design

### 3. **Dashboard**
- User stats overview (projects, events, points, badges)
- Recent projects grid
- Upcoming events list
- Top 5 leaderboard preview
- Real-time data updates

### 4. **Projects Page**
- Project grid with cards
- Create new projects (authenticated users)
- Tech stack tags
- GitHub integration
- Member count display

### 5. **Project Detail + Kanban Board**
- Full project information
- Kanban board with 3 columns (To Do, In Progress, Done)
- Create tasks with priority levels
- Drag-and-drop functionality (visual only - update via buttons)
- Task status management

### 6. **Events Page**
- Event calendar view
- Create events (Mentors/Project Leaders only)
- RSVP functionality
- Attendee tracking
- Max capacity management

### 7. **Real-time Chat**
- Club-wide chat room
- Message history
- Real-time updates (polling every 3 seconds)
- User identification
- Timestamp display

### 8. **Leaderboard**
- Top 3 podium display
- Full rankings list
- Points and badges tracking
- User rank highlighting
- Role display

### 9. **Admin Portal**
- View pending registration requests
- Approve users with credential generation
- User details display (email, role, interests, GitHub)
- Bulk approval capability

### 10. **Gamification**
- Points system (stored in user profile)
- Badges array (extensible)
- Leaderboard rankings
- Profile stats

## Setup Instructions

### 1. Firebase Configuration

#### A. Get Firebase Web Config
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `nst-swc`
3. Go to **Project Settings** > **General**
4. Scroll to **Your apps** section
5. If you haven't added a web app, click **Add app** > **Web**
6. Copy the config object

#### B. Update Frontend Config
Edit `/app/frontend/src/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_WEB_API_KEY",
  authDomain: "nst-swc.firebaseapp.com",
  projectId: "nst-swc",
  storageBucket: "nst-swc.appspot.com",
  messagingSenderId: "108242498832887073121",
  appId: "YOUR_APP_ID"
};
```

#### C. Enable Firebase Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. Save changes

#### D. Setup Firestore (Optional for real-time features)
1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Choose production mode
4. Select your region
5. Create database

### 2. Nodemailer Configuration (Optional)

To enable email sending for user credentials:

1. Edit `/app/backend/.env` and add:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

2. For Gmail, you need to:
   - Enable 2-factor authentication
   - Generate an App Password: https://myaccount.google.com/apppasswords

3. Update the backend code to send emails (placeholder is in place)

### 3. MongoDB Database

The following collections are used:
- `pending_users` - Registration requests awaiting approval
- `users` - Approved users with Firebase UID
- `projects` - All projects
- `tasks` - Tasks for projects
- `events` - Events and workshops
- `chat_messages` - Chat history

Collections are created automatically when data is inserted.

## Testing the Application

### 1. Register a New User
1. Go to homepage: `https://your-domain.com`
2. Click "Join Club"
3. Fill registration form
4. Submit request

### 2. Admin Approval
1. Login as admin (you'll need to manually create a Firebase user first)
2. Go to Admin Portal (`/admin`)
3. View pending requests
4. Click "Approve"
5. Set username and password
6. Confirm approval

### 3. User Login
1. Go to Login page
2. Enter email and generated password
3. Access dashboard

### 4. Test Features
- **Create Project**: Go to Projects > New Project
- **Manage Tasks**: Click on a project > Add tasks > Move through Kanban
- **Create Event**: Go to Events > Create Event (if Mentor/Leader)
- **RSVP Event**: Click "RSVP Now" on any event
- **Chat**: Go to Chat > Send messages
- **View Leaderboard**: Check rankings and points

## API Endpoints

### Authentication
- `POST /api/auth/register-request` - Submit registration
- `GET /api/admin/pending-requests` - Get pending users (auth required)
- `POST /api/admin/approve-user` - Approve user (auth required)
- `GET /api/users/me` - Get current user (auth required)

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project (auth required)
- `GET /api/projects/{id}` - Get project details

### Tasks
- `GET /api/tasks/{project_id}` - Get project tasks
- `POST /api/tasks` - Create task (auth required)
- `PATCH /api/tasks/{task_id}` - Update task (auth required)

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event (auth required)
- `POST /api/events/{id}/rsvp` - RSVP to event (auth required)

### Chat
- `GET /api/chat/messages` - Get messages
- `POST /api/chat/messages` - Send message (auth required)

### Leaderboard
- `GET /api/leaderboard` - Get top users by points
- `GET /api/users` - Get all users

## Architecture Decisions

### Why Custom Auth Flow?
The spec required admin approval before account creation, so we implemented:
1. Form submission → MongoDB storage
2. Admin approval → Firebase user creation
3. Email with credentials → User login

### Why Both MongoDB and Firestore?
- **MongoDB**: Primary database for structured data (users, projects, tasks, events)
- **Firestore** (optional): Can be used for real-time features like live chat and notifications

### Current Limitations
1. **Email Sending**: Nodemailer is configured but needs SMTP credentials
2. **File Sharing**: Not implemented (can be added with Firebase Storage)
3. **Real-time Updates**: Using polling instead of WebSockets (can upgrade to Firestore listeners)
4. **Drag-and-Drop**: Visual feedback only, status updates via buttons

## Next Steps / Extensibility

### 1. Enhanced Gamification
- Automated points system (on task completion, event attendance)
- More badge types (First Project, Event Organizer, Top Contributor)
- Achievement notifications

### 2. Real-time Features
- Switch to Firestore listeners for chat
- Live project updates
- Online user presence

### 3. File Sharing
- Integrate Firebase Storage
- Upload project files
- Share documents in chat

### 4. Notifications
- Email notifications for approvals
- In-app notifications
- Event reminders

### 5. Analytics Dashboard
- Admin analytics (user growth, engagement)
- Project metrics
- Event attendance tracking

### 6. Mobile App
- React Native app
- PWA support
- Push notifications

### 7. Third-party Integrations
- GitHub OAuth login
- Discord bot integration
- Slack notifications
- Calendar sync (Google Calendar)

## Design System

### Colors
- **Primary**: Cyan (#00d4ff) and Green (#00ff88)
- **Background**: Dark theme with gradient animations
- **Text**: White and gray scale
- **Accents**: Neon cyan and green for highlights

### Typography
- **Headings**: Space Grotesk (bold, modern)
- **Code**: Fira Code (monospace)
- **Body**: Space Grotesk (regular)

### Components
- Glass-morphism cards with backdrop blur
- Neon borders with glow effects
- Hover lift animations
- Gradient buttons with ripple effect
- Scanline animations on cards

## Troubleshooting

### Frontend not loading?
- Check frontend logs: `tail -f /var/log/supervisor/frontend.out.log`
- Restart frontend: `sudo supervisorctl restart frontend`

### Backend errors?
- Check backend logs: `tail -f /var/log/supervisor/backend.err.log`
- Restart backend: `sudo supervisorctl restart backend`

### Firebase authentication failing?
- Verify API key in `/app/frontend/src/firebase.js`
- Check Firebase Console > Authentication is enabled
- Ensure Email/Password method is active

### Can't approve users?
- Check Firebase Admin SDK config: `/app/backend/firebase_admin_config.json`
- Verify service account has correct permissions

## Support

For issues or questions:
1. Check logs in `/var/log/supervisor/`
2. Review Firebase Console for auth/database errors
3. Test API endpoints with curl or Postman

## License
MIT License - Feel free to modify and extend!
