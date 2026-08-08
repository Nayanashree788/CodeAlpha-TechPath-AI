import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OpportunityService } from '../services/opportunityService';
import { OpportunityMatchService } from '../services/opportunityMatchService';
import { SavedOpportunityService } from '../services/savedOpportunityService';
import { Opportunity, Company, ApplicationTrackerItem, OpportunityFilter } from '../types/Opportunity';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { CompanyModal } from '../components/opportunities/CompanyModal';
import { ApplicationTrackerModal } from '../components/opportunities/ApplicationTrackerModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Briefcase,
  Search,
  Building2,
  Bookmark,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Info,
  Mic,
  MapPin,
  Calendar,
} from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { profile, navigate, openVoiceMode, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'opportunities' | 'companies' | 'saved' | 'tracker'>(
    'opportunities'
  );

  // Filters state
  const [filters, setFilters] = useState<OpportunityFilter>({
    role: 'All',
    company: 'All',
    location: 'All',
    workMode: 'All',
    employmentType: 'All',
    experienceLevel: 'All',
    minMatch: 0,
    searchQuery: '',
  });

  const [companySearchQuery, setCompanySearchQuery] = useState('');

  // Modals state
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [trackerModalData, setTrackerModalData] = useState<Partial<ApplicationTrackerItem> | null>(
    null
  );

  // Application tracker state refresh key
  const [trackerRefreshKey, setTrackerRefreshKey] = useState(0);

  // Calculate readiness summary
  const readinessInfo = OpportunityMatchService.getReadinessSummary(profile);

  // Filtered Opportunities
  const filteredOpportunities = OpportunityService.filterOpportunities(filters, profile);

  // Company list
  const filteredCompanies = OpportunityService.searchCompanies(companySearchQuery);

  // Saved Opportunities
  const savedIds = SavedOpportunityService.getSavedOpportunityIds();
  const savedOpportunities = OpportunityService.getOpportunities().filter((o) =>
    savedIds.includes(o.id)
  );

  // Applications
  const applications = SavedOpportunityService.getApplications();

  const handleOpenCompany = (companyId: string) => {
    const comp = OpportunityService.getCompanyById(companyId);
    if (comp) {
      setSelectedCompany(comp);
    }
  };

  const handleTrackOpportunity = (opp: Opportunity) => {
    setTrackerModalData({
      companyName: opp.company,
      roleTitle: opp.title,
      applicationUrl: opp.applicationUrl,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
    });
    setTrackerModalOpen(true);
  };

  const handleDeleteApplication = (id: string) => {
    SavedOpportunityService.deleteApplication(id);
    setTrackerRefreshKey((k) => k + 1);
    showToast('Application deleted', 'info');
  };

  const locations = [
    'All',
    'India',
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Mumbai',
    'Delhi NCR',
    'Remote',
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* HEADER SECTION */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-cyan-300 border border-indigo-400/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Verified Company Sources Only
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                openVoiceMode(
                  `Which career opportunities align best with my target role as ${profile.targetRole}?`
                )
              }
              icon={<Mic className="w-3.5 h-3.5 text-amber-300" />}
              className="border-indigo-400/40 bg-indigo-900/50 text-white hover:bg-indigo-800/80 text-xs font-bold"
            >
              Ask Aira About Opportunities
            </Button>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Turn your skills into opportunities.
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Discover career paths and verified company opportunities aligned with your goals. Direct links to official company portals without third-party noise.
            </p>
          </div>

          {/* READINESS SUMMARY BAR */}
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Role</span>
              <span className="text-sm font-bold text-white block mt-0.5">{profile.targetRole}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Readiness</span>
              <span className="text-sm font-bold text-cyan-300 block mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                {readinessInfo.levelText}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Roles to Target</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {readinessInfo.targetRoleRoles.slice(0, 2).map((r) => (
                  <span
                    key={r}
                    className="text-[10px] bg-indigo-950/80 text-indigo-200 px-2 py-0.5 rounded border border-indigo-800/80 font-medium"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TRANSPARENCY DISCLAIMER BANNER */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="leading-snug">
          <strong className="font-bold">Trust & Transparency:</strong> TechPath helps you discover and prepare for opportunities. Final eligibility, openings, and hiring decisions are determined solely by the respective employer.
        </p>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'opportunities'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Recommended Opportunities ({filteredOpportunities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'companies'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Verified Company Directory ({filteredCompanies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Opportunities ({savedOpportunities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tracker'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Application Tracker ({applications.length})</span>
        </button>
      </div>

      {/* TAB 1: RECOMMENDED OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* SEARCH & FILTERS BAR */}
          <Card className="p-4 bg-white space-y-3 border-slate-200">
            <div className="flex flex-wrap items-center gap-3">
              {/* SEARCH INPUT */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search role, skills, or company (e.g. Frontend, React, Microsoft)..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* LOCATION FILTER */}
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white"
              >
                <option value="All">All Locations</option>
                {locations.filter((l) => l !== 'All').map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              {/* WORK MODE FILTER */}
              <select
                value={filters.workMode}
                onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white"
              >
                <option value="All">All Work Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              {/* EMPLOYMENT TYPE */}
              <select
                value={filters.employmentType}
                onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white"
              >
                <option value="All">All Types</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>
          </Card>

          {/* LIST OF OPPORTUNITY CARDS */}
          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  profile={profile}
                  onOpenCompanyModal={handleOpenCompany}
                  onTrackApplication={handleTrackOpportunity}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-slate-50 border-dashed border-slate-300">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No opportunities match your search filters</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try clearing search filters or browse the verified company directory directly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({
                    role: 'All',
                    company: 'All',
                    location: 'All',
                    workMode: 'All',
                    employmentType: 'All',
                    experienceLevel: 'All',
                    minMatch: 0,
                    searchQuery: '',
                  })
                }
              >
                Reset All Filters
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: VERIFIED COMPANY DIRECTORY */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <Card className="p-4 bg-white border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search verified companies by name, industry, or role (e.g. Microsoft, Google, TCS)..."
                value={companySearchQuery}
                onChange={(e) => setCompanySearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((comp) => (
              <Card key={comp.id} className="p-5 flex flex-col justify-between hover:border-indigo-300 transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl ${comp.logoBg || 'bg-indigo-600'} text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      {comp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{comp.name}</h3>
                      <span className="text-[10px] font-semibold text-slate-500 block">{comp.industry}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {comp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenCompany(comp.id)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    View Directory Profile
                  </button>

                  <a
                    href={comp.careersUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Careers Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SAVED OPPORTUNITIES */}
      {activeTab === 'saved' && (
        <div>
          {savedOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  profile={profile}
                  onOpenCompanyModal={handleOpenCompany}
                  onTrackApplication={handleTrackOpportunity}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-slate-50 border-dashed border-slate-300">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No saved opportunities yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Click the bookmark icon on any opportunity card to save it here for quick access.
              </p>
              <Button onClick={() => setActiveTab('opportunities')}>Browse Opportunities</Button>
            </Card>
          )}
        </div>
      )}

      {/* TAB 4: APPLICATION TRACKER */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Application Tracker</h3>
              <p className="text-xs text-slate-500">
                Log and track your job & internship applications manually.
              </p>
            </div>

            <Button
              onClick={() => {
                setTrackerModalData(null);
                setTrackerModalOpen(true);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Log New Application
            </Button>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((appItem) => {
                const statusColors: Record<string, string> = {
                  Interested: 'bg-slate-100 text-slate-700 border-slate-200',
                  Applied: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  Assessment: 'bg-cyan-50 text-cyan-800 border-cyan-200',
                  Interview: 'bg-amber-50 text-amber-800 border-amber-200',
                  Offer: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
                  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
                  Withdrawn: 'bg-slate-100 text-slate-500 border-slate-200',
                };

                return (
                  <Card key={appItem.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{appItem.roleTitle}</span>
                        <span className="text-xs text-slate-500">at</span>
                        <span className="font-semibold text-indigo-700 text-sm">{appItem.companyName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[appItem.status] || 'bg-slate-100'}`}>
                          {appItem.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Applied: {appItem.appliedDate}
                        </span>
                        {appItem.notes && <span className="text-slate-600 italic">"{appItem.notes}"</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {appItem.applicationUrl && (
                        <a
                          href={appItem.applicationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                          title="Open official link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => {
                          setTrackerModalData(appItem);
                          setTrackerModalOpen(true);
                        }}
                        className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                        title="Edit record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteApplication(appItem.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center bg-slate-50 border-dashed border-slate-300">
              <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No applications logged yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Keep track of your job applications, interview schedules, and offers in one place.
              </p>
              <Button
                onClick={() => {
                  setTrackerModalData(null);
                  setTrackerModalOpen(true);
                }}
              >
                Log Your First Application
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* MODALS */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          profile={profile}
          onClose={() => setSelectedCompany(null)}
          onTrackOpportunity={handleTrackOpportunity}
        />
      )}

      {trackerModalOpen && (
        <ApplicationTrackerModal
          initialData={trackerModalData}
          onClose={() => setTrackerModalOpen(false)}
          onSaved={() => setTrackerRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};
