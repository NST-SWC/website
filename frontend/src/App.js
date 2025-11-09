import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import '@/App.css';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import EventsPage from './pages/EventsPage';
import AdminPage from './pages/AdminPage';
import ChatPage from './pages/ChatPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout><Dashboard /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/projects" element={
        <PrivateRoute>
          <Layout><ProjectsPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/projects/:id" element={
        <PrivateRoute>
          <Layout><ProjectDetail /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/events" element={
        <PrivateRoute>
          <Layout><EventsPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/chat" element={
        <PrivateRoute>
          <Layout><ChatPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/leaderboard" element={
        <PrivateRoute>
          <Layout><LeaderboardPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/admin" element={
        <PrivateRoute>
          <Layout><AdminPage /></Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;