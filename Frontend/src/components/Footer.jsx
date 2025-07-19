import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Facebook,
  Heart,
  ExternalLink
} from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="BrainBuddy Logo" className="h-10 w-10" />
              <span className="text-2xl font-bold text-gray-900">BrainBuddy</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Empowering students with AI-driven learning tools and gamified education experiences. 
              Transform your learning journey with personalized tutoring and smart study habits.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-blue-600">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-blue-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-blue-600">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-blue-600">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/ai-tutor" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <span>AI Tutor</span>
                </Link>
              </li>
              <li>
                <Link to="/resource-library" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <span>Resources</span>
                </Link>
              </li>
              <li>
                <Link to="/notice-board" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <span>Notice Board</span>
                </Link>
              </li>
              <li>
                <Link to="/tech-news" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <span>Tech News</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm">support@brainbuddy.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Tech Campus, Learning District</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                &copy; {currentYear} <span className="text-blue-600 font-semibold">BrainBuddy</span>. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                <span>Privacy Policy</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                <span>Terms of Service</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                <span>Cookie Policy</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-yellow-500 text-xs flex items-center justify-center gap-1 font-semibold">
              ACCELERATED BY TEAM DNA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;