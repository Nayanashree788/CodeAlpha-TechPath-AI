import React from 'react';
import { Mic, Lock, MessageSquare, ShieldCheck, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface VoicePermissionDialogProps {
  isOpen: boolean;
  onGrantPermission: () => void;
  onUseTextChat: () => void;
  onClose: () => void;
  errorMessage?: string | null;
}

export const VoicePermissionDialog: React.FC<VoicePermissionDialogProps> = ({
  isOpen,
  onGrantPermission,
  onUseTextChat,
  onClose,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full transition-colors"
          aria-label="Close permission dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-8 ring-indigo-500/10">
            <Mic className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Enable Voice Mentorship with Aira
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Talk naturally with Aira about your engineering career, skill gaps, learning roadmap, and interview preparation.
          </p>
        </div>

        {errorMessage ? (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 shrink-0" /> Microphone Access Issue
            </p>
            <p className="text-[11px] leading-relaxed">{errorMessage}</p>
          </div>
        ) : (
          <div className="p-3 bg-indigo-50/60 dark:bg-slate-800/80 rounded-xl border border-indigo-100 dark:border-slate-700 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px]">
                <strong className="text-slate-900 dark:text-white">Privacy Guarantee:</strong> Your microphone is active only while listening. Raw audio is never stored or recorded.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <Button
            variant="primary"
            onClick={onGrantPermission}
            icon={<Mic className="w-4 h-4" />}
            className="w-full sm:flex-1 py-3 text-xs"
          >
            Allow Microphone
          </Button>

          <Button
            variant="outline"
            onClick={onUseTextChat}
            icon={<MessageSquare className="w-4 h-4" />}
            className="w-full sm:flex-1 py-3 text-xs"
          >
            Use Text Chat
          </Button>
        </div>
      </div>
    </div>
  );
};
