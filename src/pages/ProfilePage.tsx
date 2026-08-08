import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AcademicYear,
  EngineeringBranch,
  SkillProficiency,
  StudentSkill,
} from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CAREER_ROLES_DATABASE } from '../data/roles';
import { CENTRAL_SKILL_DATABASE } from '../data/skills';
import {
  User,
  GraduationCap,
  Target,
  Code2,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  Briefcase,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, resetToDefaults, showToast } = useApp();

  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [lastName, setLastName] = useState(profile.lastName || '');
  const [academicYear, setAcademicYear] = useState<AcademicYear>(profile.academicYear || '3rd Year');
  const [branch, setBranch] = useState<EngineeringBranch>(profile.branch || 'Computer Science');
  const [graduationYear, setGraduationYear] = useState<number>(profile.graduationYear || 2026);

  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Full Stack Developer');
  const [skills, setSkills] = useState<StudentSkill[]>(profile.skills || profile.currentSkills || []);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<string>('Programming');
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillProficiency>('Intermediate');

  const [saving, setSaving] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const name = newSkillName.trim();
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      showToast('Skill already exists in your profile!');
      return;
    }

    const updated = [
      ...skills,
      {
        name,
        category: newSkillCategory,
        proficiency: newSkillProficiency,
        level: newSkillProficiency,
        isCustom: true,
      },
    ];
    setSkills(updated);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };

  const handleUpdateProficiency = (skillName: string, level: SkillProficiency) => {
    setSkills(
      skills.map((s) => (s.name === skillName ? { ...s, proficiency: level, level } : s))
    );
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        ...profile,
        firstName: firstName.trim() || 'Student',
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        academicYear,
        branch,
        graduationYear,
        targetRole,
        skills,
        currentSkills: skills,
        updatedAt: new Date().toISOString(),
      });
      showToast('Career profile updated successfully!');
    } catch (e) {
      showToast('Failed to save profile updates.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Career Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your academic details, target career role, and baseline technical skill matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Profile
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveProfile}
            disabled={saving}
            icon={<Save className="w-3.5 h-3.5" />}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: PERSONAL & ACADEMIC INFO */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Personal Details</h3>
                <p className="text-[11px] text-slate-500">Student information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Engineering Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as EngineeringBranch)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Science">Information Science</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Graduation Year</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(parseInt(e.target.value) || 2026)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </Card>

          {/* TARGET ROLE CARD */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Target Career Role</h3>
                <p className="text-[11px] text-slate-500">Guides skill gap calculations</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Select Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CAREER_ROLES_DATABASE.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name} ({role.category})
                  </option>
                ))}
              </select>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mt-2">
                <span className="font-bold text-slate-800 block mb-1">Selected Goal:</span>
                {targetRole}
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: SKILLS MATRIX MANAGEMENT */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Current Technical Skills ({skills.length})</h3>
                  <p className="text-[11px] text-slate-500">
                    Your self-assessed proficiency levels
                  </p>
                </div>
              </div>
            </div>

            {/* ADD NEW SKILL INLINE FORM */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
              <span className="text-xs font-bold text-slate-800 block mb-2">Add New Skill</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="e.g. React, Docker, Python"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as SkillProficiency)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddSkill}
                  icon={<Plus className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  Add Skill
                </Button>
              </div>
            </div>

            {/* RECORDED SKILLS LIST */}
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                    <span className="text-[10px] text-slate-400 block">{skill.category}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {(['Beginner', 'Intermediate', 'Advanced'] as SkillProficiency[]).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleUpdateProficiency(skill.name, lvl)}
                          className={`px-2 py-1 text-[10px] font-semibold rounded-lg border transition-all ${
                            (skill.proficiency || skill.level) === lvl
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
