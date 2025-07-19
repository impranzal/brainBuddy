import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResource() {
      try {
        const res = await api.getResourceById(id);
        setResource(res);
      } catch (err) {
        setError('Failed to load resource');
      }
      setLoading(false);
    }
    fetchResource();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!resource) {
    return <div className="min-h-screen flex items-center justify-center">Resource not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate('/resources')} className="mb-4">&larr; Back to Resources</Button>
        <Card>
          <CardHeader>
            <CardTitle>{resource.title || 'Resource Details'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div><strong>Type:</strong> {resource.type}</div>
              <div><strong>Subject:</strong> {resource.subject}</div>
              <div><strong>Semester:</strong> {resource.semester}</div>
              {resource.url && (
                <div><a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open Resource</a></div>
              )}
              {resource.description && (
                <div><strong>Description:</strong> {resource.description}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourceDetailPage; 