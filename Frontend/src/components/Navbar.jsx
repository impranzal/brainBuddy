import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

const Navbar = () => (
  <nav className="bg-white shadow sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/"><img src={logo} alt="BrainBuddy Logo" className="h-12 w-12 mr-1" /></Link>
        <Link to="/" className="text-2xl font-bold text-blue-600">BrainBuddy</Link>
        {/* <Link to="/homepage" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link> */}
        {/* <Link to="/resource-library" className="text-gray-700 hover:text-blue-600 font-medium">Resources</Link>
        <Link to="/gamified-learning" className="text-gray-700 hover:text-blue-600 font-medium">Gamified Learning</Link>
        <Link to="/ai-tutor" className="text-gray-700 hover:text-blue-600 font-medium">AI Tutor</Link>
        <Link to="/habit" className="text-gray-700 hover:text-blue-600 font-medium">Habits</Link> */}
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
        <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold border border-blue-600 px-3 py-1 rounded">Sign Up</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;