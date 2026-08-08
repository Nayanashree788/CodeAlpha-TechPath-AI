import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillGap } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
  Sparkles,
  ArrowUpRight,
  Mic,
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const { profile, skillGaps, navigate, openVoiceMode } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Core', 'Frontend', 'Backend', 'Database', 'Cloud', 'AI', 'Tools'];

  const filteredGaps =
    selectedCategory === 'All'
      ? skillGaps
      : skillGaps.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());

  // Categorize into Current Skills, Recommended Skills, Future Skills
  const currentSkills = profile.skills;
  const recommendedGaps = filteredGaps.filter((g) => g.priority === 'High');
  const futureGaps = filteredGaps.filter((g) => g.priority === 'Medium' || g.priority === 'Low');

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info">Target: {profile.targetRole}</Badge>
            <Badge variant="cyan">Skill Baseline Analysis</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Skill Gap Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comparing your profile against company expectations for a {profile.targetRole}.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/roadmap')}
          icon={<ArrowUpRight className="w-4 h-4" />}
          iconPosition="right"
        >
          View Action Roadmap
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* COMPARISON TABLE GRID */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Skill Requirement Matrix ({profile.targetRole})
          </h3>
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              ✅ Strong
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              🟡 Developing
            </span>
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              🔴 Needs attention
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Skill Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Your Level</th>
                <th className="p-3.5">Required Level</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Action Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredGaps.map((gap) => (
                <tr key={gap.skillName} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{gap.skillName}</td>
                  <td className="p-3.5 text-slate-500">{gap.category}</td>
                  <td className="p-3.5 font-semibold text-slate-700">
                    {gap.currentLevel || 'None'}
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">{gap.requiredLevel}</td>
                  <td className="p-3.5">
                    <Badge
                      variant={
                        gap.status === 'Strong'
                          ? 'success'
                          : gap.status === 'Developing'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {gap.status === 'Strong' && '✅ Strong'}
                      {gap.status === 'Developing' && '🟡 Developing'}
                      {gap.status === 'Needs attention' && '🔴 Needs attention'}
                    </Badge>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`font-semibold ${
                        gap.priority === 'High'
                          ? 'text-rose-600'
                          : gap.priority === 'Medium'
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {gap.priority}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-xs">
                    <div className="flex flex-col gap-1.5">
                      <span>{gap.description}</span>
                      <button
                        onClick={() =>
                          openVoiceMode(
                            `Explain why ${gap.skillName} is currently a priority for my ${profile.targetRole} roadmap.`
                          )
                        }
                        className="self-start text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1 transition-colors"
                      >
                        <Mic className="w-2.5 h-2.5 text-indigo-600" />
                        <span>Talk to Aira</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* THREE SEPARATE SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* YOUR CURRENT SKILLS */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Your Current Skills ({currentSkills.length})
          </h3>
          <div className="space-y-2">
            {currentSkills.map((sk) => (
              <div
                key={sk.name}
                className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center"
              >
                <span className="font-semibold text-slate-800">{sk.name}</span>
                <Badge variant="info" size="sm">
                  {sk.proficiency}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* RECOMMENDED SKILLS */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Recommended Skills (High Priority)
          </h3>
          <div className="space-y-2">
            {recommendedGaps.map((g) => (
              <div
                key={g.skillName}
                className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs flex justify-between items-center"
              >
                <span className="font-semibold text-amber-950">{g.skillName}</span>
                <Badge variant="warning" size="sm">
                  Gap: {g.requiredLevel}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* FUTURE SKILLS */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Future Skills (Next Phase)
          </h3>
          <div className="space-y-2">
            {futureGaps.map((g) => (
              <div
                key={g.skillName}
                className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs flex justify-between items-center"
              >
                <span className="font-semibold text-indigo-950">{g.skillName}</span>
                <Badge variant="neutral" size="sm">
                  {g.category}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
