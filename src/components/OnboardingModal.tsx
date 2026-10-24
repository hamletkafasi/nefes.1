import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Calendar, DollarSign, Clock, ArrowRight, Check, Heart, ShieldCheck, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
  onClose?: () => void;
  isEditing?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  isOpen,
  onComplete,
  onClose,
  isEditing = false,
}) => {
  // Mode: 'single' (All-in-one quick registration) or 'step' (Guided step-by-step)
  const [viewMode, setViewMode] = useState<'single' | 'step'>('single');
  const [step, setStep] = useState(1);

  // Form states
  const [cigarettesPerDay, setCigarettesPerDay] = useState<number>(initialProfile.cigarettesPerDay || 20);
  const [cigarettesPerPack, setCigarettesPerPack] = useState<number>(initialProfile.cigarettesPerPack || 20);
  const [packPrice, setPackPrice] = useState<number>(initialProfile.packPrice || 85);
  
  // Quit date options: 'now' | 'custom'
  const [quitOption, setQuitOption] = useState<'now' | 'custom'>(
    initialProfile.quitDate && isEditing ? 'custom' : 'now'
  );
  
  const defaultDateStr = initialProfile.quitDate
    ? new Date(initialProfile.quitDate).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16);
  const [customDateTime, setCustomDateTime] = useState<string>(defaultDateStr);

  const [name, setName] = useState<string>(initialProfile.name || '');
  const [motivation, setMotivation] = useState<string>(
    initialProfile.motivation || 'Daha sağlıklı ve özgür bir nefes için'
  );

  if (!isOpen) return null;

  // Real-time calculations for preview
  const singleCigPrice = (Number(packPrice) || 85) / (Number(cigarettesPerPack) || 20);
  const dailyCost = Math.round((Number(cigarettesPerDay) || 20) * singleCigPrice);
  const monthlyCost = Math.round(dailyCost * 30);
  const yearlyCost = Math.round(dailyCost * 365);
  const yearlyCigarettes = Math.round((Number(cigarettesPerDay) || 20) * 365);

  const handleFinish = () => {
    let finalQuitDate = new Date().toISOString();
    if (quitOption === 'custom' && customDateTime) {
      finalQuitDate = new Date(customDateTime).toISOString();
    }
    const updated: UserProfile = {
      cigarettesPerDay: Number(cigarettesPerDay) || 20,
      cigarettesPerPack: Number(cigarettesPerPack) || 20,
      packPrice: Number(packPrice) || 85,
      quitDate: finalQuitDate,
      name: name.trim() || 'Kullanıcı',
      motivation: motivation.trim() || 'Daha sağlıklı ve özgür bir nefes için',
      completedOnboarding: true,
    };
    onComplete(updated);
  };

  const handleQuickStartDefaults = () => {
    const updated: UserProfile = {
      cigarettesPerDay: 20,
      cigarettesPerPack: 20,
      packPrice: 85,
      quitDate: new Date().toISOString(),
      name: 'Kullanıcı',
      motivation: 'Sağlıklı bir yaşam ve temiz nefes için',
      completedOnboarding: true,
    };
    onComplete(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Header & Reassurance */}
        <div className="pb-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isEditing ? 'Profili Düzenle' : 'İlk Kayıt & Bilgiler'}</span>
            </div>
            {isEditing && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-100 mt-1">
            {isEditing ? 'Bilgilerini Güncelle' : 'Hoş Geldiniz! Bilgilerini Kaydet'}
          </h2>

          {!isEditing && (
            <div className="mt-2 p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-[11px] text-emerald-300 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Yalnızca bir kez sorulur:</strong> Bu bilgiler cihazınıza kaydedilir. Sonraki tüm girişlerinizde doğrudan ana sayfa ve canlı akciğer simülasyonunuz açılır.
              </span>
            </div>
          )}
        </div>

        {/* Mode Switcher: Tek Sayfa vs Adım Adım (Only in first-time mode) */}
        {!isEditing && (
          <div className="pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Görünüm Seçeneği:</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-800 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  viewMode === 'single'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tek Ekranda Doldur
              </button>
              <button
                type="button"
                onClick={() => setViewMode('step')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  viewMode === 'step'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Adım Adım
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="py-4 flex-1 overflow-y-auto space-y-5 pr-1">
          {/* VIEW MODE 1: SINGLE SCREEN ALL-IN-ONE (FASTEST & CLEANEST) */}
          {(viewMode === 'single' || isEditing) && (
            <div className="space-y-4">
              {/* Question 1: Günde kaç dal sigara içiyorsun? */}
              <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    1. Günde kaç dal sigara içiyorsun?
                  </label>
                  <span className="text-sm font-black font-mono text-emerald-400">
                    {cigarettesPerDay} dal / gün
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={cigarettesPerDay}
                  onChange={(e) => setCigarettesPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  {[10, 15, 20, 30, 40].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCigarettesPerDay(num)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                        cigarettesPerDay === num
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      {num} {num === 20 ? '(1 pk)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Bir pakette kaç dal var? */}
              <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-slate-200 block">
                  2. Bir pakette kaç dal var?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 25, 30].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setCigarettesPerPack(count)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${
                        cigarettesPerPack === count
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      {count} dal {count === 20 ? '(Standart)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Bir paket ne kadar? (Güncel Fiyat) */}
              <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    3. Bir paket sigara ne kadar? (Güncel TL)
                  </label>
                  <span className="text-xs text-slate-400 font-mono">₺ Türk Lirası</span>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-base">
                    ₺
                  </div>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    step="1"
                    value={packPrice}
                    onChange={(e) => setPackPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-emerald-500"
                    placeholder="85"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[11px] text-slate-400 mr-1">Hızlı Seç:</span>
                  {[75, 80, 85, 90, 100].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPackPrice(p)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        packPrice === p
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p} ₺
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Sigarayı ne zaman bıraktın? */}
              <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-slate-200 block">
                  4. Sigarayı ne zaman bıraktın?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuitOption('now')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      quitOption === 'now'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>Tam Şimdi Bırakıyorum</span>
                    {quitOption === 'now' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuitOption('custom')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      quitOption === 'custom'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>Daha Önce Bıraktım</span>
                    {quitOption === 'custom' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>

                {quitOption === 'custom' && (
                  <div className="pt-1">
                    <input
                      type="datetime-local"
                      value={customDateTime}
                      max={new Date().toISOString().slice(0, 16)}
                      onChange={(e) => setCustomDateTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Optional Name & Motivation */}
              <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-slate-200 block">
                  5. Adınız (İsteğe bağlı)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Emre"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Live Savings Calculation Preview */}
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Aylık Cepte Kalacak:</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {monthlyCost.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Yıllık Tasarruf:</span>
                  <span className="text-base font-black text-emerald-300 font-mono">
                    {yearlyCost.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: STEP-BY-STEP (GUIDED) */}
          {viewMode === 'step' && !isEditing && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                <span>Adım {step} / 4</span>
                <span className="text-slate-400">
                  {step === 1 && 'Günde Kaç Dal?'}
                  {step === 2 && 'Paket ve Fiyat'}
                  {step === 3 && 'Bırakma Zamanı'}
                  {step === 4 && 'İsim & Hedef'}
                </span>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Bırakmadan önce ortalama günde kaç dal sigara tüketiyordun?
                  </p>
                  <div className="text-center py-3 bg-slate-800/40 rounded-2xl border border-slate-800">
                    <span className="text-4xl font-black text-emerald-400 font-mono">
                      {cigarettesPerDay}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">dal / gün</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={cigarettesPerDay}
                    onChange={(e) => setCigarettesPerDay(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 20, 30].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCigarettesPerDay(num)}
                        className={`py-2 rounded-xl text-xs font-semibold ${
                          cigarettesPerDay === num
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {num} dal
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1.5">
                      Bir pakette kaç dal var?
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 20, 25, 30].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setCigarettesPerPack(count)}
                          className={`py-2 rounded-xl text-xs font-semibold ${
                            cigarettesPerPack === count
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {count} dal
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1.5">
                      Bir paket sigara ne kadar? (Güncel TL)
                    </label>
                    <input
                      type="number"
                      value={packPrice}
                      onChange={(e) => setPackPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Akciğer simülasyonu için bırakma anını belirle:
                  </p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setQuitOption('now')}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between ${
                        quitOption === 'now'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span>Tam Şimdi Bırakıyorum (Sayaç 0'dan Başlasın)</span>
                      {quitOption === 'now' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuitOption('custom')}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between ${
                        quitOption === 'custom'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span>Daha Önce Bıraktım (Geçmiş Tarih Seç)</span>
                      {quitOption === 'custom' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  {quitOption === 'custom' && (
                    <input
                      type="datetime-local"
                      value={customDateTime}
                      max={new Date().toISOString().slice(0, 16)}
                      onChange={(e) => setCustomDateTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  )}
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1">
                      Adınız (İsteğe bağlı)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn: Emre"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-center space-y-1">
                    <Sparkles className="w-6 h-6 text-emerald-400 mx-auto" />
                    <h4 className="text-xs font-bold text-white">Hazırsınız!</h4>
                    <p className="text-[11px] text-slate-300">
                      Bilgileriniz kaydedilecek ve sonraki tüm girişlerinizde doğrudan ana sayfa açılacaktır.
                    </p>
                  </div>
                </div>
              )}

              {/* Step navigation buttons */}
              <div className="flex justify-between gap-2 pt-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Geri
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <span>İlerle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* PRIMARY SUBMIT ACTION BAR */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>{isEditing ? 'Değişiklikleri Kaydet' : 'Bilgilerimi Kaydet ve Ana Sayfaya Başla'}</span>
          </button>

          {!isEditing && (
            <button
              type="button"
              onClick={handleQuickStartDefaults}
              className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs font-medium text-center transition-colors"
            >
              Standart Değerlerle Hemen Başla (Günde 20 dal, 85 ₺)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
