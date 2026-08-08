import React from 'react';
import { Company, Opportunity } from '../../types/Opportunity';
import { StudentProfile } from '../../types';
import { OpportunityService } from '../../services/opportunityService';
import { Button } from '../ui/Button';
import {
  X,
  Building2,
  Globe,
  ExternalLink,
  MapPin,
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CompanyModalProps {
  company: Company | null;
  profile: StudentProfile;
  onClose: () => void;
  onTrackOpportunity?: (opportunity: Opportunity) => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  company,
  profile,
  onClose,
  onTrackOpportunity,
}) => {
  if (!company) return null;

  const companyOpportunities = OpportunityService.getCompanyOpportunities(company.id);

  const isRelevantToRole = company.supportedRoles.some(
    (r) =>
      r.toLowerCase().includes(profile.targetRole.toLowerCase()) ||
      profile.targetRole.toLowerCase().includes(r.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        {/* HEADER */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${company.logoBg || 'bg-indigo-600'} text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-lg`}
            >
              {company.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{company.name}</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {company.companyType}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {company.industry}
                </span>
                {company.headquarters && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {company.headquarters}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* DESCRIPTION */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About Company
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">{company.description}</p>
          </div>

          {/* OFFICIAL LINKS */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Official Career Source
              </span>
              <p className="text-xs text-slate-500">
                Explore official positions directly on {company.name}'s verified career portal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={company.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Website</span>
              </a>

              <a
                href={company.careersUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Official Careers</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* RELEVANCE TO STUDENT TARGET ROLE */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80">
            <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Why {company.name} is relevant to your target role ({profile.targetRole})
            </h4>
            <p className="text-xs text-indigo-800 leading-relaxed">
              {isRelevantToRole
                ? `${company.name} actively recruits for ${profile.targetRole} and related technology tracks. Aligning your roadmap projects with their core technology stack enhances your candidate readiness.`
                : `${company.name} recruits engineering talent across various digital departments. Your background in ${profile.branch || 'Engineering'} builds transferable technical fundamentals.`}
            </p>
          </div>

          {/* SUPPORTED ROLES */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Technology Tracks & Roles
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {company.supportedRoles.map((role) => (
                <span
                  key={role}
                  className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                >
                  <Briefcase className="w-3 h-3 text-slate-400" />
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* COMPANY OPPORTUNITIES */}
          {companyOpportunities.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Curated Opportunities for {company.name} ({companyOpportunities.length})
              </h3>
              <div className="space-y-3">
                {companyOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{opp.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{opp.employmentType}</span>
                        <span>•</span>
                        <span>{opp.location}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">Verified Source</span>
                      </div>
                    </div>

                    <a
                      href={opp.applicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-colors shrink-0"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
