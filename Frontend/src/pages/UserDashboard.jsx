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
import { Badge } from "@/components/ui/badge";
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
  Crown,
  Trophy,
  Bell,
  CloudCog,
} from "lucide-react";
import * as api from "../services/api";
import PetSelection from "../components/PetSelection";
import petData from "../data/pets.json";
import toast from "react-hot-toast";

// Cookie utility functions
const getCookie = (name, userId) => {
  const cookieName = userId ? `${name}_${userId}` : name;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${cookieName}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const setCookie = (name, value, userId, days = 30) => {
  const cookieName = userId ? `${name}_${userId}` : name;
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${cookieName}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/`;
};

const UserDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();



  // Initialize state with default values
  const [profileImage, setProfileImage] = useState("");
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  
  // Pet state
  const [petType, setPetType] = useState(null);
  const [petName, setPetName] = useState(null);
  const [petHappiness, setPetHappiness] = useState(100);
  const [petEnergy, setPetEnergy] = useState(100);
  const [petExperience, setPetExperience] = useState(0);
  const [petLevel, setPetLevel] = useState(0);
  const [lastFed, setLastFed] = useState(Date.now());
  const [lastPlayed, setLastPlayed] = useState(Date.now());
  const [showPetSelection, setShowPetSelection] = useState(false);

  // Notices state
  const [recentNotices, setRecentNotices] = useState([]);

  // Achievements and badges state
  const [achievements, setAchievements] = useState([]);
  const [badges, setBadges] = useState([
    { icon: "🔥", name: "Streak", earned: false, requirement: "Maintain a 7-day streak" },
    { icon: "📚", name: "Scholar", earned: false, requirement: "Complete 10 quizzes" },
    { icon: "⚡", name: "Speed", earned: false, requirement: "Complete 5 quizzes in one day" },
    { icon: "🎯", name: "Accuracy", earned: false, requirement: "Achieve 90% accuracy" },
    { icon: "🌟", name: "Master", earned: false, requirement: "Reach level 10" },
    { icon: "💎", name: "Diamond", earned: false, requirement: "Earn 1000 XP" }
  ]);

  // Load data from cookies when user is available
  useEffect(() => {
    if (user?.id) {
      console.log('Loading data from cookies for user:', user.id);
      
      // Load profile image
      const savedProfileImage = getCookie('userProfileImage', user.id);
      if (savedProfileImage) {
        try {
          setProfileImage(JSON.parse(savedProfileImage));
        } catch (e) {
          setProfileImage(savedProfileImage);
        }
      }
      
      // Load XP
      const savedXP = getCookie('userXP', user.id);
      if (savedXP) {
        try {
          const parsedXP = JSON.parse(savedXP);
          console.log('Loading XP from cookie:', parsedXP);
          setXP(parsedXP);
        } catch (e) {
          const parsedXP = parseInt(savedXP) || 0;
          console.log('Loading XP from cookie (fallback):', parsedXP);
          setXP(parsedXP);
        }
      } else {
        console.log('No XP found in cookies, using default: 0');
      }
      
      // Load streak
      const savedStreak = getCookie('userStreak', user.id);
      if (savedStreak) {
        try {
          setStreak(JSON.parse(savedStreak));
        } catch (e) {
          setStreak(parseInt(savedStreak) || 0);
        }
      }
      
      // Load level
      const savedLevel = getCookie('userLevel', user.id);
      if (savedLevel) {
        try {
          const parsedLevel = JSON.parse(savedLevel);
          console.log('Loading level from cookie:', parsedLevel);
          setLevel(parsedLevel);
        } catch (e) {
          const parsedLevel = parseInt(savedLevel) || 1;
          console.log('Loading level from cookie (fallback):', parsedLevel);
          setLevel(parsedLevel);
        }
      } else {
        console.log('No level found in cookies, using default: 1');
      }
      
      // Load quiz data
      const savedQuizIndex = getCookie('currentQuizIndex', user.id);
      if (savedQuizIndex) {
        try {
          setCurrentQuizIndex(JSON.parse(savedQuizIndex));
        } catch (e) {
          setCurrentQuizIndex(parseInt(savedQuizIndex) || 0);
        }
      }
      
      const savedQuizAnswers = getCookie('quizAnswers', user.id);
      if (savedQuizAnswers) {
        try {
          setQuizAnswers(JSON.parse(savedQuizAnswers));
        } catch (e) {
          setQuizAnswers({});
        }
      }
      
      const savedQuizCompleted = getCookie('quizCompleted', user.id);
      if (savedQuizCompleted) {
        try {
          setQuizCompleted(JSON.parse(savedQuizCompleted));
        } catch (e) {
          setQuizCompleted(savedQuizCompleted === 'true');
        }
      }
      
      // Load performance data
      const savedPerformanceData = getCookie('performanceData', user.id);
      if (savedPerformanceData) {
        try {
          setPerformanceData(JSON.parse(savedPerformanceData));
        } catch (e) {
          setPerformanceData([]);
        }
      }
      
      const savedPerformanceScore = getCookie('performanceScore', user.id);
      if (savedPerformanceScore) {
        try {
          setPerformanceScore(JSON.parse(savedPerformanceScore));
        } catch (e) {
          setPerformanceScore(parseFloat(savedPerformanceScore) || 0);
        }
      }
      
      const savedCorrectCount = getCookie('correctCount', user.id);
      if (savedCorrectCount) {
        try {
          setCorrectCount(JSON.parse(savedCorrectCount));
        } catch (e) {
          setCorrectCount(parseInt(savedCorrectCount) || 0);
        }
      }
      
      const savedWrongCount = getCookie('wrongCount', user.id);
      if (savedWrongCount) {
        try {
          setWrongCount(JSON.parse(savedWrongCount));
        } catch (e) {
          setWrongCount(parseInt(savedWrongCount) || 0);
        }
      }
      
      const savedAccuracy = getCookie('accuracy', user.id);
      if (savedAccuracy) {
        try {
          setAccuracy(JSON.parse(savedAccuracy));
        } catch (e) {
          setAccuracy(parseFloat(savedAccuracy) || 0);
        }
      }
      
      // Load quiz data completion status
      const savedQuizData = getCookie('quizData', user.id);
      if (savedQuizData) {
        try {
          const parsedQuizData = JSON.parse(savedQuizData);
          console.log('Loading quiz data from cookie:', parsedQuizData.length, 'quizzes');
          console.log('Quiz completion status:', parsedQuizData.map(q => ({ question: q.question.substring(0, 20) + '...', completed: q.completed })));
          setQuizData(parsedQuizData);
        } catch (e) {
          console.error('Error parsing quiz data:', e);
        }
      } else {
        console.log('No quiz data found in cookies, using default quiz data');
      }
      
      // Load pet data
      const savedPetType = getCookie('petType', user.id);
      if (savedPetType) {
        try {
          const parsedPetType = JSON.parse(savedPetType);
          console.log('Loading pet type from cookie:', parsedPetType);
          setPetType(parsedPetType);
        } catch (e) {
          console.log('Loading pet type from cookie (fallback):', savedPetType);
          setPetType(savedPetType);
        }
      } else {
        console.log('No pet type found in cookies');
      }
      
      const savedPetName = getCookie('petName', user.id);
      if (savedPetName) {
        try {
          setPetName(JSON.parse(savedPetName));
        } catch (e) {
          setPetName(savedPetName);
        }
      }
      
      const savedPetHappiness = getCookie('petHappiness', user.id);
      if (savedPetHappiness) {
        try {
          setPetHappiness(JSON.parse(savedPetHappiness));
        } catch (e) {
          setPetHappiness(parseInt(savedPetHappiness) || 100);
        }
      }
      
      const savedPetEnergy = getCookie('petEnergy', user.id);
      if (savedPetEnergy) {
        try {
          setPetEnergy(JSON.parse(savedPetEnergy));
        } catch (e) {
          setPetEnergy(parseInt(savedPetEnergy) || 100);
        }
      }
      
      const savedPetExperience = getCookie('petExperience', user.id);
      if (savedPetExperience) {
        try {
          setPetExperience(JSON.parse(savedPetExperience));
        } catch (e) {
          setPetExperience(parseInt(savedPetExperience) || 0);
        }
      }
      
      const savedPetLevel = getCookie('petLevel', user.id);
      if (savedPetLevel) {
        try {
          setPetLevel(JSON.parse(savedPetLevel));
        } catch (e) {
          setPetLevel(parseInt(savedPetLevel) || 0);
        }
      }
      
      const savedLastFed = getCookie('lastFed', user.id);
      if (savedLastFed) {
        try {
          setLastFed(JSON.parse(savedLastFed));
        } catch (e) {
          setLastFed(parseInt(savedLastFed) || Date.now());
        }
      }
      
      const savedLastPlayed = getCookie('lastPlayed', user.id);
      if (savedLastPlayed) {
        try {
          setLastPlayed(JSON.parse(savedLastPlayed));
        } catch (e) {
          setLastPlayed(parseInt(savedLastPlayed) || Date.now());
        }
      }
      
      // Load achievements and badges
      const savedAchievements = getCookie('userAchievements', user.id);
      if (savedAchievements) {
        try {
          setAchievements(JSON.parse(savedAchievements));
        } catch (e) {
          setAchievements([]);
        }
      }
      
      const savedBadges = getCookie('userBadges', user.id);
      if (savedBadges) {
        try {
          setBadges(JSON.parse(savedBadges));
        } catch (e) {
          setBadges([
            { icon: "🔥", name: "Streak", earned: false, requirement: "Maintain a 7-day streak" },
            { icon: "📚", name: "Scholar", earned: false, requirement: "Complete 10 quizzes" },
            { icon: "⚡", name: "Speed", earned: false, requirement: "Complete 5 quizzes in one day" },
            { icon: "🎯", name: "Accuracy", earned: false, requirement: "Achieve 90% accuracy" },
            { icon: "🌟", name: "Master", earned: false, requirement: "Reach level 10" },
            { icon: "💎", name: "Diamond", earned: false, requirement: "Earn 1000 XP" }
          ]);
        }
      }
      
      // Set pet selection visibility after all pet data is loaded
      const hasPet = savedPetType && savedPetName;
      setShowPetSelection(!hasPet);
      console.log('Pet selection visibility set to:', !hasPet, '(hasPet:', hasPet, ')');
      
      console.log('Cookie data loaded successfully');
      
      // Mark initial load as complete after a short delay to ensure all state updates are processed
      setTimeout(() => {
        setIsInitialLoad(false);
        console.log('Initial load marked as complete');
      }, 100);
    }
  }, [user?.id]);

  // Separate useEffect for daily reset logic to run after data is loaded
  useEffect(() => {
    if (user?.id && !isInitialLoad) {
      // Check if we need to reset quizzes for a new day
      const lastQuizDate = getCookie('lastQuizDate', user.id);
      const today = new Date().toDateString();
      
      console.log('Daily reset check - Last quiz date:', lastQuizDate, 'Today:', today);
      
      if (lastQuizDate && lastQuizDate !== today) {
        // New day - reset quiz progress but keep achievements
        console.log('New day detected, resetting quiz progress');
        setQuizData(prev => prev.map(quiz => ({ ...quiz, completed: false })));
        setCurrentQuizIndex(0);
        setQuizAnswers({});
        setShowQuizResult(false);
        setQuizCompleted(false);
        setPerformanceData([]);
        setPerformanceScore(0);
        setCorrectCount(0);
        setWrongCount(0);
        setAccuracy(0);
        
        // Update the last quiz date
        setCookie('lastQuizDate', today, user.id);
        
        console.log('Quiz progress reset for new day');
      } else if (!lastQuizDate) {
        // First time user - set the date but don't reset
        console.log('First time user, setting quiz date');
        setCookie('lastQuizDate', today, user.id);
      } else {
        console.log('Same day, keeping quiz progress');
      }
    }
  }, [user?.id, isInitialLoad]);

  // Quiz data - make it state-based to persist completion status
  const defaultQuizData = [
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

  const [quizData, setQuizData] = useState(defaultQuizData);

  const completedQuizzes = quizData.filter(quiz => quiz.completed).length;

  useEffect(() => {
    async function fetchStats() {
      try {
        console.log('Fetching user stats...');
        const profile = await api.getProfile();
        console.log('Profile fetched:', profile);
        
        // Only update profile image if we don't have one loaded from cookies
        if (!profileImage) {
          setProfileImage(profile.profilePictureUrl || profile.profilePicture || "");
        }
        
        // Only update level from API if it's higher than current cookie value
        // AND if we have local data (prevent overriding on first load)
        const apiLevel = profile.level || 1;
        if (apiLevel > level && level > 1) {
          setLevel(apiLevel);
        }

        // Only update XP from API if it's higher than current cookie value
        // AND if we have local data (prevent overriding on first load)
        const xpRes = await api.getXP();
        const apiXP = xpRes.xp || 0;
        if (apiXP > xp && xp > 0) {
          setXP(apiXP);
        }

        // Only update streak from API if it's higher than current cookie value
        // AND if we have local data (prevent overriding on first load)
        const streakRes = await api.getStreak();
        const apiStreak = streakRes.streak || 0;
        if (apiStreak > streak && streak > 0) {
          setStreak(apiStreak);
        }

        const habitRes = await api.getHabitStats();
        setHabits(habitRes.habits || []);

        // Fetch recent notices
        const noticesRes = await api.getNotices();
        setRecentNotices((noticesRes?.notices || noticesRes || []).slice(0, 3)); // Get latest 3 notices
        
        console.log('All stats fetched successfully');
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Don't fail completely - show dashboard with cookie data
        toast.error('Some data could not be loaded, but you can still use the dashboard');
      } finally {
        setLoading(false);
      }
    }
    
    // Only fetch stats after initial data loading is complete
    if (isInitialLoad) {
      fetchStats();
      
      // Set up real-time refresh every 30 seconds
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isInitialLoad]); // Only depend on isInitialLoad, not on level/xp/streak

  // Save user data to cookies whenever state changes
  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('userProfileImage', profileImage, user?.id);
    }
  }, [profileImage, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('userXP', xp, user?.id);
    }
  }, [xp, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('userStreak', streak, user?.id);
    }
  }, [streak, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('userLevel', level, user?.id);
    }
  }, [level, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('currentQuizIndex', currentQuizIndex, user?.id);
    }
  }, [currentQuizIndex, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('quizAnswers', quizAnswers, user?.id);
    }
  }, [quizAnswers, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('quizCompleted', quizCompleted, user?.id);
    }
  }, [quizCompleted, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('performanceData', performanceData, user?.id);
    }
  }, [performanceData, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('performanceScore', performanceScore, user?.id);
    }
  }, [performanceScore, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('correctCount', correctCount, user?.id);
    }
  }, [correctCount, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('wrongCount', wrongCount, user?.id);
    }
  }, [wrongCount, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('accuracy', accuracy, user?.id);
    }
  }, [accuracy, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('petHappiness', petHappiness, user?.id);
    }
  }, [petHappiness, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('petEnergy', petEnergy, user?.id);
    }
  }, [petEnergy, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('petExperience', petExperience, user?.id);
    }
  }, [petExperience, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('petLevel', petLevel, user?.id);
    }
  }, [petLevel, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('lastFed', lastFed, user?.id);
    }
  }, [lastFed, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('lastPlayed', lastPlayed, user?.id);
    }
  }, [lastPlayed, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('userAchievements', achievements, user?.id);
    }
  }, [achievements, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('userBadges', badges, user?.id);
    }
  }, [badges, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('petType', petType, user?.id);
    }
  }, [petType, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      setCookie('petName', petName, user?.id);
    }
  }, [petName, user?.id, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && user?.id) {
      console.log('Saving quiz data to cookie:', quizData.length, 'quizzes');
      console.log('Quiz completion status being saved:', quizData.map(q => ({ question: q.question.substring(0, 20) + '...', completed: q.completed })));
      setCookie('quizData', quizData, user?.id);
    }
  }, [quizData, user?.id, isInitialLoad]);

  // Check achievements and badges whenever relevant stats change
  useEffect(() => {
    checkAchievementsAndBadges();
  }, [streak, correctCount, accuracy, level, xp, quizCompleted]);

  // Function to check and update achievements and badges
  const checkAchievementsAndBadges = () => {
    const newAchievements = [];
    const newBadges = [...badges];
    let hasNewAchievement = false;

    // Check for achievements
    if (streak >= 7 && !achievements.find(a => a.type === 'streak')) {
      newAchievements.push({
        id: Date.now(),
        type: 'streak',
        title: '7-Day Streak',
        description: 'Maintained a 7-day learning streak!',
        icon: '🔥',
        earnedAt: new Date().toISOString()
      });
      hasNewAchievement = true;
    }

    // Check for quiz completion achievement - only after all quizzes are completed
    if (quizCompleted && !achievements.find(a => a.type === 'quizzes')) {
      newAchievements.push({
        id: Date.now() + 1,
        type: 'quizzes',
        title: 'Quiz Master',
        description: 'Completed all daily quizzes successfully!',
        icon: '📚',
        earnedAt: new Date().toISOString()
      });
      hasNewAchievement = true;
    }

    if (accuracy >= 90 && !achievements.find(a => a.type === 'accuracy')) {
      newAchievements.push({
        id: Date.now() + 2,
        type: 'accuracy',
        title: 'Perfect Score',
        description: 'Achieved 90% accuracy in quizzes!',
        icon: '🎯',
        earnedAt: new Date().toISOString()
      });
      hasNewAchievement = true;
    }

    // Check for badges
    if (streak >= 7 && !newBadges.find(b => b.name === 'Streak')?.earned) {
      const streakBadge = newBadges.find(b => b.name === 'Streak');
      if (streakBadge) {
        streakBadge.earned = true;
        streakBadge.earnedAt = new Date().toISOString();
      }
    }

    // Scholar badge - only after completing all quizzes
    if (quizCompleted && !newBadges.find(b => b.name === 'Scholar')?.earned) {
      const scholarBadge = newBadges.find(b => b.name === 'Scholar');
      if (scholarBadge) {
        scholarBadge.earned = true;
        scholarBadge.earnedAt = new Date().toISOString();
      }
    }

    if (level >= 10 && !newBadges.find(b => b.name === 'Master')?.earned) {
      const masterBadge = newBadges.find(b => b.name === 'Master');
      if (masterBadge) {
        masterBadge.earned = true;
        masterBadge.earnedAt = new Date().toISOString();
      }
    }

    if (xp >= 1000 && !newBadges.find(b => b.name === 'Diamond')?.earned) {
      const diamondBadge = newBadges.find(b => b.name === 'Diamond');
      if (diamondBadge) {
        diamondBadge.earned = true;
        diamondBadge.earnedAt = new Date().toISOString();
      }
    }

    if (accuracy >= 90 && !newBadges.find(b => b.name === 'Accuracy')?.earned) {
      const accuracyBadge = newBadges.find(b => b.name === 'Accuracy');
      if (accuracyBadge) {
        accuracyBadge.earned = true;
        accuracyBadge.earnedAt = new Date().toISOString();
      }
    }

    // Update state if there are new achievements or badges
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
    
    if (newBadges.some(badge => badge.earned !== badges.find(b => b.name === badge.name)?.earned)) {
      setBadges(newBadges);
    }

    // Show notification for new achievements
    if (hasNewAchievement) {
      toast.success('🎉 New achievement unlocked! Check your profile!');
    }
  };

  // Function to sync local data back to backend
  const syncToBackend = async () => {
    try {
      // Only sync if user is authenticated
      const token = localStorage.getItem('brainbuddy_token');
      if (!token) {
        return; // Silently skip sync if not authenticated
      }

      let hasChanges = false;
      
      // Sync XP if it has increased significantly
      if (xp > 0) {
        await api.updateXP({ xp });
        hasChanges = true;
      }
      
      // Sync level if it has increased
      if (level > 1) {
        await api.updateProfile({ level });
        hasChanges = true;
      }
      
      // Sync streak if it has increased
      if (streak > 0) {
        await api.updateStreak({ streak });
        hasChanges = true;
      }

      // Only show error if we actually tried to sync something
      if (hasChanges) {
        console.log('Backend sync completed successfully');
      }
    } catch (error) {
      console.error('Backend sync error:', error);
      // Only show error toast for network/server errors, not auth issues
      if (error.message && !error.message.includes('401') && !error.message.includes('403')) {
        toast.error('Backend sync failed, continuing with local data');
      }
    }
  };

  // Pet selection handler
  const handlePetSelected = (petData) => {
    setPetType(petData.petType);
    setPetName(petData.petName);
    setPetLevel(petData.petLevel);
    setPetExperience(petData.petExperience);
    setPetHappiness(petData.petHappiness);
    setPetEnergy(petData.petEnergy);
    setLastFed(petData.lastFed);
    setLastPlayed(petData.lastPlayed);
    setShowPetSelection(false);
    
    toast.success(`🎉 Welcome ${petData.petName}! Your new pet companion is ready for adventures!`);
  };

  // Helper function to get current pet data
  const getCurrentPet = () => {
    if (!petType) return null;
    return petData.pets.find(pet => pet.id === petType);
  };

  // Helper function to get pet emoji based on level
  const getPetEmoji = (level) => {
    const pet = getCurrentPet();
    if (!pet) return "🥚";
    
    if (level === 0) return pet.levels["0"].emoji;
    if (level >= 1 && level <= 3) return pet.levels["1-3"].emoji;
    if (level >= 4 && level <= 6) return pet.levels["4-6"].emoji;
    if (level >= 7 && level <= 9) return pet.levels["7-9"].emoji;
    return pet.levels["10+"].emoji;
  };

  // Helper function to get pet stage name
  const getPetStageName = (level) => {
    const pet = getCurrentPet();
    if (!pet) return "Unknown";
    
    if (level === 0) return pet.levels["0"].name;
    if (level >= 1 && level <= 3) return pet.levels["1-3"].name;
    if (level >= 4 && level <= 6) return pet.levels["4-6"].name;
    if (level >= 7 && level <= 9) return pet.levels["7-9"].name;
    return pet.levels["10+"].name;
  };

  // Sync to backend every 5 minutes
  useEffect(() => {
    const syncInterval = setInterval(syncToBackend, 300000); // 5 minutes
    return () => clearInterval(syncInterval);
  }, [xp, level, streak]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file.");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB.");
      return;
    }
    
    try {
      // Show loading state
      const loadingToast = toast.loading("Uploading profile picture...");
      
      const result = await api.uploadUserProfilePicture(file);
      const imageUrl = result.profilePictureUrl || result.url || "";
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (imageUrl) {
        setProfileImage(imageUrl);
        await updateUser({
          profilePicture: imageUrl,
        });
        toast.success("✅ Profile picture updated successfully!");
      } else {
        throw new Error("No image URL received");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("❌ Failed to upload profile picture. Please try again.");
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
      // Mark quiz as completed using state setter
      setQuizData(prev => prev.map((quiz, index) => 
        index === currentQuizIndex ? { ...quiz, completed: true } : quiz
      ));
      
      // Award XP
      const earnedXP = currentQuiz.xpReward;
      setXP(prev => prev + earnedXP);
      
      // Update pet experience
      setPetExperience(prev => Math.min(100, prev + 5));
      
      // Update performance stats
      const newCorrectCount = correctCount + 1;
      const newWrongCount = wrongCount;
      const newAccuracy = Math.round((newCorrectCount / (newCorrectCount + newWrongCount)) * 100);
      
      setCorrectCount(newCorrectCount);
      setWrongCount(newWrongCount);
      setAccuracy(newAccuracy);
      
      // Update performance data
      updatePerformanceData(currentQuizIndex, true, 0);
      
      // Sync to backend immediately for important changes
      setTimeout(() => syncToBackend(), 1000);
      
      // Show success message and move to next question
      setTimeout(() => {
        toast.success(`🎉 Correct! You earned ${earnedXP} XP!`);
        setShowQuizResult(false);
        nextQuiz();
      }, 1500);
    } else {
      // Update performance stats
      const newCorrectCount = correctCount;
      const newWrongCount = wrongCount + 1;
      const newAccuracy = Math.round((newCorrectCount / (newCorrectCount + newWrongCount)) * 100);
      
      setCorrectCount(newCorrectCount);
      setWrongCount(newWrongCount);
      setAccuracy(newAccuracy);
      
      // Calculate penalty for wrong answer
      const penalty = 5 * newWrongCount;
      updatePerformanceData(currentQuizIndex, false, penalty);
      
      // Show failure message and move to next question
      setTimeout(() => {
        toast.error(`❌ Wrong answer. The correct answer is: ${currentQuiz.answer}`);
        setShowQuizResult(false);
        nextQuiz();
      }, 1500);
    }
  };

  // Function to update performance data
  const updatePerformanceData = (questionIndex, isCorrect, penalty) => {
    setPerformanceData(prev => {
      const newData = [...prev];
      let currentScore = questionIndex === 0 ? 50 : (newData[questionIndex - 1]?.value || 50);
      
      if (isCorrect) {
        currentScore = Math.min(100, currentScore + 10);
      } else {
        currentScore = Math.max(0, currentScore - penalty);
      }
      
      newData[questionIndex] = {
        type: isCorrect ? 'correct' : 'wrong',
        value: currentScore,
        penalty: isCorrect ? 0 : penalty
      };
      
      // Update performance score
      const newScore = Math.max(0, calculateTotalScore(newData));
      setPerformanceScore(newScore);
      
      return newData;
    });
  };

  // Function to calculate total score from performance data
  const calculateTotalScore = (data) => {
    let score = 0;
    let penalty = 0;
    
    data.forEach((point, index) => {
      if (point.type === 'correct') {
        score += quizData[index]?.xpReward || 10;
      } else {
        penalty += point.penalty;
      }
    });
    
    return score - penalty;
  };

  // Helper function to generate performance points for the graph
  const generatePerformancePoints = () => {
    const points = [];
    
    // Add starting point
    points.push(`0,50`);
    
    // Use stable performance data
    performanceData.forEach((point, index) => {
      const x = ((index + 1) / 10) * 100;
      const y = 100 - point.value; // Invert Y axis for SVG
      points.push(`${x},${y}`);
    });
    
    return points.join(' ');
  };

  // Helper function to generate smooth cubic spline path
  const generateSmoothPath = () => {
    if (performanceData.length === 0) {
      return "M 0 50";
    }

    const points = [];
    
    // Add starting point
    points.push({ x: 0, y: 50 });
    
    // Add performance data points with dynamic scaling
    const totalQuestions = quizData.length;
    performanceData.forEach((point, index) => {
      const x = ((index + 1) / totalQuestions) * 100;
      const y = 100 - point.value;
      points.push({ x, y });
    });

    if (points.length < 2) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    // Generate smooth cubic spline path
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Calculate control points for smooth curve
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      
      // Control points for smooth cubic bezier
      const cp1x = current.x + dx * 0.3;
      const cp1y = current.y + dy * 0.3;
      const cp2x = next.x - dx * 0.3;
      const cp2y = next.y - dy * 0.3;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    
    return path;
  };

  const nextQuiz = () => {
    const nextIndex = currentQuizIndex + 1;
    if (nextIndex < quizData.length) {
      setCurrentQuizIndex(nextIndex);
    } else {
      // All quizzes completed
      setQuizCompleted(true);
      toast.success("🎊 Congratulations! You've completed all quizzes for today! Check your achievements!");
    }
  };

  const resetQuizzes = () => {
    // Reset quiz data using state setter
    setQuizData(prev => prev.map(quiz => ({ ...quiz, completed: false })));
    setCurrentQuizIndex(0);
    setQuizAnswers({});
    setShowQuizResult(false);
    setQuizCompleted(false);
    setPerformanceData([]);
    setPerformanceScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setAccuracy(0);
    
    // Clear cookies for quiz-related data
    setCookie('currentQuizIndex', 0, user?.id);
    setCookie('quizAnswers', {}, user?.id);
    setCookie('quizCompleted', false, user?.id);
    setCookie('performanceData', [], user?.id);
    setCookie('performanceScore', 0, user?.id);
    setCookie('correctCount', 0, user?.id);
    setCookie('wrongCount', 0, user?.id);
    setCookie('accuracy', 0, user?.id);
    
    // Clear achievements and badges
    setAchievements([]);
    setBadges(prev => prev.map(badge => ({ ...badge, earned: false, earnedAt: null })));
    setCookie('userAchievements', [], user?.id);
    setCookie('userBadges', badges.map(badge => ({ ...badge, earned: false, earnedAt: null })), user?.id);
    
    // Note: Pet evolution is preserved - only quiz data is reset
  };

  // Separate function to reset pet data (if needed)
  const resetPet = () => {
    setPetType(null);
    setPetName(null);
    setPetLevel(0);
    setPetExperience(0);
    setPetHappiness(100);
    setPetEnergy(100);
    setLastFed(Date.now());
    setLastPlayed(Date.now());
    setShowPetSelection(true);
    setCookie('petType', null, user?.id);
    setCookie('petName', null, user?.id);
    setCookie('petLevel', 0, user?.id);
    setCookie('petExperience', 0, user?.id);
    setCookie('petHappiness', 100, user?.id);
    setCookie('petEnergy', 100, user?.id);
    setCookie('lastFed', Date.now(), user?.id);
    setCookie('lastPlayed', Date.now(), user?.id);
  };

  // Pet interaction functions
  const feedPet = () => {
    if (!petType || !petName) {
      toast.error("Please select a pet first!");
      return;
    }
    
    const timeSinceLastFed = Date.now() - lastFed;
    if (timeSinceLastFed < 300000) { // 5 minutes cooldown
      toast.info(`🍖 ${petName} is still full! Wait a bit before feeding again.`);
      return;
    }
    
    setPetEnergy(prev => Math.min(100, prev + 15));
    setPetHappiness(prev => Math.min(100, prev + 10));
    setLastFed(Date.now());
    
    // Award small XP for caring for pet
    setXP(prev => prev + 5);
    
    // Sync to backend immediately
    setTimeout(() => syncToBackend(), 1000);
    
    const pet = getCurrentPet();
    toast.success(`🍖 ${petName} loved the ${pet?.favoriteFood || 'food'}! +5 XP for being caring!`);
  };

  const playWithPet = () => {
    if (!petType || !petName) {
      toast.error("Please select a pet first!");
      return;
    }
    
    const timeSinceLastPlayed = Date.now() - lastPlayed;
    if (timeSinceLastPlayed < 600000) { // 10 minutes cooldown
      toast.info(`🎾 ${petName} is tired! Wait a bit before playing again.`);
      return;
    }
    
    setPetHappiness(prev => Math.min(100, prev + 20));
    setPetEnergy(prev => Math.max(0, prev - 10));
    setPetExperience(prev => Math.min(100, prev + 8));
    setLastPlayed(Date.now());
    
    // Award XP for playing
    setXP(prev => prev + 8);
    
    // Sync to backend immediately
    setTimeout(() => syncToBackend(), 1000);
    
    const pet = getCurrentPet();
    toast.success(`�� ${petName} had fun ${pet?.favoriteActivity || 'playing'}! +8 XP for being playful!`);
  };

  // Check if pet can level up
  useEffect(() => {
    if (petExperience >= 100) {
      const newLevel = petLevel + 1;
      setPetLevel(newLevel);
      setPetExperience(0);
      
      const pet = getCurrentPet();
      const stageName = getPetStageName(newLevel);
      toast.success(`🎉 ${petName} evolved to Level ${newLevel} (${stageName})! +20 XP bonus!`);
      setXP(prev => prev + 20);
      
      // Sync to backend immediately for level up
      setTimeout(() => syncToBackend(), 1000);
    }
  }, [petExperience, petLevel, petName]);

  // Ensure pet evolution is properly saved
  useEffect(() => {
    if (petLevel > 0) {
      setCookie('petLevel', petLevel, user?.id);
      setCookie('petExperience', petExperience, user?.id);
    }
  }, [petLevel, petExperience, user?.id]);

  // Check if user level should increase - only when XP changes, not on mount
  useEffect(() => {
    // Skip level calculation on initial mount to prevent unwanted popups
    if (isInitialLoad) return;
    
    const currentLevelXp = xp % 100;
    const calculatedLevel = Math.floor(xp / 100) + 1;
    
    if (calculatedLevel > level) {
      setLevel(calculatedLevel);
      toast.success(`🎉 Congratulations! You've reached Level ${calculatedLevel}!`);
      
      // Sync to backend immediately for level up
      setTimeout(() => syncToBackend(), 1000);
    }
  }, [xp, level, isInitialLoad]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading your dashboard...</div>
          <div className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <div className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</div>
          <div className="text-gray-500 mb-4">Please log in to access your dashboard</div>
          <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {showPetSelection && (
        <PetSelection onPetSelected={handlePetSelected} />
      )}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Profile & Progress */}
            <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                  <CircleUserRound className="h-5 w-5 mr-2 text-blue-500" />
                  Profile & Achievements
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
                    {achievements.length > 0 ? (
                      achievements.slice(-3).reverse().map((achievement) => (
                        <div key={achievement.id} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{achievement.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-900">{achievement.title}</div>
                            <div className="text-xs text-gray-500">{achievement.description}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(achievement.earnedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-2xl mb-2">🏆</div>
                        <div className="text-xs text-gray-500">No achievements yet</div>
                        <div className="text-xs text-gray-400">Complete tasks to earn achievements!</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Badges Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">🏅 Badges</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {badges.map((badge, index) => (
                      <div key={index} className="text-center">
                        <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg ${badge.earned ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-200'}`}>
                          <span className={badge.earned ? 'text-white' : 'text-gray-400'}>{badge.icon}</span>
                        </div>
                        <div className={`text-xs mt-1 ${badge.earned ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                          {badge.name}
                        </div>
                        {badge.earned && (
                          <div className="text-xs text-green-600 font-medium">✓ Earned</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {badges.filter(b => b.earned).length}/{badges.length} badges earned
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Quizzes */}
            <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                  <Target className="h-5 w-5 mr-2 text-purple-500" />
                  Daily Quizzes
                </CardTitle>
                <CardDescription>Test your knowledge daily and earn XP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {!quizCompleted ? (
                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-purple-900 mb-2">
                        Questions
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
                
                {/* Visual Progress Bar for 10 Questions */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Performance Graph</span>
                    <span className="text-purple-600 font-bold">Score: {performanceScore}</span>
                  </div>
                  
                  {/* NEPSE-style Performance Graph */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="h-48 relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 grid grid-cols-5 grid-rows-6">
                        {Array.from({ length: 30 }, (_, i) => (
                          <div key={i} className="border-r border-b border-gray-100"></div>
                        ))}
                      </div>
                      
                      {/* Performance area fill */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Area fill */}
                        <path
                          fill="url(#areaGradient)"
                          fillOpacity="0.3"
                          d={`${generateSmoothPath()} L ${(performanceData.length / quizData.length) * 100} 100 L 0 100 Z`}
                        />
                        {/* Performance line */}
                        <path
                          fill="none"
                          stroke="url(#lineGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={generateSmoothPath()}
                        />
                        <defs>
                          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                          </linearGradient>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Data points */}
                      {performanceData.map((point, index) => (
                        <div
                          key={index}
                          className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                            point.type === 'correct' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{
                            left: `${((index + 1) / quizData.length) * 100}%`,
                            top: `${100 - point.value}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                          title={`Q${index + 1}: ${point.type === 'correct' ? 'Correct' : 'Wrong'} (${point.value.toFixed(1)})`}
                        />
                      ))}
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-3">
                      <span>Q1</span>
                      <span>Q{Math.ceil(quizData.length * 0.25)}</span>
                      <span>Q{Math.ceil(quizData.length * 0.5)}</span>
                      <span>Q{Math.ceil(quizData.length * 0.75)}</span>
                      <span>Q{quizData.length}</span>
                    </div>
                  </div>
                  
                  {/* Performance stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-50 rounded p-2">
                      <div className="text-sm font-bold text-green-600">{correctCount}</div>
                      <div className="text-xs text-gray-600">Correct</div>
                    </div>
                    <div className="bg-red-50 rounded p-2">
                      <div className="text-sm font-bold text-red-600">{wrongCount}</div>
                      <div className="text-xs text-gray-600">Wrong</div>
                    </div>
                    <div className="bg-purple-50 rounded p-2">
                      <div className="text-sm font-bold text-purple-600">{accuracy}%</div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>
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
                {!petType || !petName ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🥚</div>
                    <div className="text-lg font-bold text-gray-900 mb-2">No Pet Selected</div>
                    <div className="text-sm text-gray-600 mb-4">Choose your pet companion to start your journey!</div>
                    <Button onClick={() => setShowPetSelection(true)} className="bg-pink-500 hover:bg-pink-600">
                      Choose Pet
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-4xl mb-3">
                        {getPetEmoji(petLevel)}
                      </div>
                      <div className="text-lg font-bold text-gray-900">{petName}</div>
                      <div className="text-sm text-gray-600">Level {petLevel} {getCurrentPet()?.name}</div>
                      <div className="text-xs text-gray-500">{getPetStageName(petLevel)}</div>
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
              </>
            )}
              </CardContent>
            </Card>

            {/* Recent Notices */}
            <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  Latest News
                </CardTitle>
                <CardDescription>Stay informed about platform updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentNotices.length > 0 ? (
                    recentNotices.map((notice, index) => (
                      <div key={notice.id} className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-blue-900 mb-2">
                          {notice.title}
                        </h4>
                        <p className="text-sm text-gray-700">
                          {notice.description}
                        </p>
                        {notice.fileUrl && (
                          <a 
                            href={notice.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mt-2"
                          >
                            📎 View Attachment
                          </a>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Posted on: {new Date(notice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No recent notices</p>
                    </div>
                  )}
                </div>
                {recentNotices.length > 0 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/notice-board'}
                      className="text-sm"
                    >
                      View All Notices
                    </Button>
                  </div>
                )}
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
