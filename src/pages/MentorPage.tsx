import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AIService } from '../services/aiService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AiraAvatar } from '../components/ui/AiraAvatar';
import {
  Sparkles,
  Send,
  User,
  Bot,
  RefreshCw,
  Copy,
  Check,
  Target,
  MapPin,
  ChevronRight,
  Info,
  BookOpen,
  Briefcase,
  Zap,
  Code,
  GraduationCap,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export const MentorPage: React.FC = () => {
  const {
    profile,
    skillGaps,
    roadmap,
    roadmapProgress,
    mentorMessages,
    addMentorMessage,
    navigate,
  } = useApp();

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showContextModal, setShowContextModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mentorMessages, isSending]);

  // Derived context properties
  const context = AIService.buildMentorContext(
    profile,
    skillGaps,
    roadmap,
    roadmapProgress
  );

  const topGap =
    (skillGaps || []).find((g) => String(g.priority).toUpperCase() === 'HIGH')?.skillName ||
    'React & Frontend';

  const currentStep =
    (roadmap?.steps || []).find((s) => String(s.status).toLowerCase() === 'in progress') ||
    (roadmap?.steps || []).find((s) => String(s.status).toLowerCase() !== 'completed');

  const currentStepSkill = currentStep ? currentStep.skillName || currentStep.title : topGap;

  const quickPrompts = [
    `How can I prepare for ${profile.targetRole || 'Full Stack'} campus placements as a ${profile.academicYear} student?`,
    `Recommend a capstone project targeting my top gap: ${topGap}`,
    `How should I structure my study schedule to master ${currentStepSkill}?`,
    `What are the most common technical interview questions for a ${profile.targetRole || 'Software Engineer'}?`,
    `How do I write a compelling resume entry for my ${profile.targetRole} projects?`,
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isSending) return;

    setInput('');
    setIsSending(true);

    try {
      await addMentorMessage(text.trim());
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format text with Markdown-style bolding and bullet points
  const formatMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Check for headings
      if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
        const headingText = line.replace(/^#+\s*/, '');
        return (
          <h4 key={lineIdx} className="text-xs sm:text-sm font-extrabold text-slate-900 mt-2 mb-1">
            {headingText}
          </h4>
        );
      }

      // Check for bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
        const bulletText = line.replace(/^[\s•\-\*]+/, '');
        return (
          <li key={lineIdx} className="ml-4 list-disc text-xs sm:text-xs text-slate-800 leading-relaxed my-0.5">
            {parseInlineFormatting(bulletText)}
          </li>
        );
      }

      // Check for numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={lineIdx} className="ml-2 font-medium text-xs text-slate-800 leading-relaxed my-0.5">
            {parseInlineFormatting(line)}
          </div>
        );
      }

      // Blank lines
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      // Standard paragraph line
      return (
        <p key={lineIdx} className="text-xs sm:text-xs text-slate-800 leading-relaxed my-0.5">
          {parseInlineFormatting(line)}
        </p>
      );
    });
  };

  const parseInlineFormatting = (text: string) => {
    // Regex to convert **bold** into <strong>
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Bot className="w-7 h-7 text-indigo-600" /> Aira — AI Career Mentor
            </h1>
            <Badge variant="cyan" size="sm">
              Gemini 3.6 Flash
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Context-aware career advice personalized to your student profile, skill gaps, and learning roadmap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowContextModal(!showContextModal)}
            icon={<SlidersHorizontal className="w-4 h-4 text-indigo-600" />}
          >
            Inspect AI Context
          </Button>
        </div>
      </div>

      {/* STUDENT CONTEXT SUMMARY BAR */}
      <Card className="p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target: {profile.targetRole || 'Full Stack Developer'}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile.academicYear} ({profile.branch})</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Top Gap: {topGap}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Progress: {roadmap.overallProgress}%</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Aira is synchronized with your profile</span>
          </div>
        </div>
      </Card>

      {/* INSPECT AI CONTEXT MODAL / COLLAPSIBLE CARD */}
      {showContextModal && (
        <Card className="p-5 bg-indigo-50/90 border-indigo-200 text-slate-800 relative">
          <button
            onClick={() => setShowContextModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Active Context Sent to Gemini 3.6 Flash API
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Profile</span>
              <p className="font-bold text-slate-900">{context.studentProfile.firstName}</p>
              <p className="text-slate-600 text-[11px]">{context.studentProfile.academicYear} • {context.studentProfile.branch}</p>
              <p className="text-slate-500 text-[10px]">Graduation: {context.studentProfile.graduationYear}</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Role & Stage</span>
              <p className="font-bold text-indigo-600">{context.targetRole}</p>
              <p className="text-slate-600 text-[11px]">Active Stage: {context.roadmapProgress.currentStageName}</p>
              <p className="text-slate-500 text-[10px]">{context.roadmapProgress.overallProgressPercentage}% Roadmap Complete</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">High Priority Gaps</span>
              <p className="font-bold text-amber-700">{topGap}</p>
              <p className="text-slate-600 text-[11px]">Recorded Skills: {context.currentSkills.length}</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Learning Preferences</span>
              <p className="font-bold text-slate-800">{context.learningPreferences?.formats?.join(', ') || 'Mixed'}</p>
              <p className="text-slate-600 text-[11px]">Language: {context.learningPreferences?.language}</p>
            </div>
          </div>
        </Card>
      )}

      {/* QUICK PROMPTS CHIPS */}
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Suggested Mentorship Questions
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isSending}
              className="px-3 py-2 bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all text-left shadow-2xs hover:shadow-xs disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CHAT CONTAINER */}
      <Card className="p-4 sm:p-6 min-h-[480px] max-h-[600px] flex flex-col justify-between border-slate-200">
        {/* MESSAGES LIST */}
        <div className="space-y-4 overflow-y-auto pr-2 flex-1 max-h-[440px]">
          {mentorMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}
              >
                {/* Avatar */}
                {isUser ? (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  <AiraAvatar size="sm" className="shrink-0 mt-0.5" />
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs shadow-2xs space-y-2 relative group ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-900 rounded-tl-none border border-slate-200/90'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/40 pb-1.5 mb-1.5">
                    <span className={`font-bold text-[11px] ${isUser ? 'text-indigo-100' : 'text-indigo-900'}`}>
                      {isUser ? profile.firstName || 'You' : 'Aira — AI Career Mentor'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className={isUser ? 'text-white' : 'text-slate-800'}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    ) : (
                      <div className="space-y-1">{formatMessageText(msg.text)}</div>
                    )}
                  </div>

                  {/* AI Metadata Footer */}
                  {!isUser && (
                    <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-indigo-700">
                        {msg.modelUsed || 'gemini-3.6-flash'}
                      </span>
                      <span className="text-slate-400">Context-Aware Guidance</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* THINKING INDICATOR */}
          {isSending && (
            <div className="flex gap-3 items-start">
              <AiraAvatar size="sm" className="shrink-0 mt-0.5" />
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl rounded-tl-none p-4 text-xs space-y-2 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[11px] text-indigo-900">Aira is analyzing your context...</span>
                </div>
                <div className="flex items-center gap-1.5 py-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT FORM */}
        <div className="pt-4 border-t border-slate-200 mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <textarea
              rows={2}
              placeholder="Ask Aira about your skills, roadmap, capstone projects, placement strategy, or interview prep..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isSending}
              className="flex-1 p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-slate-50/50"
            />
            <Button
              variant="primary"
              onClick={() => handleSend()}
              disabled={!input.trim() || isSending}
              icon={<Send className="w-4 h-4" />}
              className="h-full px-5 py-3 rounded-xl shrink-0"
            >
              Send
            </Button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Press Enter to send (Shift+Enter for newline)</span>
            <span className="text-slate-500 font-medium">Powered by Gemini 3.6 Flash Server-Side API</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
