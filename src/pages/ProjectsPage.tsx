import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  FolderKanban,
  Clock,
  Sparkles,
  CheckCircle2,
  Code2,
  Filter,
  Layers,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { profile } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filterOptions = [
    'All',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Web',
    'Backend',
    'AI',
    'Data',
    'Cloud',
    'Security',
  ];

  const projects: Project[] = [
    {
      id: 'proj_1',
      title: 'Real-Time Collab Task Board with Auth & Database',
      category: 'Web',
      difficulty: 'Intermediate',
      skillsDemonstrated: ['React 19', 'TypeScript', 'Node.js/Express', 'PostgreSQL', 'WebSockets'],
      whyItMatters:
        'Demonstrates ability to manage real-time UI state, asynchronous database persistence, and clean RESTful API separation.',
      estimatedHours: 25,
      industryRelevance: 'Directly mirrors internal workflow tools used at modern software companies.',
      recommendedStack: ['React', 'TypeScript', 'Express', 'Drizzle ORM', 'PostgreSQL'],
      portfolioValue: 'Very High',
    },
    {
      id: 'proj_2',
      title: 'Full-Stack E-Commerce API with JWT & Stripe Integration',
      category: 'Backend',
      difficulty: 'Intermediate',
      skillsDemonstrated: ['REST APIs', 'Express Middleware', 'JWT Tokens', 'SQL Schema', 'Stripe SDK'],
      whyItMatters:
        'Proves mastery of secure authentication, relational transactions, payment webhooks, and error boundaries.',
      estimatedHours: 30,
      industryRelevance: 'Core architectural standard for any backend engineer applying for product roles.',
      recommendedStack: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Stripe'],
      portfolioValue: 'Very High',
    },
    {
      id: 'proj_3',
      title: 'AI Code Reviewer & AST Analyzer',
      category: 'AI',
      difficulty: 'Advanced',
      skillsDemonstrated: ['Gemini API', 'TypeScript', 'AST Parsing', 'Prompt Engineering', 'CI/CD'],
      whyItMatters:
        'Highlights AI engineering competency and practical integration of LLM structured outputs into developer tools.',
      estimatedHours: 35,
      industryRelevance: 'Combines modern AI models with practical developer workflow automation.',
      recommendedStack: ['TypeScript', 'Gemini API', 'Node.js', 'GitHub Actions'],
      portfolioValue: 'Very High',
    },
    {
      id: 'proj_4',
      title: 'Containerized Microservices Log Analytics Engine',
      category: 'Cloud',
      difficulty: 'Advanced',
      skillsDemonstrated: ['Docker', 'Linux CLI', 'Cloud Run', 'Python', 'Redis'],
      whyItMatters:
        'Proves cloud infrastructure knowledge, container deployment, and log stream processing.',
      estimatedHours: 40,
      industryRelevance: 'Essential capstone for Cloud / DevOps engineering applicants.',
      recommendedStack: ['Docker', 'FastAPI', 'Redis', 'Google Cloud Run'],
      portfolioValue: 'High',
    },
    {
      id: 'proj_5',
      title: 'Interactive Personal Portfolio & Career Showcase',
      category: 'Web',
      difficulty: 'Beginner',
      skillsDemonstrated: ['HTML5', 'CSS3', 'Tailwind', 'React', 'GitHub Pages'],
      whyItMatters:
        'Serves as your primary candidate resume hub during recruitment drives.',
      estimatedHours: 12,
      industryRelevance: 'Must-have foundational asset for every graduating engineer.',
      recommendedStack: ['React', 'Tailwind CSS', 'Vite'],
      portfolioValue: 'High',
    },
  ];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    if (['Beginner', 'Intermediate', 'Advanced'].includes(selectedCategory)) {
      return p.difficulty === selectedCategory;
    }
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <Badge variant="info" className="mb-1">
            Portfolio Boosters
          </Badge>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Industry Project Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build production-grade projects that prove your readiness to interviewers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" icon={<Sparkles className="w-3.5 h-3.5" />}>
            AI Recommendation Ready
          </Badge>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter Projects:
        </span>
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedCategory(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === f
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* PROJECTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <Card key={p.id} className="p-6 flex flex-col justify-between border-slate-200">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge
                  variant={
                    p.difficulty === 'Beginner'
                      ? 'success'
                      : p.difficulty === 'Intermediate'
                      ? 'warning'
                      : 'danger'
                  }
                  size="sm"
                >
                  {p.difficulty}
                </Badge>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  Portfolio Value: {p.portfolioValue}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{p.title}</h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">{p.whyItMatters}</p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mb-4 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Industry Relevance</span>
                  <p className="text-slate-600">{p.industryRelevance}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Recommended Tech Stack</span>
                  <div className="flex flex-wrap gap-1">
                    {p.recommendedStack.map((st) => (
                      <span
                        key={st}
                        className="px-2 py-0.5 bg-white text-[10px] font-semibold text-slate-800 rounded border border-slate-200"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Skills Demonstrated
                </span>
                <div className="flex flex-wrap gap-1">
                  {p.skillsDemonstrated.map((sk) => (
                    <Badge key={sk} variant="neutral" size="sm">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> ~{p.estimatedHours} Hours
              </span>
              <Button variant="secondary" size="sm">
                Start Project Guide
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
