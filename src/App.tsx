import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { Sidebar } from './components/navigation/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';
import { MentorPage } from './pages/MentorPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { AiraFloatingAvatar } from './components/mentor/AiraFloatingAvatar';
import { AiraVoiceMode } from './components/mentor/AiraVoiceMode';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Bot, Mic, Briefcase, Sparkles, AlertCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentPath,
    toastMessage,
    profile,
    isVoiceModeOpen,
    voiceInitialPrompt,
    openVoiceMode,
    closeVoiceMode,
  } = useApp();

  // Routes that do not render the main app chrome (Sidebar + Navbar)
  if (currentPath === '/') {
    return <LandingPage />;
  }
  if (currentPath === '/onboarding') {
    return <OnboardingPage />;
  }

  const renderInterviewPlaceholder = () => (
    <Card className="p-8 max-w-2xl mx-auto text-center space-y-4 my-12">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        <Mic className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">AI Mock Interview Prep</h2>
      <p className="text-xs text-slate-500 max-w-md mx-auto">
        Voice-driven interview simulations customized for target role <span className="font-semibold text-slate-800">{profile.targetRole}</span> will launch in future phases.
      </p>
      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 inline-block">
        Voice mentor Aira is now live! Tap the floating Aira button in the bottom corner to start a voice conversation.
      </div>
    </Card>
  );

  const renderJobsPlaceholder = () => (
    <Card className="p-8 max-w-2xl mx-auto text-center space-y-4 my-12">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        <Briefcase className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Job Opportunities Matching</h2>
      <p className="text-xs text-slate-500 max-w-md mx-auto">
        Verified entry-level job opportunities mapped to your skill profile ({profile.skills.length} skills recorded).
      </p>
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 inline-block">
        Live job API integrations will connect in future phases.
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 pt-20 px-4 md:px-8 pb-20 md:pb-8 max-w-7xl w-full mx-auto">
          {currentPath === '/dashboard' && <DashboardPage />}
          {currentPath === '/skills' && <SkillGapPage />}
          {currentPath === '/roadmap' && <RoadmapPage />}
          {currentPath.startsWith('/resources') && <ResourcesPage />}
          {currentPath === '/projects' && <ProjectsPage />}
          {currentPath === '/profile' && <ProfilePage />}
          {currentPath === '/mentor' && <MentorPage />}
          {currentPath === '/interview' && renderInterviewPlaceholder()}
          {(currentPath === '/jobs' || currentPath === '/opportunities') && <OpportunitiesPage />}
        </main>
      </div>

      {/* Floating Aira Voice Mentor Avatar */}
      <AiraFloatingAvatar onClick={() => openVoiceMode()} />

      {/* Immersive Voice Mode Modal */}
      <AiraVoiceMode
        isOpen={isVoiceModeOpen}
        onClose={closeVoiceMode}
        initialPrompt={voiceInitialPrompt}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
