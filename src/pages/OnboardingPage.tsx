import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AcademicYear,
  EngineeringBranch,
  StudentSkill,
  SkillProficiency,
  LearningFormat,
  PreferredLanguage,
  CareerPriority,
} from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Code2,
  Briefcase,
  BookOpen,
  Target,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { profile, updateProfile, navigate } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [academicYear, setAcademicYear] = useState<AcademicYear>(profile.academicYear || '3rd Year');
  const [branch, setBranch] = useState<EngineeringBranch>(profile.branch || 'Computer Science');
  const [graduationYear, setGraduationYear] = useState<number>(profile.graduationYear || 2026);

  const [selectedSkills, setSelectedSkills] = useState<StudentSkill[]>(profile.skills || []);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Full Stack Developer');
  const [isNotSureRole, setIsNotSureRole] = useState(false);

  const [learningFormats, setLearningFormats] = useState<LearningFormat[]>(
    profile.learningPreferences?.formats || ['Hands-on projects', 'Video']
  );
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    profile.learningPreferences?.difficulty || 'Intermediate'
  );
  const [language, setLanguage] = useState<PreferredLanguage>(
    profile.learningPreferences?.language || 'English'
  );

  const [careerPriorities, setCareerPriorities] = useState<CareerPriority[]>(
    profile.careerPriorities || ['Placement preparation', 'Internship']
  );

  // Skill Preset Categories
  const skillCategories = [
    {
      category: 'Programming' as const,
      skills: ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript'],
    },
    {
      category: 'Frontend' as const,
      skills: ['HTML', 'CSS', 'React', 'Next.js'],
    },
    {
      category: 'Backend' as const,
      skills: ['Node.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot'],
    },
    {
      category: 'Database' as const,
      skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'],
    },
    {
      category: 'AI/Data' as const,
      skills: ['Machine Learning', 'Deep Learning', 'Generative AI', 'Data Analysis'],
    },
    {
      category: 'Tools' as const,
      skills: ['Git', 'GitHub', 'Docker', 'Linux'],
    },
    {
      category: 'Cloud' as const,
      skills: ['AWS', 'Azure', 'Google Cloud'],
    },
  ];

  // Role Categories
  const roleCategories = [
    {
      group: 'Software Development',
      roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Python Developer', 'Java Developer'],
    },
    {
      group: 'AI & Data',
      roles: ['AI Engineer', 'Machine Learning Engineer', 'Data Scientist', 'Data Analyst'],
    },
    {
      group: 'Cloud & Infrastructure',
      roles: ['Cloud Engineer', 'DevOps Engineer'],
    },
    {
      group: 'Cybersecurity',
      roles: ['Cybersecurity Analyst', 'Security Engineer'],
    },
  ];

  const toggleSkill = (skillName: string, category: StudentSkill['category']) => {
    const existing = selectedSkills.find((s) => s.name === skillName);
    if (existing) {
      setSelectedSkills(selectedSkills.filter((s) => s.name !== skillName));
    } else {
      setSelectedSkills([
        ...selectedSkills,
        { name: skillName, category, proficiency: 'Intermediate' },
      ]);
    }
  };

  const updateSkillProficiency = (skillName: string, level: SkillProficiency) => {
    setSelectedSkills(
      selectedSkills.map((s) => (s.name === skillName ? { ...s, proficiency: level } : s))
    );
  };

  const addCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const name = customSkillInput.trim();
    if (!selectedSkills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setSelectedSkills([
        ...selectedSkills,
        { name, category: 'Other', proficiency: 'Beginner', isCustom: true },
      ]);
    }
    setCustomSkillInput('');
  };

  const togglePriority = (p: CareerPriority) => {
    if (careerPriorities.includes(p)) {
      setCareerPriorities(careerPriorities.filter((item) => item !== p));
    } else {
      setCareerPriorities([...careerPriorities, p]);
    }
  };

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNextStep = () => {
    setValidationError(null);
    if (step === 1) {
      if (!firstName.trim()) {
        setValidationError('Please enter your first name before continuing.');
        return;
      }
      if (!graduationYear || graduationYear < 2020 || graduationYear > 2035) {
        setValidationError('Please enter a valid graduation year (e.g., 2026).');
        return;
      }
    } else if (step === 2) {
      if (selectedSkills.length === 0) {
        setValidationError('Please select or add at least 1 current skill to evaluate your baseline.');
        return;
      }
    } else if (step === 3) {
      if (!isNotSureRole && !targetRole.trim()) {
        setValidationError('Please select a target role or choose "Not sure yet?".');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleFinishOnboarding = async () => {
    setValidationError(null);
    if (selectedSkills.length === 0) {
      setValidationError('Please select at least 1 skill before completing profile setup.');
      setStep(2);
      return;
    }

    const updated = {
      ...profile,
      name: `${firstName.trim()} ${profile.lastName || ''}`.trim(),
      firstName: firstName.trim() || 'Engineering Student',
      academicYear,
      branch,
      graduationYear,
      skills: selectedSkills,
      currentSkills: selectedSkills,
      targetRole: isNotSureRole ? 'Role Exploration' : targetRole,
      learningPreferences: {
        formats: learningFormats,
        difficulty,
        language,
      },
      careerPriorities,
      updatedAt: new Date().toISOString(),
    };

    await updateProfile(updated);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto w-full">
        {/* Onboarding Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">TechPath AI</span>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            Step {step} of 6
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* STEP 1: ABOUT YOU */}
        {step === 1 && (
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">About You</h2>
                <p className="text-xs text-slate-500">Let's set up your engineering student profile.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Arjun"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Academic Year</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Graduate'] as AcademicYear[]).map(
                    (yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setAcademicYear(yr)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                          academicYear === yr
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {yr}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Engineering Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as EngineeringBranch)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Science">Information Science</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Other">Other Branch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Graduation Year</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </Card>
        )}

        {/* STEP 2: CURRENT SKILLS */}
        {step === 2 && (
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Current Skills</h2>
                <p className="text-xs text-slate-500">Select skills you have already studied or practiced.</p>
              </div>
            </div>

            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
              {skillCategories.map((cat) => (
                <div key={cat.category}>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    {cat.category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((s) => {
                      const isSelected = selectedSkills.some((item) => item.name === s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s, cat.category)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {s} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Custom Skill Input */}
              <div className="pt-3 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Add Custom Skill</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                    placeholder="e.g. GraphQL, Tailwind, PyTorch"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button type="button" size="sm" onClick={addCustomSkill} icon={<Plus className="w-4 h-4" />}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Selected Skills Proficiency Adjustment */}
              {selectedSkills.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-3">
                    Selected Skills & Proficiency Levels
                  </span>
                  <div className="space-y-2">
                    {selectedSkills.map((sk) => (
                      <div
                        key={sk.name}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <span className="font-semibold text-slate-800">{sk.name}</span>
                        <div className="flex gap-1">
                          {(['Beginner', 'Intermediate', 'Advanced'] as SkillProficiency[]).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => updateSkillProficiency(sk.name, lvl)}
                              className={`px-2 py-1 rounded text-[11px] font-medium border transition-all ${
                                sk.proficiency === lvl
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white text-slate-600 border-slate-200'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* STEP 3: CAREER GOAL */}
        {step === 3 && (
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Career Goal</h2>
                <p className="text-xs text-slate-500">What engineering role are you working toward?</p>
              </div>
            </div>

            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-950 block">Not sure yet?</span>
                  <span className="text-[11px] text-indigo-700">Future AI guidance will help you explore matching roles.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsNotSureRole(!isNotSureRole);
                    if (!isNotSureRole) setTargetRole('Role Exploration');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    isNotSureRole
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-indigo-700 border-indigo-200'
                  }`}
                >
                  {isNotSureRole ? 'Selected ✓' : 'Select'}
                </button>
              </div>

              {!isNotSureRole &&
                roleCategories.map((cat) => (
                  <div key={cat.group}>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      {cat.group}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cat.roles.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setTargetRole(r)}
                          className={`p-3 rounded-xl text-left border text-xs font-semibold transition-all ${
                            targetRole === r
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* STEP 4: LEARNING PREFERENCES */}
        {step === 4 && (
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Learning Preferences</h2>
                <p className="text-xs text-slate-500">How do you learn best?</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Preferred Learning Formats
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Video', 'Courses', 'Documentation', 'Hands-on projects', 'Mixed'] as LearningFormat[]).map(
                    (fmt) => {
                      const selected = learningFormats.includes(fmt);
                      return (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => {
                            if (selected) {
                              setLearningFormats(learningFormats.filter((f) => f !== fmt));
                            } else {
                              setLearningFormats([...learningFormats, fmt]);
                            }
                          }}
                          className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
                            selected
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {fmt}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Preferred Learning Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        difficulty === d
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Preferred Language
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['English', 'Kannada', 'Hindi', 'Other'] as PreferredLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                        language === lang
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* STEP 5: CAREER PRIORITIES */}
        {step === 5 && (
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Career Priorities</h2>
                <p className="text-xs text-slate-500">Select what matters most for your immediate goals.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  'Placement preparation',
                  'Internship',
                  'First job',
                  'Skill building',
                  'Portfolio',
                  'Higher studies',
                  'Career exploration',
                ] as CareerPriority[]
              ).map((p) => {
                const selected = careerPriorities.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePriority(p)}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-semibold">{p}</span>
                    {selected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* STEP 6: REVIEW */}
        {step === 6 && (
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Review Your Profile</h2>
                <p className="text-xs text-slate-500">Confirm your setup before generating your TechPath dashboard.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase block mb-1">Student Info</span>
                <p className="text-slate-800 font-semibold">{firstName} ({academicYear}, {branch})</p>
                <p className="text-slate-500">Expected Graduation: {graduationYear}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase block mb-1">Target Career Role</span>
                <span className="text-sm font-bold text-indigo-700">{targetRole}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase block mb-1">Current Skills ({selectedSkills.length})</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedSkills.map((s) => (
                    <Badge key={s.name} variant="info">
                      {s.name} ({s.proficiency})
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase block mb-1">Preferences & Priorities</span>
                <p className="text-slate-700">Formats: {learningFormats.join(', ')}</p>
                <p className="text-slate-700">Difficulty: {difficulty} | Language: {language}</p>
                <p className="text-slate-700">Priorities: {careerPriorities.join(', ')}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center justify-between">
            <span>{validationError}</span>
            <button onClick={() => setValidationError(null)} className="text-red-500 hover:text-red-800 font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => {
                setValidationError(null);
                setStep(step - 1);
              }}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <Button
              variant="primary"
              onClick={handleNextStep}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleFinishOnboarding}
              icon={<Sparkles className="w-4 h-4" />}
              iconPosition="right"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Create My TechPath
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
