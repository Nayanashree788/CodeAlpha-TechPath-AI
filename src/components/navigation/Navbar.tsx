import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AiraAvatar } from '../ui/AiraAvatar';
import {
  Menu,
  X,
  Sparkles,
  User,
  LayoutDashboard,
  Target,
  Map,
  BookOpen,
  FolderKanban,
  Mic,
  Briefcase,
  Bot,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigate, profile } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Skill Gap', path: '/skills', icon: Target },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Interview', path: '/interview', icon: Mic },
    { name: 'Opportunities', path: '/jobs', icon: Briefcase },
    { name: 'AI Mentor', path: '/mentor', icon: Bot },
  ];

  return (
    <>
      {/* Top Header Bar for Desktop and Mobile */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 fixed top-0 right-0 left-0 md:left-64 z-20 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo on Mobile */}
          <div
            onClick={() => navigate('/')}
            className="md:hidden flex items-center gap-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">TechPath AI</span>
          </div>

          <span className="hidden md:block text-xs font-medium text-slate-500">
            College to Industry Career Readiness Platform
          </span>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3">
          {/* Quick AI Mentor Button */}
          <button
            onClick={() => navigate('/mentor')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium border border-indigo-200 transition-colors cursor-pointer"
          >
            <AiraAvatar size="sm" />
            <span className="hidden sm:inline font-semibold">Talk to Aira</span>
          </button>

          {/* User Profile Pill */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              {profile.firstName ? profile.firstName[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="hidden md:inline text-xs font-medium text-slate-700">
              {profile.firstName || 'Student'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden">
          <div className="w-72 bg-slate-900 text-white h-full p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-base">TechPath AI</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {mainLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentPath === link.path;
                  return (
                    <button
                      key={link.path}
                      onClick={() => {
                        navigate(link.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              Target Role: <span className="text-white font-semibold">{profile.targetRole}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 flex justify-around items-center h-16 px-1 shadow-lg">
        {[
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Roadmap', path: '/roadmap', icon: Map },
          { name: 'Mentor', path: '/mentor', icon: Bot, highlight: true },
          { name: 'Jobs', path: '/jobs', icon: Briefcase },
          { name: 'Profile', path: '/profile', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
