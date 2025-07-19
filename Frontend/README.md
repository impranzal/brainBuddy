# BrainBuddy - AI-Powered Learning Platform
## Setup & Installation Guide

### 🚀 Quick Start

1. **Extract the project files**
   ```bash
   unzip brainbuddy-source.zip
   cd brainbuddy
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### 🔑 Test Accounts

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Student Account:**
- Username: `student`  
- Password: `student123`

### 📁 Project Structure

```
brainbuddy/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn/UI components
│   │   └── ProtectedRoute.jsx
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/              # Application pages
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── Homepage.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AITutorPage.jsx
│   │   ├── AIStudentModePage.jsx
│   │   └── GamifiedLearningPage.jsx
│   └── App.jsx             # Main application component
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

### ✨ Features Overview

#### 🔐 Authentication System
- Role-based login (Student/Admin)
- Protected routes and session management
- Signup with comprehensive user information

#### 🎓 Learning Features
- **AI Tutor**: Interactive learning with 3 modes (Quick, Deep, Step-by-step)
- **AI Student Mode**: Teach topics to AI and receive feedback
- **Flashcard System**: 5 practice questions per topic

#### 🎮 Gamification
- **XP System**: Earn points for completing activities
- **Level Progression**: Advance through levels based on XP
- **Achievements**: 6 different achievements to unlock
- **Badge Collection**: 5 collectible badges
- **Virtual Pet**: "Buddy" evolves as you learn
- **Honor Board**: Leaderboard with top students

#### 📊 Dashboards
- **Student Dashboard**: Personal progress and quick actions
- **Admin Dashboard**: Manage students and view progress reports

### 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **State Management**: React Context API

### 🔧 Development Commands

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Lint code
pnpm run lint
```

### 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

### 🎨 Customization

The application uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Component styles in individual page files
- Global styles in `src/index.css`

### 🚀 Deployment

To deploy the application:

1. **Build the project**
   ```bash
   pnpm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider:
   - Netlify
   - Vercel
   - GitHub Pages
   - Any static hosting service

### 📞 Support

For questions or issues:
1. Check the `PROJECT_SUMMARY.md` for detailed feature documentation
2. Review the source code comments
3. Test with the provided demo accounts

### 🎯 Next Steps

Consider implementing:
- Real AI API integration
- Database persistence
- Push notifications
- Advanced analytics
- Social features

---

## 🌐 Backend API Integration

This frontend is **fully integrated** with the BrainBuddy API 1.0.0 (OAS 3.0) at `http://localhost:5000/api`.

**All documented endpoints are surfaced in the UI and available via the API service layer.**

### User Endpoints
- Signup, login, logout, and profile management
- Dashboard, XP, streak, gamification, and habit stats
- AI Tutor (explanations, flashcards) and AI Student Mode
- Resource library (list, detail, mark completed)
- Honour board (leaderboard)

### Admin Endpoints
- Admin login/logout and profile management
- Manage users and view individual progress reports
- Upload, list, and delete resources (with file upload)
- Honour board search (by username or name)

**Integration Points:**
- All API calls are managed in `src/services/api.js`
- Each page/component uses the API service for real backend data
- All endpoints requiring authentication use JWT tokens
- File uploads (profile/resource) use `multipart/form-data`
- All admin and user flows are protected and role-based

**This ensures the frontend and backend are always in sync.**

---

## 🛠️ Troubleshooting: Tailwind CSS v4+ and PostCSS Errors

If you encounter errors related to Tailwind CSS v4+ or PostCSS (such as plugin not found, or autoprefixer issues), run the following commands:

```bash
npm install -D @tailwindcss/postcss --legacy-peer-deps
npm install -D autoprefixer --legacy-peer-deps
```

These commands resolve most dependency and PostCSS plugin issues with Tailwind CSS v4+ in this project.

---

**Enjoy exploring BrainBuddy! 🧠✨**

