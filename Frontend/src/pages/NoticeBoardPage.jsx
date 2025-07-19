import React, { useState } from 'react';
import { Calendar, Clock, User, Bell } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const NoticeBoardPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for notices
  const notices = [
    {
      id: 1,
      title: 'Semester Exam Schedule Released',
      content: 'The final semester examination schedule for all CSIT students has been published. Please check your respective timetables and prepare accordingly.',
      category: 'academic',
      priority: 'high',
      author: 'Academic Department',
      date: '2024-01-15',
      time: '10:30 AM',
      isNew: true
    },
    {
      id: 2,
      title: 'Campus Maintenance Notice',
      content: 'Scheduled maintenance will be conducted in the computer labs from 2:00 PM to 6:00 PM on Friday. Please plan your lab sessions accordingly.',
      category: 'maintenance',
      priority: 'medium',
      author: 'IT Department',
      date: '2024-01-14',
      time: '09:15 AM',
      isNew: false
    },
    {
      id: 3,
      title: 'Student Council Elections',
      content: 'Nominations are now open for the Student Council elections. Interested candidates can submit their applications by the end of this week.',
      category: 'events',
      priority: 'high',
      author: 'Student Affairs',
      date: '2024-01-13',
      time: '03:45 PM',
      isNew: true
    },
    {
      id: 4,
      title: 'Library Extended Hours',
      content: 'The library will remain open until 10:00 PM during the exam preparation period. Students are encouraged to make use of the extended hours.',
      category: 'academic',
      priority: 'low',
      author: 'Library Staff',
      date: '2024-01-12',
      time: '11:20 AM',
      isNew: false
    },
    {
      id: 5,
      title: 'WiFi Network Upgrade',
      content: 'The campus WiFi network will be upgraded to provide better connectivity. Brief interruptions may occur during the upgrade process.',
      category: 'maintenance',
      priority: 'medium',
      author: 'IT Department',
      date: '2024-01-11',
      time: '02:30 PM',
      isNew: false
    },
    {
      id: 6,
      title: 'Sports Meet Registration',
      content: 'Registration for the annual sports meet is now open. Students can register for various events through the sports department.',
      category: 'events',
      priority: 'medium',
      author: 'Sports Department',
      date: '2024-01-10',
      time: '01:15 PM',
      isNew: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Notices', count: notices.length },
    { id: 'academic', name: 'Academic', count: notices.filter(n => n.category === 'academic').length },
    { id: 'maintenance', name: 'Maintenance', count: notices.filter(n => n.category === 'maintenance').length },
    { id: 'events', name: 'Events', count: notices.filter(n => n.category === 'events').length }
  ];

  const filteredNotices = selectedCategory === 'all' 
    ? notices 
    : notices.filter(notice => notice.category === selectedCategory);

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
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'events': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
          </div>
          <p className="text-gray-600">Stay updated with the latest announcements and important notices</p>
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
                    <Badge className={getCategoryColor(notice.category)}>
                      {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                    </Badge>
                    <Badge className={`border ${getPriorityColor(notice.priority)}`}>
                      {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                    </Badge>
                    {notice.isNew && (
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
                {notice.content}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{notice.author}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(notice.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{notice.time}</span>
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