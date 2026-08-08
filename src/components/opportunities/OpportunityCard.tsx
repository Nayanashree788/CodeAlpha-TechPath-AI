import React, { useState } from 'react';
import { Opportunity, SkillMatchBreakdown } from '../../types/Opportunity';
import { StudentProfile } from '../../types';
import { OpportunityMatchService } from '../../services/opportunityMatchService';
import { SavedOpportunityService } from '../../services/savedOpportunityService';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  PlusCircle,
  Mic,
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  profile: StudentProfile;
  onOpenCompanyModal?: (companyId: string) => void;
  onTrackApplication?: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  profile,
  onOpenCompanyModal,
  onTrackApplication,
}) => {
  const { openVoiceMode, showToast } = useApp();
  const [isSaved, setIsSaved] = useState(() =>
    SavedOpportunityService.isOpportunitySaved(opportunity.id)
  );
  const [showSkillBreakdown, setShowSkillBreakdown] = useState(false);

  const matchInfo: SkillMatchBreakdown = OpportunityMatchService.calculateMatch(
    profile,
    opportunity
  );

  const handleToggleSave = () => {
    const saved = SavedOpportunityService.toggleSaveOpportunity(opportunity.id);
    setIsSaved(saved);
    showToast(saved ? 'Opportunity saved to favorites' : 'Removed from saved opportunities', 'success');
  };

  const badgeColor =
    matchInfo.matchPercentage >= 75
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : matchInfo.matchPercentage >= 55
      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <Card className="p-5 flex flex-col justify-between hover:border-indigo-300 transition-all shadow-xs group">
      <div>
        {/* TOP ROW: COMPANY & SAVE BUTTON */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onOpenCompanyModal && onOpenCompanyModal(opportunity.companyId)}
              className={`w-11 h-11 rounded-xl ${opportunity.companyLogoBg || 'bg-indigo-600'} text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs cursor-pointer hover:opacity-90 transition-opacity`}
              title="View company profile"
            >
              {opportunity.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <button
                onClick={() => onOpenCompanyModal && onOpenCompanyModal(opportunity.companyId)}
                className="font-bold text-slate-900 text-sm hover:text-indigo-600 text-left transition-colors flex items-center gap-1.5"
              >
                <span>{opportunity.company}</span>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-normal">
                  View Profile
                </span>
              </button>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {opportunity.location}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title={isSaved ? 'Saved to bookmarks' : 'Save opportunity'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        {/* ROLE TITLE & BADGES */}
        <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {opportunity.title}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-slate-500" />
            {opportunity.employmentType}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {opportunity.workMode}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {opportunity.experienceLevel}
          </span>
          {opportunity.salary && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {opportunity.salary}
            </span>
          )}
        </div>

        {/* SKILL MATCH BADGE & BREAKDOWN TOGGLE */}
        <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${badgeColor}`}>
                {matchInfo.matchPercentage}% Skill Match
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                TechPath Skill Match
              </span>
            </div>

            <button
              onClick={() => setShowSkillBreakdown(!showSkillBreakdown)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>{showSkillBreakdown ? 'Hide Skills' : 'Skill Alignment'}</span>
              {showSkillBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* EXPANDABLE SKILL BREAKDOWN */}
          {showSkillBreakdown && (
            <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2 text-xs">
              {matchInfo.existingSkills.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 block mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    You have ({matchInfo.existingSkills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {matchInfo.existingSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-medium"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {matchInfo.developingSkills.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-indigo-700 block mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
                    Strengthen ({matchInfo.developingSkills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {matchInfo.developingSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 font-medium"
                      >
                        ◐ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {matchInfo.missingSkills.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    To learn ({matchInfo.missingSkills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {matchInfo.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-300 font-medium"
                      >
                        ○ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-slate-400 italic pt-1">
                {matchInfo.disclaimerText}
              </p>
            </div>
          )}
        </div>

        {/* DESCRIPTION SUMMARY */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
          {opportunity.description}
        </p>
      </div>

      {/* FOOTER & ACTIONS */}
      <div className="pt-3 border-t border-slate-100 space-y-2.5">
        {/* SOURCE & VERIFICATION STAMP */}
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            {opportunity.sourceType === 'OFFICIAL_COMPANY'
              ? 'Official Career Source'
              : 'Curated Opportunity'}
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Verified: {opportunity.lastVerified}
          </span>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>
              {opportunity.sourceType === 'OFFICIAL_COMPANY'
                ? 'Apply on Official Site'
                : 'Visit Official Careers'}
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <button
            onClick={() => onTrackApplication && onTrackApplication(opportunity)}
            className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1"
            title="Log this application in your tracker"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Track</span>
          </button>

          <button
            onClick={() =>
              openVoiceMode(
                `Am I ready for the ${opportunity.title} role at ${opportunity.company}? Which skills should I highlight or improve?`
              )
            }
            title="Ask Aira voice mentor about readiness for this role"
            className="py-2 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors flex items-center gap-1"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Ask Aira</span>
          </button>
        </div>
      </div>
    </Card>
  );
};
