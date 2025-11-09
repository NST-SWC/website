import axios from 'axios';
import { auth } from '../firebase';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const api = {
  // Auth
  registerRequest: (data) => axios.post(`${API}/auth/register-request`, data),
  
  // Admin
  getPendingRequests: async () => {
    const headers = await getAuthHeaders();
    return axios.get(`${API}/admin/pending-requests`, { headers });
  },
  approveUser: async (data) => {
    const headers = await getAuthHeaders();
    return axios.post(`${API}/admin/approve-user`, data, { headers });
  },
  
  // Users
  getUsers: () => axios.get(`${API}/users`),
  getLeaderboard: () => axios.get(`${API}/leaderboard`),
  
  // Events
  getEvents: () => axios.get(`${API}/events`),
  createEvent: async (data) => {
    const headers = await getAuthHeaders();
    return axios.post(`${API}/events`, data, { headers });
  },
  rsvpEvent: async (eventId) => {
    const headers = await getAuthHeaders();
    return axios.post(`${API}/events/${eventId}/rsvp`, {}, { headers });
  },
  
  // Projects
  getProjects: () => axios.get(`${API}/projects`),
  getProject: (id) => axios.get(`${API}/projects/${id}`),
  createProject: async (data) => {
    const headers = await getAuthHeaders();
    return axios.post(`${API}/projects`, data, { headers });
  },
  
  // Tasks
  getTasks: (projectId) => axios.get(`${API}/tasks/${projectId}`),
  createTask: async (data) => {
    const headers = await getAuthHeaders();
    return axios.post(`${API}/tasks`, data, { headers });
  },
  updateTask: async (taskId, updates) => {
    const headers = await getAuthHeaders();
    return axios.patch(`${API}/tasks/${taskId}`, updates, { headers });
  },
  
  // Chat
  getMessages: () => axios.get(`${API}/chat/messages`),
  sendMessage: async (message) => {
    const headers = await getAuthHeaders();
    return axios.post(`${API}/chat/messages`, { message }, { headers });
  }
};

export default api;