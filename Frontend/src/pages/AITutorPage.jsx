import React, { useState, useEffect } from "react";
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
  CheckCircle,
  MessageSquare,
  Target,
  TrendingUp,
  Zap,
  Trophy,
  Users,
  Calendar,
  Heart,
} from 'lucide-react';
import * as api from '../services/api';
import toast from "react-hot-toast";
// Remove GEMINI_API_KEY and GEMINI_MODEL imports

// Replace callGeminiAPI with a backend proxy call
const callGeminiAPI = async (prompt, setLoadingMessage = null) => {
  try {
    const response = await fetch('/api/user/gemini-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || response.statusText);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    throw new Error(error.message || 'Failed to get AI response from backend');
  }
};

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
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setLoadingMessage('Generating AI response...');
    setError('');
    
    try {
      // Create prompt based on mode
      let prompt = '';
      switch (mode) {
        case 'quick':
          prompt = `Provide a concise explanation of "${topic}" in 2-3 paragraphs. Focus on key concepts and practical applications.`;
          break;
        case 'deep':
          prompt = `Provide a comprehensive, detailed explanation of "${topic}". Include theoretical background, practical examples, and advanced concepts. Make it suitable for advanced learners.`;
          break;
        case 'step':
          prompt = `Explain "${topic}" step-by-step, breaking down complex concepts into simple, digestible parts. Include examples for each step and practical applications.`;
          break;
        default:
          prompt = `Explain the topic "${topic}" in a clear and engaging way.`;
      }

      // Add flashcard generation to the prompt
      prompt += `\n\nAlso, generate 5 flashcard questions for this topic. 

IMPORTANT: Respond ONLY with a valid JSON object. Do not include any text before or after the JSON. The JSON must be properly formatted with this exact structure:

{
  "explanation": "Your detailed explanation here...",
  "flashcards": [
    {
      "question": "Question 1?",
      "answer": "Answer 1"
    },
    {
      "question": "Question 2?",
      "answer": "Answer 2"
    },
    {
      "question": "Question 3?",
      "answer": "Answer 3"
    },
    {
      "question": "Question 4?",
      "answer": "Answer 4"
    },
    {
      "question": "Question 5?",
      "answer": "Answer 5"
    }
  ]
}`;

      const aiResponse = await callGeminiAPI(prompt, setLoadingMessage);

      // Try to parse JSON response
      let explanation = '';
      let flashcards = [];

      try {
        let jsonText = aiResponse;
        console.log('Raw AI response:', jsonText);
        
        // Remove code block markers if present
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
        }

        // Try to extract JSON from the response
        const firstBrace = jsonText.indexOf('{');
        const lastBrace = jsonText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonText = jsonText.substring(firstBrace, lastBrace + 1);
          console.log('Extracted JSON text:', jsonText);
        }

        const parsed = JSON.parse(jsonText);
        console.log('Parsed JSON:', parsed);
        
        explanation = parsed.explanation || aiResponse;
        flashcards = parsed.flashcards || [];
        
        // Ensure flashcards have the correct structure
        if (Array.isArray(flashcards)) {
          flashcards = flashcards.map(card => {
            if (typeof card === 'string') {
              return { question: card, answer: '' };
            }
            return {
              question: card.question || card,
              answer: card.answer || ''
            };
          });
        }
      } catch (e) {
        console.error('JSON parsing error:', e);
        console.error('Failed to parse JSON. Using raw response as explanation.');
        
        // If not valid JSON, use the raw response as explanation
        explanation = aiResponse;
        flashcards = [];
        
        // Try to extract some basic flashcards from the text
        const lines = aiResponse.split('\n');
        const extractedFlashcards = [];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.includes('?') && line.length > 10) {
            // This might be a question
            const nextLine = lines[i + 1]?.trim();
            if (nextLine && nextLine.length > 5) {
              extractedFlashcards.push({
                question: line,
                answer: nextLine
              });
              i++; // Skip the next line since we used it as answer
            } else {
              extractedFlashcards.push({
                question: line,
                answer: 'Answer not provided'
              });
            }
            
            if (extractedFlashcards.length >= 5) break;
          }
        }
        
        if (extractedFlashcards.length > 0) {
          flashcards = extractedFlashcards;
        }
      }

      setResponse({ content: explanation, title: `${topic} - ${mode} mode` });
      setFlashcards(flashcards);
      setCurrentCard(0);
      setShowAnswer(false);
    } catch (err) {
      setError(err.message || 'Failed to get AI response');
    }
    setLoading(false);
    setLoadingMessage('');
  };

  const handleSaveResponse = async () => {
    // In a real app, this would save to database via backend endpoint
    toast.success('Response saved successfully!');
  };

  const handleRateSession = async (rating) => {
    // In a real app, send rating to backend
    toast.success(`Thank you for rating this session ${rating} stars!`);
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
    toast.success('Great! You earned 50 XP for completing this lesson!');
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
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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
                {loading ? loadingMessage || 'Generating...' : 'Get AI Explanation'}
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

