import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Target,
  Map,
  BookOpen,
  FolderKanban,
  Mic,
  Briefcase,
  Bot,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate } = useApp();

  const problemCards = [
    {
      title: 'Too many technologies',
      quote: '"I don\'t know what I actually need to learn."',
      desc: 'Students get overwhelmed by endless frameworks, tools, and trendy buzzwords.',
    },
    {
      title: 'No clear roadmap',
      quote: '"I keep jumping between courses and tutorials."',
      desc: 'Tutorial hell causes aimless learning without building deep engineering core competence.',
    },
    {
      title: 'Skills don\'t match jobs',
      quote: '"I don\'t know what companies actually expect."',
      desc: 'College curriculums often lag behind modern industry production standards.',
    },
    {
      title: 'Certificates ≠ readiness',
      quote: '"I have completed courses, but can I actually build?"',
      desc: 'Watching videos is easy. Building production-ready software requires real problem solving.',
    },
    {
      title: 'Finding the right resources',
      quote: '"I waste time searching for good tutorials."',
      desc: 'Low-quality or outdated tutorials waste hundreds of valuable study hours.',
    },
    {
      title: 'Placement uncertainty',
      quote: '"I don\'t know whether I\'m actually ready to apply."',
      desc: 'Students lack clear quantitative metrics on their role readiness before interview season.',
    },
  ];

  const processSteps = [
    { step: '01', title: 'Tell us where you are', desc: 'Share your academic branch, current tech stack, and experience level.' },
    { step: '02', title: 'Choose where you want to go', desc: 'Select your target engineering role or explore industry career paths.' },
    { step: '03', title: 'Discover your skill gaps', desc: 'Compare your baseline skills directly against industry expectations.' },
    { step: '04', title: 'Follow your personalized path', desc: 'Access milestone-driven roadmaps structured for your timeline.' },
    { step: '05', title: 'Learn → Practice → Build → Apply', desc: 'Follow curated resources, capstone projects, and interview preparation.' },
  ];

  const featureCards = [
    {
      icon: Target,
      title: 'Skill Gap Analysis',
      desc: 'Clear comparison of your current skills against target role requirements.',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      icon: Map,
      title: 'Personalized Roadmaps',
      desc: 'Structured stages from foundation to production-grade project execution.',
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    },
    {
      icon: BookOpen,
      title: 'Curated & Live Resources',
      desc: 'Official documentation, top YouTube playlists, and interactive practice platforms.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      icon: FolderKanban,
      title: 'Project Recommendations',
      desc: 'Industry-style capstones designed to prove real engineering competence.',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      icon: Mic,
      title: 'Interview Preparation',
      desc: 'Technical concepts, behavioral STAR method, and mock interview practice.',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      icon: Briefcase,
      title: 'Job Opportunities',
      desc: 'Integration-ready discovery of verified corporate career pages and public ATS feeds.',
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      icon: Bot,
      title: 'AI Career Mentor',
      desc: 'Conversational assistant (Aira) available 24/7 for roadmap and skill guidance.',
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">TechPath AI</span>
              <span className="block text-[10px] text-cyan-400 font-medium tracking-wide uppercase">
                Engineering to Industry
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-slate-300 hover:text-white hover:bg-slate-800 hidden sm:inline-flex"
            >
              Enter App
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/onboarding')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Build My Path
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge variant="cyan" className="mb-6 py-1.5 px-3 border-cyan-800/80 bg-cyan-950/60 text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400 mr-1" />
            College-to-Industry Career Platform for Engineers
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            From learning to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-300">industry readiness.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
            Stop learning technologies randomly. Build a clear path from your current engineering skills to the role you want.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/onboarding')}
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              className="w-full sm:w-auto px-8 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-950"
            >
              Build My Career Path
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600"
            >
              Explore How It Works
            </Button>
          </div>

          {/* CONCEPTUAL DASHBOARD PREVIEW */}
          <div className="relative mx-auto max-w-4xl rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 sm:p-6 shadow-2xl text-left backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-400">TechPath AI Dashboard Preview</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Target: Full Stack Developer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Readiness Preview */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Skill Readiness</span>
                <div className="text-2xl font-bold text-white mb-1">42% <span className="text-xs text-slate-400 font-normal">(Initial estimate)</span></div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[42%]" />
                </div>
              </div>

              {/* Priority Gaps Preview */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Skill Gaps to Close</span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>React State Mgmt</span>
                    <span className="text-amber-400 font-medium">Developing</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>REST APIs & Node</span>
                    <span className="text-rose-400 font-medium">Attention</span>
                  </div>
                </div>
              </div>

              {/* Next Milestone */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Next Milestone</span>
                <div className="text-xs font-semibold text-white mb-1">Stage 2: Core Frontend</div>
                <div className="text-[11px] text-slate-400">Build capstone with async JS & REST APIs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM STUDENTS FACE */}
      <section className="py-20 px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-900/60 px-3 py-1 rounded-full">
              The Reality
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
              The problem engineering students face
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Why traditional career advice leaves computer science and engineering students confused.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemCards.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs font-medium text-amber-300/90 italic mb-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {item.quote}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TECHPATH AI HELPS (5-STEP PROCESS) */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-900/60 px-3 py-1 rounded-full">
              How TechPath AI Helps
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
              A 5-step path to career readiness
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {processSteps.map((s, idx) => (
              <div key={idx} className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between relative">
                <div>
                  <span className="text-3xl font-black text-indigo-500/40 block mb-2">{s.step}</span>
                  <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="py-20 px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-900/60 px-3 py-1 rounded-full">
              Platform Features
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
              Built around your real career journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-indigo-950 border-t border-slate-800 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-900">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
            Build your path. Build your skills. Build your career.
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Take control of your college-to-industry transition with structured skill gap analysis and milestone roadmaps.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/onboarding')}
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            className="px-8 bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-950"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
};
