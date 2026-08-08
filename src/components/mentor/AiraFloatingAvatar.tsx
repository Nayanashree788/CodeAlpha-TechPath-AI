import React, { useState } from 'react';
import { AiraAvatar } from '../ui/AiraAvatar';
import { Sparkles, Mic } from 'lucide-react';

interface AiraFloatingAvatarProps {
  onClick: () => void;
}

export const AiraFloatingAvatar: React.FC<AiraFloatingAvatarProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 animate-fade-in group"
      onMouseEnter={() => setIsHovered(true)}
      aria-label="Talk to Aira, AI career mentor"
    >
      {/* Tooltip Badge */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-indigo-500/30 backdrop-blur-md transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-90 -translate-x-1'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Talk to Aira</span>
      </div>

      {/* Floating Interactive Avatar Button */}
      <button
        onClick={onClick}
        onFocus={() => setIsHovered(true)}
        aria-label="Open Aira Voice Mode"
        className="relative group focus:outline-none focus:ring-4 focus:ring-indigo-400 rounded-2xl"
      >
        {/* Glowing Aura Ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />

        <div className="relative p-1 bg-slate-900 rounded-2xl border border-indigo-400/30">
          <AiraAvatar size="lg" status="idle" />

          {/* Floating Mic Pill */}
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white p-1 rounded-full shadow-md border border-white">
            <Mic className="w-3 h-3 animate-pulse" />
          </div>
        </div>
      </button>
    </div>
  );
};
