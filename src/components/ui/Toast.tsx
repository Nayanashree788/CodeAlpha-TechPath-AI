import React from 'react';
import { Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-xl border border-slate-800 animate-slideUp">
      <Info className="w-4 h-4 text-cyan-400 shrink-0" />
      <span className="leading-snug">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
