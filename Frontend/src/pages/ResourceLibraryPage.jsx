import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  BookOpen, 
  Search,
  Download,
  FileText,
  Video,
  Book,
  Filter,
  Star,
  Clock,
  User,
  CheckCircle,
  ExternalLink,
  Bookmark,
  GraduationCap,
  Code,
  Calculator,
  Globe,
  Lightbulb
} from 'lucide-react';
import * as api from '../services/api';
import toast from "react-hot-toast";

const ResourceLibraryPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [completedResources, setCompletedResources] = useState([]);

  // Mock resources data
  const mockResources = [
    {
      id: 1,
      title: "Data Structures & Algorithms Complete Guide",
      description: "Comprehensive guide covering arrays, linked lists, trees, graphs, and advanced algorithms with implementation examples in multiple programming languages.",
      type: "pdf",
      subject: "Computer Science",
      semester: "3rd",
      author: "Dr. Sarah Johnson",
      rating: 4.8,
      downloads: 1250,
      duration: "45 min read",
      tags: ["Algorithms", "Data Structures", "Programming"],
      url: "#",
      isPremium: false,
      isNew: true
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      description: "Introduction to machine learning concepts, supervised and unsupervised learning, neural networks, and practical applications.",
      type: "video",
      subject: "Artificial Intelligence",
      semester: "5th",
      author: "Prof. Michael Chen",
      rating: 4.9,
      downloads: 890,
      duration: "2 hours",
      tags: ["ML", "AI", "Neural Networks"],
      url: "#",
      isPremium: true,
      isNew: false
    },
    {
      id: 3,
      title: "Database Management Systems",
      description: "Complete course on SQL, NoSQL databases, normalization, indexing, and database design principles.",
      type: "pdf",
      subject: "Computer Science",
      semester: "4th",
      author: "Dr. Emily Watson",
      rating: 4.7,
      downloads: 756,
      duration: "60 min read",
      tags: ["SQL", "Database", "Design"],
      url: "#",
      isPremium: false,
      isNew: false
    },
    {
      id: 4,
      title: "Web Development Bootcamp",
      description: "Full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and deployment strategies.",
      type: "video",
      subject: "Web Development",
      semester: "3rd",
      author: "Alex Thompson",
      rating: 4.6,
      downloads: 1120,
      duration: "8 hours",
      tags: ["Web Dev", "React", "Node.js"],
      url: "#",
      isPremium: true,
      isNew: true
    },
    {
      id: 5,
      title: "Cybersecurity Essentials",
      description: "Fundamentals of cybersecurity, network security, cryptography, ethical hacking, and security best practices.",
      type: "pdf",
      subject: "Cybersecurity",
      semester: "5th",
      author: "David Rodriguez",
      rating: 4.8,
      downloads: 634,
      duration: "90 min read",
      tags: ["Security", "Networking", "Cryptography"],
      url: "#",
      isPremium: false,
      isNew: false
    },
    {
      id: 6,
      title: "Mathematics for Computer Science",
      description: "Essential mathematical concepts including discrete mathematics, calculus, linear algebra, and probability theory.",
      type: "pdf",
      subject: "Mathematics",
      semester: "2nd",
      author: "Dr. Lisa Park",
      rating: 4.5,
      downloads: 445,
      duration: "75 min read",
      tags: ["Math", "Calculus", "Linear Algebra"],
      url: "#",
      isPremium: false,
      isNew: false
    },
    {
      id: 7,
      title: "Cloud Computing & AWS",
      description: "Introduction to cloud computing concepts, AWS services, deployment strategies, and cloud architecture patterns.",
      type: "video",
      subject: "Cloud Computing",
      semester: "6th",
      author: "Sarah Johnson",
      rating: 4.7,
      downloads: 567,
      duration: "3 hours",
      tags: ["AWS", "Cloud", "Deployment"],
      url: "#",
      isPremium: true,
      isNew: true
    },
    {
      id: 8,
      title: "Software Engineering Principles",
      description: "Software development methodologies, design patterns, testing strategies, and project management techniques.",
      type: "pdf",
      subject: "Software Engineering",
      semester: "4th",
      author: "Prof. Robert Kim",
      rating: 4.6,
      downloads: 789,
      duration: "50 min read",
      tags: ["Design Patterns", "Testing", "Agile"],
      url: "#",
      isPremium: false,
      isNew: false
    }
  ];

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const res = await api.getResources();
        const apiResources = res.resources || [];
        
        if (apiResources.length > 0) {
          // Transform backend data to match frontend structure
          const transformedResources = apiResources.map(resource => ({
            id: resource.id,
            title: resource.title,
            description: getResourceDescription(resource.title, resource.subject),
            type: resource.type.toLowerCase(),
            subject: resource.subject,
            semester: resource.semester,
            author: getResourceAuthor(resource.subject),
            rating: getRandomRating(),
            downloads: getRandomDownloads(),
            duration: getResourceDuration(resource.type),
            tags: getResourceTags(resource.subject),
            url: resource.url,
            isPremium: Math.random() > 0.6, // 40% premium content
            isNew: Math.random() > 0.7, // 30% new content
            createdAt: resource.createdAt
          }));
          setResources(transformedResources);
          toast.success(`Loaded ${transformedResources.length} resources from database!`);
        } else {
          // Fallback to mock data if no resources in database
          setResources(mockResources);
          toast.info('No resources in database. Using sample resources for demonstration.');
        }

        // Fetch completed resources
        try {
          const completedRes = await api.getCompletedResources();
          const completedIds = (completedRes.completedResources || []).map(cr => cr.resourceId);
          setCompletedResources(completedIds);
        } catch (error) {
          console.error('Error fetching completed resources:', error);
          // Don't show error toast for this as it's not critical
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          toast.error('Please log in to access resources.');
          navigate('/login');
          return;
        }
        setResources(mockResources);
        toast.error('Failed to load resources from server. Using sample data.');
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, [navigate]);

  // Helper functions to enhance backend data
  const getResourceDescription = (title, subject) => {
    const descriptions = {
      'Computer Science': 'Comprehensive study materials covering fundamental concepts and advanced topics in computer science.',
      'Artificial Intelligence': 'Introduction to AI concepts, machine learning algorithms, and practical applications.',
      'Web Development': 'Full-stack web development resources covering modern technologies and frameworks.',
      'Cybersecurity': 'Essential cybersecurity concepts, network security, and ethical hacking practices.',
      'Mathematics': 'Mathematical foundations for computer science including discrete mathematics and algorithms.',
      'Cloud Computing': 'Cloud computing fundamentals, AWS services, and deployment strategies.',
      'Software Engineering': 'Software development methodologies, design patterns, and project management.'
    };
    return descriptions[subject] || 'Comprehensive study material for academic excellence.';
  };

  const getResourceAuthor = (subject) => {
    const authors = {
      'Computer Science': 'Dr. Sarah Johnson',
      'Artificial Intelligence': 'Prof. Michael Chen',
      'Web Development': 'Alex Thompson',
      'Cybersecurity': 'David Rodriguez',
      'Mathematics': 'Dr. Lisa Park',
      'Cloud Computing': 'Sarah Johnson',
      'Software Engineering': 'Prof. Robert Kim'
    };
    return authors[subject] || 'Expert Faculty';
  };

  const getRandomRating = () => {
    return Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
  };

  const getRandomDownloads = () => {
    return Math.floor(100 + Math.random() * 1200);
  };

  const getResourceDuration = (type) => {
    if (type.toLowerCase() === 'video') {
      const hours = Math.floor(1 + Math.random() * 4);
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor(30 + Math.random() * 60);
      return `${minutes} min read`;
    }
  };

  const getResourceTags = (subject) => {
    const tagMap = {
      'Computer Science': ['Algorithms', 'Data Structures', 'Programming'],
      'Artificial Intelligence': ['ML', 'AI', 'Neural Networks'],
      'Web Development': ['Web Dev', 'React', 'Node.js'],
      'Cybersecurity': ['Security', 'Networking', 'Cryptography'],
      'Mathematics': ['Math', 'Calculus', 'Linear Algebra'],
      'Cloud Computing': ['AWS', 'Cloud', 'Deployment'],
      'Software Engineering': ['Design Patterns', 'Testing', 'Agile']
    };
    return tagMap[subject] || ['Study', 'Education', 'Learning'];
  };

  // Helper functions
  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'book': return <Book className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'book': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = async (resource) => {
    if (resource.isPremium && (!user || user.xp < 100)) {
      toast.error('Premium content requires 100+ XP. Complete more activities to unlock!');
      return;
    }
    
    try {
      // Mark resource as completed when downloaded
      await api.markResourceCompleted(resource.id);
      
      // Simulate download with real URL
      toast.success(`Downloading ${resource.title}...`);
      
      // Open the resource URL in a new tab
      if (resource.url && resource.url !== '#') {
        window.open(resource.url, '_blank');
      }
      
      setTimeout(() => {
        toast.success(`${resource.title} downloaded successfully! +10 XP earned!`);
        // Update user XP locally
        if (updateUser) {
          updateUser({ ...user, xp: (user?.xp || 0) + 10 });
        }
        // Mark as completed locally
        setCompletedResources(prev => [...prev, resource.id]);
      }, 2000);
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast.error('Failed to download resource. Please try again.');
    }
  };

  const handleBookmark = (resourceId) => {
    if (bookmarkedResources.includes(resourceId)) {
      setBookmarkedResources(bookmarkedResources.filter(id => id !== resourceId));
      toast.success('Removed from bookmarks');
    } else {
      setBookmarkedResources([...bookmarkedResources, resourceId]);
      toast.success('Added to bookmarks');
    }
  };

  const handleAccess = async (resource) => {
    if (resource.isPremium && (!user || user.xp < 100)) {
      toast.error('Premium content requires 100+ XP. Complete more activities to unlock!');
      return;
    }
    
    try {
      // Mark resource as completed when accessed
      await api.markResourceCompleted(resource.id);
      
      toast.success(`Accessing ${resource.title}...`);
      
      // Open the resource URL in a new tab
      if (resource.url && resource.url !== '#') {
        window.open(resource.url, '_blank');
      }
      
      setTimeout(() => {
        toast.success(`${resource.title} opened successfully! +10 XP earned!`);
        // Update user XP locally
        if (updateUser) {
          updateUser({ ...user, xp: (user?.xp || 0) + 10 });
        }
        // Mark as completed locally
        setCompletedResources(prev => [...prev, resource.id]);
      }, 1500);
    } catch (error) {
      console.error('Error accessing resource:', error);
      toast.error('Failed to access resource. Please try again.');
    }
  };

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesSemester = selectedSemester === 'all' || resource.semester === selectedSemester;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesSemester && matchesType;
  });

  // Get unique values for filters
  const subjects = [...new Set(resources.map(r => r.subject))];
  const semesters = [...new Set(resources.map(r => r.semester))];
  const types = [...new Set(resources.map(r => r.type))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading resources...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
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
              <BookOpen className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Resource Library</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-indigo-600" />
              Find Your Perfect Resource
            </CardTitle>
            <CardDescription>
              Search and filter through our comprehensive collection of learning materials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Bar */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Resources</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Semester</Label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{filteredResources.length} resources found</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{completedResources.length} completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>{bookmarkedResources.length} bookmarked</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                      {getTypeIcon(resource.type)}
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-1">
                        {resource.subject}
                      </Badge>
                      <Badge variant="outline" className="mb-1">
                        {resource.semester}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {completedResources.includes(resource.id) && (
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                    {resource.isNew && (
                      <Badge className="bg-green-100 text-green-800">New</Badge>
                    )}
                    {resource.isPremium && (
                      <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(resource.id)}
                      className={`p-1 ${bookmarkedResources.includes(resource.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{resource.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{resource.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{resource.rating}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{resource.downloads} downloads</span>
                  <span>ID: {resource.id}</span>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleAccess(resource)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {resource.isPremium ? 'Access Premium' : 'Open Resource'}
                  </Button>
                  <Button
                    onClick={() => handleDownload(resource)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('all');
                  setSelectedSemester('all');
                  setSelectedType('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResourceLibraryPage; 