import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningResource } from '../../types';
import { SavedResourceService } from '../../services/savedResourceService';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  ExternalLink,
  Play,
  BookOpen,
  GraduationCap,
  FlaskConical,
  MapPin,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  Radio,
  FileCode,
  Mic,
} from 'lucide-react';

interface ResourceCardProps {
  resource: LearningResource;
  onStatusChange?: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onStatusChange }) => {
  const { openVoiceMode, profile } = useApp();
  const [isSaved, setIsSaved] = useState(() => SavedResourceService.isResourceSaved(resource.id));
  const [isCompleted, setIsCompleted] = useState(() => SavedResourceService.isResourceCompleted(resource.id));

  const handleToggleSave = () => {
    const updated = SavedResourceService.toggleSaveResource(resource.id);
    setIsSaved(updated);
    if (onStatusChange) onStatusChange();
  };

  const handleToggleCompleted = () => {
    const updated = SavedResourceService.toggleResourceCompleted(resource.id);
    setIsCompleted(updated);
    if (onStatusChange) onStatusChange();
  };

  // Button label and icon based on resource type
  const getActionButtonConfig = () => {
    switch (resource.type) {
      case 'Video':
        return { label: 'Watch on YouTube', icon: Play, color: 'hover:bg-rose-600 hover:text-white' };
      case 'Documentation':
        return { label: 'Open Documentation', icon: BookOpen, color: 'hover:bg-indigo-600 hover:text-white' };
      case 'Course':
        return { label: 'View Course', icon: GraduationCap, color: 'hover:bg-cyan-600 hover:text-white' };
      case 'Practice':
        return { label: 'Start Practice', icon: FlaskConical, color: 'hover:bg-emerald-600 hover:text-white' };
      case 'Roadmap':
        return { label: 'View Roadmap', icon: MapPin, color: 'hover:bg-amber-600 hover:text-white' };
      default:
        return { label: 'Open Resource', icon: ExternalLink, color: 'hover:bg-indigo-600 hover:text-white' };
    }
  };

  const actionConfig = getActionButtonConfig();
  const ActionIcon = actionConfig.icon;

  return (
    <Card hoverEffect className="flex flex-col justify-between border-slate-200 overflow-hidden h-full">
      <div>
        {/* THUMBNAIL IF AVAILABLE */}
        {resource.thumbnail ? (
          <div className="relative w-full h-36 -mt-6 -mx-6 mb-4 bg-slate-900 overflow-hidden group">
            <img
              src={resource.thumbnail}
              alt={resource.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </a>

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white">
              <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md rounded font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-300" />
                {resource.estimatedDuration}
              </span>
            </div>
          </div>
        ) : null}

        {/* HEADER BADGES */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant={
                resource.type === 'Video'
                  ? 'danger'
                  : resource.type === 'Documentation'
                  ? 'indigo'
                  : resource.type === 'Course'
                  ? 'cyan'
                  : 'success'
              }
              size="sm"
            >
              {resource.type}
            </Badge>

            {/* SOURCE PROVENANCE LABEL */}
            {resource.sourceType === 'OFFICIAL' ? (
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-[10px] font-extrabold border border-indigo-200">
                Official
              </span>
            ) : resource.sourceType === 'CURATED' ? (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-extrabold border border-blue-200">
                {resource.type === 'Video' ? 'YouTube — Curated' : 'Curated'}
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" /> Live API
              </span>
            )}
          </div>

          {/* BOOKMARK SAVE BUTTON */}
          <button
            onClick={handleToggleSave}
            title={isSaved ? 'Remove from Saved' : 'Save Resource'}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ${
              isSaved ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-indigo-100 text-indigo-600" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* TITLE & DESCRIPTION */}
        <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug line-clamp-2">
          {resource.title}
        </h3>

        <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {resource.description}
        </p>

        {/* PROVIDER & METADATA */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>
            Provider: <strong className="text-slate-800 font-semibold">{resource.provider}</strong>
          </span>
          {!resource.thumbnail && (
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
              {resource.estimatedDuration}
            </span>
          )}
        </div>

        {/* SKILL & DIFFICULTY TAGS */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="neutral" size="sm">
            Skill: {resource.skill}
          </Badge>
          <Badge variant="info" size="sm">
            {resource.difficulty}
          </Badge>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {/* MARK COMPLETED TOGGLE */}
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={handleToggleCompleted}
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
              isCompleted ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center border ${
                isCompleted
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>{isCompleted ? '✓ Resource completed' : 'Mark as completed'}</span>
          </button>

          {resource.lastChecked && (
            <span className="text-[10px] text-slate-400">Verified: {resource.lastChecked}</span>
          )}
        </div>

        {/* OPEN EXTERNAL LINK BUTTON & ASK AIRA */}
        <div className="flex items-center gap-2">
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <ActionIcon className="w-3.5 h-3.5" />
            <span className="truncate">{actionConfig.label}</span>
            <ExternalLink className="w-3 h-3 opacity-70 ml-auto shrink-0" />
          </a>

          <button
            onClick={() =>
              openVoiceMode(
                `How should I use "${resource.title}" (${resource.skill}) in my ${profile.targetRole} roadmap?`
              )
            }
            title="Ask Aira voice mentor about this resource"
            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 transition-colors shrink-0 flex items-center justify-center"
          >
            <Mic className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      </div>
    </Card>
  );
};
