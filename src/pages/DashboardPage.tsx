import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SkillGapService } from '../services/skillGapService';
import { RoadmapService } from '../services/roadmapService';
import { ResourceService } from '../services/resourceService';
import { OpportunityService } from '../services/opportunityService';
import { SavedOpportunityService } from '../services/savedOpportunityService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CircularProgressBar } from '../components/ui/ProgressBar';
import { AiraAvatar } from '../components/ui/AiraAvatar';
import {
  Target,
  Map,
  BookOpen,
  FolderKanban,
  Briefcase,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  ExternalLink,
  Play,
  FileText,
  Compass,
  Mic,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { profile, roadmap, roadmapProgress, navigate, openVoiceMode } = useApp();

  const coverage = SkillGapService.calculateInitialCoverage(profile);
  const nextAction = RoadmapService.getNextBestAction(roadmap);

  // Determine current stage and next roadmap skill
  const currentStage =
    (roadmap?.stages || []).find((stg) => (stg.steps || []).some((s) => String(s.status).toLowerCase() === 'in progress')) ||
    (roadmap?.stages || []).find((stg) => stg.completionPercentage < 100) ||
    roadmap?.stages?.[0];

  const nextStep = (roadmap?.steps || []).find((s) => String(s.status).toLowerCase() !== 'completed');
  const nextSkill = nextStep ? nextStep.skillName || nextStep.title : 'React';

  // Get personalized learning resource recommendations for the next skill
  const recommendations = useMemo(() => {
    return ResourceService.getPersonalizedRecommendations(profile, nextSkill);
  }, [profile, nextSkill]);

  const startingResource = recommendations.recommendedResources[0];
  const topThreeResources = recommendations.recommendedResources.slice(0, 3);

  const upcomingSteps = (roadmap?.steps || []).filter((s) => String(s.status).toLowerCase() !== 'completed').slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {profile.firstName || 'Student'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Let's move one step closer to your target role as{' '}
            <span className="font-semibold text-indigo-600">{profile.targetRole || 'Full Stack Developer'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/skills')}
            icon={<Target className="w-4 h-4 text-indigo-600" />}
          >
            Skill Gap Analysis
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/roadmap')}
            icon={<Map className="w-4 h-4" />}
          >
            Continue My Roadmap
          </Button>
        </div>
      </div>

      {/* PROMINENT NEXT BEST ACTION BANNER */}
      {nextAction && (
        <Card className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border-none shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/30">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Next Best Action</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                🎯 {nextAction.step.title}
              </h2>
              <p className="text-xs text-indigo-200 leading-relaxed">
                <span className="font-semibold text-white">Why:</span> {nextAction.why}
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => navigate(`/resources?skill=${encodeURIComponent(nextSkill)}`)}
              className="bg-indigo-500 hover:bg-indigo-400 text-white border-none shrink-0"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Start Learning {nextSkill}
            </Button>
          </div>
        </Card>
      )}

      {/* TOP ROW: TARGET ROLE & ROADMAP PROGRESS + UPCOMING MILESTONES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* TARGET ROLE CARD & ROADMAP PROGRESS */}
        <Card className="p-6 md:col-span-1 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-300">
                Target Role
              </span>
              <Badge variant="cyan" size="sm">
                Active Goal
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{profile.targetRole || 'Full Stack Developer'}</h2>
            <p className="text-xs text-slate-300">
              Current Stage: <span className="font-semibold text-indigo-300">{currentStage?.stageName}</span>
            </p>
          </div>

          <div className="my-6 flex flex-col items-center justify-center">
            <CircularProgressBar progress={roadmap.overallProgress} size={130} label={`${roadmap.overallProgress}%`} sublabel="Roadmap Progress" />
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-indigo-300">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Estimated timeline: {roadmap.totalWeeks} Weeks</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/roadmap')}
            className="w-full border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800 hover:text-white"
          >
            Open Interactive Roadmap
          </Button>
        </Card>

        {/* ROADMAP UPCOMING MILESTONES */}
        <Card className="p-6 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upcoming Roadmap Milestones</h3>
                <p className="text-xs text-slate-500">
                  Calculated sequence based on your skill gaps and target prerequisites.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/roadmap')}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                View Full Roadmap
              </Button>
            </div>

            <div className="space-y-2.5">
              {upcomingSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{step.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Stage: {step.stage} • ~{step.estimatedDuration}</span>
                    </div>
                  </div>
                  <Badge variant={step.status === 'In Progress' ? 'info' : step.status === 'Locked' ? 'warning' : 'neutral'} size="sm">
                    {step.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Stage 0{currentStage?.stageNumber}: {currentStage?.stageName} ({currentStage?.completionPercentage}% Done)</span>
            <button
              onClick={() => navigate('/roadmap')}
              className="font-bold text-indigo-600 hover:underline"
            >
              Continue Learning →
            </button>
          </div>
        </Card>
      </div>

      {/* SECOND ROW: CONTINUE LEARNING RESOURCE CARD & AI MENTOR CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CONTINUE LEARNING RESOURCE ENGINE PREVIEW */}
        <Card className="p-6 md:col-span-2 flex flex-col justify-between border-slate-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Continue Learning: Next Skill
                  </h3>
                  <Badge variant="indigo" size="sm">{nextSkill}</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hand-curated, verified resources matching your roadmap and skill level.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/resources?skill=${encodeURIComponent(nextSkill)}`)}
                className="text-xs text-indigo-600 font-bold"
              >
                Explore More Resources →
              </Button>
            </div>

            {/* RECOMMENDED STARTING RESOURCE HIGHLIGHT */}
            {startingResource && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-extrabold rounded">
                      Top Starting Choice
                    </span>
                    <span className="text-[10px] text-indigo-700 font-bold uppercase">{startingResource.sourceType}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{startingResource.title}</h4>
                  <p className="text-xs text-slate-600">{startingResource.description}</p>
                </div>

                <a
                  href={startingResource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shrink-0 flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Start Learning</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* 3 RECOMMENDED RESOURCES PREVIEW LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topThreeResources.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex flex-col justify-between text-xs transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1.5">
                      <span className="font-bold text-indigo-600">{res.type}</span>
                      <span className="text-slate-400 font-medium">{res.difficulty}</span>
                    </div>
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 leading-snug mb-1">
                      {res.title}
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate">{res.provider}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Card>

        {/* AI MENTOR CARD */}
        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-indigo-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <AiraAvatar size="md" status="idle" />
              <div>
                <h3 className="text-base font-bold text-white">Meet Aira</h3>
                <p className="text-[11px] text-indigo-200">Your AI Career Mentor</p>
              </div>
            </div>

            <p className="text-xs text-indigo-100 leading-relaxed mb-6">
              Ask questions about your skills, roadmap, projects, interviews, and career direction via voice or text.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => openVoiceMode()}
              icon={<Mic className="w-4 h-4 text-amber-300" />}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-md border-none"
            >
              Talk to Aira (Voice)
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/mentor')}
              icon={<Sparkles className="w-4 h-4 text-indigo-200" />}
              className="w-full border-indigo-400/50 bg-indigo-900/40 text-white hover:bg-indigo-900/80 text-xs"
            >
              Open Text Chat
            </Button>
          </div>
        </Card>
      </div>

      {/* THIRD ROW: RECOMMENDED PROJECT & JOB READINESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* PROJECT TO BUILD */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-indigo-600" />
              Recommended Capstone Project
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
              View All
            </Button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="warning" size="sm">
                Intermediate
              </Badge>
              <span className="text-[11px] text-slate-500 font-semibold">Portfolio Value: High</span>
            </div>

            <h4 className="text-xs font-bold text-slate-900">
              Collab Task Board with Persistent Database & Auth
            </h4>

            <p className="text-[11px] text-slate-500">
              Demonstrates React state, Express REST routes, and SQL/NoSQL schema setup.
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/projects')}
              className="w-full mt-2"
            >
              View Project Specifications
            </Button>
          </div>
        </Card>

        {/* OPPORTUNITY RADAR CARD */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Opportunity Radar
              </h3>
              <Badge variant="success" size="sm">
                Verified Sources
              </Badge>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-600 space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Target Role:</span>
                <span className="font-bold text-indigo-700">{profile.targetRole || 'Software Engineer'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Relevant Companies:</span>
                <span className="text-slate-600 font-medium">Microsoft, Google, Amazon, TCS, IBM + 10 more</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="font-semibold text-slate-700">Saved Opportunities:</span>
                <span className="font-bold text-slate-900">
                  {SavedOpportunityService.getSavedOpportunityIds().length} saved
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/jobs')}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            className="w-full"
          >
            Explore Opportunities
          </Button>
        </Card>
      </div>
    </div>
  );
};
