import React, { useState } from 'react';
import { Badge, BadgeCategory } from '../types';
import {
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  Flame,
  Zap,
  Star,
  Crown,
  Coins,
  Shield,
  Target,
  Heart,
  Trophy,
  DollarSign,
  HeartHandshake,
  Smile,
  ShieldCheck,
  Activity,
} from 'lucide-react';

interface BadgeGalleryProps {
  badges: Badge[];
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ badges }) => {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [inspectedBadge, setInspectedBadge] = useState<Badge | null>(null);

  const filteredBadges = badges.filter((b) => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const totalCount = badges.length;
  const overallPercent = Math.round((unlockedCount / totalCount) * 100);

  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `w-7 h-7 ${isUnlocked ? 'text-white' : 'text-slate-400'}`;
    switch (iconName) {
      case 'Flame': return <Flame className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'Wind': return <Zap className={iconClass} />;
      case 'Award': return <Award className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'Smile': return <Smile className={iconClass} />;
      case 'Activity': return <Activity className={iconClass} />;
      case 'Star': return <Star className={iconClass} />;
      case 'Crown': return <Crown className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      case 'Coins': return <Coins className={iconClass} />;
      case 'DollarSign': return <DollarSign className={iconClass} />;
      case 'TrendingUp': return <Award className={iconClass} />;
      case 'Gift': return <Trophy className={iconClass} />;
      case 'Shield': return <Shield className={iconClass} />;
      case 'Target': return <Target className={iconClass} />;
      case 'CheckCircle2': return <CheckCircle2 className={iconClass} />;
      case 'Heart': return <Heart className={iconClass} />;
      case 'HeartHandshake': return <HeartHandshake className={iconClass} />;
      case 'Trophy': return <Trophy className={iconClass} />;
      default: return <Award className={iconClass} />;
    }
  };

  const getTierBadgeStyle = (tier: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        cardBorder: 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50',
        medalGradient: 'from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 border-slate-300 dark:border-slate-700/50',
        badgeTextColor: 'text-slate-400',
      };
    }
    switch (tier) {
      case 'emerald':
        return {
          cardBorder: 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm',
          medalGradient: 'from-emerald-400 to-teal-500 border-emerald-400 shadow-md shadow-emerald-500/20',
          badgeTextColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'diamond':
        return {
          cardBorder: 'border-cyan-500/50 bg-cyan-50/30 dark:bg-cyan-950/20 shadow-sm',
          medalGradient: 'from-cyan-400 to-blue-500 border-cyan-400 shadow-md shadow-cyan-500/20',
          badgeTextColor: 'text-cyan-600 dark:text-cyan-300',
        };
      case 'platinum':
        return {
          cardBorder: 'border-indigo-400/50 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-sm',
          medalGradient: 'from-slate-200 to-indigo-400 border-indigo-300 shadow-md shadow-indigo-400/20',
          badgeTextColor: 'text-indigo-600 dark:text-indigo-300',
        };
      case 'gold':
        return {
          cardBorder: 'border-amber-400/60 bg-amber-50/30 dark:bg-amber-950/20 shadow-sm',
          medalGradient: 'from-amber-400 to-yellow-500 border-amber-300 shadow-md shadow-amber-500/20',
          badgeTextColor: 'text-amber-600 dark:text-amber-300',
        };
      case 'silver':
        return {
          cardBorder: 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-850 shadow-sm',
          medalGradient: 'from-slate-300 to-slate-500 border-slate-400',
          badgeTextColor: 'text-slate-600 dark:text-slate-300',
        };
      default: // bronze
        return {
          cardBorder: 'border-amber-600/40 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm',
          medalGradient: 'from-amber-600 to-orange-700 border-amber-600',
          badgeTextColor: 'text-amber-700 dark:text-amber-400',
        };
    }
  };

  return (
    <div className="space-y-5 pb-6 animate-in fade-in">
      {/* Top Gallery Header & Overall Progress */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Başarı & Dönüm Noktaları
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Başarı Rozetleri Galerisi
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {unlockedCount} / {totalCount}
            </span>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Kazanılan Rozet
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Sigarasız geçen ilk 24 saat, 1 hafta, 1 ay ve 1 yıl gibi tarihi zaferlerinin yanı sıra tasarruf ve irade başarılarının hepsi bu vitrinde parıldıyor.
        </p>

        {/* Global Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Koleksiyon Tamamlanma Oranı</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">%{overallPercent}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 rounded-full transition-all duration-700"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'all', label: 'Tümü' },
          { key: 'time', label: 'Zaman (24s, 1h, 1y)' },
          { key: 'savings', label: 'Tasarruf (₺)' },
          { key: 'craving', label: 'İrade & Kriz' },
          { key: 'health', label: 'Sağlık & Adet' },
        ].map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.key
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Grid (2 Columns on mobile) */}
      <div className="grid grid-cols-2 gap-3">
        {filteredBadges.map((badge) => {
          const style = getTierBadgeStyle(badge.tier, badge.isUnlocked);

          return (
            <div
              key={badge.id}
              onClick={() => setInspectedBadge(badge)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${style.cardBorder}`}
            >
              {/* Top Tier Tag & Status */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${style.badgeTextColor}`}>
                  {badge.requirementLabel}
                </span>
                {badge.isUnlocked ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Medal Center */}
              <div className="my-2 flex items-center justify-center">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${style.medalGradient} border p-0.5 flex items-center justify-center transition-transform group-hover:scale-105`}
                >
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                    {getBadgeIcon(badge.iconName, badge.isUnlocked)}
                  </div>
                </div>
              </div>

              {/* Title & Progress */}
              <div className="text-center mt-1 space-y-1">
                <h4 className={`text-xs font-bold truncate ${badge.isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                  {badge.title}
                </h4>

                {badge.isUnlocked ? (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block truncate font-medium">
                    {badge.unlockedAt || 'Kazanıldı'}
                  </span>
                ) : (
                  <div className="space-y-1 pt-0.5">
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${badge.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono block truncate">
                      {badge.remainingLabel || `%${badge.progressPercent}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* INSPECTION DETAIL MODAL */}
      {inspectedBadge && (
        <div
          onClick={() => setInspectedBadge(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-900 dark:text-white space-y-4 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setInspectedBadge(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1"
            >
              ✕
            </button>

            {/* Medal Display */}
            <div className="text-center space-y-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg">
                {getBadgeIcon(inspectedBadge.iconName, inspectedBadge.isUnlocked)}
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                {inspectedBadge.requirementLabel}
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {inspectedBadge.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed">
              {inspectedBadge.description}
            </p>

            {/* Benefit info */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Sağlık & Psikolojik Etkisi:
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {inspectedBadge.benefitDescription}
              </p>
            </div>

            {/* Status / Progress footer */}
            <div className="pt-2 text-center">
              {inspectedBadge.isUnlocked ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bu Başarı Kütüphanende Aktif!</span>
                </div>
              ) : (
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>Mevcut İlerleme</span>
                    <span className="text-slate-900 dark:text-white font-bold">%{inspectedBadge.progressPercent}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full"
                      style={{ width: `${inspectedBadge.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block text-center pt-1 font-mono">
                    {inspectedBadge.remainingLabel}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
