import { CravingLog, SavingsGoal, UserProfile } from '../types';
import { DEFAULT_SAVINGS_GOALS } from './healthData';

const PROFILE_KEY = 'nefes_user_profile';
const REGISTERED_KEY = 'nefes_is_registered';
const GOALS_KEY = 'nefes_savings_goals';
const CRAVINGS_KEY = 'nefes_craving_logs';

export const DEFAULT_PROFILE: UserProfile = {
  cigarettesPerDay: 20,
  cigarettesPerPack: 20,
  packPrice: 85, // Current market average in Turkey
  quitDate: new Date().toISOString(), // Defaults to current moment
  name: 'Kullanıcı',
  motivation: 'Daha sağlıklı ve özgür bir nefes için',
  completedOnboarding: false,
};

export function isUserRegistered(): boolean {
  try {
    const isReg = localStorage.getItem(REGISTERED_KEY);
    if (isReg === 'true') return true;
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Boolean(parsed.completedOnboarding);
    }
  } catch (e) {
    console.error('Failed to check registration status', e);
  }
  return false;
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    const registered = localStorage.getItem(REGISTERED_KEY) === 'true';
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        completedOnboarding: registered || Boolean(parsed.completedOnboarding),
      };
    }
    // If registered flag was set previously
    if (registered) {
      return {
        ...DEFAULT_PROFILE,
        completedOnboarding: true,
      };
    }
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile): void {
  try {
    const toSave: UserProfile = {
      ...profile,
      completedOnboarding: true, // Always persist true once saved
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(toSave));
    localStorage.setItem(REGISTERED_KEY, 'true');
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}


export function loadGoals(): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load goals', e);
  }
  return DEFAULT_SAVINGS_GOALS;
}

export function saveGoals(goals: SavingsGoal[]): void {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals', e);
  }
}

export function loadCravings(): CravingLog[] {
  try {
    const raw = localStorage.getItem(CRAVINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load craving logs', e);
  }
  return [];
}

export function saveCravings(cravings: CravingLog[]): void {
  try {
    localStorage.setItem(CRAVINGS_KEY, JSON.stringify(cravings));
  } catch (e) {
    console.error('Failed to save craving logs', e);
  }
}
