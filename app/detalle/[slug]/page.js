'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { translations } from '@/app/i18n/translations';
import { SEASON_ORDER, SEASON_BG, SEASON_EMOJI, slugify, allCarouselItems } from '@/app/lib/utils';

const PADDING = 40; // px on each side — creates the card peek
const GAP     = 16; // px between cards
const cardStep = (vw) => vw - PADDING * 2 + GAP; // vw = el.clientWidth

const TOTAL = allCarouselItems.length;
// Infinite loop structure: [clone_last, item_0 … item_N-1, clone_first]
// DOM indices:              0           1 …         N       N+1
const renderItems = [
  allCarouselItems[TOTAL - 1],
  ...allCarouselItems,
  allCarouselItems[0],
];

export default function DetailPage() {
  const { slug } = useParams();
  const router   = useRouter();
  const { lang } = useLanguage();
  const l = lang ?? 'es';
  const t = translations[l];

  const startIndex = Math.max(
    0,
    allCarouselItems.findIndex(item => slugify(item.nombre.es) === slug)
  );

  // activeIndex = real item index (0 … TOTAL-1)
  // Corresponding DOM index = activeIndex + 1  (clone prepended at 0)
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [bgColor, setBgColor] = useState(() => {
    const season = allCarouselItems[startIndex]?.estacion?.[0]?.trim().toLowerCase().normalize('NFC');
    return SEASON_BG[season] ?? SEASON_BG.verano;
  });
  const scrollRef = useRef(null);
  const rafRef    = useRef(null);

  const activeSeason = allCarouselItems[activeIndex]?.estacion?.[0]?.trim().toLowerCase().normalize('NFC') ?? 'verano';

  // Sync bgColor to <html> so iOS Safari overscroll areas match the card background
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.backgroundColor;
    html.style.backgroundColor = bgColor;
    return () => { html.style.backgroundColor = prev; };
  }, [bgColor]);

  // Lock body scroll while carousel is open.
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPosition = body.style.position;
    const prevWidth    = body.style.width;
    const prevTop      = body.style.top;
    const scrollY = window.scrollY;
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width    = '100%';
    body.style.top      = `-${scrollY}px`;
    return () => {
      body.style.overflow  = prevOverflow;
      body.style.position  = prevPosition;
      body.style.width     = prevWidth;
      body.style.top       = prevTop;
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Set initial scroll position — DOM index = startIndex + 1 (prepended clone offsets by 1)
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = (startIndex + 1) * cardStep(el.clientWidth);
    el.style.scrollBehavior = '';
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll handler — update active index and teleport when landing on a clone
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      const step   = cardStep(el.clientWidth);
      const domIdx = Math.round(el.scrollLeft / step);

      const applyRealIndex = (realIdx) => {
        setActiveIndex(realIdx);
        const season = allCarouselItems[realIdx]?.estacion?.[0]?.trim().toLowerCase().normalize('NFC');
        setBgColor(SEASON_BG[season] ?? SEASON_BG.verano);
      };

      if (domIdx === 0) {
        // Landed on clone of last item — teleport to real last
        el.style.scrollBehavior = 'auto';
        el.scrollLeft = TOTAL * step;
        el.style.scrollBehavior = '';
        applyRealIndex(TOTAL - 1);
      } else if (domIdx === TOTAL + 1) {
        // Landed on clone of first item — teleport to real first
        el.style.scrollBehavior = 'auto';
        el.scrollLeft = step;
        el.style.scrollBehavior = '';
        applyRealIndex(0);
      } else {
        const realIdx = domIdx - 1;
        if (realIdx >= 0 && realIdx < TOTAL) applyRealIndex(realIdx);
      }
    });
  }, []);

  // Jump to first item of a season
  const jumpToSeason = useCallback((season) => {
    const realIdx = allCarouselItems.findIndex(item => item.estacion[0] === season);
    if (realIdx < 0 || !scrollRef.current) return;
    const domIdx = realIdx + 1; // +1 for prepended clone
    const el = scrollRef.current;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = domIdx * cardStep(el.clientWidth);
    el.style.scrollBehavior = '';
  }, []);

  if (lang === null) return null;

  const activeDomIndex = activeIndex + 1;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: bgColor,
        transition: 'background-color 0.5s ease',
      }}
    >

      {/* ── Header ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-semibold active:scale-95 transition-transform"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {l === 'en' ? 'Back' : 'Volver'}
        </button>

        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-full px-3 py-2">
          {SEASON_ORDER.map(s => {
            const isActive = activeSeason === s;
            return (
              <button
                key={s}
                onClick={() => jumpToSeason(s)}
                className="transition-all px-1"
                style={{
                  fontSize: isActive ? '1.35rem' : '1.1rem',
                  opacity: isActive ? 1 : 0.45,
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {SEASON_EMOJI[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Horizontal carousel ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="hide-scrollbar absolute inset-0 flex items-center"
        style={{
          overflowX: 'scroll',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
          background: 'transparent',
          gap: `${GAP}px`,
          paddingLeft: `${PADDING}px`,
          paddingRight: `${PADDING}px`,
          scrollPaddingLeft: `${PADDING}px`,
        }}
      >
        {renderItems.map((item, domI) => {
          const dist      = Math.abs(domI - activeDomIndex);
          const isActive  = dist === 0;
          const showImage = dist <= 3;

          return (
            <div
              key={`${domI}-${item.nombre.es}`}
              style={{
                flexShrink: 0,
                width: `calc(100vw - ${PADDING * 2}px)`,
                scrollSnapAlign: 'start',
                paddingTop: '88px',
                paddingBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
              }}
            >
              {/* Card */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  backgroundColor: '#fff',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  transform: isActive ? 'scale(1)' : 'scale(0.91)',
                  opacity: isActive ? 1 : 0.5,
                  boxShadow: isActive
                    ? '0 20px 60px rgba(0,0,0,0.4), 0 40px 40px -20px rgba(0,0,0,0.3)'
                    : '0 8px 24px rgba(0,0,0,0.2)',
                  transition: 'transform 0.4s cubic-bezier(0.34,1.4,0.64,1), opacity 0.4s ease, box-shadow 0.4s ease',
                }}
              >
                {/* ── Photo ── */}
                <div style={{ padding: '12px 12px 0 12px' }}>
                  <div style={{ position: 'relative', paddingTop: '62%', borderRadius: '16px', overflow: 'hidden', background: '#f5f5f4' }}>
                  {showImage && (
                    <img
                      src={item.imagen}
                      alt={item.nombre[l]}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading={dist === 0 ? 'eager' : 'lazy'}
                    />
                  )}

                  </div>{/* end image container */}
                </div>{/* end padding wrapper */}

                {/* ── Season badges ── */}
                <div className="px-5 pt-3 pb-2 flex items-center justify-center gap-1.5 flex-wrap">
                  {item.estacion.map(s => (
                    <div
                      key={s}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: SEASON_BG[s] }}
                    >
                      <span>{SEASON_EMOJI[s]}</span>
                      <span>{t.seasons[s]?.label}</span>
                    </div>
                  ))}
                </div>

                {/* ── Info ── */}
                <div className="px-5 pt-2 pb-5">
                  <h2 className="text-[22px] font-bold text-stone-900 leading-snug mb-4">
                    {item.nombre[l]}
                    {item.alias && (
                      <span className="text-stone-400 font-semibold"> · {item.alias}</span>
                    )}
                  </h2>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-stone-50 rounded-2xl p-3 text-center">
                      <p className="text-[10px] uppercase tracking-wide text-stone-400 font-semibold">Cal.</p>
                      <p className="text-xl font-bold text-stone-800 leading-tight mt-1">{item.calorias}</p>
                      <p className="text-[10px] text-stone-400">kcal</p>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3">
                      <p className="text-[10px] uppercase tracking-wide text-stone-400 font-semibold mb-1.5">
                        {l === 'en' ? 'Vitamins' : 'Vitaminas'}
                      </p>
                      <p className="text-[11px] font-semibold text-stone-700 leading-snug">
                        {item.vitaminas.join(' · ')}
                      </p>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3">
                      <p className="text-[10px] uppercase tracking-wide text-stone-400 font-semibold mb-1.5">
                        {l === 'en' ? 'Minerals' : 'Minerales'}
                      </p>
                      <p className="text-[11px] font-semibold text-stone-700 leading-snug">
                        {item.minerales.slice(0, 2).join(' · ')}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {item.descripcion_corta[l]}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-10">
        {SEASON_ORDER.map(s => (
          <div
            key={s}
            className="rounded-full transition-all"
            style={{
              width: activeSeason === s ? '20px' : '6px',
              height: '6px',
              backgroundColor: activeSeason === s ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
