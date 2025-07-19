import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Gamepad2,
  Calendar,
  ArrowRight,
  CheckCircle,
  CircleUserRound,
  Sparkles,
  TrendingUp,
  PieChart,
  BarChart3,
  Zap,
  Target,
  Heart,
  Battery,
  Star,
} from "lucide-react";
import * as api from "../services/api";

const UserDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Pet state
  const [petHappiness, setPetHappiness] = useState(85);
  const [petEnergy, setPetEnergy] = useState(92);
  const [petExperience, setPetExperience] = useState(67);
  const [petLevel, setPetLevel] = useState(3);
  const [petName] = useState("Luna");
  const [lastFed, setLastFed] = useState(Date.now() - 3600000); // 1 hour ago
  const [lastPlayed, setLastPlayed] = useState(Date.now() - 7200000); // 2 hours ago

  // Quiz data
  const quizData = [
    { 
      question: "What is the capital of France?", 
      answer: "Paris", 
      options: ["London", "Paris", "Berlin", "Madrid"],
      completed: false,
      xpReward: 10
    },
    { 
      question: "Which planet is closest to the Sun?", 
      answer: "Mercury", 
      options: ["Venus", "Mercury", "Mars", "Earth"],
      completed: false,
      xpReward: 10
    },
    { 
      question: "What is 2 + 2?", 
      answer: "4", 
      options: ["3", "4", "5", "6"],
      completed: false,
      xpReward: 5
    },
    { 
      question: "Who wrote Romeo and Juliet?", 
      answer: "Shakespeare", 
      options: ["Shakespeare", "Dickens", "Austen", "Tolstoy"],
      completed: false,
      xpReward: 15
    },
    { 
      question: "What is the largest ocean?", 
      answer: "Pacific", 
      options: ["Atlantic", "Pacific", "Indian", "Arctic"],
      completed: false,
      xpReward: 10
    },
    { 
      question: "What is the chemical symbol for gold?", 
      answer: "Au", 
      options: ["Ag", "Au", "Fe", "Cu"],
      completed: false,
      xpReward: 15
    },
    { 
      question: "How many sides does a hexagon have?", 
      answer: "6", 
      options: ["5", "6", "7", "8"],
      completed: false,
      xpReward: 5
    },
    { 
      question: "What year did World War II end?", 
      answer: "1945", 
      options: ["1943", "1944", "1945", "1946"],
      completed: false,
      xpReward: 15
    },
    { 
      question: "What is the square root of 64?", 
      answer: "8", 
      options: ["6", "7", "8", "9"],
      completed: false,
      xpReward: 10
    },
    { 
      question: "Who painted the Mona Lisa?", 
      answer: "Da Vinci", 
      options: ["Van Gogh", "Da Vinci", "Picasso", "Monet"],
      completed: false,
      xpReward: 15
    }
  ];

  const completedQuizzes = quizData.filter(quiz => quiz.completed).length;

  useEffect(() => {
    async function fetchStats() {
      try {
        const profile = await api.getProfile();
        setProfileImage(profile.profilePicture || "");
        setLevel(profile.level || 1);

        const xpRes = await api.getXP();
        setXP(xpRes.xp || 0);

        const streakRes = await api.getStreak();
        setStreak(streakRes.streak || 0);

        const habitRes = await api.getHabitStats();
        setHabits(habitRes.habits || []);
      } catch {}
      setLoading(false);
    }
    fetchStats();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file.");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }
    
    try {
      // Show loading state
      const loadingMessage = "Uploading profile picture...";
      console.log(loadingMessage);
      
      const result = await api.uploadUserProfilePicture(file);
      const imageUrl = result.profilePictureUrl || result.url || "";
      
      if (imageUrl) {
        setProfileImage(imageUrl);
        await updateUser({
          profilePicture: imageUrl,
        });
        alert("✅ Profile picture updated successfully!");
      } else {
        throw new Error("No image URL received");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Failed to upload profile picture. Please try again.");
    }
    
    // Reset the input
    e.target.value = '';
  };

  // Quiz interaction functions
  const handleQuizAnswer = (answer) => {
    const currentQuiz = quizData[currentQuizIndex];
    const isCorrect = answer === currentQuiz.answer;
    
    setQuizAnswers(prev => ({
      ...prev,
      [currentQuizIndex]: answer
    }));
    
    setShowQuizResult(true);
    
    if (isCorrect) {
      // Mark quiz as completed
      quizData[currentQuizIndex].completed = true;
      
      // Award XP
      const earnedXP = currentQuiz.xpReward;
      setXP(prev => prev + earnedXP);
      
      // Update pet experience
      setPetExperience(prev => Math.min(100, prev + 5));
      
      // Show success message
      setTimeout(() => {
        alert(`🎉 Correct! You earned ${earnedXP} XP!`);
        setShowQuizResult(false);
        nextQuiz();
      }, 1500);
    } else {
      // Show failure message
      setTimeout(() => {
        alert(`❌ Wrong answer. The correct answer is: ${currentQuiz.answer}`);
        setShowQuizResult(false);
      }, 1500);
    }
  };

  const nextQuiz = () => {
    const nextIndex = currentQuizIndex + 1;
    if (nextIndex < quizData.length) {
      setCurrentQuizIndex(nextIndex);
    } else {
      // All quizzes completed
      setQuizCompleted(true);
      alert("🎊 Congratulations! You've completed all quizzes for today!");
    }
  };

  const resetQuizzes = () => {
    quizData.forEach(quiz => quiz.completed = false);
    setCurrentQuizIndex(0);
    setQuizAnswers({});
    setShowQuizResult(false);
    setQuizCompleted(false);
  };

  // Pet interaction functions
  const feedPet = () => {
    const timeSinceLastFed = Date.now() - lastFed;
    if (timeSinceLastFed < 300000) { // 5 minutes cooldown
      alert("🍖 Luna is still full! Wait a bit before feeding again.");
      return;
    }
    
    setPetEnergy(prev => Math.min(100, prev + 15));
    setPetHappiness(prev => Math.min(100, prev + 10));
    setLastFed(Date.now());
    
    // Award small XP for caring for pet
    setXP(prev => prev + 5);
    
    alert("🍖 Luna loved the food! +5 XP for being caring!");
  };

  const playWithPet = () => {
    const timeSinceLastPlayed = Date.now() - lastPlayed;
    if (timeSinceLastPlayed < 600000) { // 10 minutes cooldown
      alert("🎾 Luna is tired! Wait a bit before playing again.");
      return;
    }
    
    setPetHappiness(prev => Math.min(100, prev + 20));
    setPetEnergy(prev => Math.max(0, prev - 10));
    setPetExperience(prev => Math.min(100, prev + 8));
    setLastPlayed(Date.now());
    
    // Award XP for playing
    setXP(prev => prev + 8);
    
    alert("🎾 Luna had fun playing! +8 XP for being playful!");
  };

  // Check if pet can level up
  useEffect(() => {
    if (petExperience >= 100) {
      setPetLevel(prev => prev + 1);
      setPetExperience(0);
      alert(`🎉 Luna evolved to Level ${petLevel + 1}! +20 XP bonus!`);
      setXP(prev => prev + 20);
    }
  }, [petExperience, petLevel]);

  // Check if user level should increase
  useEffect(() => {
    const currentLevelXp = xp % 100;
    const calculatedLevel = Math.floor(xp / 100) + 1;
    
    if (calculatedLevel > level) {
      setLevel(calculatedLevel);
      alert(`🎉 Congratulations! You've reached Level ${calculatedLevel}!`);
    }
  }, [xp, level]);

  const xpForNextLevel = 100; // Fixed XP requirement for next level
  const currentLevelXp = xp % 100;
  const progressPercentage = (currentLevelXp / 100) * 100;

  const quotes = [
    "The expert in anything was once a beginner.",
    "Learning never exhausts the mind. - Leonardo da Vinci",
    "Education is the most powerful weapon which you can use to change the world.",
    "The more that you read, the more things you will know.",
    "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  ];
  const todayQuote = quotes[new Date().getDay() % quotes.length];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <CircleUserRound size={60} />
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                WELCOME, {user?.name?.toUpperCase() || "User"}!
              </h2>
              <p className="text-gray-600 text-md mt-1">
                Level <span className="text-red-600 font-bold">{level}</span>{" "}
                &bull; <span className="text-green-600 font-bold">{xp}</span> XP
                &bull; <span className="text-blue-600 font-bold">{streak}</span>{" "}
                day streak
              </p>
            </div>
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Enhanced Profile & Progress */}
            <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                  <CircleUserRound className="h-5 w-5 mr-2 text-blue-500" />
                  👤 Profile & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={profileImage}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="mt-2 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="profile-upload"
                    />
                    <label 
                      htmlFor="profile-upload" 
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 cursor-pointer transition-colors"
                    >
                      📷 Change Photo
                    </label>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-md">{user?.name}</div>
                  <div className="text-gray-500 text-sm">{user?.email}</div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Level {level}</span>
                    <span>{xp} XP</span>
                  </div>
                  <Progress value={progressPercentage} />
                  <div className="text-right text-xs text-gray-400">
                    {currentLevelXp}/100 XP
                  </div>
                </div>
                
                {/* Achievements Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">🏆 Recent Achievements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🔥</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">7-Day Streak</div>
                        <div className="text-xs text-gray-500">Keep it burning!</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">⭐</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">Quick Learner</div>
                        <div className="text-xs text-gray-500">Completed 5 lessons</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🎯</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">Perfect Score</div>
                        <div className="text-xs text-gray-500">100% on quiz</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">🏅 Badges</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: "🔥", name: "Streak", earned: true },
                      { icon: "📚", name: "Scholar", earned: true },
                      { icon: "⚡", name: "Speed", earned: true },
                      { icon: "🎯", name: "Accuracy", earned: true },
                      { icon: "🌟", name: "Master", earned: false },
                      { icon: "💎", name: "Diamond", earned: false }
                    ].map((badge, index) => (
                      <div key={index} className="text-center">
                        <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg ${badge.earned ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-200'}`}>
                          <span className={badge.earned ? 'text-white' : 'text-gray-400'}>{badge.icon}</span>
                        </div>
                        <div className={`text-xs mt-1 ${badge.earned ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                          {badge.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Quizzes */}
            <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                  <Target className="h-5 w-5 mr-2 text-purple-500" />
                  🧠 Daily Quizzes
                </CardTitle>
                <CardDescription>Test your knowledge daily and earn XP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">{completedQuizzes}/{quizData.length}</div>
                  <div className="text-sm text-gray-600">Quizzes Completed Today</div>
                  <Progress value={(completedQuizzes / quizData.length) * 100} className="mt-2" />
                </div>
                
                {!quizCompleted ? (
                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-purple-900 mb-2">
                        Question {currentQuizIndex + 1} of {quizData.length}
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mb-4">
                        {quizData[currentQuizIndex].question}
                      </div>
                      <div className="text-xs text-purple-600 mb-3">
                        Reward: {quizData[currentQuizIndex].xpReward} XP
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {quizData[currentQuizIndex].options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className={`w-full justify-start text-left ${
                              showQuizResult 
                                ? option === quizData[currentQuizIndex].answer
                                  ? 'bg-green-100 border-green-500 text-green-700'
                                  : quizAnswers[currentQuizIndex] === option
                                  ? 'bg-red-100 border-red-500 text-red-700'
                                  : 'bg-gray-50'
                                : 'hover:bg-purple-50'
                            }`}
                            onClick={() => !showQuizResult && handleQuizAnswer(option)}
                            disabled={showQuizResult}
                          >
                            <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                            {option}
                            {showQuizResult && option === quizData[currentQuizIndex].answer && (
                              <CheckCircle className="ml-auto h-4 w-4 text-green-600" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🎊</div>
                    <div className="text-lg font-bold text-green-600">All Quizzes Completed!</div>
                    <div className="text-sm text-gray-600">Great job! Come back tomorrow for more challenges.</div>
                    <Button onClick={resetQuizzes} variant="outline" size="sm">
                      Reset Quizzes
                    </Button>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Recent Progress:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {quizData.slice(0, 4).map((quiz, index) => (
                      <div key={index} className={`p-2 rounded text-xs text-center ${
                        quiz.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        Q{index + 1}: {quiz.completed ? '✓' : '○'}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Virtual Pet */}
            <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                  <Sparkles className="h-5 w-5 mr-2 text-pink-500" />
                  🐾 Virtual Pet
                </CardTitle>
                <CardDescription>Your learning companion grows with you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-4xl mb-3">
                    🐱
                  </div>
                  <div className="text-lg font-bold text-gray-900">{petName}</div>
                  <div className="text-sm text-gray-600">Level {petLevel} Cat</div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 flex items-center">
                        <Heart className="h-3 w-3 mr-1 text-red-500" />
                        Happiness
                      </span>
                      <span className="text-gray-900 font-medium">{petHappiness}%</span>
                    </div>
                    <Progress value={petHappiness} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 flex items-center">
                        <Battery className="h-3 w-3 mr-1 text-yellow-500" />
                        Energy
                      </span>
                      <span className="text-gray-900 font-medium">{petEnergy}%</span>
                    </div>
                    <Progress value={petEnergy} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 flex items-center">
                        <Star className="h-3 w-3 mr-1 text-blue-500" />
                        Experience
                      </span>
                      <span className="text-gray-900 font-medium">{petExperience}%</span>
                    </div>
                    <Progress value={petExperience} className="h-2" />
                  </div>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-3">
                  <div className="text-sm text-pink-700">
                    <span className="font-medium">Status:</span> {
                      petHappiness > 80 && petEnergy > 80 
                        ? `${petName} is happy and ready to learn! 🎉`
                        : petHappiness > 60 && petEnergy > 60
                        ? `${petName} is doing well! 😊`
                        : petHappiness > 40 && petEnergy > 40
                        ? `${petName} needs some attention! 😐`
                        : `${petName} is feeling down! 😢`
                    }
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs hover:bg-green-50 hover:border-green-300"
                    onClick={feedPet}
                  >
                    🍖 Feed
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs hover:bg-blue-50 hover:border-blue-300"
                    onClick={playWithPet}
                  >
                    🎾 Play
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  {petExperience >= 90 && (
                    <div className="text-green-600 font-medium">
                      ⭐ {petName} is close to evolving!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  📈 Quick Stats
                </CardTitle>
                <CardDescription>Your learning overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{streak}</div>
                    <div className="text-xs text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{xp}</div>
                    <div className="text-xs text-gray-600">Total XP</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-xs text-gray-600">Quizzes Done</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">85%</div>
                    <div className="text-xs text-gray-600">Accuracy</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">This Week's Goal</span>
                    <span className="text-gray-900 font-medium">7/10 Days</span>
                  </div>
                  <Progress value={70} />
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  View Full Stats
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quote of the Day */}
          <div className="text-center mt-10">
            <p className="italic text-lg text-gray-700">"{todayQuote}"</p>
          </div>

          {/* Analytics Dashboard */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                📊 Learning Analytics
              </h2>
              <p className="text-gray-600">Track your performance trends and engagement patterns</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* XP Gain Chart */}
              <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    XP Gain Trend (Last 7 Days)
                  </CardTitle>
                  <CardDescription>Daily experience points earned through activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[25, 45, 30, 60, 40, 75, 55].map((value, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="text-xs text-gray-500 mb-1">{value}</div>
                        <div 
                          className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all duration-300 hover:scale-105"
                          style={{ height: `${(value / 75) * 200}px` }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700 font-medium">Total XP This Week:</span>
                      <span className="text-green-800 font-bold">330 XP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Streak Heatmap */}
              <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                    <Flame className="h-5 w-5 mr-2 text-orange-500" />
                    Daily Engagement Heatmap
                  </CardTitle>
                  <CardDescription>Your activity intensity over the past 4 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-xs text-gray-500 text-center py-1">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }, (_, i) => {
                      const intensity = Math.floor(Math.random() * 5);
                      const colors = [
                        'bg-gray-100',
                        'bg-orange-200',
                        'bg-orange-300',
                        'bg-orange-400',
                        'bg-orange-500'
                      ];
                      return (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer ${colors[intensity]}`}
                          title={`Day ${i + 1}: ${intensity}/4 intensity`}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                      {['bg-gray-100', 'bg-orange-200', 'bg-orange-300', 'bg-orange-400', 'bg-orange-500'].map((color, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${color}`}></div>
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Breakdown */}
              <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                    <PieChart className="h-5 w-5 mr-2 text-blue-500" />
                    Activity Distribution
                  </CardTitle>
                  <CardDescription>How you spend your learning time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'AI Tutor Sessions', percentage: 40, color: 'bg-blue-500' },
                      { name: 'Resource Study', percentage: 25, color: 'bg-green-500' },
                      { name: 'Practice Tests', percentage: 20, color: 'bg-purple-500' },
                      { name: 'Knowledge Enhancement', percentage: 15, color: 'bg-orange-500' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{activity.name}</span>
                            <span className="text-gray-500">{activity.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-1000 ${activity.color}`}
                              style={{ width: `${activity.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700">
                      <span className="font-medium">Most Active:</span> AI Tutor Sessions
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Heat Engine Performance */}
              <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    Learning Heat Engine
                  </CardTitle>
                  <CardDescription>Your learning momentum and consistency score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900">87%</span>
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Consistency Score</span>
                      <span className="text-sm font-medium text-gray-900">87/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Momentum Level</span>
                      <span className="text-sm font-medium text-green-600">High</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Burn Rate</span>
                      <span className="text-sm font-medium text-orange-600">Optimal</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-700">
                      <span className="font-medium">Status:</span> Your learning engine is running at peak efficiency! 🚀
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Summary */}
            <Card className="mt-8 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                  <BarChart3 className="h-5 w-5 mr-2 text-indigo-500" />
                  Weekly Performance Summary
                </CardTitle>
                <CardDescription>Key metrics and achievements from this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">7</div>
                    <div className="text-sm text-gray-600">Days Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-gray-600">Sessions Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">85%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">+15%</div>
                    <div className="text-sm text-gray-600">Improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
