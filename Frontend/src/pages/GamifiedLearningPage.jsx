import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gamepad2, 
  ArrowLeft, 
  Trophy, 
  Star, 
  Flame, 
  Target,
  Award,
  Crown,
  Zap,
  BookOpen,
  Brain,
  Calendar,
  TrendingUp,
  Heart,
  Sparkles
} from 'lucide-react';
import * as api from '../services/api';
import toast from "react-hot-toast";

// Add new API calls for feeding pet and starting quiz
async function feedPetBackend() {
  return api.apiFetch('/user/feed-pet', { method: 'POST' });
}
async function startQuizBackend() {
  return api.apiFetch('/user/quiz/start', { method: 'POST' });
}

const GamifiedLearningPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [gamifyStats, setGamifyStats] = useState({ achievements: [], badges: [], completedLessons: 0, pet: null });
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [petLoading, setPetLoading] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const gamify = await api.getGamifyStats();
        setGamifyStats(gamify);
        setXP(gamify.xp || 0);
        setStreak(gamify.streak || 0);
        setPet(gamify.pet || null);
        const profile = await api.getProfile();
        setLevel(profile.level || 1);
      } catch {}
      setLoading(false);
    }
    fetchStats();
  }, []);

  // Calculate user stats
  const currentXP = xp;
  const currentLevel = level;
  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * 100;
  const progressToNextLevel = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  // Achievements and badges from backend
  const achievements = gamifyStats.achievements || [];
  const badges = gamifyStats.badges || [];
  const completedLessons = gamifyStats.completedLessons || 0;

  const handleClaimReward = (achievement) => {
    if (achievement.unlocked) {
      const newXP = currentXP + achievement.xpReward;
      const newLevel = Math.floor(newXP / 100) + 1;
      updateUser({ xp: newXP, level: newLevel });
      toast.success(`Congratulations! You earned ${achievement.xpReward} XP for "${achievement.title}"!`);
    }
  };

  const startQuiz = async () => {
    setQuizLoading(true);
    try {
      const quizData = await startQuizBackend();
      setQuiz(quizData);
      toast.success('Quiz started! (Implement quiz UI to display questions)');
    } catch {
      toast.error('Failed to start quiz.');
    }
    setQuizLoading(false);
  };

  const feedPet = async () => {
    setPetLoading(true);
    try {
      const petData = await feedPetBackend();
      setPet(petData.pet || petData);
      toast.success('Your virtual pet is happy!');
    } catch {
      toast.error('Failed to feed pet.');
    }
    setPetLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/homepage')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homepage
            </Button>
            <div className="flex items-center">
              <Gamepad2 className="h-8 w-8 text-purple-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Gamified Learning</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Track your XP, level, streak, and achievements!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Level {currentLevel}</span>
                <span className="text-gray-500 text-sm">{currentXP} XP</span>
              </div>
              <Progress value={progressToNextLevel} />
              <div className="text-right text-xs text-gray-400 mt-1">{currentXP - xpForCurrentLevel}/100 XP to next level</div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-gray-700">{streak} day streak</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">{completedLessons} lessons completed</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="achievements" className="mb-8">
          <TabsList>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="pet">Virtual Pet</TabsTrigger>
          </TabsList>
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.length > 0 ? achievements.map((ach, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${ach.unlocked ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-6 w-6 text-yellow-500" />
                        <span className="font-semibold text-gray-900">{ach.title}</span>
                        {ach.unlocked && <Badge variant="secondary">Unlocked</Badge>}
                      </div>
                      <div className="text-gray-700 mb-2">{ach.description}</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" disabled={!ach.unlocked} onClick={() => handleClaimReward(ach)}>
                          Claim Reward
                        </Button>
                        <span className="text-xs text-gray-500">{ach.xpReward} XP</span>
                      </div>
                    </div>
                  )) : <div>No achievements yet.</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {badges.length > 0 ? badges.map((badge, idx) => (
                    <div key={idx} className={`flex flex-col items-center p-4 rounded-lg border ${badge.earned ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                      <Crown className="h-8 w-8 text-yellow-500 mb-2" />
                      <span className="font-semibold text-gray-900">{badge.name}</span>
                      {badge.earned && <Badge variant="secondary">Earned</Badge>}
                    </div>
                  )) : <div>No badges yet.</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pet">
            <Card>
              <CardHeader>
                <CardTitle>Virtual Pet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center text-6xl">
                    {pet?.emoji || '🐉'}
                  </div>
                  <div className="text-lg font-semibold">{pet?.name || 'Buddy'} ({pet?.evolution || 'baby'})</div>
                  <div className="text-gray-600">Level: {pet?.level || 1}</div>
                  <div className="text-gray-600">Happiness: {pet?.happiness ?? 0}%</div>
                  <Button onClick={feedPet} className="bg-purple-600 hover:bg-purple-700" disabled={petLoading}>{petLoading ? 'Feeding...' : 'Feed Pet'}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Daily Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="text-gray-700 mb-2">Test your knowledge and earn bonus XP!</div>
              <Button onClick={startQuiz} className="bg-green-600 hover:bg-green-700" disabled={quizLoading}>
                {quizLoading ? 'Starting Quiz...' : 'Play & Learn'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamifiedLearningPage;

