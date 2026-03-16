'use client';

import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';

const NAV_ITEMS = [
  { key: 'home',   href: '/',       icon: '🏠', tKey: 'home' },
  { key: 'search', href: '/search', icon: '🔍', tKey: 'search' },
  { key: 'about',  href: '/about',  icon: 'ℹ️',  tKey: 'about' },
];

export default function BottomNav({ active }) {
  const { lang } = useLanguage();
  const t = translations[lang ?? 'es'].nav;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex justify-around items-center z-10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingTop: '12px', minHeight: '64px' }}
    >
      {NAV_ITEMS.map(item => (
        <Link
          key={item.key}
          href={item.href}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
            active === item.key ? 'text-stone-900' : 'text-stone-400'
          }`}
        >
          <span className="text-xl leading-none">{item.icon}</span>
          <span className={`text-xs font-medium ${active === item.key ? 'text-stone-900' : 'text-stone-400'}`}>
            {t[item.tKey]}
          </span>
        </Link>
      ))}
    </nav>
  );
}
