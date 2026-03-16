'use client';

import { useLanguage } from '@/app/contexts/LanguageContext';
import BottomNav from '@/app/components/BottomNav';

export default function AboutPage() {
  const { lang } = useLanguage();
  const l = lang ?? 'es';

  if (lang === null) return null;

  return (
    <div className="min-h-screen bg-stone-50 pb-24">

      {/* Header */}
      <div className="px-5 pt-14 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          {l === 'en' ? 'About' : 'Info'}
        </h1>
      </div>

      <div className="px-5 flex flex-col gap-4">

        {/* App identity card */}
        <div className="bg-white rounded-3xl px-6 py-6 border border-stone-100">
          <div className="text-5xl mb-4 select-none">🌱</div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight mb-1">Cosechar</h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            {l === 'en'
              ? 'Seasonal fruits & vegetables in Argentina'
              : 'Frutas y verduras de temporada en Argentina'}
          </p>
        </div>

        {/* Description card */}
        <div className="bg-white rounded-3xl px-6 py-5 border border-stone-100">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-3">
            {l === 'en' ? 'What is this?' : '¿Qué es esto?'}
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            {l === 'en'
              ? 'Cosechar helps you discover which fruits and vegetables are in season in Argentina right now. Eating seasonal produce means better flavour, more nutrients, and lower prices.'
              : 'Cosechar te ayuda a descubrir qué frutas y verduras están en temporada en Argentina en este momento. Comer productos de estación significa mejor sabor, más nutrientes y mejores precios.'}
          </p>
        </div>

        {/* Data source card */}
        <div className="bg-white rounded-3xl px-6 py-5 border border-stone-100">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-3">
            {l === 'en' ? 'Data source' : 'Fuente de datos'}
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            {l === 'en'
              ? 'Official data from the Argentine Ministry of Economy (Ministerio de Economía de la Nación Argentina).'
              : 'Datos oficiales del Ministerio de Economía de Argentina.'}
          </p>
        </div>

        {/* Feedback card */}
        <div className="bg-white rounded-3xl px-6 py-5 border border-stone-100">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-3">
            {l === 'en' ? 'Share your feedback' : '¡Cuéntanos qué piensas!'}
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            {l === 'en'
              ? <>Did you like it? Something missing? Write to us on Instagram 🌿{' '}
                  <a href="https://instagram.com/vero.explores" target="_blank" rel="noopener noreferrer" className="font-semibold text-stone-800 underline underline-offset-2">@vero.explores</a></>
              : <>¿Te gustó? ¿Falta algo? Escríbenos en Instagram 🌿{' '}
                  <a href="https://instagram.com/vero.explores" target="_blank" rel="noopener noreferrer" className="font-semibold text-stone-800 underline underline-offset-2">@vero.explores</a></>}
          </p>
        </div>

        {/* Made by card */}
        <div className="bg-white rounded-3xl px-6 py-5 border border-stone-100">
          <p className="text-sm text-stone-500 leading-relaxed">
            {l === 'en' ? 'Made with 🌱 by ' : 'Hecho con 🌱 por '}
            <a
              href="https://instagram.com/vero.explores"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-stone-800 underline underline-offset-2"
            >
              vero.explores
            </a>
          </p>
        </div>

      </div>

      <BottomNav active="about" />
    </div>
  );
}
