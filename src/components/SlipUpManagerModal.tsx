import React, { useState } from 'react';
import { SlipUpRecord, ThemeMode, UserProfile } from '../types';
import { AlertTriangle, Clock, RefreshCw, CheckCircle2, ShieldCheck, HeartPulse, Droplets, Footprints, Wind, Trash2 } from 'lucide-react';

interface SlipUpManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  slipUps: SlipUpRecord[];
  onSaveSlipUp: (slipUp: Omit<SlipUpRecord, 'id'> & { updateLastSmoked?: boolean }) => void;
  onDeleteSlipUp: (id: string) => void;
  onUpdateLastSmokedDate: (newDateStr: string) => void;
  theme?: ThemeMode;
}

export const SlipUpManagerModal: React.FC<SlipUpManagerModalProps> = ({
  isOpen,
  onClose,
  profile,
  slipUps,
  onSaveSlipUp,
  onDeleteSlipUp,
  onUpdateLastSmokedDate,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  // Sub-tab: 'new_slip' | 'update_time' | 'history'
  const [activeTab, setActiveTab] = useState<'new_slip' | 'update_time' | 'history'>('new_slip');

  // New slip form state
  const [slipDateTime, setSlipDateTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [amount, setAmount] = useState<number>(1);
  const [trigger, setTrigger] = useState<string>('Stres & Yoğunluk');
  const [actionPlan, setActionPlan] = useState<'compensation' | 'restart'>('compensation');
  const [notes, setNotes] = useState<string>('');

  // Update Last Smoked directly
  const [customLastSmoked, setCustomLastSmoked] = useState<string>(
    profile.lastSmokedDate
      ? new Date(profile.lastSmokedDate).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );

  if (!isOpen) return null;

  const handleCreateSlipUp = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSlipUp({
      timestamp: new Date(slipDateTime).toISOString(),
      amount: Number(amount) || 1,
      trigger,
      actionPlan,
      notes: notes.trim(),
      updateLastSmoked: true,
    });
    onClose();
  };

  const handleDirectUpdateTime = () => {
    if (customLastSmoked) {
      onUpdateLastSmokedDate(new Date(customLastSmoked).toISOString());
      onClose();
    }
  };

  const triggersList = [
    'Stres & Yoğunluk',
    'Sosyal Ortam / Arkadaşlar',
    'Kahve veya Alkol Yanı',
    'Ani Kriz & Yoksunluk',
    'Can Sıkıntısı & Alışkanlık',
    'Öfke & Duygusal Dalgalanma',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl my-auto max-h-[92vh] flex flex-col border transition-all ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Son İçilen Saat & Esnek Kaçamak Yönetimi
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ufak tökezlemeler seni yolundan alıkoyamaz; esnek ve şefkatli planlama
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 my-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveTab('new_slip')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'new_slip'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Kaçamak Kaydet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('update_time')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'update_time'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Son İçilen Saati Değiştir
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Geçmiş ({slipUps.length})
          </button>
        </div>

        {/* TAB 1: NEW SLIP-UP WITH FLEXIBLE PLAN */}
        {activeTab === 'new_slip' && (
          <form onSubmit={handleCreateSlipUp} className="space-y-4 overflow-y-auto flex-1 pr-1">
            {/* Compassionate message banner */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Kendini Suçlama:</strong> Bırakma sürecinde bir kere tökezlemek başarısız olduğun anlamına gelmez. Önemli olan bunu zincirleme bir alışkanlığa dönüştürmeden hemen yola devam etmektir.
              </div>
            </div>

            {/* Time input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                Kaçamak Ne Zaman Oldu?
              </label>
              <input
                type="datetime-local"
                value={slipDateTime}
                max={new Date().toISOString().slice(0, 16)}
                onChange={(e) => setSlipDateTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Amount input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                Kaç Dal İçildi?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0.5, 1, 2, 3].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      amount === val
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {val === 0.5 ? 'Yarım dal' : `${val} dal`}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                Tetikleyici Faktör Neydi?
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {triggersList.map((trig) => (
                  <button
                    key={trig}
                    type="button"
                    onClick={() => setTrigger(trig)}
                    className={`p-2 rounded-xl text-[11px] font-semibold text-left border transition-all ${
                      trigger === trig
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {trig}
                  </button>
                ))}
              </div>
            </div>

            {/* Flexible Plan Choice */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                Uygulanacak Eylem Planı:
              </label>

              {/* Option A: Compensation Detoks */}
              <div
                onClick={() => setActionPlan('compensation')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  actionPlan === 'compensation'
                    ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Telafi Protokolü (Önerilen)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    Sıfırlama Yapmaz
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Toplam gün ve para tasarrufun korunur. Yalnızca 24 saatlik hızlı temizleme protokolü (bol su, yürüyüş ve derin nefes) devreye girer.
                </p>
              </div>

              {/* Option B: Restart Timer */}
              <div
                onClick={() => setActionPlan('restart')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  actionPlan === 'restart'
                    ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Temiz Sayfa (Sayacı Bu Saatten Başlat)
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Bırakma sayacını bu kaçamak anına günceller.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
              >
                Kaçamağı Kaydet ve Telafi Planını Başlat
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: DIRECT UPDATE OF LAST SMOKED DATE */}
        {activeTab === 'update_time' && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              En son içtiğiniz sigaranın tam saat ve tarihini buradan doğrudan güncelleyebilirsiniz. Canlı sayaç ve akciğer iyileşmesi bu saate göre yeniden senkronize edilecektir.
            </p>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                En Son İçtiğiniz Tarih ve Saat:
              </label>
              <input
                type="datetime-local"
                value={customLastSmoked}
                max={new Date().toISOString().slice(0, 16)}
                onChange={(e) => setCustomLastSmoked(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={handleDirectUpdateTime}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              En Son İçilen Saati Onayla & Güncelle
            </button>
          </div>
        )}

        {/* TAB 3: SLIP-UP HISTORY & PATTERN RECOGNITION */}
        {activeTab === 'history' && (
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {slipUps.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  Henüz Hiç Kaçamak Yok!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Harika gidiyorsun! Sigarasızlık yolculuğun kesintisiz ve tertemiz devam ediyor.
                </p>
              </div>
            ) : (
              slipUps.map((slip) => (
                <div
                  key={slip.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {slip.amount} dal sigara
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold">
                        {slip.trigger}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block mt-0.5">
                      {new Date(slip.timestamp).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {slip.actionPlan === 'compensation' ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1">
                        ✓ 24 Saatlik Hızlı Telafi Detoksu uygulandı
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block mt-1">
                        ⟳ Sayaç bu tarihten sıfırlandı
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteSlipUp(slip.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Kaydı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
