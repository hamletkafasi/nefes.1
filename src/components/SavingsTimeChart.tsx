import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { UserProfile, ThemeMode } from '../types';
import { TrendingUp, Calendar, Coins, Sparkles } from 'lucide-react';

interface SavingsTimeChartProps {
  profile: UserProfile;
  elapsedSeconds: number;
  theme?: ThemeMode;
}

type MetricMode = 'savings' | 'days' | 'cigarettes';
type TimeRange = '7d' | '14d' | '30d' | 'all';

interface ChartDataPoint {
  dayNumber: number;
  dateLabel: string;
  fullDate: string;
  savings: number;
  smokeFreeDays: number;
  cigarettesNotSmoked: number;
  isProjected: boolean;
}

export const SavingsTimeChart: React.FC<SavingsTimeChartProps> = ({
  profile,
  elapsedSeconds,
  theme = 'light',
}) => {
  const isLight = theme === 'light';
  const [metric, setMetric] = useState<MetricMode>('savings');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const singleCigarettePrice =
    profile.packPrice / (profile.cigarettesPerPack || 20);
  const dailyCost = profile.cigarettesPerDay * singleCigarettePrice;
  const currentElapsedDays = Math.max(0, elapsedSeconds / 86400);
  const completedFullDays = Math.floor(currentElapsedDays);

  const effectiveStartDate = useMemo(() => {
    return new Date(profile.lastSmokedDate || profile.quitDate);
  }, [profile.lastSmokedDate, profile.quitDate]);

  // Generate continuous timeline dataset
  const chartData = useMemo(() => {
    const points: ChartDataPoint[] = [];

    // Determine target day count based on timeRange
    let targetDays = 7;
    if (timeRange === '14d') targetDays = 14;
    else if (timeRange === '30d') targetDays = 30;
    else if (timeRange === 'all') {
      targetDays = Math.max(7, Math.ceil(currentElapsedDays) + 3);
    }

    // Always include Day 0 (the quitting starting moment)
    const startDate = new Date(effectiveStartDate);
    points.push({
      dayNumber: 0,
      dateLabel: 'Başlangıç',
      fullDate: startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      savings: 0,
      smokeFreeDays: 0,
      cigarettesNotSmoked: 0,
      isProjected: false,
    });

    for (let day = 1; day <= targetDays; day++) {
      const pointDate = new Date(startDate.getTime() + day * 86400 * 1000);
      const isPastOrToday = day <= completedFullDays + 1;
      const isProjected = day > completedFullDays + 1;

      // Fractional calculation for current day, full calculation for past/future
      const effectiveDays = isProjected
        ? day
        : Math.min(day, currentElapsedDays);

      const cumulativeSavings = Math.round(effectiveDays * dailyCost);
      const cumulativeCigarettes = Math.round(effectiveDays * profile.cigarettesPerDay);

      const dateLabel = pointDate.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
      });

      points.push({
        dayNumber: day,
        dateLabel: day === completedFullDays + 1 ? 'Bugün' : dateLabel,
        fullDate: pointDate.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          weekday: 'short',
        }),
        savings: cumulativeSavings,
        smokeFreeDays: Number(effectiveDays.toFixed(1)),
        cigarettesNotSmoked: cumulativeCigarettes,
        isProjected,
      });
    }

    return points;
  }, [effectiveStartDate, timeRange, completedFullDays, currentElapsedDays, dailyCost, profile.cigarettesPerDay]);

  // Dynamic values based on active metric
  const currentTotal = useMemo(() => {
    if (metric === 'savings') {
      return `${Math.floor(currentElapsedDays * dailyCost).toLocaleString('tr-TR')} ₺`;
    }
    if (metric === 'days') {
      return `${currentElapsedDays.toFixed(1)} Gün`;
    }
    return `${Math.floor(currentElapsedDays * profile.cigarettesPerDay).toLocaleString('tr-TR')} Dal`;
  }, [metric, currentElapsedDays, dailyCost, profile.cigarettesPerDay]);

  const activeColor = useMemo(() => {
    if (metric === 'savings') return '#059669'; // Emerald
    if (metric === 'days') return '#0284c7'; // Sky
    return '#7c3aed'; // Violet
  }, [metric]);

  const gradientId = `grad_${metric}`;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all shadow-sm ${
        isLight
          ? 'bg-white border-slate-200/90'
          : 'bg-slate-900 border-slate-800'
      }`}
    >
      {/* HEADER: TITLE & CURRENT METRIC TOTAL */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zaman Serisi İlerlemesi</span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {currentTotal}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              +{Math.round(dailyCost)} ₺/gün
            </span>
          </div>
        </div>

        {/* TIME RANGE SELECTOR (Segmented control button group) */}
        <div
          className={`flex items-center p-0.5 rounded-lg border ${
            isLight
              ? 'bg-slate-100 border-slate-200/80'
              : 'bg-slate-800/80 border-slate-700/60'
          }`}
        >
          {(
            [
              { id: '7d', label: '7G' },
              { id: '14d', label: '14G' },
              { id: '30d', label: '30G' },
              { id: 'all', label: 'Tümü' },
            ] as const
          ).map((item) => {
            const isActive = timeRange === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTimeRange(item.id)}
                className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${
                  isActive
                    ? isLight
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'bg-slate-700 text-white shadow-xs'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* METRIC SELECTOR TABS (Interactive buttons) */}
      <div className="flex items-center gap-1 mb-3">
        <button
          type="button"
          onClick={() => setMetric('savings')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            metric === 'savings'
              ? isLight
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-emerald-950/50 text-emerald-300 border border-emerald-700/40'
              : isLight
              ? 'text-slate-600 hover:bg-slate-50'
              : 'text-slate-400 hover:bg-slate-800/50'
          }`}
        >
          <Coins className="w-3 h-3 text-emerald-600" />
          <span>Tasarruf</span>
        </button>

        <button
          type="button"
          onClick={() => setMetric('days')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            metric === 'days'
              ? isLight
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'bg-sky-950/50 text-sky-300 border border-sky-700/40'
              : isLight
              ? 'text-slate-600 hover:bg-slate-50'
              : 'text-slate-400 hover:bg-slate-800/50'
          }`}
        >
          <Calendar className="w-3 h-3 text-sky-600" />
          <span>Sigarasız Gün</span>
        </button>

        <button
          type="button"
          onClick={() => setMetric('cigarettes')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            metric === 'cigarettes'
              ? isLight
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-purple-950/50 text-purple-300 border border-purple-700/40'
              : isLight
              ? 'text-slate-600 hover:bg-slate-50'
              : 'text-slate-400 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span>İçilmeyen Dal</span>
        </button>
      </div>

      {/* RECHARTS INTERACTIVE CHART AREA */}
      <div className="w-full h-48 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 6, left: -22, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeColor} stopOpacity={isLight ? 0.28 : 0.4} />
                <stop offset="95%" stopColor={activeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isLight ? '#f1f5f9' : '#1e293b'}
              vertical={false}
            />

            <XAxis
              dataKey="dateLabel"
              tickLine={false}
              axisLine={{ stroke: isLight ? '#e2e8f0' : '#334155' }}
              tick={{
                fontSize: 10,
                fill: isLight ? '#64748b' : '#94a3b8',
                fontWeight: 500,
              }}
              interval="preserveStartEnd"
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 9,
                fill: isLight ? '#94a3b8' : '#64748b',
                fontFamily: 'monospace',
              }}
              tickFormatter={(val) => {
                if (metric === 'savings') return `${val}₺`;
                if (metric === 'days') return `${val}g`;
                return `${val}`;
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload as ChartDataPoint;

                return (
                  <div
                    className={`p-2.5 rounded-xl border shadow-lg backdrop-blur-md text-xs min-w-[150px] transition-all ${
                      isLight
                        ? 'bg-white/95 border-slate-200 text-slate-800'
                        : 'bg-slate-900/95 border-slate-700 text-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {data.fullDate}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          data.isProjected
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {data.isProjected ? 'Projeksiyon' : `${data.dayNumber}. Gün`}
                      </span>
                    </div>

                    <div className="space-y-1 font-mono">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-sans">Tasarruf:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {data.savings.toLocaleString('tr-TR')} ₺
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-sans">Sigarasız:</span>
                        <span className="font-semibold text-sky-600 dark:text-sky-400">
                          {data.smokeFreeDays} gün
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-sans">İçilmeyen:</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {data.cigarettesNotSmoked} dal
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey={
                metric === 'savings'
                  ? 'savings'
                  : metric === 'days'
                  ? 'smokeFreeDays'
                  : 'cigarettesNotSmoked'
              }
              stroke={activeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={{
                r: 2.5,
                fill: activeColor,
                strokeWidth: 1.5,
                stroke: isLight ? '#ffffff' : '#0f172a',
              }}
              activeDot={{
                r: 5,
                fill: activeColor,
                strokeWidth: 2,
                stroke: isLight ? '#ffffff' : '#0f172a',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER INSIGHT KICKER */}
      <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Aylık beklenen tasarruf:{' '}
          <strong className="text-slate-800 dark:text-slate-200 font-mono">
            {Math.round(dailyCost * 30).toLocaleString('tr-TR')} ₺
          </strong>
        </span>
        <span className="font-mono text-slate-400">
          {completedFullDays}g tamamlandı
        </span>
      </div>
    </div>
  );
};
