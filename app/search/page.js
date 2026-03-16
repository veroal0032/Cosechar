'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { translations } from '@/app/i18n/translations';
import { slugify } from '@/app/lib/utils';
import BottomNav from '@/app/components/BottomNav';
import produce from '@/data/produce.json';

export default function SearchPage() {
  const { lang } = useLanguage();
  const l = lang ?? 'es';
  const t = translations[l];

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (lang === null) return null;

  const q = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const results = q.length === 0 ? [] : produce.filter(item => {
    const nameEs = item.nombre.es.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const nameEn = item.nombre.en.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const alias  = (item.alias ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return nameEs.includes(q) || nameEn.includes(q) || alias.includes(q);
  });

  const showEmpty = q.length > 0 && results.length === 0;

  return (
    <div className="min-h-screen bg-stone-50 pb-24">

      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 mb-5">
          {l === 'en' ? 'Search' : 'Buscar'}
        </h1>

        {/* Search input */}
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={l === 'en' ? 'Fruit or vegetable…' : 'Fruta o verdura…'}
            className="w-full bg-white border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-stone-800 placeholder-stone-400 text-base outline-none focus:border-stone-400 transition-colors"
          />
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="px-4 flex flex-col gap-2">
          <p className="px-1 pb-1 text-xs text-stone-400 uppercase tracking-widest font-medium">
            {results.length} {results.length === 1
              ? (l === 'en' ? 'result' : 'resultado')
              : (l === 'en' ? 'results' : 'resultados')}
          </p>
          {results.map(item => (
            <Link
              key={item.nombre.es}
              href={`/detalle/${slugify(item.nombre.es)}`}
              className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3.5 shadow-xs border border-stone-100 active:scale-[0.98] transition-transform"
            >
              <span className="text-3xl leading-none select-none">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800 text-base">{item.nombre[l]}</p>
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
      )}

      {/* Empty state */}
      {showEmpty && (
        <div className="flex flex-col items-center justify-center pt-20 px-8 text-center">
          <span className="text-5xl mb-4 select-none">🔍</span>
          <p className="text-stone-700 font-semibold text-base mb-1">
            {l === 'en' ? `Nothing found for "${query}"` : `Sin resultados para "${query}"`}
          </p>
          <p className="text-stone-400 text-sm">
            {l === 'en'
              ? 'Try a different name or check the spelling.'
              : 'Prueba con otro nombre o revisa la ortografía.'}
          </p>
        </div>
      )}

      {/* Idle state */}
      {q.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-20 px-8 text-center">
          <span className="text-5xl mb-4 select-none">🌿</span>
          <p className="text-stone-400 text-sm">
            {l === 'en'
              ? 'Start typing to find any fruit or vegetable.'
              : 'Empieza a escribir para buscar frutas y verduras.'}
          </p>
        </div>
      )}

      <BottomNav active="search" />
    </div>
  );
}
