import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speechService';
import { VoiceService } from '../../services/voiceService';
import { AIService } from '../../services/aiService';
import { AiraAvatar, AvatarStatus } from '../ui/AiraAvatar';
import { VoicePermissionDialog } from './VoicePermissionDialog';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Mic,
  MicOff,
  Square,
  X,
  Send,
  MessageSquare,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Target,
  ChevronRight,
  Bot,
} from 'lucide-react';

interface AiraVoiceModeProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const AiraVoiceMode: React.FC<AiraVoiceModeProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const { profile, skillGaps, roadmap, roadmapProgress, mentorMessages, addMentorMessage, navigate } =
    useApp();

  const [status, setStatus] = useState<AvatarStatus>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [lastSpeechInput, setLastSpeechInput] = useState<string>('');
  const [airaSpeechOutput, setAiraSpeechOutput] = useState<string>('');
  const [showTextFallback, setShowTextFallback] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [hasGreeted, setHasGreeted] = useState<boolean>(false);

  const isMountedRef = useRef<boolean>(true);

  // Clean up on unmount or close
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      SpeechService.stopListening();
      VoiceService.stopSpeaking();
    };
  }, []);

  // Handle open state
  useEffect(() => {
    if (!isOpen) {
      SpeechService.stopListening();
      VoiceService.stopSpeaking();
      setStatus('idle');
      setTranscript('');
      setHasGreeted(false);
      return;
    }

    // Play greeting when opened
    const firstName = profile.firstName || '';
    const greetingText = firstName
      ? `Hi ${firstName}! I'm Aira. How can I help you with your ${profile.targetRole || 'career'} goals today?`
      : `Hi! I'm Aira. How can I help you with your engineering career today?`;

    setAiraSpeechOutput(greetingText);
    setStatus('speaking');

    if (VoiceService.isSupported()) {
      VoiceService.speak(greetingText, {
        onEnd: () => {
          if (isMountedRef.current) {
            setStatus('idle');
            setHasGreeted(true);

            // If an initial contextual prompt was passed, process it right away
            if (initialPrompt) {
              handleSendText(initialPrompt);
            }
          }
        },
        onError: () => {
          if (isMountedRef.current) {
            setStatus('idle');
            setHasGreeted(true);
          }
        },
      });
    } else {
      setStatus('idle');
      setHasGreeted(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Request & Start Listening
  const handleStartListening = () => {
    VoiceService.stopSpeaking();
    setPermissionError(null);

    if (!SpeechService.isSupported()) {
      setPermissionError('Speech recognition is not supported in this browser. Please use text fallback below.');
      setShowPermissionModal(true);
      return;
    }

    const success = SpeechService.startListening({
      onStart: () => {
        if (!isMountedRef.current) return;
        setStatus('listening');
        setTranscript('');
        setHasPermission(true);
      },
      onTranscript: (text, isFinal) => {
        if (!isMountedRef.current) return;
        setTranscript(text);

        if (isFinal && text.trim()) {
          SpeechService.stopListening();
          handleProcessUserInput(text.trim());
        }
      },
      onError: (err) => {
        if (!isMountedRef.current) return;
        console.warn('Speech recognition error:', err);
        if (err.includes('not-allowed') || err.includes('permission')) {
          setPermissionError('Microphone access was denied. Please allow microphone permissions in your browser bar.');
          setShowPermissionModal(true);
          setStatus('permission_required');
        } else {
          setStatus('idle');
        }
      },
      onEnd: () => {
        if (!isMountedRef.current) return;
        if (status === 'listening') {
          setStatus('idle');
        }
      },
    });

    if (!success && !hasPermission) {
      setShowPermissionModal(true);
    }
  };

  const handleStopListening = () => {
    SpeechService.stopListening();
    setStatus('idle');
  };

  const handleStopSpeaking = () => {
    VoiceService.stopSpeaking();
    setStatus('idle');
  };

  // Process user speech or typed text input through MentorAgent
  const handleProcessUserInput = async (userText: string) => {
    if (!userText.trim()) return;

    setLastSpeechInput(userText);
    setStatus('thinking');
    setTranscript('');

    try {
      const context = AIService.buildMentorContext(
        profile,
        skillGaps,
        roadmap,
        roadmapProgress
      );

      // Call server API route with isVoiceMode: true
      const result = await AIService.generateMentorResponse(userText, mentorMessages, context, true);

      // Save to conversation history in AppContext
      await addMentorMessage(userText);

      if (!isMountedRef.current) return;

      const aiText = result.response;
      setAiraSpeechOutput(aiText);
      setStatus('speaking');

      // Speak AI response aloud
      if (VoiceService.isSupported()) {
        VoiceService.speak(aiText, {
          onEnd: () => {
            if (isMountedRef.current) {
              setStatus('idle');
            }
          },
          onError: () => {
            if (isMountedRef.current) {
              setStatus('idle');
            }
          },
        });
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error('Error processing voice query:', err);
      if (isMountedRef.current) {
        setAiraSpeechOutput("Sorry, I had trouble processing that request. Please try again.");
        setStatus('error');
      }
    }
  };

  const handleSendText = (text: string) => {
    if (!text.trim()) return;
    setTextInput('');
    handleProcessUserInput(text.trim());
  };

  const handleClose = () => {
    SpeechService.stopListening();
    VoiceService.stopSpeaking();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-fade-in p-4 sm:p-6 overflow-y-auto">
      {/* Voice Permission Modal if required */}
      <VoicePermissionDialog
        isOpen={showPermissionModal}
        onGrantPermission={() => {
          setShowPermissionModal(false);
          handleStartListening();
        }}
        onUseTextChat={() => {
          setShowPermissionModal(false);
          setShowTextFallback(true);
        }}
        onClose={() => setShowPermissionModal(false)}
        errorMessage={permissionError}
      />

      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white flex flex-col justify-between min-h-[580px] max-h-[90vh]">
        {/* HEADER BAR */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
              <Bot className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Aira — Voice Mentor
                </h2>
                <Badge variant="cyan" size="sm">
                  Live Voice Mode
                </Badge>
              </div>
              <p className="text-[11px] text-indigo-200/80">
                Context-aware guidance for {profile.firstName || 'Student'} ({profile.targetRole || 'Engineering Professional'})
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-indigo-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label="Close Aira Voice Mode"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CENTER ANIMATED AVATAR DISPLAY */}
        <div className="my-auto py-6 flex flex-col items-center justify-center space-y-6 text-center">
          <AiraAvatar size="2xl" status={status} showStatusLabel={false} />

          {/* STATUS TEXT & LIVE TRANSCRIPT */}
          <div className="max-w-lg space-y-2 px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
              <span
                className={`w-2 h-2 rounded-full ${
                  status === 'listening'
                    ? 'bg-emerald-400 animate-ping'
                    : status === 'speaking'
                    ? 'bg-cyan-400 animate-pulse'
                    : status === 'thinking'
                    ? 'bg-amber-400 animate-spin'
                    : 'bg-indigo-400'
                }`}
              />
              <span className="capitalize">
                {status === 'listening'
                  ? 'Listening to you...'
                  : status === 'thinking'
                  ? 'Aira is reasoning...'
                  : status === 'speaking'
                  ? 'Aira is speaking...'
                  : status === 'permission_required'
                  ? 'Microphone Permission Needed'
                  : 'Ready to listen'}
              </span>
            </div>

            {/* LIVE USER RECOGNIZED TRANSCRIPT */}
            {transcript && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 animate-fade-in shadow-inner">
                <p className="text-[10px] uppercase font-bold text-emerald-400 mb-0.5">You said:</p>
                <p className="italic">"{transcript}"</p>
              </div>
            )}

            {/* AIRA RESPONSE DISPLAY */}
            {airaSpeechOutput && !transcript && (
              <div className="p-4 bg-slate-800/80 border border-indigo-500/30 rounded-2xl text-xs text-slate-200 space-y-1 shadow-lg leading-relaxed max-h-36 overflow-y-auto">
                <p className="text-[10px] uppercase font-bold text-cyan-400">Aira:</p>
                <p className="text-slate-100">{airaSpeechOutput}</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER CONTROLS */}
        <div className="space-y-4 pt-4 border-t border-indigo-500/20">
          {/* PRIMARY VOICE CONTROLS */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {status === 'speaking' ? (
              <Button
                variant="outline"
                onClick={handleStopSpeaking}
                icon={<Square className="w-4 h-4 text-rose-400" />}
                className="bg-rose-950/40 border-rose-500/40 text-rose-200 hover:bg-rose-900/60 text-xs px-6 py-3 rounded-full"
              >
                Stop Speaking
              </Button>
            ) : status === 'listening' ? (
              <Button
                variant="outline"
                onClick={handleStopListening}
                icon={<MicOff className="w-4 h-4 text-emerald-400 animate-pulse" />}
                className="bg-emerald-950/60 border-emerald-500/50 text-emerald-200 hover:bg-emerald-900/80 text-xs px-6 py-3 rounded-full"
              >
                Stop Listening
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleStartListening}
                icon={<Mic className="w-5 h-5 text-white" />}
                className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs px-8 py-3.5 rounded-full shadow-lg shadow-indigo-500/30"
              >
                Tap to Speak
              </Button>
            )}

            <button
              onClick={() => setShowTextFallback(!showTextFallback)}
              className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-indigo-100 font-semibold transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-indigo-300" />
              {showTextFallback ? 'Hide Text Input' : 'Type Instead'}
            </button>
          </div>

          {/* FALLBACK TEXT INPUT */}
          {showTextFallback && (
            <div className="flex items-center gap-2 pt-2 animate-fade-in">
              <input
                type="text"
                placeholder="Ask Aira a question via text..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendText(textInput);
                }}
                className="flex-1 px-4 py-2.5 text-xs bg-slate-800/90 border border-indigo-400/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <Button
                variant="primary"
                onClick={() => handleSendText(textInput)}
                disabled={!textInput.trim() || status === 'thinking'}
                icon={<Send className="w-3.5 h-3.5" />}
                className="px-4 py-2.5 text-xs rounded-xl"
              >
                Send
              </Button>
            </div>
          )}

          {/* PRIVACY & CONTEXT NOTICE */}
          <div className="flex items-center justify-between text-[10px] text-indigo-300/70 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Your microphone is used only while speaking. No audio is recorded.
            </span>
            <button
              onClick={() => {
                handleClose();
                navigate('/mentor');
              }}
              className="text-cyan-300 hover:underline flex items-center gap-0.5"
            >
              Full Text Mentor <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
