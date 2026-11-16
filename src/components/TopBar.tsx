import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  History,
  Settings,
  ChevronDown,
  X,
  Plus,
  Download,
  LockOpen,
  LayoutGrid,
} from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  historyCount: number;
  activeSection: 'home' | 'catalog' | 'favorites' | 'history' | 'categories';
  onSelectSection: (section: 'home' | 'catalog' | 'favorites' | 'history' | 'categories') => void;
  onOpenSettings: () => void;
  onOpenAddDoc: () => void;
  onExportCsv: () => void;
  userName: string;
  userRole: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  historyCount,
  activeSection,
  onSelectSection,
  onOpenSettings,
  onOpenAddDoc,
  onExportCsv,
  userName,
  userRole,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-6 border-b border-slate-800/80 bg-[#081221]/95 px-5 backdrop-blur-md">
      {/* Zone 1: Brand Lockup */}
      <button
        type="button"
        onClick={() => onSelectSection('home')}
        className="flex shrink-0 items-center gap-3 text-left transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-blue-500"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2b7fff] to-[#1356d8] text-white shadow-md shadow-blue-900/50 ring-1 ring-blue-400/20">
          <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
            {/* Solid 8-tooth gear with circular center cutout */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.2 4.5h3.6l.6 2.3a9.2 9.2 0 0 1 2.2.9l2-1.2 2.5 2.5-1.2 2a9.2 9.2 0 0 1 .9 2.2l2.3.6v3.6l-2.3.6a9.2 9.2 0 0 1-.9 2.2l1.2 2-2.5 2.5-2-1.2a9.2 9.2 0 0 1-2.2.9l-.6 2.3h-3.6l-.6-2.3a9.2 9.2 0 0 1-2.2-.9l-2 1.2-2.5-2.5 1.2-2a9.2 9.2 0 0 1-.9-2.2l-2.3-.6v-3.6l2.3-.6a9.2 9.2 0 0 1 .9-2.2l-1.2-2 2.5-2.5 2 1.2a9.2 9.2 0 0 1 2.2-.9l.6-2.3ZM16 10.2a5.8 5.8 0 1 0 0 11.6 5.8 5.8 0 0 0 0-11.6Z"
              fill="#FFFFFF"
            />
            {/* Eye silhouette inside gear center */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 12.7c-2.6 0-4.7 1.7-5.5 3.3.8 1.6 2.9 3.3 5.5 3.3s4.7-1.7 5.5-3.3c-.8-1.6-2.9-3.3-5.5-3.3Zm0 5.3a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
              fill="#FFFFFF"
            />
            {/* Pupil glint */}
            <circle cx="16.6" cy="15.4" r="0.85" fill="#FFFFFF" />
          </svg>
        </div>
        <div className="whitespace-nowrap">
          <div className="font-display text-[20px] font-bold leading-none tracking-tight text-white">
            Visor<span className="text-[#5da3ff]">Tech</span>
          </div>
          <div className="mt-1 text-[9.5px] font-medium tracking-[0.12em] text-slate-400 uppercase">
            Documentos e Desenhos Industriais
          </div>
        </div>
      </button>

      {/* Zone 2: Global Search Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
        className="relative flex-1 max-w-2xl"
      >
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar por nome, código, equipamento, categoria, TAG..."
          aria-label="Pesquisar documentos técnicos"
          className="h-10 w-full rounded-lg border border-slate-700/70 bg-[#0d192b] pr-9 pl-10 text-sm text-slate-100 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-[#102038] focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Limpar pesquisa"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Zone 3: Quick Nav Actions + Settings + User */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectSection('history')}
          className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors ${
            activeSection === 'history'
              ? 'bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/50'
              : 'text-slate-200 hover:bg-slate-800/70'
          }`}
        >
          <History className="h-4 w-4 text-slate-300" />
          <span>Histórico</span>
          <span className="tabular-nums rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            {historyCount}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          title="Configurações e Sincronização"
          aria-label="Configurações"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-white"
        >
          <Settings className="h-4 w-4" />
        </button>

        <div className="relative ml-1 pl-2 border-l border-slate-800" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-lg py-1 pr-1.5 pl-1 text-left transition-colors hover:bg-slate-800/60"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="hidden sm:block leading-tight whitespace-nowrap">
              <div className="text-sm font-semibold text-slate-100">{userName}</div>
              <div className="text-[11px] text-slate-400">{userRole}</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-700/80 bg-[#0d192b] p-1.5 shadow-2xl">
              <div className="mb-1 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                <LockOpen className="h-3.5 w-3.5 shrink-0" />
                <span>Acesso livre ativo (sem restrição)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAddDoc();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4 text-blue-400" />
                <span>Adicionar documento</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onSelectSection('categories');
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
              >
                <LayoutGrid className="h-4 w-4 text-blue-400" />
                <span>Explorar 18 categorias</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onExportCsv();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
              >
                <Download className="h-4 w-4 text-blue-400" />
                <span>Exportar catálogo CSV</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSettings();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>Preferências do portal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
