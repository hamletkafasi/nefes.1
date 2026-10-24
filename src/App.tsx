/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, SavingsGoal, CravingLog, Badge, SlipUpRecord, ThemeMode } from './types';
import { isUserRegistered, loadProfile, saveProfile, loadGoals, saveGoals, loadCravings, saveCravings } from './utils/storage';
import { evaluateBadges } from './utils/badgeData';
import { fetchFullAppData, apiSaveProfile, apiAddSlipUp, apiDeleteSlipUp } from './services/api';
import { OnboardingModal } from './components/OnboardingModal';
import { LungSimulation } from './components/LungSimulation';
import { Dashboard } from './components/Dashboard';
import { HealthTimeline } from './components/HealthTimeline';
import { SavingsGoals } from './components/SavingsGoals';
import { CravingAssistant } from './components/CravingAssistant';
import { BadgeUnlockModal } from './components/BadgeUnlockModal';
import { SlipUpManagerModal } from './components/SlipUpManagerModal';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { Home, Activity, Flame, DollarSign, Trophy, Settings, Sun, Moon, Clock, HeartPulse } from 'lucide-react';

const SEEN_BADGES_KEY = 'nefes_seen_badge_ids';
const THEME_KEY = 'nefes_theme_mode';

export default function App() {
  // Theme state: defaults to 'light' as requested ("tema koyu olmasın, daha açık bir tema olsun")
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light'; // Default is clean, bright light theme
  });

  const isLight = theme === 'light';

  const handleToggleTheme = () => {
    const next: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  // State loaded from cache first, then synced from backend database
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [goals, setGoals] = useState<SavingsGoal[]>(loadGoals);
  const [cravings, setCravings] = useState<CravingLog[]>(loadCravings);
  const [slipUps, setSlipUps] = useState<SlipUpRecord[]>(() => {
    try {
      const raw = localStorage.getItem('nefes_slip_ups');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Database initial synchronization
  useEffect(() => {
    fetchFullAppData().then((data) => {
      if (data.profile && data.profile.completedOnboarding) {
        setProfile(data.profile);
        saveProfile(data.profile);
        setIsOnboardingOpen(false);
      }
      if (data.slipUps && data.slipUps.length > 0) {
        setSlipUps(data.slipUps);
      }
      if (data.goals && data.goals.length > 0) {
        setGoals(data.goals);
      }
    });
  }, []);

  // Active Bottom Tab: 'home' | 'lungs' | 'craving' | 'timeline' | 'goals'
  const [activeTab, setActiveTab] = useState<'home' | 'lungs' | 'craving' | 'timeline' | 'goals'>('home');
  const [timelineSubTab, setTimelineSubTab] = useState<'timeline' | 'badges'>('timeline');

  // Modals - only open onboarding if user has NEVER registered
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(
    () => !isUserRegistered() && !profile.completedOnboarding
  );
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isSlipUpModalOpen, setIsSlipUpModalOpen] = useState<boolean>(false);

  // Newly unlocked badge celebration
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);

  const [seenBadgeIds, setSeenBadgeIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SEEN_BADGES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Calculate elapsed time from lastSmokedDate (or quitDate)
  const effectiveStartDate = profile.lastSmokedDate || profile.quitDate;
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    const startMs = new Date(effectiveStartDate).getTime();
    return Math.max(0, Math.floor((Date.now() - startMs) / 1000));
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const startMs = new Date(effectiveStartDate).getTime();
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
    }, 1000);

    return () => clearInterval(timer);
  }, [effectiveStartDate]);

  // Compute dynamic badges
  const badges = evaluateBadges(profile, elapsedSeconds, cravings);

  // Check newly unlocked badges
  const initialLoadRef = useRef(true);
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const newlyUnlocked = badges.find(
      (b) => b.isUnlocked && !seenBadgeIds.includes(b.id)
    );

    if (newlyUnlocked) {
      setCelebrationBadge(newlyUnlocked);
      const updatedSeen = [...seenBadgeIds, newlyUnlocked.id];
      setSeenBadgeIds(updatedSeen);
      try {
        localStorage.setItem(SEEN_BADGES_KEY, JSON.stringify(updatedSeen));
      } catch (e) {
        console.error(e);
      }
    }
  }, [badges, seenBadgeIds]);

  // Handlers
  const handleProfileComplete = (updated: UserProfile) => {
    setProfile(updated);
    saveProfile(updated);
    apiSaveProfile(updated);
    setIsOnboardingOpen(false);
    setIsEditingProfile(false);
    setActiveTab('home');
  };

  const handleSaveSlipUp = async (slipUpData: Omit<SlipUpRecord, 'id'> & { updateLastSmoked?: boolean }) => {
    const res = await apiAddSlipUp(slipUpData);
    setSlipUps(res.slipUps);

    if (res.profile) {
      setProfile(res.profile);
      saveProfile(res.profile);
    } else if (slipUpData.updateLastSmoked) {
      const updatedProfile = {
        ...profile,
        lastSmokedDate: slipUpData.timestamp,
        ...(slipUpData.actionPlan === 'restart' ? { quitDate: slipUpData.timestamp } : {}),
      };
      setProfile(updatedProfile);
      saveProfile(updatedProfile);
      apiSaveProfile(updatedProfile);
    }
  };

  const handleDeleteSlipUp = async (id: string) => {
    const updated = await apiDeleteSlipUp(id);
    setSlipUps(updated);
  };

  const handleUpdateLastSmokedDate = (newDateStr: string) => {
    const updated: UserProfile = {
      ...profile,
      lastSmokedDate: newDateStr,
      quitDate: newDateStr,
    };
    setProfile(updated);
    saveProfile(updated);
    apiSaveProfile(updated);
  };

  const handleAddGoal = (goal: SavingsGoal) => {
    const updated = [...goals, goal];
    setGoals(updated);
    saveGoals(updated);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updated = goals.filter((g) => g.id !== goalId);
    setGoals(updated);
    saveGoals(updated);
  };

  const handleCravingOvercome = (log: CravingLog) => {
    const updated = [log, ...cravings];
    setCravings(updated);
    saveCravings(updated);
  };

  const handleOpenBadges = () => {
    setTimelineSubTab('badges');
    setActiveTab('timeline');
  };

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <MobileFrameWrapper theme={theme} onToggleTheme={handleToggleTheme}>
      {/* Mobile Top App Bar (Pattern 2) */}
      <header
        className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 backdrop-blur-md border-b transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200/90 text-slate-900 shadow-sm'
            : 'bg-slate-950/90 border-slate-800/80 text-white'
        }`}
      >
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-sm shadow-sm border border-emerald-500/20">
            🫁
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight leading-none text-slate-900 dark:text-white">
              Nefes
            </h1>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Sigarasız Yaşam
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Theme switcher button directly in mobile header */}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Tema Değiştir"
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800'
            }`}
            title={isLight ? 'Koyu Temaya Geç' : 'Açık Temaya Geç'}
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Quick Slip-Up / Last Smoked Button */}
          <button
            type="button"
            onClick={() => setIsSlipUpModalOpen(true)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isLight
                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
            }`}
            title="Kaçamak kaydet veya son sigara saatini değiştir"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Kaçamak</span>
          </button>

          {/* Settings / Profile Button */}
          <button
            type="button"
            onClick={() => setIsEditingProfile(true)}
            aria-label="Ayarlar"
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        {/* Onboarding Wizard (Only shown once for new users) */}
        <OnboardingModal
          initialProfile={profile}
          isOpen={isOnboardingOpen || isEditingProfile}
          isEditing={isEditingProfile}
          onComplete={handleProfileComplete}
          onClose={() => {
            setIsEditingProfile(false);
            setIsOnboardingOpen(false);
          }}
        />

        {/* Slip-Up & Last Smoked Manager Modal */}
        <SlipUpManagerModal
          isOpen={isSlipUpModalOpen}
          onClose={() => setIsSlipUpModalOpen(false)}
          profile={profile}
          slipUps={slipUps}
          onSaveSlipUp={handleSaveSlipUp}
          onDeleteSlipUp={handleDeleteSlipUp}
          onUpdateLastSmokedDate={handleUpdateLastSmokedDate}
          theme={theme}
        />

        {/* Celebration Modal for newly unlocked badge */}
        <BadgeUnlockModal
          badge={celebrationBadge}
          onClose={() => setCelebrationBadge(null)}
        />

        {/* TAB 1: Home Dashboard (Minimalist, Zen, Goal-Focused, Living Lung Centerpiece) */}
        {activeTab === 'home' && (
          <Dashboard
            profile={profile}
            elapsedSeconds={elapsedSeconds}
            badges={badges}
            slipUps={slipUps}
            onOpenLungSimulation={() => setActiveTab('lungs')}
            onOpenCravingAssistant={() => setActiveTab('craving')}
            onOpenTimeline={() => {
              setTimelineSubTab('timeline');
              setActiveTab('timeline');
            }}
            onOpenGoals={() => setActiveTab('goals')}
            onOpenBadges={handleOpenBadges}
            onOpenSlipUpModal={() => setIsSlipUpModalOpen(true)}
            onEditProfile={() => setIsEditingProfile(true)}
            theme={theme}
          />
        )}

        {/* TAB 2: Deep Anatomical Lung Simulation (Layers, 10-Year Explorer, Tissue Inspection) */}
        {activeTab === 'lungs' && (
          <div className="space-y-4">
            <LungSimulation
              elapsedSeconds={elapsedSeconds}
              quitDate={effectiveStartDate}
              theme={theme}
            />
          </div>
        )}

        {/* TAB 3: Craving Assistant / 4-7-8 Breathing Circle */}
        {activeTab === 'craving' && (
          <CravingAssistant
            onCravingOvercome={handleCravingOvercome}
            onBack={() => setActiveTab('home')}
          />
        )}

        {/* TAB 4: Health Milestones & Badges Gallery */}
        {activeTab === 'timeline' && (
          <HealthTimeline
            elapsedSeconds={elapsedSeconds}
            badges={badges}
            initialSubTab={timelineSubTab}
          />
        )}

        {/* TAB 5: Savings Goals & Piggy Bank */}
        {activeTab === 'goals' && (
          <SavingsGoals
            profile={profile}
            elapsedSeconds={elapsedSeconds}
            goals={goals}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}
      </main>

      {/* Fixed Bottom Tab Bar (Mobile Ergonomics) */}
      <nav
        className={`sticky bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t px-2 py-1 transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200/90 text-slate-600 shadow-md'
            : 'bg-slate-950/95 border-slate-800/80 text-slate-400'
        }`}
      >
        <div className="grid grid-cols-5 items-center h-14">
          {/* Tab 1: Panel */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-all ${
              activeTab === 'home'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Panel</span>
          </button>

          {/* Tab 2: Akciğer */}
          <button
            type="button"
            onClick={() => setActiveTab('lungs')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-all relative ${
              activeTab === 'lungs'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] mt-1 tracking-tight">Akciğer</span>
          </button>

          {/* Tab 3: Kriz Savar SOS */}
          <button
            type="button"
            onClick={() => setActiveTab('craving')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-all ${
              activeTab === 'craving'
                ? 'text-rose-600 dark:text-rose-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Flame className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Kriz Savar</span>
          </button>

          {/* Tab 4: Rozetler */}
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-all relative ${
              activeTab === 'timeline'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Rozetler</span>
            {unlockedCount > 0 && (
              <span className="absolute top-1 right-2.5 w-4 h-4 rounded-full bg-amber-500 text-white dark:text-slate-950 text-[9px] font-bold flex items-center justify-center">
                {unlockedCount}
              </span>
            )}
          </button>

          {/* Tab 5: Kumbara */}
          <button
            type="button"
            onClick={() => setActiveTab('goals')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-all ${
              activeTab === 'goals'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Kumbara</span>
          </button>
        </div>
      </nav>
    </MobileFrameWrapper>
  );
}
