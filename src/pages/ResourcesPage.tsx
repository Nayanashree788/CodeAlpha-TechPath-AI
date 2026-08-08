import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceType, ResourceSourceType, LearningResource } from '../types';
import { ResourceService } from '../services/resourceService';
import { SavedResourceService } from '../services/savedResourceService';
import { ResourceCard } from '../components/resources/ResourceCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  BookOpen,
  Video,
  GraduationCap,
  FileText,
  FlaskConical,
  MapPin,
  Search,
  Target,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Filter,
  Info,
  RotateCcw,
  Compass,
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { profile, roadmap } = useApp();

  // URL query parameter for pre-selecting a skill (e.g., /resources?skill=FastAPI)
  const queryParams = new URLSearchParams(window.location.search);
  const initialSkillParam = queryParams.get('skill') || '';

  // Current Focus Next Skill determination from roadmap
  const nextSkillName = useMemo(() => {
    if (initialSkillParam) return initialSkillParam;
    const nextStep = (roadmap?.steps || []).find((s) => String(s.status).toLowerCase() !== 'completed');
    return nextStep ? nextStep.skillName || nextStep.title : 'React';
  }, [initialSkillParam, roadmap?.steps]);

  // States
  const [activeTab, setActiveTab] = useState<'All' | ResourceType | 'Saved'>('All');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>(initialSkillParam || 'All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<ResourceType | 'All'>('All');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All'>('All');
  const [selectedSourceType, setSelectedSourceType] = useState<ResourceSourceType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>(() => SavedResourceService.getSavedResourceIds());

  const refreshSavedIds = () => {
    setSavedResourceIds(SavedResourceService.getSavedResourceIds());
  };

  // Get personalized recommendations for Next Skill
  const recommendations = useMemo(() => {
    return ResourceService.getPersonalizedRecommendations(profile, nextSkillName);
  }, [profile, nextSkillName]);

  // Main catalog
  const allResources = ResourceService.getAllResources();

  // List of unique skills available for filter dropdown
  const availableSkills = useMemo(() => {
    const set = new Set<string>();
    allResources.forEach((r) => set.add(r.skill));
    return Array.from(set).sort();
  }, [allResources]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    let list = allResources;

    // Tab filter
    if (activeTab === 'Saved') {
      list = list.filter((r) => savedResourceIds.includes(r.id));
    } else if (activeTab !== 'All') {
      list = list.filter((r) => r.type === activeTab);
    }

    // Dropdown filters
    list = ResourceService.filterResources(list, {
      skill: selectedSkillFilter,
      type: selectedTypeFilter,
      difficulty: selectedDifficultyFilter,
      sourceType: selectedSourceType,
    });

    // Search query
    if (searchQuery.trim()) {
      const term = searchQuery.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.skill.toLowerCase().includes(term) ||
          r.provider.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term)
      );
    }

    return list;
  }, [
    allResources,
    activeTab,
    savedResourceIds,
    selectedSkillFilter,
    selectedTypeFilter,
    selectedDifficultyFilter,
    selectedSourceType,
    searchQuery,
  ]);

  const tabs: { label: string; value: 'All' | ResourceType | 'Saved'; icon: any }[] = [
    { label: 'All Resources', value: 'All', icon: BookOpen },
    { label: 'Official Docs', value: 'Documentation', icon: FileText },
    { label: 'YouTube / Video', value: 'Video', icon: Video },
    { label: 'Courses', value: 'Course', icon: GraduationCap },
    { label: 'Practice', value: 'Practice', icon: FlaskConical },
    { label: 'Roadmaps', value: 'Roadmap', icon: MapPin },
    { label: `Saved (${savedResourceIds.length})`, value: 'Saved', icon: Bookmark },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo">Personalized Resource Engine</Badge>
            <Badge variant="success">100% Free & Verified</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Learning Resources Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hand-curated, official documentation and verified educational guides matched to your career path.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills or resources (e.g. React, Python)..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* YOUR LEARNING PATH RECOMMENDATION BOX */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold block">
                  Your Personalized Learning Path
                </span>
                <span className="text-base font-extrabold text-white">
                  Target Role: <strong className="text-indigo-200">{profile.targetRole}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/80">
              <Target className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300">
                Current Focus Skill: <strong className="text-white font-bold">{recommendations.nextSkill}</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {recommendations.skillWhyItMatters}
          </p>

          {recommendations.languageNotice && (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{recommendations.languageNotice}</span>
            </div>
          )}

          {/* QUICK TOP RECOMMENDATIONS FOR NEXT SKILL */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Recommended Starting Resources for {recommendations.nextSkill}:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendations.recommendedResources.slice(0, 3).map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl flex items-center justify-between text-xs transition-all group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded">
                        {res.type}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">{res.sourceType}</span>
                    </div>
                    <span className="font-bold text-white group-hover:text-indigo-300 truncate block">
                      {res.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{res.provider}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-300 group-hover:translate-x-0.5 transition-transform shrink-0">
                    →
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* TABS & FILTER BAR */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* DROPDOWN FILTERS */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold">
            <Filter className="w-3 h-3 text-indigo-600" /> Filters:
          </div>

          {/* Skill Filter Dropdown */}
          <select
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Skills</option>
            {availableSkills.map((sk) => (
              <option key={sk} value={sk}>
                {sk}
              </option>
            ))}
          </select>

          {/* Source Type Filter Dropdown */}
          <select
            value={selectedSourceType}
            onChange={(e) => setSelectedSourceType(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Sources</option>
            <option value="OFFICIAL">Official Documentation</option>
            <option value="CURATED">Curated Resources</option>
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficultyFilter}
            onChange={(e) => setSelectedDifficultyFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Reset Filters */}
          {(selectedSkillFilter !== 'All' ||
            selectedTypeFilter !== 'All' ||
            selectedDifficultyFilter !== 'All' ||
            selectedSourceType !== 'All' ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedSkillFilter('All');
                setSelectedTypeFilter('All');
                setSelectedDifficultyFilter('All');
                setSelectedSourceType('All');
                setSearchQuery('');
              }}
              className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1 ml-auto"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* RESOURCE RESULTS GRID */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => (
            <ResourceCard key={res.id} resource={res} onStatusChange={refreshSavedIds} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center bg-white border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No verified resources found for this skill yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We continuously verify official documentation and curated guides. Try resetting your search or exploring another skill.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSkillFilter('All');
              setSelectedTypeFilter('All');
              setSelectedDifficultyFilter('All');
              setSelectedSourceType('All');
              setSearchQuery('');
              setActiveTab('All');
            }}
          >
            Show All Resources
          </Button>
        </Card>
      )}
    </div>
  );
};
