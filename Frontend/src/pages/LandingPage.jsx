import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import backgroundImage from '@/assets/image.png';

const features = [
  {
    title: '🤖 AI Tutor',
    description: 'Get personalized explanations and flashcards for any topic.',
  },
  {
    title: '🎮 Gamified Learning',
    description: 'Earn XP, unlock badges, and level up as you learn.',
  },
  {
    title: '📚 Resource Library',
    description: 'Browse curated CSIT resources, notes, and study materials.',
  },
  {
    title: '📈 Habit-Building Engine',
    description: 'Track study habits, maintain streaks, and build consistency.',
  },
  {
    title: '⚙️ Admin Dashboard',
    description: 'Manage users, upload resources, and view progress reports.',
  },
];

const LandingPage = () => (
  <div className="min-h-screen flex flex-col relative overflow-hidden" style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
    {/* Gradient overlay for better text readability */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-indigo-900/60 to-purple-900/70"></div>
    
    {/* Animated background shapes */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-gradient-to-br from-blue-400 via-indigo-300 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-300 via-blue-200 to-indigo-100 rounded-full opacity-30 blur-2xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-100 rounded-full opacity-15 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
    </div>
    
    <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 relative z-10">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 text-center drop-shadow-lg animate-fade-in">AI-Powered Learning Platform</h1>
        <p className="text-xl md:text-2xl text-gray-100 mb-8 text-center max-w-2xl animate-fade-in">
          Accelerate your learning, stay motivated, and achieve your academic goals with BrainBuddy!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-fade-in">
          <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-indigo-700 transition-transform duration-200">Get Started</Link>
          <Link to="/login" className="bg-white/90 border-2 border-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg shadow hover:bg-white hover:text-blue-900 transition-colors duration-200">Login</Link>
        </div>
      </div>
      <section className="w-full max-w-5xl mt-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-white mb-8 drop-shadow-lg">Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 flex flex-col items-start border-t-4 border-blue-200 hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer">
              <h3 className="text-2xl font-semibold text-blue-700 mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

export default LandingPage; 