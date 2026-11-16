import React from 'react';
import {
  Search,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Folder,
  ArrowRight,
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
      {/* Advanced Search Card */}
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
