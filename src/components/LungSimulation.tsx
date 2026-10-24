import React, { useState } from 'react';
import { getLungMetrics } from '../utils/healthData';
import { Activity, Wind, Sparkles, Info, Eye, Layers, CheckCircle2 } from 'lucide-react';
import { ThemeMode } from '../types';

interface LungSimulationProps {
  elapsedSeconds: number;
  quitDate: string;
  theme?: ThemeMode;
}

interface AnatomicalRegion {
  id: string;
  name: string;
  latinName: string;
  description: (recovery: number) => string;
  status: (recovery: number) => string;
  actionAdvice: string;
}

const ANATOMICAL_REGIONS: AnatomicalRegion[] = [
  {
    id: 'trachea',
    name: 'Soluk Borusu (Trakea)',
    latinName: 'Trachea Cartilaginea',
    status: (rec) => (rec > 60 ? 'Mukozası Yenilendi & Temiz' : rec > 20 ? 'Tahriş İyileşiyor' : 'Kronik Duman Yanığı & Ödem'),
    description: (rec) =>
      rec > 60
        ? 'Soluk borusu silyalı epitel hücreleri ve mukus bezleri doğal koruyucu bariyerini tekrar kazandı. Dumanın yarattığı kuruluk ve yanma hissi tamamen bitti.'
        : 'Sigara dumanındaki formaldehit ve katranın soluk borusu kıkırdaklarında oluşturduğu mikro iltihaplanma gerileme evresinde.',
    actionAdvice: 'Günde 2.5 litre ılık su içmek soluk borusu nemini hızla dengeler.',
  },
  {
    id: 'bronchi',
    name: 'Bronşiyal Ağaç & Bronşiyoller',
    latinName: 'Arbor Bronchialis',
    status: (rec) => (rec > 50 ? 'Gevşemiş & Maksimum Hava Geçişi' : rec > 15 ? 'Bronkospazm Azalıyor' : 'Daralmış & Katran Kalıntıları'),
    description: (rec) =>
      rec > 50
        ? 'Bronş duvarlarındaki düz kaslar gevşeyerek hava yollarını genişletti. Akciğerin derin loblarına oksijen transferi artık dirençsiz gerçekleşiyor.'
        : 'Sıcak dumanın bronş lümeninde neden olduğu daralma çözülüyor. Hava yolları genişlemeye başladı.',
    actionAdvice: 'Günde 15-20 dakika tempolu yürüyüş bronş kaslarını doğal olarak esnetir.',
  },
  {
    id: 'lobes',
    name: 'Akciğer Lobları & Parankim Dokusu',
    latinName: 'Pulmones (Lobus Superior/Inferior)',
    status: (rec) => (rec > 70 ? 'Pembe, Elastik & Arınmış' : rec > 30 ? 'Katran Tahliyesi Hızlandı' : 'Zift ve Karbon Lekeleri'),
    description: (rec) =>
      rec > 70
        ? 'Sağdaki 3 ve soldaki 2 akciğer lobunun süngerimsi dokusu, yıllardır biriken siyah katran parçacıklarından makrofaj hücreleri sayesinde arındı.'
        : 'Akciğer parankiminde depolanan katran ve toksinler öksürük ve lenfatik drenajla vücuttan dışarı atılıyor.',
    actionAdvice: 'Derin diyafram nefesi almak alt lobların havalanmasını sağlar.',
  },
  {
    id: 'alveoli',
    name: 'Alveoller (Hava Kesecikleri)',
    latinName: 'Alveoli Pulmonales (~300 Milyon)',
    status: (rec) => (rec > 80 ? 'Yüksek Difüzyon & Tam Elastikiyet' : rec > 40 ? 'Oksijen Alımı Artıyor' : 'CO Zehirlenmesi & Yıpranma'),
    description: (rec) =>
      rec > 80
        ? 'Mikroskobik hava kesecikleri yüzey gerilimini (sürfaktan) yeniden sağladı. Kılcal damarlara saniyede pompalanan oksijen miktarı dorukta.'
        : 'Karbonmonoksit moleküllerinin alveol yüzeyinden çekilmesiyle birlikte kana oksijen geçiş kapasitesi hızla toparlanıyor.',
    actionAdvice: 'C vitamini ve antioksidan besinler alveol duvarlarını serbest radikallerden korur.',
  },
  {
    id: 'cilia',
    name: 'Siliya (Akciğer Temizlik Tüyleri)',
    latinName: 'Cilia Epithelialis (Süpürge Hücreleri)',
    status: (rec) => (rec > 85 ? 'Senkronize Dalgalanma & Aktif' : rec > 35 ? 'Yeniden Büyüme Başladı' : 'Duman Tarafından Felç Edilmiş'),
    description: (rec) =>
      rec > 85
        ? 'Hava yollarındaki siliya tüyleri saniyede 12 kez dalgalanarak ciğerlere giren toz, bakteri ve yabancı maddeleri doğal refleksle dışarı süpürüyor.'
        : 'Nikotin ve sıcak katranın felç ettiği siliya tüyleri köklerinden yeniden filizleniyor.',
    actionAdvice: 'Okaliptüs ve nane buharı siliya hücrelerinin hareketini canlandırır.',
  },
];

