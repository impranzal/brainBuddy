# BrainBuddy - AI-Powered Learning Platform

## Overview

BrainBuddy is a full-stack, AI-powered learning platform designed to make education engaging and effective. It combines interactive AI tutoring, gamified learning, and robust user management for both students and administrators.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [API Integration](#api-integration)
- [Testing & Accounts](#testing--accounts)
- [Future Enhancements](#future-enhancements)
- [Support](#support)

---

## Features

- **Role-based Authentication:** Student/Admin login, protected routes, session management.
- **AI Tutor:** Interactive learning with multiple modes (Quick, Deep, Step-by-step).
- **AI Student Mode:** Users teach topics to AI and receive feedback.
- **Gamification:** XP system, level progression, achievements, badges, and a virtual pet.
- **Dashboards:** Personalized dashboards for students and admins.
- **Resource Library:** Upload, list, and manage learning resources.
- **Honor Board:** Leaderboard with top students and streaks.
- **Responsive Design:** Works on desktop, tablet, and mobile.

---

## Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Shadcn/UI, React Router v6, Lucide React, Context API
- **Backend:** Node.js, Express, Prisma ORM, JWT authentication, Zod validation, Cloudinary, Swagger (API docs)
- **Database:** Prisma (supports PostgreSQL, MySQL, SQLite, etc.)
- **Other:** Axios, Multer, dotenv, rate limiting, CORS

---

## Project Structure

```
brainBuddy/
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React Context providers
│   │   ├── pages/           # Application pages
│   │   └── App.jsx          # Main app
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend docs
├── Backend/
│   ├── src/
│   │   ├── controller/      # Route controllers
│   │   ├── middleware/      # Express middlewares
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Prisma schema & migrations
│   ├── package.json         # Backend dependencies
│   └── README.md            # Backend docs (add if needed)
```

---

## Setup & Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm
- (Optional) PostgreSQL/MySQL/SQLite for database

### 1. Clone the repository

```bash
git clone https://github.com/impranzal/brainBuddy.git
cd brainBuddy
```

### 2. Install dependencies

#### Frontend
```bash
cd Frontend
pnpm install   # or npm install
```

#### Backend
```bash
cd ../Backend
pnpm install   # or npm install
```

### 3. Configure environment variables

- Backend: Create a `.env` file in `/Backend` for database and API keys.
- Frontend: Update API URLs in `/Frontend/src/config/api.js` if needed.

### 4. Run the development servers

#### Backend
```bash
cd Backend
pnpm run dev   # or npm run dev
```

#### Frontend
```bash
cd ../Frontend
pnpm run dev   # or npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api

---

## Frontend Overview

- Built with React 18, Vite, and Tailwind CSS.
- Modern UI with Shadcn/UI and Lucide icons.
- Features include authentication, dashboards, AI tutor, gamification, resource management, and more.
- All API calls are managed in `src/services/api.js`.
- Fully responsive and customizable.

---

## Backend Overview

- Node.js + Express REST API.
- Prisma ORM for database management.
- JWT-based authentication and role-based access control.
- File uploads via Multer and Cloudinary.
- Rate limiting, CORS, and error handling middleware.
- API documentation with Swagger.

---

## API Integration

- The frontend is fully integrated with the backend API at `http://localhost:5000/api`.
- All endpoints are documented and surfaced in the UI.
- Authentication, resource management, gamification, and more are available via the API.

---

## Testing & Accounts

### Test Accounts

**Admin**
- Username: `admin`
- Password: `admin123`

**Student**
- Username: `student`
- Password: `student123`

---

## Future Enhancements

- Real AI API integration
- Persistent database storage
- Push notifications
- Advanced analytics
- Social features (friends, group challenges)
- Habit-building engine

---

## Support

- For questions, see `Frontend/PROJECT_SUMMARY.md` and code comments.
- Open issues or discussions on the GitHub repository.

---

**Enjoy exploring BrainBuddy! 🚀** 