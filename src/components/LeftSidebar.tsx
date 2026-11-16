import React from 'react';
import { Home, Folder, ChevronRight } from 'lucide-react';
import { CategoryItem } from '../types/documents';

interface LeftSidebarProps {
  categories: CategoryItem[];
  activeCategoryId: string | null;
  isHomeActive: boolean;
  onSelectHome: () => void;
  onSelectCategory: (categoryId: string) => void;
  rootFolderName: string;
  onOpenDriveInfo: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  categories,
  activeCategoryId,
  isHomeActive,
  onSelectHome,
  onSelectCategory,
  rootFolderName,
  onOpenDriveInfo,
}) => {
  const sidebarCategories = categories.filter((c) => c.showInSidebar);

  return (
    <aside className="flex w-[264px] shrink-0 flex-col border-r border-slate-800/80 bg-[#081221]">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <button
          type="button"
          onClick={onSelectHome}
          className={`mb-2 flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all ${
            isHomeActive
              ? 'bg-gradient-to-r from-[#1d63dc] to-[#154eb4] text-white shadow-md shadow-blue-950/50'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span className="truncate">Início</span>
        </button>

        <nav aria-label="Categorias técnicas" className="space-y-0.5">
          {sidebarCategories.map((cat) => {
            const isSelected = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[12.5px] font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/40'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Folder
                    className={`h-4 w-4 shrink-0 ${
                      isSelected ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{cat.label}</span>
                </span>
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                    isSelected
                      ? 'translate-x-0.5 text-blue-400'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Drive Connection Footer */}
      <button
        type="button"
        onClick={onOpenDriveInfo}
        className="border-t border-slate-800/80 bg-[#07101d] px-4 py-3.5 text-left transition-colors hover:bg-slate-900/60"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
          <span>Conectado ao Google Drive</span>
        </div>
        <div className="mt-1 pl-4.5 text-[11px] text-slate-400">
          Pasta raiz: <span className="font-semibold text-slate-200">{rootFolderName}</span>
        </div>
      </button>
    </aside>
  );
};
