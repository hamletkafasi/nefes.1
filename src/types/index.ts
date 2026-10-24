export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packPrice: number; // in Turkish Lira (TL)
  quitDate: string; // ISO string
  lastSmokedDate?: string; // ISO string - en son içilen sigara saati/tarihi
  flexibleMode?: 'forgiving' | 'strict'; // esnek telafi modu vs katı sıfırlama
  name: string;
  motivation: string;
  completedOnboarding: boolean;
}

export interface SlipUpRecord {
  id: string;
  timestamp: string; // en son kaçamak saati
  amount: number; // dal adedi (örn. 0.5, 1, 2)
  trigger: string; // Stres, Arkadaş Ortamı, Alkol/Kahve vb.
  actionPlan: 'compensation' | 'restart'; // Telafi detoksu vs Sayacı Baştan Başlatma
  notes?: string;
  detoxWaterDrunkLiters?: number;
  walkMinutesDone?: number;
  ciliaRecoveryPenaltyHours?: number;
}


export interface HealthMilestone {
  id: string;
  durationSeconds: number;
  durationLabel: string;
  title: string;
  description: string;
  benefit: string;
  organ: 'heart' | 'lungs' | 'blood' | 'brain' | 'senses' | 'cells';
  category: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
}

export interface SavingsGoal {
  id: string;
  title: string;
  cost: number;
  iconName: string;
  isCustom?: boolean;
}

export interface CravingLog {
  id: string;
  timestamp: string;
  intensity: number; // 1 to 5
  trigger: string;
  status: 'survived' | 'resisted';
  notes?: string;
}

export interface LungMetrics {
  recoveryPercentage: number; // 0 to 100
  tarExpelledGrams: number;
  oxygenSaturation: number; // e.g. 94% to 99%
  ciliaRegenerationPercent: number;
  vitalCapacityBonusPercent: number;
  carbonMonoxideReductionPercent: number;
  strokeRiskReductionPercent: number;
  cancerRiskReductionPercent: number;
  stageName: string;
  stageDescription: string;
}

export type BadgeCategory = 'time' | 'savings' | 'craving' | 'health';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'emerald';

export interface Badge {
  id: string;
  category: BadgeCategory;
  tier: BadgeTier;
  title: string;
  requirementLabel: string;
  description: string;
  benefitDescription: string;
  iconName: string;
  targetValue: number; // duration in seconds, money in TL, or count
  currentValue: number;
  isUnlocked: boolean;
  progressPercent: number; // 0 to 100
  unlockedAt?: string;
  remainingLabel?: string;
}

