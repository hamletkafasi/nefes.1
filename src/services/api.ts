import { CravingLog, SavingsGoal, SlipUpRecord, UserProfile } from '../types';
import { DEFAULT_PROFILE } from '../utils/storage';

export async function fetchFullAppData(): Promise<{
  profile: UserProfile;
  slipUps: SlipUpRecord[];
  cravings: CravingLog[];
  goals: SavingsGoal[];
}> {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      return {
        profile: data.profile || DEFAULT_PROFILE,
        slipUps: data.slipUps || [],
        cravings: data.cravings || [],
        goals: data.goals || [],
      };
    }
  } catch (err) {
    console.warn('API fetch failed, falling back to local cache:', err);
  }

  // Fallback to local storage if API is not yet reachable
  const rawProfile = localStorage.getItem('nefes_user_profile');
  const rawSlipUps = localStorage.getItem('nefes_slip_ups');
  const rawCravings = localStorage.getItem('nefes_craving_logs');
  const rawGoals = localStorage.getItem('nefes_savings_goals');

  return {
    profile: rawProfile ? JSON.parse(rawProfile) : DEFAULT_PROFILE,
    slipUps: rawSlipUps ? JSON.parse(rawSlipUps) : [],
    cravings: rawCravings ? JSON.parse(rawCravings) : [],
    goals: rawGoals ? JSON.parse(rawGoals) : [],
  };
}

export async function apiSaveProfile(profile: UserProfile): Promise<void> {
  // Save locally first for instant feedback
  localStorage.setItem('nefes_user_profile', JSON.stringify(profile));
  localStorage.setItem('nefes_is_registered', 'true');

  try {
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
  } catch (err) {
    console.warn('Backend sync failed, saved locally:', err);
  }
}

export async function apiAddSlipUp(slipUp: Omit<SlipUpRecord, 'id'> & { updateLastSmoked?: boolean }): Promise<{
  slipUps: SlipUpRecord[];
  profile?: UserProfile;
}> {
  const newRecord: SlipUpRecord = {
    id: Date.now().toString(),
    ...slipUp,
  };

  // Local sync
  const existingRaw = localStorage.getItem('nefes_slip_ups');
  const existing: SlipUpRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
  const updatedSlipUps = [newRecord, ...existing];
  localStorage.setItem('nefes_slip_ups', JSON.stringify(updatedSlipUps));

  try {
    const res = await fetch('/api/slip-ups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slipUp),
    });
    if (res.ok) {
      const data = await res.json();
      return { slipUps: data.slipUps, profile: data.profile };
    }
  } catch (err) {
    console.warn('API slip-up sync error, saved locally:', err);
  }

  return { slipUps: updatedSlipUps };
}

export async function apiDeleteSlipUp(id: string): Promise<SlipUpRecord[]> {
  const existingRaw = localStorage.getItem('nefes_slip_ups');
  const existing: SlipUpRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
  const updatedSlipUps = existing.filter((s) => s.id !== id);
  localStorage.setItem('nefes_slip_ups', JSON.stringify(updatedSlipUps));

  try {
    const res = await fetch(`/api/slip-ups/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const data = await res.json();
      return data.slipUps;
    }
  } catch (err) {
    console.warn('API delete slip-up error, removed locally:', err);
  }

  return updatedSlipUps;
}
