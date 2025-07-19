import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Newspaper, ExternalLink, Bookmark, ArrowLeft } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const TechNewsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for tech news
  const newsArticles = [
    {
      id: 1,
      title: 'AI Breakthrough: New Language Model Surpasses Human Performance',
      excerpt: 'Researchers have developed a new artificial intelligence model that demonstrates unprecedented capabilities in natural language understanding and generation.',
      content: 'A team of researchers from leading tech companies has announced a breakthrough in artificial intelligence technology. The new language model, called GPT-5, has demonstrated capabilities that surpass human performance in various language tasks including translation, summarization, and creative writing.',
      category: 'ai',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      isTrending: true,
      tags: ['AI', 'Machine Learning', 'Research']
    },
    {
      id: 2,
      title: 'Quantum Computing: Major Milestone Achieved',
      excerpt: 'Scientists have successfully demonstrated quantum supremacy in a practical computing task, marking a significant step forward in quantum technology.',
      content: 'In a landmark achievement, researchers have demonstrated quantum supremacy by solving a complex mathematical problem that would take classical computers thousands of years to complete. This breakthrough opens new possibilities for cryptography, drug discovery, and climate modeling.',
      category: 'quantum',
      author: 'Michael Chen',
      date: '2024-01-14',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
      isTrending: true,
      tags: ['Quantum Computing', 'Technology', 'Research']
    },
    {
      id: 3,
      title: 'Cybersecurity: New Threats and Defense Strategies',
      excerpt: 'Recent developments in cybersecurity reveal emerging threats and innovative defense mechanisms to protect digital infrastructure.',
      content: 'As cyber threats become more sophisticated, security experts are developing new defense strategies. Recent attacks have targeted critical infrastructure, prompting governments and organizations to invest heavily in cybersecurity measures.',
      category: 'security',
      author: 'David Rodriguez',
      date: '2024-01-13',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
      isTrending: false,
      tags: ['Cybersecurity', 'Digital Security', 'Technology']
    },
    {
      id: 4,
      title: 'Blockchain Revolution: Beyond Cryptocurrency',
      excerpt: 'Blockchain technology is finding new applications beyond digital currencies, revolutionizing industries from healthcare to supply chain management.',
      content: 'While blockchain is commonly associated with cryptocurrencies, its applications extend far beyond. Industries including healthcare, supply chain management, and voting systems are adopting blockchain for enhanced transparency and security.',
      category: 'blockchain',
      author: 'Emily Watson',
      date: '2024-01-12',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
      isTrending: false,
      tags: ['Blockchain', 'Technology', 'Innovation']
    },
    {
      id: 5,
      title: '5G Networks: The Future of Connectivity',
      excerpt: 'The rollout of 5G networks continues globally, promising faster speeds and enabling new technologies like autonomous vehicles and smart cities.',
      content: '5G technology is transforming how we connect and communicate. With speeds up to 100 times faster than 4G, 5G networks are enabling innovations in autonomous vehicles, smart cities, and the Internet of Things.',
      category: 'networking',
      author: 'Alex Thompson',
      date: '2024-01-11',
      readTime: '3 min read',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      isTrending: false,
      tags: ['5G', 'Networking', 'Connectivity']
    },
    {
      id: 6,
      title: 'Sustainable Tech: Green Computing Initiatives',
      excerpt: 'Technology companies are increasingly focusing on sustainability, developing energy-efficient solutions and reducing carbon footprints.',
      content: 'As environmental concerns grow, the tech industry is embracing green computing. Companies are developing energy-efficient data centers, renewable energy solutions, and sustainable manufacturing processes.',
      category: 'sustainability',
      author: 'Lisa Park',
      date: '2024-01-10',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop',
      isTrending: false,
      tags: ['Sustainability', 'Green Tech', 'Environment']
    }
  ];

  const categories = [
    { id: 'all', name: 'All News', count: newsArticles.length },
    { id: 'ai', name: 'Artificial Intelligence', count: newsArticles.filter(n => n.category === 'ai').length },
    { id: 'quantum', name: 'Quantum Computing', count: newsArticles.filter(n => n.category === 'quantum').length },
    { id: 'security', name: 'Cybersecurity', count: newsArticles.filter(n => n.category === 'security').length },
    { id: 'blockchain', name: 'Blockchain', count: newsArticles.filter(n => n.category === 'blockchain').length },
    { id: 'networking', name: 'Networking', count: newsArticles.filter(n => n.category === 'networking').length },
    { id: 'sustainability', name: 'Sustainability', count: newsArticles.filter(n => n.category === 'sustainability').length }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'ai': return 'bg-purple-100 text-purple-800';
      case 'quantum': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'blockchain': return 'bg-green-100 text-green-800';
      case 'networking': return 'bg-orange-100 text-orange-800';
      case 'sustainability': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <Newspaper className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Tech News</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Content */}
        <div className="mb-8">
          <p className="text-gray-600">Stay updated with the latest technology trends and innovations</p>
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

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                {article.isTrending && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Trending
                    </Badge>
                  </div>
                )}
                <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Bookmark className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoryColor(article.category)}>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <span>Read Full Article</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No articles found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechNewsPage; 