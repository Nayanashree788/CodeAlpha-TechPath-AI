import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Target,
  Map,
  BookOpen,
  FolderKanban,
  Mic,
  Briefcase,
  Bot,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentPath, navigate, profile } = useApp();

  const mainLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Skill Gap', path: '/skills', icon: Target },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Interview', path: '/interview', icon: Mic },
    { name: 'Opportunities', path: '/jobs', icon: Briefcase },
    { name: 'AI Mentor', path: '/mentor', icon: Bot, highlight: true },
  ];

  const bottomLinks = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-30 hidden md:flex">
      {/* Brand Header */}
      <div
        onClick={() => navigate('/')}
        className="px-6 py-5 flex items-center gap-3 cursor-pointer border-b border-slate-800/80 hover:bg-slate-850 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-950">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
            TechPath <span className="text-cyan-400 text-xs px-1.5 py-0.5 bg-cyan-950/80 border border-cyan-800/60 rounded font-mono">AI</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Engineering to Industry</p>
        </div>
      </div>

      {/* Target Role Indicator */}
      <div className="mx-4 my-3 px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Target Role</span>
        <span className="text-xs font-semibold text-white truncate block mt-0.5">{profile.targetRole || 'Full Stack Developer'}</span>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.path;

          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50 font-semibold'
                  : link.highlight
                  ? 'text-cyan-300 hover:bg-slate-800/80 hover:text-white border border-cyan-900/40'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : link.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="truncate">{link.name}</span>
              {link.highlight && !isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile & Settings Links */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.path;

          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="truncate">{link.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
