import React, { useState, useEffect } from 'react';
import { ApplicationTrackerItem, ApplicationStatus } from '../../types/Opportunity';
import { SavedOpportunityService } from '../../services/savedOpportunityService';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { X, Plus, Calendar, Link as LinkIcon, Building2, Briefcase, FileText } from 'lucide-react';

interface ApplicationTrackerModalProps {
  initialData?: Partial<ApplicationTrackerItem> | null;
  onClose: () => void;
  onSaved: () => void;
}

export const ApplicationTrackerModal: React.FC<ApplicationTrackerModalProps> = ({
  initialData,
  onClose,
  onSaved,
}) => {
  const { showToast } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      if (initialData.companyName) setCompanyName(initialData.companyName);
      if (initialData.roleTitle) setRoleTitle(initialData.roleTitle);
      if (initialData.applicationUrl) setApplicationUrl(initialData.applicationUrl);
      if (initialData.appliedDate) setAppliedDate(initialData.appliedDate);
      if (initialData.status) setStatus(initialData.status);
      if (initialData.notes) setNotes(initialData.notes);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) {
      showToast('Please enter both Company Name and Role Title', 'error');
      return;
    }

    if (initialData?.id) {
      SavedOpportunityService.updateApplication({
        id: initialData.id,
        companyName: companyName.trim(),
        roleTitle: roleTitle.trim(),
        applicationUrl: applicationUrl.trim() || 'https://careers.google.com',
        appliedDate,
        status,
        notes: notes.trim(),
      });
      showToast('Application updated', 'success');
    } else {
      SavedOpportunityService.addApplication({
        companyName: companyName.trim(),
        roleTitle: roleTitle.trim(),
        applicationUrl: applicationUrl.trim() || 'https://careers.google.com',
        appliedDate,
        status,
        notes: notes.trim(),
      });
      showToast('Application logged in tracker', 'success');
    }

    onSaved();
    onClose();
  };

  const statusOptions: ApplicationStatus[] = [
    'Interested',
    'Applied',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected',
    'Withdrawn',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {initialData?.id ? 'Edit Application Record' : 'Log Application'}
              </h3>
              <p className="text-[11px] text-slate-400">Track your application pipeline manually</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Company Name *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Microsoft, TCS, Google"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Role Title *
            </label>
            <input
              type="text"
              required
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Software Engineering Intern, SDE 1"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs font-medium bg-white"
              >
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              Official Portal or Application Link
            </label>
            <input
              type="url"
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              placeholder="https://careers.company.com/job/123"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notes / Reminders
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Applied via campus referral. Assessment link expected in 1 week."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs font-medium"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {initialData?.id ? 'Update Record' : 'Save Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
