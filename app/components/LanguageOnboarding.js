import AppName from './AppName';

export default function LanguageOnboarding({ onSelect }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">

      {/* App identity */}
      <div className="text-center mb-14">
        <div className="text-7xl mb-5 select-none">🌱</div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight"><AppName /></h1>
        <p className="text-stone-400 mt-2 text-sm tracking-wide">
          Temporada argentina · Seasonal produce
        </p>
      </div>

      {/* Language prompt */}
      <p className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-6">
        Idioma · Choose your language
      </p>

      {/* Language buttons */}
      <div className="flex gap-4 w-full max-w-xs">
        <button
          onClick={() => onSelect('es')}
          className="flex-1 flex flex-col items-center gap-3 bg-white rounded-3xl py-7 px-4 shadow-sm border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all active:scale-95"
        >
          <span className="text-4xl select-none">🇦🇷</span>
          <span className="font-semibold text-stone-800 text-base">Español</span>
        </button>

        <button
          onClick={() => onSelect('en')}
          className="flex-1 flex flex-col items-center gap-3 bg-white rounded-3xl py-7 px-4 shadow-sm border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all active:scale-95"
        >
          <span className="text-4xl select-none">🇬🇧</span>
          <span className="font-semibold text-stone-800 text-base">English</span>
        </button>
      </div>

    </div>
  );
}