const TIMELINE_PRESETS = [
  { label: '0 Saat', seconds: 0, tag: 'Son Duman' },
  { label: '8 Saat', seconds: 8 * 3600, tag: 'Oksijen' },
  { label: '24 Saat', seconds: 24 * 3600, tag: 'CO Sıfırlama' },
  { label: '3 Gün', seconds: 72 * 3600, tag: 'Bronşlar' },
  { label: '2 Hafta', seconds: 14 * 86400, tag: 'Dolaşım' },
  { label: '1 Ay', seconds: 30 * 86400, tag: 'Siliya' },
  { label: '3 Ay', seconds: 90 * 86400, tag: 'Kapasite +%30' },
  { label: '1 Yıl', seconds: 365 * 86400, tag: 'Kalp %50' },
  { label: '5 Yıl', seconds: 5 * 365 * 86400, tag: 'İnme 0' },
  { label: '10 Yıl', seconds: 10 * 365 * 86400, tag: 'Kanser %50' },
];

export const LungSimulation: React.FC<LungSimulationProps> = ({
  elapsedSeconds,
  theme = 'light',
}) => {
  const [simulationMode, setSimulationMode] = useState<'live' | 'explorer'>('live');
  const [explorerSeconds, setExplorerSeconds] = useState<number>(elapsedSeconds);
  const [selectedRegion, setSelectedRegion] = useState<AnatomicalRegion | null>(null);

  // Layer toggles
  const [showVessels, setShowVessels] = useState(true);
  const [showBronchi, setShowBronchi] = useState(true);
  const [showTarMap, setShowTarMap] = useState(true);

  // Active calculation
  const currentSeconds = simulationMode === 'live' ? elapsedSeconds : explorerSeconds;
  const metrics = getLungMetrics(currentSeconds);
  const rec = metrics.recoveryPercentage; // 0 to 100

  // Respiratory pacing
  const breathDurationSec = 2.8 + (rec / 100) * 1.6;

  // Realistic color palettes
  const isLight = theme === 'light';
  const tarOpacity = Math.max(0, (100 - rec) / 100);
  const healthyPinkOpacity = Math.min(1, Math.max(0.2, rec / 100));

  return (
    <div
      className={`w-full rounded-3xl p-4 sm:p-6 transition-all duration-300 space-y-6 border ${
        isLight
          ? 'bg-white border-slate-200/90 shadow-sm text-slate-800'
          : 'bg-slate-900 border-slate-800 text-white shadow-xl'
      }`}
    >
      {/* 1. TOP HEADER & MODE CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                Anatomik Akciğer ve Solunum Simülatörü
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {simulationMode === 'live'
                  ? 'Şu anki gerçek sigarasızlık sürenize göre biyolojik durum'
                  : 'Gelecek simülasyonu: Katran temizliği ve doku yenilenmesi'}
              </p>
            </div>
          </div>
        </div>

        {/* Live vs Explorer segmented toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setSimulationMode('live')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              simulationMode === 'live'
                ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Canlı Durumum
          </button>
          <button
            type="button"
            onClick={() => {
              setSimulationMode('explorer');
              setExplorerSeconds(Math.max(elapsedSeconds, 86400));
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              simulationMode === 'explorer'
                ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Zaman Gezgini (10 Yıl)
          </button>
        </div>
      </div>

      {/* Explorer Time Scrubber (Visible in explorer mode) */}
      {simulationMode === 'explorer' && (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700 rounded-2xl space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Zamanı İleri Sar ve Ciğerlerinin Arınmasını İzle
            </span>
            <span className="font-mono text-slate-600 dark:text-slate-300">
              İyileşme: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">%{rec}</strong>
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {TIMELINE_PRESETS.map((p) => {
              const isSelected = Math.abs(explorerSeconds - p.seconds) < 3600;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setExplorerSeconds(p.seconds)}
                  className={`py-1.5 px-1 rounded-xl text-[11px] font-semibold transition-all text-center truncate ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm font-bold'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. REALISTIC MEDICAL SVG LUNG ANATOMY */}
      <div className="relative flex flex-col items-center justify-center py-5 px-3 rounded-2xl bg-gradient-to-b from-slate-50/70 to-slate-100/50 dark:from-slate-950/70 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-800 overflow-hidden">
        {/* Layer Visibility Pills */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap justify-center">
          <span className="text-[10px] text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Katmanlar:
          </span>
          <button
            type="button"
            onClick={() => setShowBronchi(!showBronchi)}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors border ${
              showBronchi
                ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            Bronş Ağacı
          </button>
          <button
            type="button"
            onClick={() => setShowVessels(!showVessels)}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors border ${
              showVessels
                ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            Kılcal Damarlar
          </button>
          <button
            type="button"
            onClick={() => setShowTarMap(!showTarMap)}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors border ${
              showTarMap
                ? 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            Katran / Zift Haritası
          </button>
        </div>

        {/* Anatomical Stage Tag */}
        <div className="text-center max-w-sm mb-2 space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-900 dark:text-white">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: rec < 30 ? '#ef4444' : rec < 65 ? '#f59e0b' : '#10b981',
              }}
            />
            <span>{metrics.stageName}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
            {metrics.stageDescription}
          </p>
        </div>

        {/* Real Anatomical SVG Respiratory Engine */}
        <div className="relative w-full max-w-[340px] aspect-[4/3] flex items-center justify-center my-2">
          {/* Ambient respiratory glow */}
          <div
            className="absolute inset-2 rounded-full blur-2xl transition-all duration-1000 pointer-events-none"
            style={{
              backgroundColor:
                rec > 60
                  ? 'rgba(244, 114, 182, 0.15)'
                  : rec > 20
                  ? 'rgba(56, 189, 248, 0.12)'
                  : 'rgba(239, 68, 68, 0.08)',
            }}
          />

          <svg
            viewBox="0 0 420 340"
            className="w-full h-full drop-shadow-xl select-none"
            style={{
              animation: `lungBreathing ${breathDurationSec}s ease-in-out infinite`,
              transformOrigin: '50% 45%',
            }}
          >
            <defs>
              {/* Healthy fleshy pink tissue gradient with light volume */}
              <linearGradient id="realPinkRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#fb7185" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#fda4af" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id="realPinkLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#fb7185" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#fda4af" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.85" />
              </linearGradient>

              {/* Pathological tar & soot layer */}
              <linearGradient id="realTarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="40%" stopColor="#0f172a" />
                <stop offset="80%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#27272a" />
              </linearGradient>

              {/* Trachea cartilage rings */}
              <linearGradient id="realTrachea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              <filter id="softVolume" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* TRACHEA (Soluk Borusu ile C-Kıkırdak Halkaları) */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedRegion(ANATOMICAL_REGIONS[0])}
            >
              {/* Outer tube */}
              <path
                d="M 197 15 L 223 15 L 221 110 L 199 110 Z"
                fill="url(#realTrachea)"
                stroke="#0284c7"
                strokeWidth="1.5"
                filter="url(#softVolume)"
              />
              {/* Cartilaginous rings (C-şeklinde 16-20 adet) */}
              {[25, 38, 51, 64, 77, 90, 102].map((y) => (
                <path
                  key={y}
                  d={`M 198 ${y} Q 210 ${y + 2} 222 ${y}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={0.85}
                />
              ))}
              {/* Carina bifurkasyonu */}
              <path
                d="M 199 110 Q 210 114 221 110 L 210 120 Z"
                fill="#0369a1"
              />
            </g>

            {/* BRONCHIAL TREE (Bronş Ağacı - Primary, Secondary, Tertiary) */}
            {showBronchi && (
              <g
                className="cursor-pointer"
                onClick={() => setSelectedRegion(ANATOMICAL_REGIONS[1])}
              >
                {/* Right primary bronchus (3 branches for 3 lobes) */}
                <path
                  d="M 203 113 Q 170 125 145 155"
                  fill="none"
                  stroke={rec > 50 ? '#0284c7' : '#475569'}
                  strokeWidth="6.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 160 135 Q 125 125 95 135"
                  fill="none"
                  stroke={rec > 50 ? '#38bdf8' : '#64748b'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 148 152 Q 115 175 90 220"
                  fill="none"
                  stroke={rec > 50 ? '#38bdf8' : '#64748b'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 145 155 Q 155 205 148 255"
                  fill="none"
                  stroke={rec > 50 ? '#7dd3fc' : '#94a3b8'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Right tertiary twigs */}
                <path
                  d="M 105 130 Q 80 140 70 160"
                  fill="none"
                  stroke={rec > 50 ? '#bae6fd' : '#94a3b8'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 100 200 Q 80 230 75 255"
                  fill="none"
                  stroke={rec > 50 ? '#bae6fd' : '#94a3b8'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Left primary bronchus (2 branches for 2 lobes + cardiac notch) */}
                <path
                  d="M 217 113 Q 250 125 275 155"
                  fill="none"
                  stroke={rec > 50 ? '#0284c7' : '#475569'}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M 260 135 Q 295 125 325 135"
                  fill="none"
                  stroke={rec > 50 ? '#38bdf8' : '#64748b'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 272 152 Q 305 175 330 220"
                  fill="none"
                  stroke={rec > 50 ? '#38bdf8' : '#64748b'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 275 155 Q 265 205 272 255"
                  fill="none"
                  stroke={rec > 50 ? '#7dd3fc' : '#94a3b8'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Left tertiary twigs */}
                <path
                  d="M 315 130 Q 340 140 350 160"
                  fill="none"
                  stroke={rec > 50 ? '#bae6fd' : '#94a3b8'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 320 200 Q 340 230 345 255"
                  fill="none"
                  stroke={rec > 50 ? '#bae6fd' : '#94a3b8'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* PULMONARY BLOOD VESSELS (Pulmoner Arter ve Venler) */}
            {showVessels && (
              <g opacity={0.65}>
                {/* Red oxygenated pulmonary veins */}
                <path
                  d="M 195 125 Q 160 140 130 180"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 225 125 Q 260 140 290 180"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Blue deoxygenated branches */}
                <path
                  d="M 190 130 Q 150 160 115 220"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 230 130 Q 270 160 305 220"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* RIGHT LUNG: 3 LOBES (Viewer's Left) */}
            <g
              className="cursor-pointer transition-opacity duration-700"
              onClick={() => setSelectedRegion(ANATOMICAL_REGIONS[2])}
            >
              {/* Healthy Pink Parenchyma */}
              <path
                d="M 185 110 C 150 85, 80 100, 55 145 C 40 175, 35 230, 55 270 C 75 305, 125 310, 165 290 C 182 280, 188 250, 190 200 C 192 155, 190 120, 185 110 Z"
                fill="url(#realPinkRight)"
                opacity={healthyPinkOpacity}
                filter="url(#softVolume)"
              />
              {/* Tar Overlay Layer (fades as user recovers) */}
              {showTarMap && (
                <path
                  d="M 185 110 C 150 85, 80 100, 55 145 C 40 175, 35 230, 55 270 C 75 305, 125 310, 165 290 C 182 280, 188 250, 190 200 C 192 155, 190 120, 185 110 Z"
                  fill="url(#realTarGrad)"
                  opacity={tarOpacity * 0.9}
                />
              )}

              {/* Anatomical Lobar Fissures (Horizontal & Oblique) */}
              <path
                d="M 60 180 Q 120 185 185 200"
                fill="none"
                stroke={rec > 50 ? '#f43f5e' : '#334155'}
                strokeWidth="1.2"
                opacity="0.6"
              />
              <path
                d="M 95 190 Q 140 240 165 285"
                fill="none"
                stroke={rec > 50 ? '#f43f5e' : '#334155'}
                strokeWidth="1.2"
                opacity="0.6"
              />

              {/* Realistic Tar Clusters & Soot blotches */}
              {showTarMap && (
                <g opacity={tarOpacity}>
                  <circle cx="75" cy="165" r="14" fill="#020617" opacity="0.85" />
                  <circle cx="100" cy="205" r="17" fill="#0f172a" opacity="0.8" />
                  <circle cx="65" cy="235" r="12" fill="#020617" opacity="0.9" />
                  <circle cx="130" cy="255" r="16" fill="#1e293b" opacity="0.75" />
                  <circle cx="140" cy="155" r="11" fill="#0f172a" opacity="0.85" />
                </g>
              )}

              {/* Outer boundary contour */}
              <path
                d="M 185 110 C 150 85, 80 100, 55 145 C 40 175, 35 230, 55 270 C 75 305, 125 310, 165 290 C 182 280, 188 250, 190 200 C 192 155, 190 120, 185 110 Z"
                fill="none"
                stroke={rec > 50 ? '#fb7185' : '#64748b'}
                strokeWidth="1.5"
              />
            </g>

            {/* LEFT LUNG: 2 LOBES with CARDIAC NOTCH (Viewer's Right) */}
            <g
              className="cursor-pointer transition-opacity duration-700"
              onClick={() => setSelectedRegion(ANATOMICAL_REGIONS[2])}
            >
              {/* Healthy Pink Parenchyma */}
              <path
                d="M 235 110 C 270 85, 340 100, 365 145 C 380 175, 385 230, 365 270 C 345 305, 295 310, 255 290 C 240 280, 232 255, 230 230 C 224 190, 232 165, 228 145 C 226 125, 231 115, 235 110 Z"
                fill="url(#realPinkLeft)"
                opacity={healthyPinkOpacity}
                filter="url(#softVolume)"
              />
              {/* Tar Overlay Layer */}
              {showTarMap && (
                <path
                  d="M 235 110 C 270 85, 340 100, 365 145 C 380 175, 385 230, 365 270 C 345 305, 295 310, 255 290 C 240 280, 232 255, 230 230 C 224 190, 232 165, 228 145 C 226 125, 231 115, 235 110 Z"
                  fill="url(#realTarGrad)"
                  opacity={tarOpacity * 0.9}
                />
              )}

              {/* Oblique Fissure on Left */}
              <path
                d="M 270 140 Q 320 190 355 240"
                fill="none"
                stroke={rec > 50 ? '#f43f5e' : '#334155'}
                strokeWidth="1.2"
                opacity="0.6"
              />

              {/* Tar spots on Left */}
              {showTarMap && (
                <g opacity={tarOpacity}>
                  <circle cx="345" cy="165" r="15" fill="#020617" opacity="0.85" />
                  <circle cx="320" cy="205" r="16" fill="#0f172a" opacity="0.8" />
                  <circle cx="355" cy="235" r="12" fill="#020617" opacity="0.9" />
                  <circle cx="290" cy="260" r="15" fill="#1e293b" opacity="0.75" />
                  <circle cx="280" cy="155" r="10" fill="#0f172a" opacity="0.85" />
                </g>
              )}

              {/* Outer boundary contour */}
              <path
                d="M 235 110 C 270 85, 340 100, 365 145 C 380 175, 385 230, 365 270 C 345 305, 295 310, 255 290 C 240 280, 232 255, 230 230 C 224 190, 232 165, 228 145 C 226 125, 231 115, 235 110 Z"
                fill="none"
                stroke={rec > 50 ? '#fb7185' : '#64748b'}
                strokeWidth="1.5"
              />
            </g>

            {/* CARDIAC SILHOUETTE (Kalp Çentiği Boşluğu) */}
            <path
              d="M 210 170 C 198 185, 195 210, 210 230 C 225 210, 222 185, 210 170 Z"
              fill="#e11d48"
              opacity={0.3 + (rec / 100) * 0.3}
              stroke="#fb7185"
              strokeWidth="1"
            />

            {/* INCOMING OXYGEN STREAM (Animated fresh air stream) */}
            {rec > 15 && (
              <g opacity={Math.min(1, rec / 50)}>
                <circle cx="210" cy="30" r="3" fill="#38bdf8" className="animate-pulse" />
                <circle cx="210" cy="65" r="3" fill="#38bdf8" className="animate-pulse" />
                <circle cx="175" cy="125" r="2.5" fill="#38bdf8" />
                <circle cx="245" cy="125" r="2.5" fill="#38bdf8" />
                <circle cx="130" cy="175" r="2.5" fill="#38bdf8" />
                <circle cx="290" cy="175" r="2.5" fill="#38bdf8" />
              </g>
            )}
          </svg>
        </div>

        {/* Breath flow rhythm status */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Wind className="w-3.5 h-3.5 text-sky-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>
            {rec > 70
              ? 'Akciğerler sakin, derin ve doğal ritminde genişliyor.'
              : rec > 30
              ? 'Bronkospazm geriledi, hava akışı rahatladı.'
              : 'Katran yükü ve inflamasyon nedeniyle solunum sığ ve sık.'}
          </span>
        </div>
      </div>

      {/* 3. INTERACTIVE ANATOMICAL REGION INSPECTION */}
      {selectedRegion && (
        <div className="p-4 rounded-2xl border bg-emerald-500/5 border-emerald-500/30 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                {selectedRegion.name}
              </span>
              <span className="text-[10px] text-slate-400 italic font-mono block">
                {selectedRegion.latinName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRegion(null)}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
            >
              ✕ Kapat
            </button>
          </div>

          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Fizyolojik Durum: <span className="text-emerald-600 dark:text-emerald-400">{selectedRegion.status(rec)}</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedRegion.description(rec)}
          </p>

          <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900 dark:text-white">İyileşme Tavsiyesi:</strong> {selectedRegion.actionAdvice}
            </span>
          </div>
        </div>
      )}

      {/* 4. REAL-TIME PHYSIOLOGICAL BENCHMARK TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
            Katran Tahliyesi
          </span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
            %{rec}
          </span>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rec}%` }} />
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
            Oksijen SpO2
          </span>
          <span className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400 block">
            %{metrics.oxygenSaturation}
          </span>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(metrics.oxygenSaturation / 99.6) * 100}%` }} />
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
            Siliya Hücreleri
          </span>
          <span className="text-xl font-bold font-mono text-pink-600 dark:text-pink-400 block">
            %{metrics.ciliaRegenerationPercent}
          </span>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-pink-500 rounded-full" style={{ width: `${metrics.ciliaRegenerationPercent}%` }} />
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
            Vital Kapasite
          </span>
          <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 block">
            +%{metrics.vitalCapacityBonusPercent}
          </span>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(metrics.vitalCapacityBonusPercent / 30) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* 5. HOTSPOT BUTTON STRIP */}
      <div className="space-y-1.5">
        <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
          Organ Bölgelerine Dokunarak İyileşme Teşhisini Okuyun:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ANATOMICAL_REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                selectedRegion?.id === region.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="truncate font-bold block">{region.name}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate block mt-0.5">
                {region.status(rec)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
