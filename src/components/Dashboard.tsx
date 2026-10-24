import React from 'react';
import { Badge, SlipUpRecord, ThemeMode, UserProfile } from '../types';
import { calculateStats, getLungMetrics, HEALTH_MILESTONES } from '../utils/healthData';
import { Wind, ChevronRight, Flame, Sparkles, Clock, AlertCircle, HeartPulse, ArrowUpRight } from 'lucide-react';
import { SavingsTimeChart } from './SavingsTimeChart';

interface DashboardProps {
  profile: UserProfile;
  elapsedSeconds: number;
  badges: Badge[];
  slipUps: SlipUpRecord[];
  onOpenLungSimulation: () => void;
  onOpenCravingAssistant: () => void;
  onOpenTimeline: () => void;
  onOpenGoals: () => void;
  onOpenBadges: () => void;
  onOpenSlipUpModal: () => void;
  onEditProfile: () => void;
  theme?: ThemeMode;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  elapsedSeconds,
  badges,
  slipUps,
  onOpenLungSimulation,
  onOpenCravingAssistant,
  onOpenTimeline,
  onOpenGoals,
  onOpenBadges,
  onOpenSlipUpModal,
  onEditProfile,
  theme = 'light',
}) => {
  const isLight = theme === 'light';
  const stats = calculateStats(profile, elapsedSeconds);
  const lungMetrics = getLungMetrics(elapsedSeconds);

  // Next milestone
  const nextMilestone = HEALTH_MILESTONES.find(
    (m) => m.durationSeconds > elapsedSeconds
  ) || HEALTH_MILESTONES[HEALTH_MILESTONES.length - 1];

  const nextMilestoneProgress = Math.min(
    100,
    Math.round((elapsedSeconds / nextMilestone.durationSeconds) * 100)
  );

  const days = stats.days;
  const hours = stats.hours;
  const minutes = stats.minutes;
  const seconds = stats.seconds;

  // Next badge
  const nextBadge = badges.find((b) => !b.isUnlocked);

  // Biological breathing & color calculations
  const rec = lungMetrics.recoveryPercentage;
  const breathDurationSec = 2.8 + (rec / 100) * 1.6;
  const tarOpacity = Math.max(0, (100 - rec) / 100);
  const healthyPinkOpacity = Math.min(1, Math.max(0.2, rec / 100));

  // Format last smoked display
  const effectiveLastSmoked = profile.lastSmokedDate || profile.quitDate;
  const lastSmokedFormatted = new Date(effectiveLastSmoked).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-5 pb-6 select-none animate-in fade-in duration-500">
      {/* 1. TOP STATUS STRIP: BRAND & LAST SMOKED TIME */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 font-bold">
            <span>NEFES</span>
            <span>·</span>
            <span>{days > 0 ? `${days + 1}. GÜN` : 'İLK GÜN'}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            {profile.name ? `Merhaba, ${profile.name}` : 'Temiz Yaşam'}
          </h2>
        </div>

        {/* Last Smoked Quick Pill Button */}
        <button
          type="button"
          onClick={onOpenSlipUpModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
          title="Son içilen saati değiştir veya kaçamak kaydet"
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px] font-mono">Son: {lastSmokedFormatted}</span>
        </button>
      </div>

      {/* 2. LIVING REALISTIC BREATHING LUNG CENTERPIECE */}
      <div
        onClick={onOpenLungSimulation}
        className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border transition-all cursor-pointer group shadow-sm ${
          isLight
            ? 'bg-gradient-to-b from-white via-slate-50/50 to-emerald-50/20 border-slate-200/90 hover:border-emerald-500/40'
            : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40'
        }`}
      >
        {/* Soft Ambient Respiratory Halo */}
        <div
          className="absolute w-56 h-56 rounded-full blur-3xl pointer-events-none transition-all duration-1000 -z-10"
          style={{
            backgroundColor:
              rec > 60
                ? 'rgba(244, 114, 182, 0.15)'
                : rec > 25
                ? 'rgba(56, 189, 248, 0.12)'
                : 'rgba(239, 68, 68, 0.08)',
          }}
        />

        {/* Clean Typographic Smoke-Free Counter */}
        <div className="text-center mb-2">
          <div className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-0.5">
            Sigarasız Geçen Süre
          </div>
          <div className="flex items-baseline justify-center gap-1 text-slate-900 dark:text-slate-100 font-mono">
            {days > 0 && (
              <span className="text-3xl font-black tracking-tight">
                {days}<span className="text-xs text-slate-400 font-sans ml-0.5 mr-1 font-normal">g</span>
              </span>
            )}
            <span className="text-3xl font-black tracking-tight">
              {hours}<span className="text-xs text-slate-400 font-sans ml-0.5 mr-1 font-normal">s</span>
            </span>
            <span className="text-3xl font-black tracking-tight">
              {minutes}<span className="text-xs text-slate-400 font-sans ml-0.5 mr-1 font-normal">dk</span>
            </span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {seconds < 10 ? `0${seconds}` : seconds}<span className="text-[10px] text-emerald-500/80 font-sans ml-0.5 font-normal">sn</span>
            </span>
          </div>
        </div>

        {/* Realistic Breathing Lung SVG */}
        <div className="relative w-full max-w-[230px] aspect-[4/3] flex items-center justify-center my-1 transition-transform group-hover:scale-105 duration-300">
          <svg
            viewBox="0 0 420 340"
            className="w-full h-full drop-shadow-md select-none"
            style={{
              animation: `lungBreathing ${breathDurationSec}s ease-in-out infinite`,
              transformOrigin: '50% 45%',
            }}
          >
            <defs>
              <linearGradient id="dashPinkRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#fb7185" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#fda4af" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id="dashPinkLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#fb7185" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#fda4af" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id="dashTar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#18181b" />
              </linearGradient>
            </defs>

            {/* Trachea with cartilage */}
            <path
              d="M 197 18 L 223 18 L 221 110 L 199 110 Z"
              fill={rec > 50 ? '#0284c7' : '#64748b'}
              opacity="0.85"
            />
            {[28, 42, 56, 70, 84, 98].map((y) => (
              <path
                key={y}
                d={`M 198 ${y} Q 210 ${y + 2} 222 ${y}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                opacity="0.9"
              />
            ))}

            {/* Bronchi branches */}
            <path
              d="M 203 113 Q 170 125 145 155"
              fill="none"
              stroke={rec > 50 ? '#0284c7' : '#475569'}
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <path
              d="M 217 113 Q 250 125 275 155"
              fill="none"
              stroke={rec > 50 ? '#0284c7' : '#475569'}
              strokeWidth="5.5"
              strokeLinecap="round"
            />

            {/* Right Lung (Viewer's Left - 3 Lobes) */}
            <g>
              <path
                d="M 185 110 C 150 85, 80 100, 55 145 C 40 175, 35 230, 55 270 C 75 305, 125 310, 165 290 C 182 280, 188 250, 190 200 C 192 155, 190 120, 185 110 Z"
                fill="url(#dashPinkRight)"
                opacity={healthyPinkOpacity}
              />
              <path
                d="M 185 110 C 150 85, 80 100, 55 145 C 40 175, 35 230, 55 270 C 75 305, 125 310, 165 290 C 182 280, 188 250, 190 200 C 192 155, 190 120, 185 110 Z"
                fill="url(#dashTar)"
                opacity={tarOpacity * 0.9}
              />
              {/* Tar spots */}
              <g opacity={tarOpacity}>
                <circle cx="75" cy="165" r="14" fill="#020617" opacity="0.85" />
                <circle cx="100" cy="205" r="16" fill="#0f172a" opacity="0.8" />
                <circle cx="130" cy="255" r="15" fill="#1e293b" opacity="0.75" />
              </g>
              {/* Lobar fissure */}
              <path
                d="M 60 180 Q 120 185 185 200"
                fill="none"
                stroke={rec > 50 ? '#f43f5e' : '#334155'}
                strokeWidth="1.2"
                opacity="0.6"
              />
            </g>

            {/* Left Lung (Viewer's Right - 2 Lobes + Cardiac Notch) */}
            <g>
              <path
                d="M 235 110 C 270 85, 340 100, 365 145 C 380 175, 385 230, 365 270 C 345 305, 295 310, 255 290 C 240 280, 232 255, 230 230 C 224 190, 232 165, 228 145 C 226 125, 231 115, 235 110 Z"
                fill="url(#dashPinkLeft)"
                opacity={healthyPinkOpacity}
              />
              <path
                d="M 235 110 C 270 85, 340 100, 365 145 C 380 175, 385 230, 365 270 C 345 305, 295 310, 255 290 C 240 280, 232 255, 230 230 C 224 190, 232 165, 228 145 C 226 125, 231 115, 235 110 Z"
                fill="url(#dashTar)"
                opacity={tarOpacity * 0.9}
              />
              {/* Tar spots */}
              <g opacity={tarOpacity}>
                <circle cx="345" cy="165" r="15" fill="#020617" opacity="0.85" />
                <circle cx="320" cy="205" r="15" fill="#0f172a" opacity="0.8" />
                <circle cx="290" cy="260" r="14" fill="#1e293b" opacity="0.75" />
              </g>
              {/* Oblique fissure */}
              <path
                d="M 270 140 Q 320 190 355 240"
                fill="none"
                stroke={rec > 50 ? '#f43f5e' : '#334155'}
                strokeWidth="1.2"
                opacity="0.6"
              />
            </g>

            {/* Fresh Oxygen Streams */}
            {rec > 15 && (
              <g opacity={Math.min(1, rec / 60)}>
                <circle cx="210" cy="40" r="2.5" fill="#38bdf8" />
                <circle cx="170" cy="130" r="2.5" fill="#38bdf8" />
                <circle cx="250" cy="130" r="2.5" fill="#38bdf8" />
              </g>
            )}
          </svg>
        </div>

        {/* Caption */}
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{lungMetrics.stageName}</span>
          <span className="text-slate-400">·</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono">%{rec} İyileşme</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 3. CLEAN MONOLITHIC KPI STRIP (3 GOAL METRICS IN 1 CRISP ROW) */}
      <div
        className={`p-3.5 rounded-2xl grid grid-cols-3 divide-x text-center border shadow-sm ${
          isLight
            ? 'bg-white border-slate-200/90 divide-slate-100'
            : 'bg-slate-900 border-slate-800 divide-slate-800'
        }`}
      >
        {/* Metric 1: Savings */}
        <div onClick={onOpenGoals} className="px-2 cursor-pointer group">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">
            Tasarruf
          </span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums block mt-0.5">
            {Math.floor(stats.moneySaved).toLocaleString('tr-TR')} <span className="text-xs font-sans text-emerald-600">₺</span>
          </span>
          <span className="text-[9px] text-slate-500 font-mono">
            +{Math.round((profile.cigarettesPerDay * (profile.packPrice / (profile.cigarettesPerPack || 20))))} ₺/gün
          </span>
        </div>

        {/* Metric 2: Unsmoked */}
        <div className="px-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">
            İçilmeyen
          </span>
          <span className="text-base font-black text-slate-900 dark:text-white font-mono tabular-nums block mt-0.5">
            {Math.floor(stats.cigarettesNotSmoked).toLocaleString('tr-TR')} <span className="text-xs font-sans text-slate-400 font-normal">dal</span>
          </span>
          <span className="text-[9px] text-slate-500 font-mono">
            {stats.tarPreventedGrams}g katran
          </span>
        </div>

        {/* Metric 3: Life Regained */}
        <div className="px-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">
            Kazanılan Ömür
          </span>
          <span className="text-base font-black text-rose-500 dark:text-rose-300 font-mono tabular-nums block mt-0.5">
            {stats.lifeHoursGained > 24
              ? `+${stats.lifeDaysGained}g`
              : `+${stats.lifeHoursGained}s`}
          </span>
          <span className="text-[9px] text-slate-500 font-mono">
            SpO2 %{lungMetrics.oxygenSaturation}
          </span>
        </div>
      </div>

      {/* 4. INTERACTIVE SAVINGS & SMOKE-FREE TIME PROGRESSION CHART (RECHARTS) */}
      <SavingsTimeChart
        profile={profile}
        elapsedSeconds={elapsedSeconds}
        theme={theme}
      />

      {/* 5. GOAL TARGET CARD (NEXT PHYSIOLOGICAL MILESTONE) */}
      <div
        onClick={onOpenTimeline}
        className={`p-4 rounded-2xl border transition-all cursor-pointer group shadow-sm ${
          isLight
            ? 'bg-white border-slate-200/90 hover:border-emerald-500/40'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sıradaki Eşik:</span>
            <span className="text-emerald-700 dark:text-emerald-400">{nextMilestone.durationLabel}</span>
          </div>
          <span className="text-[11px] text-slate-400 flex items-center gap-0.5 group-hover:text-emerald-600 transition-colors">
            Tüm Takvim <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
          {nextMilestone.title} — {nextMilestone.description}
        </p>

        <div className="space-y-1 pt-2">
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full transition-all duration-500"
              style={{ width: `${nextMilestoneProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>İlerleme: %{nextMilestoneProgress}</span>
            {nextBadge && <span>Hedef Rozet: {nextBadge.title}</span>}
          </div>
        </div>
      </div>

      {/* 5. DUAL ACTION BAR: "KRIZ SAVAR" & "UFAK KAÇAMAK BİLDİR" */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {/* Craving SOS */}
        <button
          type="button"
          onClick={onOpenCravingAssistant}
          className={`py-3 px-3.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left shadow-sm active:scale-98 ${
            isLight
              ? 'bg-rose-50/70 border-rose-200/80 hover:bg-rose-100/70 text-rose-900'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div className="truncate">
            <span className="text-xs font-bold block truncate">Kriz Geldi</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">4-7-8 Nefes Al</span>
          </div>
        </button>

        {/* Flexible Slip-up button */}
        <button
          type="button"
          onClick={onOpenSlipUpModal}
          className={`py-3 px-3.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left shadow-sm active:scale-98 ${
            isLight
              ? 'bg-amber-50/70 border-amber-200/80 hover:bg-amber-100/70 text-amber-900'
              : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="text-xs font-bold block truncate">Ufak Kaçamak</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">Telafi Protokolü</span>
          </div>
        </button>
      </div>
    </div>
  );
};
