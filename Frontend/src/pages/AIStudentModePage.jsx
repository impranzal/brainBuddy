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
import { GEMINI_API_KEY, GEMINI_MODEL } from '../config/api';

// Direct Gemini API integration
const callGeminiAPI = async (prompt) => {
  // Check if API key is properly set
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') {
    throw new Error('Gemini API key not configured. Please set your API key in src/config/api.js');
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error details:', errorData);
        
        if (response.status === 400) {
          throw new Error('Invalid API key or request format');
        } else if (response.status === 403) {
          throw new Error('API key not authorized or quota exceeded');
        } else if (response.status === 429) {
          // Rate limit exceeded - wait and retry
          retryCount++;
          if (retryCount < maxRetries) {
            const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
            console.log(`Rate limit hit. Waiting ${waitTime/1000}s before retry ${retryCount}/${maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          } else {
            throw new Error('Rate limit exceeded. Please wait a minute and try again.');
          }
        } else {
          throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
        }
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    } catch (error) {
      console.error('Gemini API error:', error);
      if (error.message.includes('API key')) {
        throw new Error('Please configure your Gemini API key in src/config/api.js. Get one from https://makersuite.google.com/app/apikey');
      }
      if (error.message.includes('Rate limit')) {
        throw error; // Re-throw rate limit errors
      }
      throw new Error('Failed to get AI feedback. Please check your internet connection and try again.');
    }
  }
};

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
      const prompt = `
A student provided the following explanation about "${topic}": "${explanation}".

Please analyze this explanation and provide:

1. Constructive feedback on correctness, clarity, and completeness
2. An improved version of the answer
3. A score out of 100
4. XP points to award (0-20) based on quality

Respond ONLY with a valid JSON object in this exact format:
{
  "feedback": "Your detailed feedback here...",
  "improved": "The improved answer here...",
  "score": 85,
  "xp": 15
}
`;

      const aiResponse = await callGeminiAPI(prompt);

      // Try to parse JSON response
      let feedback = '', improved = '', score = 0, xpEarned = 0;
      
      try {
        let jsonText = aiResponse;
        // Remove code block markers if present
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
        }

        // Extract JSON from response
        const firstBrace = jsonText.indexOf('{');
        const lastBrace = jsonText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonText = jsonText.substring(firstBrace, lastBrace + 1);
        }

        const parsed = JSON.parse(jsonText);
        feedback = parsed.feedback || 'AI could not provide specific feedback.';
        improved = parsed.improved || 'AI could not provide an improved version.';
        score = parseInt(parsed.score) || 0;
        xpEarned = parseInt(parsed.xp) || 0;
        
        // Validate score and XP ranges
        score = Math.max(0, Math.min(100, score));
        xpEarned = Math.max(0, Math.min(20, xpEarned));
        
      } catch (e) {
        console.error('JSON parsing error:', e);
        feedback = 'AI could not parse the response properly. Here is the raw response: ' + aiResponse;
        improved = '';
        score = 0;
        xpEarned = 0;
      }

      const result = { feedback, improved, score, xp: xpEarned };
      setAIFeedback(result);
      setConversation([
        { type: 'user', content: explanation, timestamp: new Date().toLocaleTimeString() },
        { type: 'ai', content: feedback, timestamp: new Date().toLocaleTimeString() }
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
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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
                  {loading ? 'Evaluating...' : 'Start Session'}
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

