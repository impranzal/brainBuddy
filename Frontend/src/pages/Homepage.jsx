import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  LogOut, 
  Trophy, 
  Search,
  Bot,
  GraduationCap,
  Gamepad2,
  Calendar,
  BookOpen,
  Flame,
  Star,
  Users,
  ArrowRight,
  Sparkles,
  Bell,
  Newspaper,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  PieChart,
  BarChart3
} from 'lucide-react';
import * as api from '../services/api';
import toast from "react-hot-toast";

const Homepage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [honorBoardOpen, setHonorBoardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHonorBoard() {
      try {
        const data = await api.getHonourBoard();
        // Defensive: handle both array and object
        if (Array.isArray(data)) {
          setTopStudents(data);
        } else if (Array.isArray(data.students)) {
          setTopStudents(data.students);
        } else if (Array.isArray(data.users)) {
          setTopStudents(data.users);
        } else {
          setTopStudents([]);
        }
      } catch {
        setTopStudents([]);
      }
      setLoading(false);
    }
    fetchHonorBoard();
  }, []);

  const filteredStudents = topStudents.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFeatureClick = (featureName) => {
    // Navigate to specific feature pages
    switch(featureName) {
      case 'AI Tutor':
        navigate('/ai-tutor');
        break;
      case 'AI Student Mode':
        navigate('/ai-student');
        break;
      case 'Gamified Learning':
        navigate('/gamified-learning');
        break;
      case 'Habit-Building Engine':
        navigate('/habit');
        break;
      case 'Resource Library':
        navigate('/resource-library');
        break;
      default:
        toast.error(`${featureName} feature would be implemented here`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Learning Hub! 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our powerful AI-driven features to accelerate your learning journey
          </p>
        </div>

        {/* Main Section: 5 Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* AI Tutor */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-blue-500 flex flex-col h-full" onClick={() => handleFeatureClick('AI Tutor')}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Bot className="h-12 w-12 text-blue-600 group-hover:scale-110 transition-transform" />
                <Sparkles className="h-6 w-6 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                🤖 AI Tutor
              </CardTitle>
              <CardDescription className="text-gray-600">
                Learn any topic with personalized explanations and flashcards
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                  Choose learning style: Quick, Deep, or Step-by-step
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                  Get 5 related flashcard questions
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                  Save responses and earn XP
                </div>
              </div>
              <Button className="w-full mt-4 group-hover:bg-blue-600 transition-colors">
                Start Learning
              </Button>
            </CardContent>
          </Card>

          {/* AI Student Mode */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-green-500 flex flex-col h-full" onClick={() => handleFeatureClick('AI Student Mode')}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <GraduationCap className="h-12 w-12 text-green-600 group-hover:scale-110 transition-transform" />
                <Sparkles className="h-6 w-6 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                🎓 Enhance Your Knowledge
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enhance Your Knowledge - explain topics to AI and get feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  Explain any topic to the AI
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  Get follow-up questions and feedback
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  Track weak areas for review
                </div>
              </div>
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 transition-colors">
                Start Enhancing
              </Button>
            </CardContent>
          </Card>

          {/* Resource Library */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-indigo-500 flex flex-col h-full" onClick={() => handleFeatureClick('Resource Library')}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <BookOpen className="h-12 w-12 text-indigo-600 group-hover:scale-110 transition-transform" />
                <Sparkles className="h-6 w-6 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                📚 Resource Library
              </CardTitle>
              <CardDescription className="text-gray-600">
                Access resources like notes, practice sets, and syllabus as you want
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-indigo-500" />
                  Filter by semester and subject
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-indigo-500" />
                  Download PDFs and practice sets
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-indigo-500" />
                  Mark completed and earn XP
                </div>
              </div>
              <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Browse Resources
              </Button>
            </CardContent>
          </Card>

          {/* Notice Board Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-orange-500 flex flex-col h-full" onClick={() => navigate('/notice-board')}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Bell className="h-12 w-12 text-orange-600 group-hover:scale-110 transition-transform" />
                <Badge className="bg-orange-100 text-orange-800">3 New</Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                📢 Notice Board
              </CardTitle>
              <CardDescription className="text-gray-600">
                Stay updated with campus announcements, academic notices, and important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-orange-500" />
                  Academic announcements and exam schedules
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-orange-500" />
                  Campus maintenance and facility updates
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-orange-500" />
                  Student events and activities
                </div>
              </div>
              <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 transition-colors">
                View Notices
              </Button>
            </CardContent>
          </Card>

          {/* Tech News Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-purple-500 flex flex-col h-full" onClick={() => navigate('/tech-news')}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Newspaper className="h-12 w-12 text-purple-600 group-hover:scale-110 transition-transform" />
                <Badge className="bg-purple-100 text-purple-800">2 Trending</Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                📰 Tech News
              </CardTitle>
              <CardDescription className="text-gray-600">
                Explore the latest technology trends, AI breakthroughs, and industry innovations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-purple-500" />
                  AI and machine learning breakthroughs
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-purple-500" />
                  Cybersecurity and digital security updates
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-purple-500" />
                  Emerging technologies and innovations
                </div>
              </div>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 transition-colors">
                Read News
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Stats */}
        <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Your Learning Journey
            </h2>
            <p className="text-gray-600">Track your progress and celebrate your achievements</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Streak */}
            <div className="group relative">
              <div className="bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-100">
                <div className="bg-white rounded-xl p-6 text-center h-full">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-10 w-10 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{user?.streak || 0}</p>
                  <p className="text-sm font-medium text-gray-600">Day Streak</p>
                  <div className="mt-2 text-xs text-orange-600 font-medium">
                    Keep it burning! 🔥
                  </div>
                </div>
              </div>
            </div>

            {/* XP */}
            <div className="group relative">
              <div className="bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-100">
                <div className="bg-white rounded-xl p-6 text-center h-full">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-10 w-10 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{user?.xp || 0}</p>
                  <p className="text-sm font-medium text-gray-600">Total XP</p>
                  <div className="mt-2 text-xs text-yellow-600 font-medium">
                    Experience points earned! ⭐
                  </div>
                </div>
              </div>
            </div>

            {/* Level */}
            <div className="group relative">
              <div className="bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-100">
                <div className="bg-white rounded-xl p-6 text-center h-full">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-10 w-10 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{user?.level || 1}</p>
                  <p className="text-sm font-medium text-gray-600">Current Level</p>
                  <div className="mt-2 text-xs text-blue-600 font-medium">
                    Level up your skills! 🏆
                  </div>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="group relative">
              <div className="bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-100">
                <div className="bg-white rounded-xl p-6 text-center h-full">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{user?.completedLessons || 0}</p>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    Lessons mastered! 📚
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                <span>Active Streak</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                <span>Experience Points</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                <span>Skill Level</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                <span>Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

