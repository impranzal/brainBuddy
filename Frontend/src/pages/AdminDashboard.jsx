import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import logo from '@/assets/logo.png';
import {
  Brain,
  LogOut,
  Upload,
  Search,
  Users,
  BookOpen,
  TrendingUp,
  FileText,
  Plus,
  Filter,
  Crown,
  Award,
  BarChart3,
  PieChart,
  Target,
  Calendar,
  Eye,
  Trash2,
  Edit,
  Download,
  Bell,
  Settings,
  Shield,
  Activity,
  Zap,
  Star,
  Trophy,
  Flame,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import * as api from '../services/api';

const AdminDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [resources, setResources] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalResources: 0,
    totalNotices: 0,
    averageXP: 0,
    averageStreak: 0
  });

  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [progressData, setProgressData] = useState(null);

  // Form states
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: '',
    semester: '',
    subject: '',
    url: ''
  });
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    file: null
  });

  // Honour board
  const [honourSearch, setHonourSearch] = useState('');
  const [honourResults, setHonourResults] = useState([]);
  const [honourLoading, setHonourLoading] = useState(false);

  // Feedback states
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch all data in parallel
      const [usersRes, resourcesRes, honourRes, noticesRes] = await Promise.all([
        api.getAllUsers(),
        api.getAllAdminResources(),
        api.getAdminHonourBoard(),
        api.getAdminNotices()
      ]);

      setStudents(usersRes.users || []);
      setResources(resourcesRes.resources || []);
      setHonourResults(honourRes || []);
      setNotices(noticesRes || []);

      // Calculate stats
      const totalStudents = usersRes.users?.length || 0;
      const activeStudents = usersRes.users?.filter(u => u.progress?.streak > 0).length || 0;
      const totalResources = resourcesRes.resources?.length || 0;
      const totalNotices = noticesRes?.length || 0;
      const averageXP = usersRes.users?.reduce((sum, u) => sum + (u.progress?.xp || 0), 0) / totalStudents || 0;
      const averageStreak = usersRes.users?.reduce((sum, u) => sum + (u.progress?.streak || 0), 0) / totalStudents || 0;

      setStats({
        totalStudents,
        activeStudents,
        totalResources,
        totalNotices,
        averageXP: Math.round(averageXP),
        averageStreak: Math.round(averageStreak)
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      showFeedback('Failed to refresh data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.adminLogout();
      showFeedback('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
    logout();
    navigate('/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const result = await api.uploadAdminProfilePicture(file);
      const imageUrl = result.profilePictureUrl || result.url || '';
      
      if (imageUrl) {
        setProfileImage(imageUrl);
        await updateUser({ profilePicture: imageUrl });
        showFeedback('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showFeedback('Failed to upload profile picture', 'error');
    }
    
    e.target.value = '';
  };

  const handleUploadResource = async (e) => {
    e.preventDefault();
    try {
      await api.uploadResource(uploadForm);
      setUploadModalOpen(false);
      setUploadForm({ title: '', type: '', semester: '', subject: '', url: '' });
      await fetchDashboardData(); // Refresh data
      showFeedback('Resource uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      showFeedback('Failed to upload resource', 'error');
    }
  };

  const handleUploadNotice = async (e) => {
    e.preventDefault();
    try {
      await api.uploadNotice({
        title: noticeForm.title,
        description: noticeForm.description,
        category: noticeForm.category,
        priority: noticeForm.priority,
        file: noticeForm.file
      });

      setNoticeModalOpen(false);
      setNoticeForm({ title: '', description: '', category: 'general', priority: 'medium', file: null });
      await fetchDashboardData(); // Refresh data
      showFeedback('Notice posted successfully!');
    } catch (error) {
      console.error('Notice upload error:', error);
      showFeedback('Failed to post notice', 'error');
    }
  };

  const handleDeleteResource = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await api.deleteResource(id);
      await fetchDashboardData(); // Refresh data
      showFeedback('Resource deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      showFeedback('Failed to delete resource', 'error');
    }
  };

  const handleViewProgress = async (userId) => {
    try {
      const data = await api.getUserProgressReport(userId);
      setProgressData(data);
      setSelectedUser(students.find(s => s.id === userId));
      setProgressModalOpen(true);
    } catch (error) {
      console.error('Progress error:', error);
      showFeedback('Failed to fetch user progress', 'error');
    }
  };

  const handleHonourSearch = async (e) => {
    e.preventDefault();
    try {
      setHonourLoading(true);
      const results = await api.getAdminHonourBoard(honourSearch);
      setHonourResults(results);
      showFeedback(`Found ${results.length} results`);
    } catch (error) {
      console.error('Search error:', error);
      showFeedback('Failed to search honour board', 'error');
    } finally {
      setHonourLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Feedback Toast */}
      {feedback.message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          feedback.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            {feedback.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={logo} alt="BrainBuddy Logo" className="h-12 w-12" />
                <h1 className="text-2xl font-bold text-blue-600">BrainBuddy</h1>
                <Badge variant="outline" className="ml-2">Admin Panel</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={fetchDashboardData} 
                variant="outline" 
                size="sm"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={profileImage} alt={user?.name || 'Admin'} />
                  <AvatarFallback>{user?.name?.[0] || 'A'}</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="admin-profile-upload"
                />
                <label htmlFor="admin-profile-upload" className="cursor-pointer">
                  <Edit className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </label>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Students</p>
                    <p className="text-3xl font-bold">{stats.totalStudents}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Students</p>
                    <p className="text-3xl font-bold">{stats.activeStudents}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Resources</p>
                    <p className="text-3xl font-bold">{stats.totalResources}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Total Notices</p>
                    <p className="text-3xl font-bold">{stats.totalNotices}</p>
                  </div>
                  <Bell className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button onClick={() => setUploadModalOpen(true)} className="flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
            <Button onClick={() => setNoticeModalOpen(true)} variant="outline" className="flex-shrink-0">
              <Bell className="h-4 w-4 mr-2" />
              Post Notice
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Honour Board */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                Honour Board
                <Badge variant="secondary" className="ml-2">
                  Top Performers
                </Badge>
              </CardTitle>
              <CardDescription>Students with highest XP and streaks - Updates every 30 seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHonourSearch} className="flex gap-2 mb-4">
                <Input
                  placeholder="Search by username or name..."
                  value={honourSearch}
                  onChange={e => setHonourSearch(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={honourLoading}>
                  {honourLoading ? 'Searching...' : 'Search'}
                </Button>
              </form>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">XP</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Streak</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {honourResults.slice(0, 10).map((user, index) => (
                      <tr key={user.id} className="bg-white even:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <Trophy className={`h-4 w-4 mr-2 ${
                                index === 0 ? 'text-yellow-500' : 
                                index === 1 ? 'text-gray-400' : 'text-orange-500'
                              }`} />
                            ) : null}
                            <span className="font-medium">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap font-medium">{user.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-600">@{user.username}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {user.xp}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <Flame className="h-4 w-4 text-orange-500 mr-1" />
                            {user.streak} days
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Button size="sm" variant="outline" onClick={() => handleViewProgress(user.id)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Student Management */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Student Management
                {searchTerm && (
                  <Badge variant="secondary" className="ml-2">
                    {filteredStudents.length} of {stats.totalStudents} students
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Monitor student progress and performance - Live updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">XP</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Streak</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="bg-white even:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="w-8 h-8 mr-3">
                              <AvatarImage src={student.profilePicture} alt={student.name} />
                              <AvatarFallback>{student.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-600">@{student.username}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-600">{student.email}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {student.progress?.xp || 0}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <Flame className="h-4 w-4 text-orange-500 mr-1" />
                            {student.progress?.streak || 0} days
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Badge variant={student.progress?.streak > 0 ? "default" : "secondary"}>
                            {student.progress?.streak > 0 ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Button size="sm" variant="outline" onClick={() => handleViewProgress(student.id)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View Progress
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Resource Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Resource Management
              </CardTitle>
              <CardDescription>Upload and manage learning resources - Available to students in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((resource) => (
                      <tr key={resource.id} className="bg-white even:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap font-medium">{resource.title}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Badge variant="outline">{resource.type}</Badge>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-600">{resource.subject}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-600">{resource.semester}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteResource(resource.id)}>
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Notice Management */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notice Management
              </CardTitle>
              <CardDescription>Manage announcements and notices - Visible to all students in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Posted By</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.map((notice) => (
                      <tr key={notice.id} className="bg-white even:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap font-medium">{notice.title}</td>
                        <td className="px-4 py-2 text-gray-600 max-w-xs truncate">{notice.description}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-600">
                          {notice.user?.name || notice.uploadedBy || 'Admin'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-600">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex gap-2">
                            {notice.fileUrl && (
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            )}
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {notices.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No notices posted yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Resource Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button onClick={() => setUploadModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <XCircle className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Upload Resource</h2>
            <form onSubmit={handleUploadResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select type</option>
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Link">Link</option>
                  <option value="Notes">Notes</option>
                  <option value="Quiz">Quiz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Input
                  type="text"
                  value={uploadForm.subject}
                  onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Semester</label>
                <Input
                  type="text"
                  value={uploadForm.semester}
                  onChange={(e) => setUploadForm({...uploadForm, semester: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <Input
                  type="url"
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({...uploadForm, url: e.target.value})}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Notice Modal */}
      {noticeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button onClick={() => setNoticeModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <XCircle className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Post Notice</h2>
            <form onSubmit={handleUploadNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  type="text"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({...noticeForm, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={noticeForm.description}
                  onChange={(e) => setNoticeForm({...noticeForm, description: e.target.value})}
                  className="w-full border rounded px-3 py-2 h-24 resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={noticeForm.category}
                  onChange={(e) => setNoticeForm({...noticeForm, category: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="general">General</option>
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                  <option value="important">Important</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={noticeForm.priority}
                  onChange={(e) => setNoticeForm({...noticeForm, priority: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Attachment (Optional)</label>
                <Input
                  type="file"
                  onChange={(e) => setNoticeForm({...noticeForm, file: e.target.files[0]})}
                  accept="*/*"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setNoticeModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Post Notice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {progressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button onClick={() => setProgressModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <XCircle className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">
              Progress Report - {selectedUser?.name}
            </h2>
            {progressData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-sm text-blue-600">Total Resources Completed</div>
                    <div className="text-2xl font-bold text-blue-800">{progressData.progress?.length || 0}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-sm text-green-600">Last Activity</div>
                    <div className="text-sm font-medium text-green-800">
                      {progressData.progress?.[0]?.completedAt ? 
                        new Date(progressData.progress[0].completedAt).toLocaleDateString() : 
                        'No activity'
                      }
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Recent Completions</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {progressData.progress?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{item.resourceTitle}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {(!progressData.progress || progressData.progress.length === 0) && (
                      <div className="text-center text-gray-500 py-4">
                        No resources completed yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Loading progress data...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
