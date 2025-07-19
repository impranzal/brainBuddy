import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Layers, 
  Route,
  Star,
  Save,
  ThumbsUp,
  CheckCircle
} from 'lucide-react';
import * as api from '../services/api';

const AITutorPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState('quick');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.aiTutor({ topic, mode });
      setResponse(res.response || res);
      // Fetch flashcards from dedicated endpoint
      const flashRes = await api.getFlashcardsByTopic(topic);
      setFlashcards(flashRes.flashcards || []);
      setCurrentCard(0);
      setShowAnswer(false);
    } catch (err) {
      setError(err.message || 'Failed to get AI response');
    }
    setLoading(false);
  };

  const handleSaveResponse = async () => {
    // In a real app, this would save to database via backend endpoint
    alert('Response saved successfully!');
  };

  const handleRateSession = async (rating) => {
    // In a real app, send rating to backend
    alert(`Thank you for rating this session ${rating} stars!`);
  };

  const handleMarkUnderstood = async () => {
    // In a real app, call backend to mark session as understood and award XP
    const newXP = (user?.xp || 0) + 50;
    const newLevel = Math.floor(newXP / 100) + 1;
    updateUser({ 
      xp: newXP, 
      level: newLevel,
      completedLessons: (user?.completedLessons || 0) + 1
    });
    alert('Great! You earned 50 XP for completing this lesson!');
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
              <Brain className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">AI Tutor</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Get Personalized Explanations</CardTitle>
            <CardDescription>
              Enter a topic and select a mode to get a tailored explanation and flashcards from the AI Tutor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Binary Search Trees, HTTP Protocol, Machine Learning..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mode</Label>
                <RadioGroup value={mode} onValueChange={setMode} className="flex gap-4">
                  <RadioGroupItem value="quick" id="mode-quick" />
                  <Label htmlFor="mode-quick">Quick</Label>
                  <RadioGroupItem value="deep" id="mode-deep" />
                  <Label htmlFor="mode-deep">Deep</Label>
                  <RadioGroupItem value="step" id="mode-step" />
                  <Label htmlFor="mode-step">Step-by-step</Label>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Generating...' : 'Get AI Explanation'}
              </Button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </form>
          </CardContent>
        </Card>

        {response && (
          <div className="space-y-8">
            {/* AI Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{response.title || 'AI Explanation'}</span>
                  <Badge variant="secondary" className="capitalize">{mode} mode</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {response.content || response}
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleSaveResponse} variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Response
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rate this session:</span>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRateSession(rating)}
                        className="p-1"
                      >
                        <Star className="h-4 w-4 text-yellow-500" />
                      </Button>
                    ))}
                  </div>
                  <Button onClick={handleMarkUnderstood} className="ml-auto">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Understood
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Flashcards */}
            {flashcards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Flashcards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-full max-w-md">
                      <div className="bg-gray-100 rounded-lg p-6 shadow-md">
                        <div className="text-lg font-semibold mb-2">Q: {flashcards[currentCard].question}</div>
                        {showAnswer && (
                          <div className="text-green-700 font-medium mt-2">A: {flashcards[currentCard].answer}</div>
                        )}
                        <div className="flex justify-between mt-4">
                          <Button onClick={prevCard} disabled={currentCard === 0} variant="outline" size="sm">Previous</Button>
                          <Button onClick={() => setShowAnswer(!showAnswer)} variant="secondary" size="sm">
                            {showAnswer ? 'Hide Answer' : 'Show Answer'}
                          </Button>
                          <Button onClick={nextCard} disabled={currentCard === flashcards.length - 1} variant="outline" size="sm">Next</Button>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          Card {currentCard + 1} of {flashcards.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AITutorPage;

