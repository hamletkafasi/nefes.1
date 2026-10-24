import React, { useState } from 'react';
import { Smartphone, Monitor, Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../types';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  theme = 'light',
  onToggleTheme,
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'responsive'>('mobile');
  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start p-0 md:p-6 transition-colors duration-300 ${
        isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Top Device Switcher Toolbar (Hidden on actual phones) */}
      <header
        className={`hidden md:flex items-center justify-between w-full max-w-4xl py-3 px-4 mb-4 rounded-2xl backdrop-blur-md border shadow-sm transition-colors ${
          isLight
            ? 'bg-white/90 border-slate-200/90 text-slate-800'
            : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
            🫁
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              Nefes · Akciğer Simülatörü & Sağlık Takibi
            </h1>
            <p className="text-[11px] text-slate-500">
              Mobil Arayüz & Canlı Veritabanı
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
              }`}
              title="Açık / Koyu Tema Değiştir"
            >
              {isLight ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Açık Tema</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Koyu Tema</span>
                </>
              )}
            </button>
          )}

          {/* Mode switch */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
            }`}
          >
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Telefon Modu</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('responsive')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                deviceMode === 'responsive'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Geniş Ekran</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          deviceMode === 'mobile'
            ? `md:max-w-[420px] md:my-auto md:border-[10px] ${
                isLight
                  ? 'md:border-slate-300 md:bg-white md:shadow-xl md:shadow-slate-300/40'
                  : 'md:border-slate-800 md:bg-slate-950 md:shadow-2xl md:shadow-emerald-950/40'
              } md:rounded-[48px] md:overflow-hidden relative`
            : 'max-w-3xl'
        }`}
      >
        {/* Dynamic Island on Desktop Phone Mode */}
        {deviceMode === 'mobile' && (
          <div
            className={`hidden md:flex justify-center pt-3 pb-1 relative z-40 transition-colors ${
              isLight ? 'bg-slate-50 border-b border-slate-100' : 'bg-slate-950'
            }`}
          >
            <div className="w-28 h-5 bg-black rounded-full flex items-center justify-between px-3 border border-slate-700/50">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        )}

        {/* App Content */}
        <div
          className={`min-h-screen md:min-h-[780px] md:max-h-[850px] md:overflow-y-auto flex flex-col transition-colors ${
            isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
