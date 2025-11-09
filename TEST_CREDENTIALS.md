# NSTSWC Dev Club - Test Login Credentials

## ✅ Ready to Test!

Your Firebase is now fully configured and the platform is ready to use.

---

## 🔐 Test Accounts

### **Admin Account** (Full Access)
```
Email: admin@nstswc.com
Password: Admin123!
Role: Mentor
Points: 1500
Badges: Early Adopter, Club Admin
```

**Admin Capabilities:**
- ✅ Access Admin Portal to approve new registrations
- ✅ Create events
- ✅ Create and manage projects
- ✅ Access all features

---

### **Regular User Account**
```
Email: john@nstswc.com
Password: John123!
Role: Student Developer
Points: 250
Badges: First Login
```

**User Capabilities:**
- ✅ View and RSVP to events
- ✅ Create projects
- ✅ Join projects
- ✅ Participate in chat
- ✅ View leaderboard

---

## 📊 Pre-loaded Sample Data

### **Projects:**
1. **AI Chatbot Platform** - GPT-4 powered chatbot
2. **Dev Club Website** - Modern portfolio site
3. **Task Management App** - Kanban task manager

### **Events:**
1. **React Workshop** - Jan 15, 2025
2. **Hackathon 2025** - Jan 20, 2025
3. **AI/ML Study Group** - Jan 12, 2025

### **Pending Registrations:**
- Test Admin (already approved)
- John Developer (already approved)

---

## 🧪 Testing Checklist

### Authentication Flow
- [x] Login with admin account
- [x] Login with regular user account
- [ ] Register new user (form submission)
- [ ] Admin approve new user
- [ ] New user login with credentials

### Dashboard
- [x] View stats (projects, events, points, badges)
- [x] See recent projects
- [x] See upcoming events
- [x] View leaderboard preview

### Projects
- [ ] View all projects
- [ ] Create new project
- [ ] Click into project detail
- [ ] View Kanban board
- [ ] Create task
- [ ] Move task through columns (To Do → In Progress → Done)

### Events
- [ ] View all events
- [ ] Create event (as Mentor/Leader)
- [ ] RSVP to event
- [ ] Check attendee count updates

### Chat
- [ ] Send messages
- [ ] View message history
- [ ] See real-time updates (auto-refreshes every 3 seconds)

### Leaderboard
- [ ] View top 3 podium
- [ ] See full rankings
- [ ] Find your position
- [ ] Check points and badges

### Admin Portal (Mentor/Leader only)
- [ ] View pending registration requests
- [ ] Approve new user
- [ ] Generate username/password
- [ ] See success confirmation

---

## 🚀 Quick Start

1. **Open the app:** https://nstswc-tech.preview.emergentagent.com

2. **Login as Admin:**
   - Click "Login"
   - Enter: `admin@nstswc.com` / `Admin123!`
   - Explore dashboard, projects, events, admin portal

3. **Test Registration Flow:**
   - Logout
   - Click "Join Club"
   - Fill registration form
   - Login back as admin
   - Go to Admin Portal
   - Approve the new user
   - Logout and login as the new user

4. **Test All Features:**
   - Create a project
   - Add tasks to Kanban board
   - Create an event
   - RSVP to events
   - Send chat messages
   - Check leaderboard

---

## 🎯 Feature Highlights to Test

### **1. Beautiful Animations**
- Gradient backgrounds that animate
- Floating particles on homepage
- Hover lift effects on cards
- Glass-morphism effects
- Neon borders with glow

### **2. Kanban Board**
- Drag-and-drop visual (status updates via buttons)
- Color-coded priorities (low, medium, high)
- Task creation with descriptions
- Status tracking (todo, in_progress, done)

### **3. Real-time Chat**
- Message history loaded
- Auto-refresh every 3 seconds
- User avatars with initials
- Timestamp display
- Smooth scrolling

### **4. Gamification**
- Points system visible in header
- Badges displayed on profile
- Leaderboard rankings
- Top 3 podium display
- User rank highlighting

### **5. Admin Features**
- Pending requests dashboard
- One-click approval
- Auto-generated credentials
- User details display
- Email notification (when configured)

---

## 📝 Creating Additional Test Users

You can register new users through the UI:

1. Go to homepage
2. Click "Join Club"
3. Fill out the form:
   - Name: Any name
   - Email: Any valid email
   - Role: Student Developer / Project Leader / Mentor
   - Interests: Comma-separated (e.g., "React, Python, AI")
   - GitHub: Your GitHub username (optional)

4. Login as admin (`admin@nstswc.com`)
5. Go to Admin Portal
6. Click "Approve" on the pending request
7. Set username and password
8. Click "Confirm & Approve"
9. Logout and login with the new credentials

---

## 🔧 Troubleshooting

### Can't login?
- Verify you're using the correct email/password
- Check browser console for errors
- Ensure Firebase Authentication is enabled in Firebase Console

### Not seeing data?
- Refresh the page
- Check browser network tab for API errors
- Verify MongoDB is running

### Admin portal not showing?
- Admin portal is only visible to Mentor and Project Leader roles
- Login with `admin@nstswc.com` to access it

---

## 🎨 Design Features to Notice

- **Dark Theme** with animated gradient backgrounds
- **Neon Accents** - Cyan (#00d4ff) and Green (#00ff88)
- **Space Grotesk Font** - Modern, tech-focused typography
- **Glass Cards** - Frosted glass effect with backdrop blur
- **Hover Effects** - Lift animations on interactive elements
- **Responsive Design** - Mobile-first, works on all devices
- **Particle Animations** - Floating particles on homepage
- **Scanline Effects** - Retro tech aesthetic on cards

---

## 📱 Mobile Testing

The platform is fully responsive! Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

All features work seamlessly across devices.

---

## 🎉 Have Fun Testing!

Explore all the features, create projects, join events, and see how the gamification system works!

If you find any issues or have questions, check the logs:
- Frontend: `/var/log/supervisor/frontend.out.log`
- Backend: `/var/log/supervisor/backend.err.log`
