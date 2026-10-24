import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Badge } from '../types';
import { Award, Sparkles, CheckCircle2, Share2, Flame, Shield, Zap, Crown, Star, Heart, Trophy, Coins, Target } from 'lucide-react';

interface BadgeUnlockModalProps {
  badge: Badge | null;
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badge, onClose }) => {
  useEffect(() => {
    if (badge) {
      // Fire confetti burst!
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  }, [badge]);

  if (!badge) return null;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-12 h-12 text-amber-400" />;
      case 'ShieldCheck': return <CheckCircle2 className="w-12 h-12 text-emerald-400" />;
      case 'Wind': return <Zap className="w-12 h-12 text-sky-400" />;
      case 'Award': return <Award className="w-12 h-12 text-amber-300" />;
      case 'Zap': return <Zap className="w-12 h-12 text-yellow-400" />;
      case 'Star': return <Star className="w-12 h-12 text-amber-400" />;
      case 'Crown': return <Crown className="w-12 h-12 text-yellow-300" />;
      case 'Sparkles': return <Sparkles className="w-12 h-12 text-emerald-300" />;
      case 'Coins': return <Coins className="w-12 h-12 text-amber-400" />;
      case 'Shield': return <Shield className="w-12 h-12 text-rose-400" />;
      case 'Target': return <Target className="w-12 h-12 text-orange-400" />;
      case 'Heart': return <Heart className="w-12 h-12 text-rose-500" />;
      case 'Trophy': return <Trophy className="w-12 h-12 text-yellow-400" />;
      default: return <Award className="w-12 h-12 text-emerald-400" />;
    }
  };

  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'emerald': return 'from-emerald-400 to-teal-500 border-emerald-400 text-emerald-300';
      case 'diamond': return 'from-cyan-300 to-blue-500 border-cyan-300 text-cyan-200';
      case 'platinum': return 'from-slate-200 to-indigo-300 border-indigo-200 text-slate-100';
      case 'gold': return 'from-amber-300 to-yellow-500 border-amber-300 text-amber-200';
      case 'silver': return 'from-slate-300 to-slate-400 border-slate-300 text-slate-200';
      default: return 'from-amber-600 to-orange-700 border-amber-600 text-amber-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white text-center shadow-2xl overflow-hidden space-y-4">
        {/* Glow ambient circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Yeni Başarı Kilidi Açıldı!</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight pt-1">
            Tebrikler! 🎉
          </h3>
        </div>

        {/* Big 3D styled Badge Medal */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          {/* Animated pulsing outer halo */}
          <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-xl animate-pulse" />

          {/* Core medal container */}
          <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${getTierColors(badge.tier)} p-0.5 shadow-2xl`}>
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              {getBadgeIcon(badge.iconName)}
            </div>
          </div>
        </div>

        {/* Badge Details */}
        <div className="space-y-1.5">
          <h4 className="text-xl font-bold text-white">
            {badge.title}
          </h4>
          <span className="text-xs font-semibold text-emerald-400 font-mono block">
            Dönüm Noktası: {badge.requirementLabel}
          </span>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            {badge.description}
          </p>
        </div>

        {/* Biological / Psychological Gain Note */}
        <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-xs text-slate-200 text-left space-y-1">
          <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Vücudunun Kazancı:
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {badge.benefitDescription}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Zaferimi Kutla & Devam Et</span>
          </button>
        </div>
      </div>
    </div>
  );
};
