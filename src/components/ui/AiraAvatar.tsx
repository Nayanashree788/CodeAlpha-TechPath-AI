import React from 'react';
import { Bot, Sparkles, Mic, Volume2, AlertTriangle, Lock } from 'lucide-react';

export type AvatarStatus =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'error'
  | 'permission_required';

interface AiraAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: AvatarStatus;
  onClick?: () => void;
  className?: string;
  showStatusLabel?: boolean;
}

export const AiraAvatar: React.FC<AiraAvatarProps> = ({
  size = 'md',
  status = 'idle',
  onClick,
  className = '',
  showStatusLabel = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
    '2xl': 'w-36 h-36 text-5xl sm:w-44 sm:h-44',
  };

  const getStatusRings = () => {
    switch (status) {
      case 'listening':
        return 'ring-4 ring-emerald-400/80 shadow-lg shadow-emerald-500/30 animate-pulse';
      case 'thinking':
        return 'ring-4 ring-amber-400/80 shadow-lg shadow-amber-500/30 animate-pulse';
      case 'speaking':
        return 'ring-4 ring-cyan-400/80 shadow-xl shadow-cyan-500/40 animate-pulse';
      case 'error':
        return 'ring-4 ring-rose-500/80 shadow-lg shadow-rose-500/30';
      case 'permission_required':
        return 'ring-4 ring-purple-500/80 shadow-lg shadow-purple-500/30';
      default:
        return 'ring-2 ring-indigo-400/50 hover:ring-indigo-500 shadow-md shadow-indigo-500/20';
    }
  };

  const renderBadgeIcon = () => {
    switch (status) {
      case 'listening':
        return <Mic className="w-3 h-3 text-emerald-950 animate-bounce" />;
      case 'thinking':
        return <Sparkles className="w-3 h-3 text-amber-950 animate-spin" />;
      case 'speaking':
        return <Volume2 className="w-3 h-3 text-cyan-950 animate-pulse" />;
      case 'error':
        return <AlertTriangle className="w-3 h-3 text-rose-950" />;
      case 'permission_required':
        return <Lock className="w-3 h-3 text-purple-950" />;
      default:
        return <Sparkles className="w-3 h-3 text-slate-950" />;
    }
  };

  const getBadgeBg = () => {
    switch (status) {
      case 'listening':
        return 'bg-emerald-400';
      case 'thinking':
        return 'bg-amber-400';
      case 'speaking':
        return 'bg-cyan-300';
      case 'error':
        return 'bg-rose-400';
      case 'permission_required':
        return 'bg-purple-300';
      default:
        return 'bg-amber-400';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={`Aira AI Career Mentor Avatar (${status})`}
        className={`relative inline-flex items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-600 to-cyan-500 text-white transition-all duration-300 ${
          sizeClasses[size]
        } ${getStatusRings()} ${
          onClick ? 'cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300' : ''
        } ${className}`}
      >
        {/* Animated Background Aura for Voice Modes */}
        {status === 'speaking' && (
          <div className="absolute -inset-2 rounded-full bg-cyan-400/20 blur-md animate-pulse -z-10" />
        )}
        {status === 'listening' && (
          <div className="absolute -inset-2 rounded-full bg-emerald-400/20 blur-md animate-ping -z-10" />
        )}

        {/* Central Bot Icon */}
        <Bot
          className={`${
            size === '2xl'
              ? 'w-20 h-20'
              : size === 'xl'
              ? 'w-12 h-12'
              : size === 'lg'
              ? 'w-8 h-8'
              : 'w-5 h-5'
          } transition-transform duration-300 ${status === 'speaking' ? 'scale-110' : ''}`}
        />

        {/* Status Badge */}
        <div
          className={`absolute -top-1 -right-1 p-1 ${getBadgeBg()} text-slate-950 rounded-full shadow-md border border-white`}
        >
          {renderBadgeIcon()}
        </div>

        {/* Sound Wave Indicator when Speaking */}
        {status === 'speaking' && (size === 'xl' || size === '2xl') && (
          <div className="absolute -bottom-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-400/40">
            <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.1s]" />
            <span className="w-1 h-5 bg-cyan-300 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            <span className="w-1 h-4 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {showStatusLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          {status === 'listening'
            ? 'Listening...'
            : status === 'thinking'
            ? 'Thinking...'
            : status === 'speaking'
            ? 'Aira is speaking'
            : status === 'permission_required'
            ? 'Mic Permission Needed'
            : status === 'error'
            ? 'Voice Error'
            : 'Ready to help'}
        </span>
      )}
    </div>
  );
};
