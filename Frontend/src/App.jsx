import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Homepage from "./pages/Homepage";
import AITutorPage from "./pages/AITutorPage";
import AIStudentModePage from "./pages/AIStudentModePage";
import GamifiedLearningPage from "./pages/GamifiedLearningPage";
import UserResources from "./pages/UserResources";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import HabitPage from "./pages/HabitPage";
import LandingPage from "./pages/LandingPage";
import NoticeBoardPage from "./pages/NoticeBoardPage";
import TechNewsPage from "./pages/TechNewsPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
import OpenRoutes from "./wrapppers/open-wrapper";
import UserLayout from "./wrapppers/user-layout";
import UserWrapper from "./wrapppers/user-wrapper";
import AdminWrapper from "./wrapppers/admin-wrapper";

const ResourceLibraryPage = () => (
  <div className="min-h-screen flex items-center justify-center text-2xl">
    Resource Library Coming Soon!
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route element={<OpenRoutes />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>

          {/* Protected Routes for User*/}
          <Route element={<UserLayout />}>
            <Route element={<UserWrapper />}>
              <Route path="/profile" element={<UserDashboard />} />
              <Route path="/dashboard" element={<Homepage />} />
              <Route path="/ai-tutor" element={<AITutorPage />} />
              <Route path="/ai-student" element={<AIStudentModePage />} />
              <Route
                path="/gamified-learning"
                element={<GamifiedLearningPage />}
              />
              <Route path="/resources" element={<UserResources />} />
              <Route path="/habit" element={<HabitPage />} />
              <Route
                path="/resource-library"
                element={<ResourceLibraryPage />}
              />
              <Route path="/resources" element={<UserResources />} />
              <Route path="/notice-board" element={<NoticeBoardPage />} />
              <Route path="/tech-news" element={<TechNewsPage />} />
            </Route>
          </Route>

          {/* protected routes for Admin */}
          <Route element={<AdminWrapper />}>
            <Route path={"/admin-dashboard"} element={<AdminDashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
