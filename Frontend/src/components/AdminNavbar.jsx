import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Trophy, Flame, Search } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Adjust the path based on your logo location
// import api from "../services/api";

const AdminNavbar = () => {
  const [honorBoardOpen, setHonorBoardOpen] = useState(false);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchHonorBoard() {
      try {
        const data = await api.getHonourBoard();
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

  const filteredStudents = topStudents.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    localStorage.removeItem("brainbuddy_token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Link to="/profile">
              <img src={logo} alt="BrainBuddy Logo" className="h-12 w-12" />
            </Link>
            <Link
              to="/profile"
              className="text-2xl font-bold text-blue-600 ml-1"
            >
              BrainBuddy
            </Link>
          </div>
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/ai-tutor"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            AI Tutor
          </Link>
          <Link
            to="/ai-student"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Enhance Your Skills
          </Link>
          <Link
            to="/resource-library"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Resources
          </Link>
          <Link
            to="/notice-board"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Notice Board
          </Link>
          <Link
            to="/tech-news"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Tech News
          </Link>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          {/* Honor Board Sheet */}
          <Sheet open={honorBoardOpen} onOpenChange={setHonorBoardOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:-translate-y-1"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Honor Board
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Honor Board
                </SheetTitle>
                <SheetDescription>
                  Top students with highest streaks
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-3">
                  {filteredStudents.map((student, index) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {student.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Flame className="h-3 w-3 mr-1 text-orange-500" />
                            {student.streak} day streak
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Level {student.level}</Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {student.xp} XP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          {/* Logout Button */}
          <Button
            variant="destructive"
            onClick={() => handleLogout()}
            className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:-translate-y-1"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
