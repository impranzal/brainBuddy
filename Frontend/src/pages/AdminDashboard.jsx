import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  Filter
} from 'lucide-react';
import * as api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState('');
  const [progressData, setProgressData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadForm, setUploadForm] = useState({ file: null, title: '', type: '', semester: '', subject: '' });
  const [honourSearch, setHonourSearch] = useState('');
  const [honourLoading, setHonourLoading] = useState(false);
  const [honourError, setHonourError] = useState('');
  const [honourResults, setHonourResults] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await api.getAllUsers();
        setStudents(users);
        const res = await api.getAllAdminResources();
        setResources(res);
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.adminLogout();
    } catch {}
    logout();
    navigate('/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const result = await api.uploadAdminProfilePicture(file);
        setProfileImage(result.profilePictureUrl || result.url || '');
        await updateUser({ profilePicture: result.profilePictureUrl || result.url || '' });
      } catch {
        alert('Failed to upload admin profile picture');
      }
    }
  };

  // Example: handle resource upload (replace placeholder)
  const handleUploadResources = async (resourceData) => {
    try {
      await api.uploadAdminResource(resourceData);
      // Optionally refresh resources
      const res = await api.getAllAdminResources();
      setResources(res);
    } catch {
      alert('Failed to upload resource');
    }
  };

  const handleDeleteResource = async (id) => {
    await api.deleteResource(id);
    setResources(resources.filter(r => r.id !== id));
  };

  // Example: handle honour board search
  const handleSearchHonourBoard = async (searchTerm) => {
    try {
      const board = await api.getAdminHonourBoard(searchTerm);
      // setHonourBoard(board); // Add this state if you want to display
    } catch {
      alert('Failed to search honour board');
    }
  };

  const handleViewProgress = async (userId) => {
    setProgressModalOpen(true);
    setProgressLoading(true);
    setProgressError('');
    setProgressData(null);
    setSelectedUser(userId);
    try {
      const data = await api.getUserProgressReport(userId);
      setProgressData(data);
    } catch (err) {
      setProgressError('Failed to fetch progress');
    }
    setProgressLoading(false);
  };
  const handleCloseProgressModal = () => {
    setProgressModalOpen(false);
    setProgressData(null);
    setSelectedUser(null);
    setProgressError('');
  };

  const openUploadModal = () => {
    setUploadModalOpen(true);
    setUploadForm({ file: null, title: '', type: '', semester: '', subject: '' });
    setUploadError('');
  };
  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setUploadError('');
  };
  const handleUploadFormChange = (e) => {
    const { name, value, files } = e.target;
    setUploadForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const handleUploadFormSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadError('');
    try {
      await handleUploadResources(uploadForm);
      closeUploadModal();
    } catch {
      setUploadError('Failed to upload resource');
    }
    setUploadLoading(false);
  };

  const handleHonourSearch = async (e) => {
    e.preventDefault();
    setHonourLoading(true);
    setHonourError('');
    try {
      const results = await api.getAdminHonourBoard(honourSearch);
      setHonourResults(results);
    } catch {
      setHonourError('Failed to search honour board');
    }
    setHonourLoading(false);
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate overall stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.lastActive?.includes('hour') || s.lastActive?.includes('minute')).length;
  const averageProgress = students.length > 0 ? Math.round(students.reduce((sum, s) => sum + (s.progress || 0), 0) / students.length) : 0;
  const totalLessonsCompleted = students.reduce((sum, s) => sum + (s.completedLessons || 0), 0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="BrainBuddy Logo" className="h-12 w-auto drop-shadow" />
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={profileImage} alt={user?.name || 'Admin'} />
                <AvatarFallback>{user?.name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <label htmlFor="admin-profile-upload" className="block w-full">
                <span className="block text-sm font-medium mb-1">Profile Picture</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="admin-profile-upload"
                name="profilePicture"
                className="w-full border rounded px-2 py-1"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'Admin'}!</h2>
                <p className="text-gray-600">Admin Dashboard</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button onClick={openUploadModal} className="flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" /> Upload Resources
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filter students by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" /> Student Progress Reports
                {searchTerm && (
                  <Badge variant="secondary" className="ml-2">
                    {filteredStudents.length} of {totalStudents} students
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Streak</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">XP</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="bg-white even:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">{student.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{student.username}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{student.email}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{student.streak}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{student.xp}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{student.level}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{student.completedLessons}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Button size="sm" variant="secondary" onClick={() => handleViewProgress(student.id)}>
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

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" /> Honour Board Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHonourSearch} className="flex gap-2 mb-4">
                  <Input
                    placeholder="Search by username or name..."
                    value={honourSearch}
                    onChange={e => setHonourSearch(e.target.value)}
                  />
                  <Button type="submit" disabled={honourLoading}>{honourLoading ? 'Searching...' : 'Search'}</Button>
                </form>
                {honourError && <div className="text-red-500 mb-2">{honourError}</div>}
                {honourResults.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">XP</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Streak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {honourResults.map((user) => (
                          <tr key={user.id} className="bg-white even:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap">{user.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{user.username}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{user.xp}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{user.streak}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" /> Resources
                </CardTitle>
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
                          <td className="px-4 py-2 whitespace-nowrap">{resource.title}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{resource.type}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{resource.subject}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{resource.semester}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteResource(resource.id)}>
                              Delete
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
      </div>
      <Footer />
      {progressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button onClick={handleCloseProgressModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">&times;</button>
            <h2 className="text-xl font-bold mb-4">User Progress Report</h2>
            {progressLoading && <div>Loading...</div>}
            {progressError && <div className="text-red-500">{progressError}</div>}
            {progressData && (
              <div className="space-y-2">
                {Object.entries(progressData).map(([key, value]) => (
                  <div key={key}><strong>{key}:</strong> {String(value)}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button onClick={closeUploadModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">&times;</button>
            <h2 className="text-xl font-bold mb-4">Upload Resource</h2>
            <form onSubmit={handleUploadFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <input type="file" name="file" accept="*" onChange={handleUploadFormChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" name="title" value={uploadForm.title} onChange={handleUploadFormChange} className="w-full border rounded px-2 py-1" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={uploadForm.type}
                  onChange={handleUploadFormChange}
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Select type</option>
                  <option value="pdf">PDF</option>
                  <option value="link">Link</option>
                  <option value="notes">Notes</option>
                  <option value="video">Video</option>
                  {/* Add more types as needed */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Semester</label>
                <input type="text" name="semester" value={uploadForm.semester} onChange={handleUploadFormChange} className="w-full border rounded px-2 py-1" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input type="text" name="subject" value={uploadForm.subject} onChange={handleUploadFormChange} className="w-full border rounded px-2 py-1" required />
              </div>
              {uploadError && <div className="text-red-500 text-sm">{uploadError}</div>}
              <div className="flex justify-end">
                <Button type="button" variant="ghost" onClick={closeUploadModal} className="mr-2">Cancel</Button>
                <Button type="submit" disabled={uploadLoading}>{uploadLoading ? 'Uploading...' : 'Upload'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

