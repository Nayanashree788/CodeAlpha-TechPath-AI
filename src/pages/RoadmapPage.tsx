import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RoadmapStep, StepStatus, PacePreferences, LearningResource } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { PDFService } from '../services/pdfService';
import { RoadmapService } from '../services/roadmapService';
import { ResourceService } from '../services/resourceService';
import { YouTubeService } from '../services/youtubeService';
import {
  Map,
  Download,
  CheckCircle2,
  Clock,
  BookOpen,
  FolderKanban,
  Check,
  ChevronRight,
  Lock,
  Sparkles,
  SlidersHorizontal,
  Calendar,
  Layers,
  Flame,
  ArrowRight,
  Info,
  RotateCcw,
  Target,
  GraduationCap,
  ExternalLink,
  Video,
  Loader2,
  Play,
  Radio,
  Mic,
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const {
    profile,
    roadmap,
    roadmapProgress,
    updateStepStatus,
    updatePacePreferences,
    resetRoadmapProgress,
    showToast,
    navigate,
    openVoiceMode,
  } = useApp();

  const [selectedStep, setSelectedStep] = useState<RoadmapStep | null>(null);
  const [viewMode, setViewMode] = useState<'stage' | 'weekly'>('stage');
  const [showPaceModal, setShowPaceModal] = useState(false);

  // Step learning resources state
  const [stepResources, setStepResources] = useState<LearningResource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [resourceNotice, setResourceNotice] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStep) {
      const skillToSearch = selectedStep.skillName || selectedStep.title;
      setIsLoadingResources(true);
      try {
        const res = ResourceService.getResourcesForSkill(skillToSearch);
        setStepResources(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingResources(false);
      }
    } else {
      setStepResources([]);
      setResourceNotice(null);
    }
  }, [selectedStep]);

  // Local pace form state
  const [hoursPerDay, setHoursPerDay] = useState<number>(roadmapProgress.pace?.hoursPerDay || 2);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(roadmapProgress.pace?.daysPerWeek || 5);
  const [preferredPace, setPreferredPace] = useState<'Relaxed' | 'Balanced' | 'Intensive'>(
    roadmapProgress.pace?.preferredPace || 'Balanced'
  );

  const nextBestAction = RoadmapService.getNextBestAction(roadmap);

  const handleDownloadPdf = async () => {
    const res = await PDFService.generateRoadmapPDF(roadmap, profile);
    showToast(res.message);
  };

  const handleSavePace = () => {
    updatePacePreferences({
      hoursPerDay,
      daysPerWeek,
      preferredPace,
    });
    setShowPaceModal(false);
  };

  const getStatusBadgeVariant = (status: StepStatus) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'info';
      case 'Locked':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" /> Target Role: {profile.targetRole}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Estimated ~{roadmap.totalWeeks} Weeks
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your TechPath
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your personalized journey from where you are to where you want to be.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPaceModal(true)}
              icon={<SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />}
            >
              Customize Pace
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              icon={<Download className="w-3.5 h-3.5 text-indigo-600" />}
            >
              Download PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetRoadmapProgress}
              icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
              title="Reset progress"
            >
              Reset Progress
            </Button>
          </div>
        </div>

        {/* OVERALL PROGRESS & STAGES SUMMARY BAR */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Overall Roadmap Progress
            </span>
            <span className="text-indigo-600 text-sm font-extrabold">{roadmap.overallProgress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(3, roadmap.overallProgress)}%` }}
            />
          </div>

          {/* Stage Progress Mini Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
            {roadmap.stages.map((stg) => (
              <div
                key={stg.stageId}
                className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1"
              >
                <span className="text-[10px] font-bold text-slate-400 block truncate">
                  0{stg.stageNumber}. {stg.stageName}
                </span>
                <span className="text-xs font-extrabold text-slate-800 block">
                  {stg.completionPercentage}%
                </span>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${stg.completionPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROMINENT NEXT BEST ACTION CARD */}
      {nextBestAction && (
        <Card className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border-none shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/30">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Your Next Best Action</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                🎯 {nextBestAction.step.title}
              </h2>
              <p className="text-xs text-indigo-200 leading-relaxed">
                <span className="font-semibold text-white">Why:</span> {nextBestAction.why}
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => setSelectedStep(nextBestAction.step)}
              className="bg-indigo-500 hover:bg-indigo-400 text-white border-none shrink-0"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {nextBestAction.actionLabel}
            </Button>
          </div>
        </Card>
      )}

      {/* VIEW SWITCHER TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('stage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'stage'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Stage View (Timeline)
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'weekly'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Weekly Plan
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {roadmap.steps.length} total steps
        </span>
      </div>

      {/* VIEW MODE 1: STAGE VIEW (TIMELINE) */}
      {viewMode === 'stage' && (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 sm:before:left-7 before:w-0.5 before:bg-indigo-100">
          {roadmap.stages.map((stage) => (
            <div key={stage.stageId} className="relative pl-12 sm:pl-16">
              {/* STAGE NUMBER BADGE */}
              <div className="absolute left-2 sm:left-4 -translate-x-1/2 top-0 w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center shadow-md border-2 border-white">
                0{stage.stageNumber}
              </div>

              {/* STAGE HEADER */}
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                      {stage.stageName}
                    </h3>
                    <span className="text-xs text-slate-400 font-semibold">• ~{stage.estimatedWeeks} Weeks</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{stage.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-700">
                    {stage.completionPercentage}% Done
                  </span>
                  <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${stage.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* STEP CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stage.steps.map((step) => {
                  const isLocked = step.status === 'Locked' || !step.isUnlocked;

                  return (
                    <Card
                      key={step.id}
                      className={`p-5 transition-all ${
                        isLocked
                          ? 'bg-slate-50/80 border-slate-200 opacity-90'
                          : step.status === 'Completed'
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant={getStatusBadgeVariant(step.status)} size="sm">
                            {isLocked ? (
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Locked
                              </span>
                            ) : (
                              step.status
                            )}
                          </Badge>

                          <Badge
                            variant={
                              step.priority === 'High'
                                ? 'danger'
                                : step.priority === 'Medium'
                                ? 'warning'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {step.priority} Priority
                          </Badge>
                        </div>

                        <span className="text-[11px] text-slate-400 font-medium shrink-0">
                          {step.estimatedDuration}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                        {step.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        {step.description}
                      </p>

                      {/* LEVEL TRANSITION indicator */}
                      <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3">
                        <span className="text-slate-500">Current Level:</span>
                        <span className="font-bold text-slate-700">{step.currentLevel}</span>
                        <span className="text-slate-300">→</span>
                        <span className="text-slate-500">Target Level:</span>
                        <span className="font-bold text-indigo-600">{step.requiredLevel}</span>
                      </div>

                      {/* PREREQUISITE LOCK WARNING */}
                      {isLocked && step.prerequisites.length > 0 && (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center gap-2 mb-3">
                          <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            Complete prerequisite: <strong>{step.prerequisites.join(', ')}</strong>
                          </span>
                        </div>
                      )}

                      {/* ACTION BUTTONS */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedStep(step)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            Details <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              openVoiceMode(
                                `Why is ${step.title} important for my target role as ${profile.targetRole}?`
                              )
                            }
                            className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md border border-indigo-200 flex items-center gap-1 transition-colors"
                            title="Ask Aira voice mentor about this step"
                          >
                            <Mic className="w-3 h-3 text-indigo-600" />
                            <span>Talk to Aira</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          {step.status !== 'Completed' && !isLocked && (
                            <button
                              onClick={() => updateStepStatus(step.id, 'In Progress')}
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                                step.status === 'In Progress'
                                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              In Progress
                            </button>
                          )}

                          {!isLocked && (
                            <button
                              onClick={() =>
                                updateStepStatus(
                                  step.id,
                                  step.status === 'Completed' ? 'Not Started' : 'Completed'
                                )
                              }
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all flex items-center gap-1 ${
                                step.status === 'Completed'
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                              {step.status === 'Completed' ? 'Done' : 'Mark Complete'}
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 2: WEEKLY PLAN */}
      {viewMode === 'weekly' && (
        <div className="space-y-4">
          {RoadmapService.getWeeklyPlan(roadmap).map((wp) => (
            <Card key={wp.weekNumber} className="p-5 border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                  {wp.title}
                </span>
                <span className="text-xs text-slate-400 font-medium">Pace: {roadmapProgress.pace.preferredPace}</span>
              </div>

              <div className="space-y-3">
                {wp.steps.map((st) => (
                  <div
                    key={st.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{st.title}</span>
                        <Badge variant={getStatusBadgeVariant(st.status)} size="sm">
                          {st.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">{st.description}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStep(st)}
                      className="shrink-0 text-xs"
                    >
                      View Tasks
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* EXPANDABLE STEP DETAILS MODAL */}
      <Modal
        isOpen={Boolean(selectedStep)}
        onClose={() => setSelectedStep(null)}
        title={selectedStep?.title || 'Milestone Details'}
        maxWidth="lg"
      >
        {selectedStep && (
          <div className="space-y-5 text-xs text-slate-700">
            {/* Status & Priority header */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(selectedStep.status)}>
                  {selectedStep.status}
                </Badge>
                <Badge variant="neutral">{selectedStep.stage}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-semibold">
                  Time: {selectedStep.estimatedDuration}
                </span>
              </div>
            </div>

            {/* WHY THIS MATTERS */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Why This Matters
              </h4>
              <p className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-slate-800 leading-relaxed font-medium">
                {selectedStep.whyItMatters}
              </p>
            </div>

            {/* WHAT YOU SHOULD KNOW (CONCEPTS) */}
            {selectedStep.conceptsToLearn && selectedStep.conceptsToLearn.length > 0 && (
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> What You Should Know
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {selectedStep.conceptsToLearn.map((c, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* PREREQUISITES */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-1">
                Prerequisites
              </h4>
              {selectedStep.prerequisites.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedStep.prerequisites.map((pr) => (
                    <span
                      key={pr}
                      className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700 border border-slate-200"
                    >
                      ✓ {pr}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">No prerequisites required.</span>
              )}
            </div>

            {/* PRACTICE TASKS */}
            {selectedStep.practiceTasks && selectedStep.practiceTasks.length > 0 && (
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Practice Activities
                </h4>
                <div className="space-y-2">
                  {selectedStep.practiceTasks.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BUILD / PROJECT IDEA */}
            {selectedStep.project && (
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Associated Build Project
                </span>
                <h5 className="text-xs font-bold text-white">{selectedStep.project.title}</h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedStep.project.description}
                </p>
              </div>
            )}

            {/* DYNAMIC LEARNING RESOURCES (PHASE 4 ENGINE) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-600" /> Recommended Learning Resources
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const skill = selectedStep.skillName || selectedStep.title;
                    setSelectedStep(null);
                    navigate(`/resources?skill=${encodeURIComponent(skill)}`);
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Start Learning</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>

              {stepResources.length > 0 ? (
                <div className="grid grid-cols-1 gap-2.5">
                  {stepResources.slice(0, 4).map((res) => (
                    <div
                      key={res.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {res.thumbnail ? (
                          <img
                            src={res.thumbnail}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-14 h-10 object-cover rounded-lg shrink-0 bg-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                            {res.type === 'Video' ? <Video className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-slate-900 truncate block">{res.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span>{res.provider}</span>
                            <span>•</span>
                            <span
                              className={`font-extrabold ${
                                res.sourceType === 'OFFICIAL'
                                  ? 'text-indigo-700'
                                  : 'text-blue-700'
                              }`}
                            >
                              {res.sourceType}
                            </span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg shrink-0 flex items-center gap-1 border border-indigo-100"
                      >
                        <span>Learn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                  No direct videos found for this skill yet. Explore the full Directory on the Resources tab.
                </div>
              )}
            </div>

            {/* STATUS UPDATER CONTROLS IN MODAL */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const stepTitle = selectedStep.title;
                  setSelectedStep(null);
                  openVoiceMode(`Why is ${stepTitle} important for my target role as ${profile.targetRole}?`);
                }}
                icon={<Mic className="w-3.5 h-3.5 text-indigo-600" />}
                className="bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100 font-bold text-xs"
              >
                Talk to Aira About This
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateStepStatus(selectedStep.id, 'In Progress');
                    setSelectedStep(null);
                  }}
                >
                  Mark In Progress
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    updateStepStatus(selectedStep.id, 'Completed');
                    setSelectedStep(null);
                  }}
                  icon={<Check className="w-3.5 h-3.5" />}
                >
                  Mark Complete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* CUSTOMIZE PACE MODAL */}
      <Modal
        isOpen={showPaceModal}
        onClose={() => setShowPaceModal(false)}
        title="Customize Study Pace & Schedule"
        maxWidth="md"
      >
        <div className="space-y-5 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Study Hours Per Day
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setHoursPerDay(hrs)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    hoursPerDay === hrs
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {hrs} {hrs === 4 ? '4+ hrs' : 'hr' + (hrs > 1 ? 's' : '')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Study Days Per Week
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[3, 4, 5, 6, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setDaysPerWeek(days)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    daysPerWeek === days
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Preferred Learning Intensity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Relaxed', 'Balanced', 'Intensive'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreferredPace(p)}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    preferredPace === p
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Adjusting pace recalculates weekly step distributions and timeline estimates.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPaceModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSavePace}>
              Apply Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
