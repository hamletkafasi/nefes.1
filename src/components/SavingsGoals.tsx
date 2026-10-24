import React, { useState } from 'react';
import { SavingsGoal, UserProfile } from '../types';
import { calculateStats } from '../utils/healthData';
import { DollarSign, Plus, Check, Target, Trash2, Calendar, ShoppingBag } from 'lucide-react';

interface SavingsGoalsProps {
  profile: UserProfile;
  elapsedSeconds: number;
  goals: SavingsGoal[];
  onAddGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  profile,
  elapsedSeconds,
  goals,
  onAddGoal,
  onDeleteGoal,
}) => {
  const stats = calculateStats(profile, elapsedSeconds);
  const moneySaved = stats.moneySaved;

  // Daily savings rate in TL
  const singleCigPrice = profile.packPrice / (profile.cigarettesPerPack || 20);
  const dailySavings = profile.cigarettesPerDay * singleCigPrice;

  // New goal form modal state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCost || Number(newCost) <= 0) return;

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      cost: Number(newCost),
      iconName: 'Gift',
      isCustom: true,
    };

    onAddGoal(goal);
    setNewTitle('');
    setNewCost('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Total Savings Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-500/10 via-emerald-50/50 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/30 rounded-3xl space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            Biriken Sigara Kumbarası
          </span>
          <span className="font-mono">
            Günlük: +{Math.round(dailySavings)} ₺
          </span>
        </div>

        <div>
          <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight tabular-nums">
            {moneySaved.toLocaleString('tr-TR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            <span className="text-xl font-sans text-emerald-600 dark:text-emerald-400 font-bold">₺</span>
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Pakete vermek yerine cebinde kalan ve geleceğine yatırdığın gerçek nakit miktar.
          </p>
        </div>
      </div>

      {/* Goal list title & Add Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Tasarrufunla Alabileceğin Ödüller
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sigarayı bırakmanın somut meyveleri
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Hedef</span>
        </button>
      </div>

      {/* Goals Cards List */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const isUnlocked = moneySaved >= goal.cost;
          const progressPercent = Math.min(
            100,
            Math.round((moneySaved / goal.cost) * 100)
          );
          const remainingMoney = Math.max(0, goal.cost - moneySaved);
          const remainingDays = dailySavings > 0 ? Math.ceil(remainingMoney / dailySavings) : 0;

          return (
            <div
              key={goal.id}
              className={`p-4 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'bg-emerald-50/60 dark:bg-slate-900 border-emerald-500/40 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isUnlocked
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isUnlocked ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {goal.title}
                    </h4>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      {goal.cost.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>

                {goal.isCustom && (
                  <button
                    type="button"
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Hedefi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Progress and status info */}
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>
                    {isUnlocked
                      ? 'Tebrikler! Satın alabilirsin 🎉'
                      : `Kalan: ${Math.round(remainingMoney).toLocaleString('tr-TR')} ₺`}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-200">%{progressPercent}</span>
                </div>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-emerald-500 to-sky-400'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {!isUnlocked && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" />
                    <span>
                      Bu hedefe ulaşmana yaklaşık <strong className="text-slate-900 dark:text-white">{remainingDays} gün</strong> kaldı!
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Goal Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-850 dark:text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Özel Hedef Ekle
              </h4>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Hedefin Adı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Yeni Koşu Ayakkabısı"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Fiyatı (TL)
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  step="1"
                  placeholder="3000"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Hedefi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
