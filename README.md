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
- **Habit Tracking:** Build and track learning habits with dedicated pages and sections.
- **Tech News Feed:** Stay updated with the latest technology news.
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
│   │   │   └── ui/         # Extensive Shadcn/UI-based components
│   │   ├── wrapppers/      # Layout and route wrappers (note: typo, should be 'wrappers')
│   │   ├── contexts/       # React Context providers
│   │   ├── pages/          # Application pages (Dashboard, AI Tutor, Habit, Tech News, etc.)
│   │   ├── data/           # Static data (e.g., pets)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── config/         # API config
│   │   └── App.jsx         # Main app
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend docs
├── Backend/
│   ├── src/
│   │   ├── controller/     # Route controllers
│   │   ├── middleware/     # Express middlewares (auth, error, rate limit, upload, validation)
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions (validators, config, cloudinary, gemini, etc.)
│   │   ├── jwt/            # JWT token utilities
│   │   ├── connect/        # Prisma connection
│   │   └── types/          # Type definitions
│   ├── prisma/             # Prisma schema & migrations
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend docs (add if needed)
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
- Features include authentication, dashboards, AI tutor, gamification, resource management, habit tracking, tech news, and more.
- Modular and reusable UI system with 40+ components in `src/components/ui/`.
- Layout and route wrappers in `src/wrapppers/` for flexible page structure.
- All API calls are managed in `src/services/api.js`.
- Fully responsive and customizable.

---

## Backend Overview

- Node.js + Express REST API.
- Prisma ORM for database management.
- JWT-based authentication and role-based access control (see `src/jwt/`).
- Centralized Prisma connection management (see `src/connect/`).
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

You can log in using either **username or email** for the test accounts below:

**Admin**
- Username: `admin`  
- Email: `admin@example.com`
- Password: `admin123`

**Student**
- Username: `student`  
- Email: `student@example.com`
- Password: `student123`

---

## Security Note: API Keys

- All sensitive API keys (such as Gemini) are now securely stored on the backend and never exposed to the frontend or end users.
- The frontend communicates with the backend for all Gemini API requests, ensuring your keys remain private.

---

## Future Enhancements

- Real AI API integration
- Persistent database storage
- Push notifications
- Advanced analytics
- Social features (friends, group challenges)
- Habit-building engine

---

## Environment Variables

### Backend (.env in /Backend)

- `DATABASE_URL` — Your database connection string (PostgreSQL, MySQL, or SQLite)
- `GEMINI_API_KEY` — Your Gemini API key (never expose this to frontend)
- (Add any other secrets, e.g., JWT secret, Cloudinary keys, etc.)

### Frontend (.env in /Frontend, if needed)

- (Optional) `VITE_API_BASE` — Override backend API base URL for deployment

**Never commit your .env files to version control.**

---

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/impranzal/brainBuddy) or contact the project maintainer.