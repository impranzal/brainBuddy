import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Bell, RefreshCw, ArrowLeft } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import * as api from '../services/api';

const NoticeBoardPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await api.getNotices();
      setNotices((data?.notices || data || []));
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
      setError('Failed to load notices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
    
    // Set up real-time refresh every 10 seconds for better responsiveness
    const interval = setInterval(fetchNotices, 10000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', name: 'All Notices', count: notices.length },
    { id: 'general', name: 'General', count: notices.filter(n => n.category === 'general').length },
    { id: 'announcement', name: 'Announcement', count: notices.filter(n => n.category === 'announcement').length },
    { id: 'event', name: 'Event', count: notices.filter(n => n.category === 'event').length },
    { id: 'important', name: 'Important', count: notices.filter(n => n.category === 'important').length }
  ];

  const filteredNotices = selectedCategory === 'all' 
    ? notices 
    : notices.filter(notice => notice.category === selectedCategory);

  // Check if notice is new (created within last 24 hours)
  const isNoticeNew = (notice) => {
    const noticeDate = new Date(notice.createdAt);
    const now = new Date();
    const diffInHours = (now - noticeDate) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'important': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && notices.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading notices...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && notices.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchNotices}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Bell className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Notice Board</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
            <button 
              onClick={fetchNotices}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <p className="text-gray-600">Stay updated with the latest announcements and important notices</p>
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(notice.category || 'general')}>
                      {(notice.category || 'general').charAt(0).toUpperCase() + (notice.category || 'general').slice(1)}
                    </Badge>
                    <Badge className={`border ${getPriorityColor(notice.priority || 'medium')}`}>
                      {(notice.priority || 'medium').charAt(0).toUpperCase() + (notice.priority || 'medium').slice(1)}
                    </Badge>
                    {isNoticeNew(notice) && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        New
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {notice.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {notice.description}
              </p>

              {/* File attachment if exists */}
              {notice.fileUrl && (
                <div className="mb-4">
                  <a 
                    href={notice.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📎 View Attachment
                  </a>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{notice.user?.name || notice.uploadedBy || 'Admin'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(notice.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notices found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoardPage; 