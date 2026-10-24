import React, { useState } from 'react';
import { Badge } from '../types';
import { HEALTH_MILESTONES } from '../utils/healthData';
import { BadgeGallery } from './BadgeGallery';
import { Check, ChevronDown, ChevronUp, Heart, Activity, Wind, Sparkles, Brain, Award, Trophy } from 'lucide-react';

interface HealthTimelineProps {
  elapsedSeconds: number;
  badges?: Badge[];
  initialSubTab?: 'timeline' | 'badges';
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  elapsedSeconds,
  badges = [],
  initialSubTab = 'timeline',
}) => {
  const [subTab, setSubTab] = useState<'timeline' | 'badges'>(initialSubTab);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getOrganIcon = (organ: string) => {
    switch (organ) {
      case 'heart':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'lungs':
        return <Wind className="w-4 h-4 text-sky-500" />;
      case 'brain':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'cells':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      default:
        return <Activity className="w-4 h-4 text-amber-500" />;
    }
  };

  const completedCount = HEALTH_MILESTONES.filter(
    (m) => elapsedSeconds >= m.durationSeconds
  ).length;

  return (
    <div className="space-y-5 pb-6">
      {/* Top Segmented View Switcher */}
      <div className="p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-1 shadow-sm">
        <button
          type="button"
          onClick={() => setSubTab('timeline')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            subTab === 'timeline'
              ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
          <span>Sağlık Evreleri ({completedCount}/{HEALTH_MILESTONES.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('badges')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            subTab === 'badges'
              ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-slate-950 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Başarı Rozetleri ({badges.filter((b) => b.isUnlocked).length}/{badges.length})</span>
        </button>
      </div>

      {subTab === 'badges' ? (
        <BadgeGallery badges={badges} />
      ) : (
        <>
          {/* Header Summary */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Bilimsel İyileşme Zaman Çizelgesi
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  Vücudunun Biyolojik Yenilenmesi
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {completedCount} / {HEALTH_MILESTONES.length}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">
                  Tamamlanan Hedef
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dünya Sağlık Örgütü (WHO) ve tıp literatürüne göre sigarayı bıraktıktan sonraki ilk 20 dakikadan 10. yıla kadar vücudunda gerçekleşen somut biyolojik adımlar.
            </p>

            {/* Global Progress Bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full transition-all duration-700"
                style={{
                  width: `${(completedCount / HEALTH_MILESTONES.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Milestones Vertical List */}
          <div className="space-y-3">
            {HEALTH_MILESTONES.map((milestone) => {
              const isCompleted = elapsedSeconds >= milestone.durationSeconds;
              const progressPercent = Math.min(
                100,
                Math.round((elapsedSeconds / milestone.durationSeconds) * 100)
              );
              const isExpanded = expandedId === milestone.id;

              return (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-2xl border transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-50/60 dark:bg-slate-900 border-emerald-500/30'
                      : progressPercent > 0
                      ? 'bg-white dark:bg-slate-900/90 border-slate-300 dark:border-slate-700'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div
                    className="flex items-start justify-between gap-3 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                            : progressPercent > 0
                            ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        ) : (
                          getOrganIcon(milestone.organ)
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                            {milestone.durationLabel}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded font-bold">
                              Tamamlandı
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          {milestone.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {!isCompleted && progressPercent > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        <span>Devam Eden Süreç</span>
                        <span>%{progressPercent}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs leading-relaxed animate-in fade-in">
                      <p className="text-slate-600 dark:text-slate-300">{milestone.description}</p>
                      <div className="p-2.5 bg-emerald-50 dark:bg-slate-800/60 rounded-xl border border-emerald-200 dark:border-slate-700 text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          <strong className="text-slate-900 dark:text-white">Kazanım:</strong> {milestone.benefit}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
