import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CRAVING_TIPS } from '../utils/healthData';
import { CravingLog } from '../types';
import { Wind, Flame, CheckCircle, ShieldCheck, Timer, Sparkles, Volume2, ArrowLeft } from 'lucide-react';

interface CravingAssistantProps {
  onCravingOvercome: (log: CravingLog) => void;
  onBack: () => void;
}

export const CravingAssistant: React.FC<CravingAssistantProps> = ({
  onCravingOvercome,
  onBack,
}) => {
  // 4-7-8 Breathing state
  // Phases: inhale (4s), hold (7s), exhale (8s)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCountdown, setBreathCountdown] = useState<number>(4);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(true);

  // 3-Minute Craving Timer (180 seconds)
  const [cravingTimerSeconds, setCravingTimerSeconds] = useState<number>(180);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [activeTipIndex, setActiveTipIndex] = useState<number>(0);

  // 4-7-8 Breathing cycle timer
  useEffect(() => {
    if (!isBreathingActive) return;

    const interval = setInterval(() => {
      setBreathCountdown((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return 7;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return 8;
          } else {
            setBreathPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathPhase, isBreathingActive]);

  // 3-Minute Craving countdown
  useEffect(() => {
    if (cravingTimerSeconds <= 0) return;

    const timer = setInterval(() => {
      setCravingTimerSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cravingTimerSeconds]);

  const handleOvercomeCraving = () => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const newLog: CravingLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      intensity: 4,
      trigger: 'Ani Nikotin Dürtüsü',
      status: 'survived',
    };

    setHasCompleted(true);
    onCravingOvercome(newLog);
  };

  const minutesRemaining = Math.floor(cravingTimerSeconds / 60);
  const secondsRemaining = cravingTimerSeconds % 60;

  return (
    <div className="space-y-6 pb-6 animate-in fade-in">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>
        <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" />
          SOS Kriz Savar
        </span>
      </div>

      {/* Hero Affirmation Banner */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-white tracking-tight">
          Bu Kriz En Fazla 3 Dakika Sürecek!
        </h2>
        <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
          Beyninin ödül mekanizması seni test ediyor. Şu an derin nefes alarak dopamin dalgasını sakinleştireceksin.
        </p>
      </div>

      {/* 3-Minute Urge Countdown Meter */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Krizin Sönümlenmesine Kalan Süre:</span>
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              {minutesRemaining}:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-emerald-400 font-semibold block">
            {cravingTimerSeconds > 120
              ? 'Tepe noktası başlıyor...'
              : cravingTimerSeconds > 60
              ? 'Dürtü zayıflıyor...'
              : 'Neredeyse bitti!'}
          </span>
        </div>
      </div>

      {/* GUIDED 4-7-8 BREATHING CIRCLE */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
        {/* Dynamic Breathing Circle */}
        <div className="relative w-56 h-56 flex items-center justify-center my-4">
          {/* Animated Background Ripple Ring */}
          <div
            className="absolute rounded-full border border-emerald-500/30 transition-all duration-1000 ease-in-out pointer-events-none"
            style={{
              width: breathPhase === 'inhale' ? '220px' : breathPhase === 'hold' ? '220px' : '120px',
              height: breathPhase === 'inhale' ? '220px' : breathPhase === 'hold' ? '220px' : '120px',
              backgroundColor:
                breathPhase === 'inhale'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : breathPhase === 'hold'
                  ? 'rgba(56, 189, 248, 0.18)'
                  : 'rgba(244, 63, 94, 0.1)',
            }}
          />

          {/* Central Core Circle */}
          <div
            className="w-36 h-36 rounded-full flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-1000 ease-in-out border"
            style={{
              transform:
                breathPhase === 'inhale'
                  ? 'scale(1.15)'
                  : breathPhase === 'hold'
                  ? 'scale(1.15)'
                  : 'scale(0.9)',
              backgroundColor:
                breathPhase === 'inhale'
                  ? '#064e3b'
                  : breathPhase === 'hold'
                  ? '#0c4a6e'
                  : '#1e293b',
              borderColor:
                breathPhase === 'inhale'
                  ? '#10b981'
                  : breathPhase === 'hold'
                  ? '#38bdf8'
                  : '#64748b',
            }}
          >
            <Wind className="w-6 h-6 text-emerald-300 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {breathPhase === 'inhale' && 'Nefes Al'}
              {breathPhase === 'hold' && 'Nefesi Tut'}
              {breathPhase === 'exhale' && 'Yavaşça Ver'}
            </span>
            <span className="text-3xl font-black font-mono tabular-nums text-white mt-0.5">
              {breathCountdown}
            </span>
          </div>
        </div>

        {/* Phase Guidance Instruction */}
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-100">
            {breathPhase === 'inhale' && 'Burnundan sakin ve derin bir nefes çek (4 sn)'}
            {breathPhase === 'hold' && 'Nefesini ciğerlerinde tut ve sakinleş (7 sn)'}
            {breathPhase === 'exhale' && 'Dudaklarını büzerek havayı yavaşça bırak (8 sn)'}
          </p>
          <span className="text-xs text-slate-400 block">
            4-7-8 tekniği parasempatik sinir sistemini uyararak kalp ritmini yavaşlatır.
          </span>
        </div>
      </div>

      {/* SCIENTIFIC QUICK RELIEF TIPS */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Krizi Dağıtacak Hızlı Hamleler:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CRAVING_TIPS.map((tip, idx) => (
            <div
              key={tip.title}
              onClick={() => setActiveTipIndex(idx)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                activeTipIndex === idx
                  ? 'bg-slate-800 border-emerald-500/50 shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <h4 className="text-xs font-bold text-slate-100 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {tip.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* OVERCOME ACTION BUTTON */}
      <div className="pt-2">
        {!hasCompleted ? (
          <button
            type="button"
            onClick={handleOvercomeCraving}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <CheckCircle className="w-5 h-5 text-slate-950" />
            <span>Krizi Başarıyla Atlattım! 🏆</span>
          </button>
        ) : (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-base">Harika Bir Zafer Kazandın!</h4>
            <p className="text-xs text-emerald-200">
              Bu krizle savaşmak yerine onu atlattın. İrade kasların her geçen saat daha da güçleniyor.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="mt-2 px-5 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Ana Ekrana Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
