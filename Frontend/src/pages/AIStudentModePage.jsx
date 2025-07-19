import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  GraduationCap, 
  ArrowLeft, 
  MessageCircle, 
  Bot, 
  User, 
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';
import * as api from '../services/api';

const AIStudentModePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentStep, setCurrentStep] = useState('input'); // input, conversation, feedback
  const [sessionComplete, setSessionComplete] = useState(false);
  const [aiFeedback, setAIFeedback] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !explanation.trim()) return;
    setLoading(true);
    setError('');
    setCurrentStep('conversation');
    try {
      const res = await api.aiStudentMode({ topic, explanation });
      setAIFeedback(res);
      setConversation([
        { type: 'user', content: explanation, timestamp: new Date().toLocaleTimeString() },
        { type: 'ai', content: res.feedback, timestamp: new Date().toLocaleTimeString() }
      ]);
      setCurrentStep('feedback');
    } catch (err) {
      setError(err.message || 'Failed to get AI feedback');
      setCurrentStep('input');
    }
    setLoading(false);
  };

  const handleCompleteSession = () => {
    // Award XP and update user stats
    const newXP = (user?.xp || 0) + (aiFeedback?.xp || 75);
    const newLevel = Math.floor(newXP / 100) + 1;
    updateUser({ 
      xp: newXP, 
      level: newLevel,
      completedLessons: (user?.completedLessons || 0) + 1
    });
    setSessionComplete(true);
  };

  const resetSession = () => {
    setTopic('');
    setExplanation('');
    setConversation([]);
    setCurrentStep('input');
    setSessionComplete(false);
    setAIFeedback(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
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
              <GraduationCap className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Enhance Your Knowledge</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'feedback' && aiFeedback && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
              <CardDescription>See how you did and get suggestions for improvement!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="font-semibold text-lg mb-2">Feedback:</div>
                <div className="bg-gray-100 rounded-lg p-4 text-gray-700 whitespace-pre-line">{aiFeedback.feedback}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-lg mb-2">Improved Answer:</div>
                <div className="bg-gray-100 rounded-lg p-4 text-gray-700 whitespace-pre-line">{aiFeedback.improved}</div>
              </div>
              <div className="mb-4 flex gap-4">
                <Badge variant="secondary">Score: {aiFeedback.score}/100</Badge>
                <Badge variant="secondary">XP: {aiFeedback.xp}</Badge>
              </div>
              <Button onClick={handleCompleteSession} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" /> Complete Session
              </Button>
            </CardContent>
          </Card>
        )}

        {sessionComplete && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Session Complete!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-green-700 font-semibold mb-4">Congratulations! You earned {aiFeedback?.xp || 75} XP for teaching the AI.</div>
              <Button onClick={resetSession} variant="outline">Start New Session</Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 'input' && !sessionComplete && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
                Sharpen your knowledge
              </CardTitle>
              <CardDescription>
                Explain any topic to our AI and help reinforce your own learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic">What topic will you Explain?</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Binary Search Trees, HTTP Protocol, Machine Learning..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">Your Explanation</Label>
                  <Textarea
                    id="explanation"
                    placeholder="Explain the topic in your own words. Include key concepts, examples, and any insights you have..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={8}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    The more detailed your explanation, the better feedback you'll receive!
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Evaluating...' : 'Teach AI'}
                </Button>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIStudentModePage;

