import React from 'react';
import {
  Search,
  RotateCcw,
  Info,
  ChevronRight,
  ChevronDown,
  Folder,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import {
  AdvancedSearchFilters,
  CategoryItem,
  DateRangePreset,
  DocumentType,
} from '../types/documents';
import { TOP_ACCESSED_CATEGORY_IDS } from '../data/catalogData';

interface RightSidebarProps {
  filters: AdvancedSearchFilters;
  onUpdateFilters: (patch: Partial<AdvancedSearchFilters>) => void;
  onApplySearch: () => void;
  onResetFilters: () => void;
  categories: CategoryItem[];
  equipments: string[];
  manufacturers: string[];
  revisions: string[];
  onSelectCategory: (categoryId: string) => void;
  onViewAllCategories: () => void;
  rootFolderName: string;
  driveAccount: string;
  lastSyncTime: string;
  isSyncing: boolean;
  onSyncNow: () => void;
  onOpenDriveDetails: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  filters,
  onUpdateFilters,
  onApplySearch,
  onResetFilters,
  categories,
  equipments,
  manufacturers,
  revisions,
  onSelectCategory,
  onViewAllCategories,
  rootFolderName,
  driveAccount,
  lastSyncTime,
  isSyncing,
  onSyncNow,
  onOpenDriveDetails,
}) => {
  const topCategories = TOP_ACCESSED_CATEGORY_IDS.map((id) =>
    categories.find((c) => c.id === id)
  ).filter(Boolean) as CategoryItem[];

  const dateButtons: { id: DateRangePreset; label: string }[] = [
    { id: 'today', label: 'Hoje' },
    { id: '7d', label: '7 dias' },
    { id: '30d', label: '30 dias' },
    { id: 'custom', label: 'Personalizado' },
  ];

  return (
    <aside className="flex w-full xl:w-[320px] shrink-0 flex-col gap-4 border-l border-slate-800/80 bg-[#081221] p-4">
      {/* 1. Google Drive Status Card */}
      <section className="rounded-xl border border-slate-800/90 bg-[#0c192c] p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            {/* Google Drive Triangle SVG */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#081322] border border-slate-800">
              <svg viewBox="0 0 87.3 78" className="h-6 w-6" aria-hidden="true">
                <path
                  d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
                  fill="#0066da"
                />
                <path
                  d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z"
                  fill="#00ac47"
                />
                <path
                  d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
                  fill="#ea4335"
                />
                <path
                  d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
                  fill="#00832d"
                />
                <path
                  d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
                  fill="#2684fc"
                />
                <path
                  d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
                  fill="#ffba00"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-white">Google Drive</h2>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Conectado</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onSyncNow}
              title={`Sincronizar agora (última: ${lastSyncTime})`}
              aria-label="Sincronizar pasta do Google Drive"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onOpenDriveDetails}
              title="Detalhes da pasta raiz"
              aria-label="Informações da integração Google Drive"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3.5 space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>
              Pasta raiz:{' '}
              <strong className="font-semibold text-slate-100">{rootFolderName}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenDriveDetails}
            className="flex w-full items-center gap-1.5 text-left text-slate-400 transition-colors hover:text-slate-200"
          >
            <span>Conta:</span>
            <ChevronRight className="h-3 w-3 text-slate-500" />
            <span className="truncate font-medium text-slate-200">{driveAccount}</span>
          </button>
        </div>

        <div className="mt-3.5 flex items-start gap-2.5 rounded-lg border border-slate-700/70 bg-[#091526] p-3 text-[11.5px] leading-relaxed text-slate-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
          <p>
            Os arquivos permanecem no Google Drive. Alterações são refletidas automaticamente no
            aplicativo.
          </p>
        </div>
      </section>

      {/* 2. Advanced Search Card */}
      <section className="rounded-xl border border-slate-800/90 bg-[#0c192c] p-4">
        <h2 className="font-display text-[15px] font-bold text-white">Pesquisa avançada</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onApplySearch();
          }}
          className="mt-3 space-y-3"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => onUpdateFilters({ query: e.target.value })}
              placeholder="Digite o termo da sua pesquisa..."
              className="h-9 w-full rounded-lg border border-slate-700/80 bg-[#081221] pr-3 pl-8.5 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Tipo de arquivo */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Tipo de arquivo
              </label>
              <div className="relative">
                <select
                  value={filters.type}
                  onChange={(e) =>
                    onUpdateFilters({ type: e.target.value as DocumentType | 'Todos' })
                  }
                  className="h-9 w-full appearance-none rounded-lg border border-slate-700/80 bg-[#081221] pr-7 pl-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Todos">Todos</option>
                  <option value="Desenho técnico">Desenho técnico</option>
                  <option value="PDF">PDF</option>
                  <option value="Imagem">Imagem</option>
                  <option value="Manual">Manual</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Categoria
              </label>
              <div className="relative">
                <select
                  value={filters.categoryId}
                  onChange={(e) => onUpdateFilters({ categoryId: e.target.value })}
                  className="h-9 w-full appearance-none rounded-lg border border-slate-700/80 bg-[#081221] pr-7 pl-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Todas">Todas</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Equipamento */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Equipamento
              </label>
              <div className="relative">
                <select
                  value={filters.equipment}
                  onChange={(e) => onUpdateFilters({ equipment: e.target.value })}
                  className="h-9 w-full appearance-none rounded-lg border border-slate-700/80 bg-[#081221] pr-7 pl-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Todos">Todos</option>
                  {equipments.map((eq) => (
                    <option key={eq} value={eq}>
                      {eq}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Fabricante */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Fabricante
              </label>
              <div className="relative">
                <select
                  value={filters.manufacturer}
                  onChange={(e) => onUpdateFilters({ manufacturer: e.target.value })}
                  className="h-9 w-full appearance-none rounded-lg border border-slate-700/80 bg-[#081221] pr-7 pl-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Todos">Todos</option>
                  {manufacturers.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Revisão */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Revisão
              </label>
              <div className="relative">
                <select
                  value={filters.revision}
                  onChange={(e) => onUpdateFilters({ revision: e.target.value })}
                  className="h-9 w-full appearance-none rounded-lg border border-slate-700/80 bg-[#081221] pr-7 pl-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Todas">Todas</option>
                  {revisions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* TAG */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">TAG</label>
              <input
                type="text"
                value={filters.tag}
                onChange={(e) => onUpdateFilters({ tag: e.target.value })}
                placeholder="Digite uma TAG..."
                className="h-9 w-full rounded-lg border border-slate-700/80 bg-[#081221] px-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Data de modificação */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-slate-300">
              Data de modificação
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {dateButtons.map((btn) => {
                const active = filters.datePreset === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => onUpdateFilters({ datePreset: btn.id })}
                    className={`h-8 rounded-lg px-1.5 text-[11px] font-medium whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-slate-700/80 bg-[#081221] text-slate-300 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {filters.datePreset === 'custom' && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.customStartDate}
                  onChange={(e) => onUpdateFilters({ customStartDate: e.target.value })}
                  aria-label="Data inicial"
                  className="h-8 rounded-lg border border-slate-700 bg-[#081221] px-2 text-[11px] text-slate-200 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={filters.customEndDate}
                  onChange={(e) => onUpdateFilters({ customEndDate: e.target.value })}
                  aria-label="Data final"
                  className="h-8 rounded-lg border border-slate-700 bg-[#081221] px-2 text-[11px] text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="submit"
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Pesquisar</span>
            </button>
            <button
              type="button"
              onClick={onResetFilters}
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-700/90 bg-[#081221] px-3 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Limpar filtros</span>
            </button>
          </div>
        </form>
      </section>

      {/* 3. Categorias mais acessadas */}
      <section className="rounded-xl border border-slate-800/90 bg-[#0c192c] p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-display text-[14px] font-bold text-white">
            Categorias mais acessadas
          </h2>
          <button
            type="button"
            onClick={onViewAllCategories}
            className="flex items-center gap-1 text-xs font-medium text-blue-400 whitespace-nowrap hover:text-blue-300"
          >
            <span>Ver todas</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/70">
          {topCategories.map((cat, idx) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="group flex w-full items-center justify-between gap-2 py-2.5 text-left transition-colors hover:bg-slate-800/30 rounded px-1 -mx-1"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="tabular-nums flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-[#081221] text-[10px] font-semibold text-slate-300">
                  {idx + 1}
                </span>
                <Folder className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-blue-400" />
                <span className="truncate text-xs font-medium text-slate-200 group-hover:text-white">
                  {cat.label}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-slate-400">
                <span className="tabular-nums">{cat.fileCount} arquivos</span>
                <ChevronRight className="h-3 w-3 text-slate-500 group-hover:text-slate-300" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
};
