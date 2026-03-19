'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './contexts/LanguageContext';
import { translations } from './i18n/translations';
import { slugify } from './lib/utils';
import BottomNav from './components/BottomNav';
import LanguageOnboarding from './components/LanguageOnboarding';
import AppName from './components/AppName';
import produce from '@/data/produce.json';

const SEASON_ORDER = ['verano', 'otoño', 'invierno', 'primavera'];

const SEASON_INFO = {
  verano:    { emoji: '🌞', chipBg: '#FFE8E8', chipText: '#CC2222', activeBg: '#FF6B6B' },
  otoño:     { emoji: '🍂', chipBg: '#F5DDD5', chipText: '#C1440E', activeBg: '#C1440E' },
  invierno:  { emoji: '❄️', chipBg: '#E3F2FD', chipText: '#1565C0', activeBg: '#1565C0' },
  primavera: { emoji: '🌸', chipBg: '#E8F5E9', chipText: '#2E7D32', activeBg: '#2E7D32' },
};

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 12 || month <= 2) return 'verano';
  if (month >= 3 && month <= 5) return 'otoño';
  if (month >= 6 && month <= 8) return 'invierno';
  return 'primavera';
}

const FILTER_KEYS = ['todo', 'fruta', 'verdura'];

export default function Home() {
  const { lang, setLang, setSelectedSeason } = useLanguage();
  const [filter, setFilter] = useState('todo');
  const [season, setSeason] = useState(() => (typeof window !== 'undefined' ? sessionStorage.getItem('selectedSeason') : null) || getCurrentSeason());
  const [pickerOpen, setPickerOpen] = useState(false);

  if (lang === null) return null;
  if (lang === '') return <LanguageOnboarding onSelect={setLang} />;

  const t = translations[lang];
  const currentSeason = getCurrentSeason();
  const seasonStyle = SEASON_INFO[season];
  const seasonLabel = t.seasons[season];

  const items = produce.filter(
    item =>
      item.estacion.includes(season) &&
      (filter === 'todo' || item.tipo === filter)
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-24">

      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900"><AppName /></h1>
            <p className="text-stone-400 text-sm mt-1">{t.appSubtitle}</p>
          </div>
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="mt-1 text-xl select-none active:scale-90 transition-transform"
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            {lang === 'es' ? '🇺🇸' : '🇦🇷'}
          </button>
        </div>

        {/* Season selector chip */}
        <button
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-semibold active:scale-95 transition-transform"
          style={{ backgroundColor: seasonStyle.chipBg, color: seasonStyle.chipText }}
        >
          <span>{seasonStyle.emoji}</span>
          <span>{seasonLabel.label} · {seasonLabel.dates}</span>
          <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter pills */}
      <div className="px-5 pt-5 pb-3 flex gap-2">
        {FILTER_KEYS.map(key => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === key
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            {t.filters[key]}
          </button>
        ))}
      </div>

      {/* Count label */}
      <div className="px-5 pb-3">
        <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">
          {t.inSeason(items.length)}
        </p>
      </div>

      {/* Produce list */}
      <div className="px-4 flex flex-col gap-2">
        {items.map(item => (
          <Link
            key={item.nombre.es}
            onClick={() => { sessionStorage.setItem('selectedSeason', season); setSelectedSeason(season); }}
            href={`/detalle/${slugify(item.nombre.es)}`}
            className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3.5 shadow-xs border border-stone-100 active:scale-[0.98] transition-transform"
          >
            <span className="text-3xl leading-none select-none">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 text-base">{item.nombre[lang]}</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {item.calorias} {t.kcal} · {t.tipos[item.tipo]}
              </p>
            </div>
            <svg className="w-4 h-4 text-stone-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      <BottomNav active="home" />

      {/* Season picker bottom sheet */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPickerOpen(false)}
          />

          {/* Sheet */}
          <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-10">
            {/* Handle */}
            <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-5" />

            <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-4">
              {lang === 'en' ? 'Select a season' : 'Elige una estación'}
            </p>

            <div className="flex flex-col gap-2">
              {SEASON_ORDER.map(s => {
                const info  = SEASON_INFO[s];
                const label = t.seasons[s];
                const isSelected = s === season;
                const isCurrent  = s === currentSeason;

                return (
                  <button
                    key={s}
                    onClick={() => { setSeason(s); setPickerOpen(false); }}
                    className="flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-all active:scale-[0.98]"
                    style={{
                      backgroundColor: isSelected ? info.chipBg : 'transparent',
                      border: `1.5px solid ${isSelected ? info.chipBg : '#e7e5e4'}`,
                    }}
                  >
                    <span className="text-2xl leading-none select-none">{info.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-base"
                        style={{ color: isSelected ? info.chipText : '#292524' }}
                      >
                        {label.label}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">{label.dates}</p>
                    </div>
                    {isCurrent && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: info.chipBg, color: info.chipText }}
                      >
                        {lang === 'en' ? 'Now' : 'Ahora'}
                      </span>
                    )}
                    {isSelected && (
                      <svg className="w-4 h-4 shrink-0" style={{ color: info.chipText }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
