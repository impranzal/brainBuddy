import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import * as api from '../services/api';

const UserResources = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await api.getResources();
        setResources(res);
        // Optionally, fetch completed resources if backend provides
        // setCompleted([...]);
      } catch (err) {
        setError('Failed to load resources');
      }
      setLoading(false);
    }
    fetchResources();
  }, []);

  const handleMarkCompleted = async (resourceId) => {
    try {
      await api.markResourceCompleted(resourceId);
      setCompleted([...completed, resourceId]);
    } catch {
      alert('Failed to mark as completed');
    }
  };

  const handleViewResource = (resourceId) => {
    navigate(`/resource/${resourceId}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
              <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Resources</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Available Resources</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource.id} className="bg-white even:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">{resource.title}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{resource.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{resource.subject}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{resource.semester}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {completed.includes(resource.id) ? (
                          <Badge variant="secondary"><CheckCircle className="h-4 w-4 mr-1 inline" /> Completed</Badge>
                        ) : (
                          <Button size="sm" onClick={() => handleMarkCompleted(resource.id)}>
                            Mark as Completed
                          </Button>
                        )}
                        <Button onClick={() => handleViewResource(resource.id)} variant="secondary" className="mt-2">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserResources; 