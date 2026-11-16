import React, { useMemo, useState, useEffect } from 'react';
import {
  FileText,
  Folder,
  DraftingCompass,
  Image as ImageIcon,
  BookOpen,
  Star,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  List,
  Plus,
  Menu,
  X,
  SearchX,
  RotateCcw,
} from 'lucide-react';
import {
  CATEGORIES,
  HERO_BANNER_IMAGE,
  INITIAL_DOCUMENTS,
  INITIAL_FAVORITE_IDS,
  INITIAL_HISTORY,
} from './data/catalogData';
import {
  AdvancedSearchFilters,
  HistoryEntry,
  QuickAccessFilter,
  TechnicalDocument,
} from './types/documents';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { DocumentCard } from './components/DocumentCard';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { SettingsModal } from './components/SettingsModal';

type ActiveView = 'home' | 'catalog' | 'favorites' | 'history' | 'categories';

const DEFAULT_FILTERS: AdvancedSearchFilters = {
  query: '',
  type: 'Todos',
  categoryId: 'Todas',
  equipment: 'Todos',
  manufacturer: 'Todos',
  revision: 'Todas',
  tag: '',
  datePreset: '30d',
  customStartDate: '',
  customEndDate: '',
};

const STORAGE_KEYS = {
  docs: 'ct_documents_v1',
  favorites: 'ct_favorites_v1',
  history: 'ct_history_v1',
  prefs: 'ct_prefs_v1',
};

export default function App() {
  const [documents, setDocuments] = useState<TechnicalDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.docs);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.favorites);
      return saved ? JSON.parse(saved) : INITIAL_FAVORITE_IDS;
    } catch {
      return INITIAL_FAVORITE_IDS;
    }
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.history);
      return saved ? JSON.parse(saved) : INITIAL_HISTORY;
    } catch {
      return INITIAL_HISTORY;
    }
  });

  const [workspacePrefs, setWorkspacePrefs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.prefs);
      return saved
        ? JSON.parse(saved)
        : {
            userName: 'Fernando Franco',
            userRole: 'Usuário',
          };
    } catch {
      return {
        userName: 'Fernando Franco',
        userRole: 'Usuário',
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.docs, JSON.stringify(documents));
    } catch {
      // ignore storage quota errors
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favoriteIds));
    } catch {
      // ignore
    }
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.prefs, JSON.stringify(workspacePrefs));
    } catch {
      // ignore
    }
  }, [workspacePrefs]);

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filters, setFilters] = useState<AdvancedSearchFilters>(DEFAULT_FILTERS);
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [selectedDoc, setSelectedDoc] = useState<TechnicalDocument | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'prefs' | 'add'>('prefs');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic dropdown options from catalog
  const equipments = useMemo(
    () => Array.from(new Set(documents.map((d) => d.equipment))).sort(),
    [documents]
  );
  const manufacturers = useMemo(
    () => Array.from(new Set(documents.map((d) => d.manufacturer))).sort(),
    [documents]
  );
  const revisions = useMemo(
    () =>
      Array.from(new Set(documents.map((d) => d.revision).filter((r) => r && r !== '-'))).sort(),
    [documents]
  );

  // Reference baseline date (2026-10-02 matches recent docs so date presets filter cleanly)
  const referenceNowMs = useMemo(() => {
    const latest = documents.reduce((max, d) => {
      const t = new Date(d.updatedIso).getTime();
      return t > max ? t : max;
    }, 0);
    return latest || Date.now();
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const combinedQuery = (globalSearch || filters.query).trim().toLowerCase();
    const tagTerm = filters.tag.trim().toLowerCase();

    return documents.filter((doc) => {
      if (selectedCategoryId && doc.categoryId !== selectedCategoryId) {
        return false;
      }
      if (
        !selectedCategoryId &&
        filters.categoryId !== 'Todas' &&
        doc.categoryId !== filters.categoryId
      ) {
        return false;
      }
      if (filters.type !== 'Todos' && doc.type !== filters.type) {
        return false;
      }
      if (filters.equipment !== 'Todos' && doc.equipment !== filters.equipment) {
        return false;
      }
      if (filters.manufacturer !== 'Todos' && doc.manufacturer !== filters.manufacturer) {
        return false;
      }
      if (filters.revision !== 'Todas' && doc.revision !== filters.revision) {
        return false;
      }
      if (tagTerm && !doc.tags.some((t) => t.toLowerCase().includes(tagTerm))) {
        return false;
      }
      if (combinedQuery) {
        const haystack = [
          doc.code,
          doc.title,
          doc.equipment,
          doc.manufacturer,
          doc.categoryLabel,
          doc.type,
          ...doc.tags,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(combinedQuery)) {
          return false;
        }
      }

      // Date filter only when actively browsing catalog/search
      if (activeView === 'catalog') {
        const docMs = new Date(doc.updatedIso).getTime();
        if (filters.datePreset === 'today') {
          if (referenceNowMs - docMs > 24 * 60 * 60 * 1000) return false;
        } else if (filters.datePreset === '7d') {
          if (referenceNowMs - docMs > 7 * 24 * 60 * 60 * 1000) return false;
        } else if (filters.datePreset === 'custom') {
          if (filters.customStartDate) {
            const startMs = new Date(filters.customStartDate).getTime();
            if (docMs < startMs) return false;
          }
          if (filters.customEndDate) {
            const endMs = new Date(filters.customEndDate).getTime() + 86400000;
            if (docMs > endMs) return false;
          }
        }
      }

      return true;
    });
  }, [documents, globalSearch, filters, selectedCategoryId, activeView, referenceNowMs]);

  const recentSixDocuments = useMemo(() => {
    const featured = documents.filter((d) => d.featuredRecent);
    if (featured.length >= 6) return featured.slice(0, 6);
    return documents.slice(0, 6);
  }, [documents]);

  const favoriteDocuments = useMemo(
    () => documents.filter((d) => favoriteIds.includes(d.id)),
    [documents, favoriteIds]
  );

  const historyDocuments = useMemo(() => {
    return history
      .map((entry) => {
        const doc = documents.find((d) => d.id === entry.documentId);
        return doc ? { doc, viewedAt: entry.viewedAt } : null;
      })
      .filter(Boolean) as { doc: TechnicalDocument; viewedAt: string }[];
  }, [history, documents]);

  const handleToggleFavorite = (docId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleOpenDocument = (doc: TechnicalDocument) => {
    setSelectedDoc(doc);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const viewedAt = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}`;

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.documentId !== doc.id);
      return [{ documentId: doc.id, viewedAt }, ...filtered].slice(0, 24);
    });
  };

  const handleSelectHome = () => {
    setActiveView('home');
    setSelectedCategoryId(null);
    setGlobalSearch('');
    setFilters(DEFAULT_FILTERS);
    setMobileMenuOpen(false);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setFilters((prev) => ({ ...prev, categoryId }));
    setActiveView('catalog');
    setMobileMenuOpen(false);
  };

  const handleQuickAccess = (target: QuickAccessFilter) => {
    if (target === 'all_categories') {
      setSelectedCategoryId(null);
      setActiveView('categories');
      return;
    }
    if (target === 'favorites') {
      setSelectedCategoryId(null);
      setActiveView('favorites');
      return;
    }
    setSelectedCategoryId(null);
    setFilters({ ...DEFAULT_FILTERS, type: target });
    setActiveView('catalog');
  };

  const handleApplyAdvancedSearch = () => {
    setSelectedCategoryId(filters.categoryId !== 'Todas' ? filters.categoryId : null);
    setActiveView('catalog');
  };

  const handleResetFilters = () => {
    setGlobalSearch('');
    setSelectedCategoryId(null);
    setFilters(DEFAULT_FILTERS);
  };

  const handleGlobalSearchChange = (q: string) => {
    setGlobalSearch(q);
    if (q.trim().length > 0 && activeView === 'home') {
      setActiveView('catalog');
    } else if (q.trim().length === 0 && activeView === 'catalog' && !selectedCategoryId) {
      // stay or let user navigate cleanly
    }
  };

  const handleExportCsv = () => {
    const headers = ['Código', 'Título', 'Tipo', 'Categoria', 'Equipamento', 'Fabricante', 'Revisão', 'Atualizado'];
    const rows = filteredDocuments.map((d) =>
      [d.code, d.title, d.type, d.categoryLabel, d.equipment, d.manufacturer, d.revision, d.updatedAt]
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'consulta_tecnica_catalogo.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Counts displayed on Quick Access cards (matching screenshot baseline + live deltas)
  const extraDocs = Math.max(0, documents.length - INITIAL_DOCUMENTS.length);
  const drawingsCount = (1248 + documents.filter((d) => d.id.startsWith('doc-17') && d.type === 'Desenho técnico').length).toLocaleString('pt-BR');
  const imagesCount = (856 + documents.filter((d) => d.id.startsWith('doc-17') && d.type === 'Imagem').length).toLocaleString('pt-BR');
  const pdfsCount = (642 + documents.filter((d) => d.id.startsWith('doc-17') && d.type === 'PDF').length).toLocaleString('pt-BR');
  const manualsCount = (328 + documents.filter((d) => d.id.startsWith('doc-17') && d.type === 'Manual').length).toLocaleString('pt-BR');
  const quickFavoritesCount = 36 + favoriteIds.length; // 42 initially, updates dynamically

  const quickAccessCards: {
    id: QuickAccessFilter;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconBg: string;
  }[] = [
    {
      id: 'all_categories',
      title: 'Todas as categorias',
      subtitle: `${CATEGORIES.length} categorias`,
      icon: <Folder className="h-5 w-5 text-white" />,
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-700',
    },
    {
      id: 'Desenho técnico',
      title: 'Desenhos técnicos',
      subtitle: `${extraDocs ? (1248 + extraDocs).toLocaleString('pt-BR') : drawingsCount} arquivos`,
      icon: <DraftingCompass className="h-5 w-5 text-white" />,
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    },
    {
      id: 'Imagem',
      title: 'Imagens',
      subtitle: `${imagesCount} arquivos`,
      icon: <ImageIcon className="h-5 w-5 text-white" />,
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-700',
    },
    {
      id: 'PDF',
      title: 'PDFs',
      subtitle: `${pdfsCount} arquivos`,
      icon: <FileText className="h-5 w-5 text-white" />,
      iconBg: 'bg-gradient-to-br from-rose-500 to-red-700',
    },
    {
      id: 'Manual',
      title: 'Manuais',
      subtitle: `${manualsCount} arquivos`,
      icon: <BookOpen className="h-5 w-5 text-white" />,
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-600',
    },
    {
      id: 'favorites',
      title: 'Favoritos',
      subtitle: `${quickFavoritesCount} arquivos`,
      icon: <Star className="h-5 w-5 fill-white text-white" />,
      iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    },
  ];

  const activeCategoryObj = selectedCategoryId
    ? CATEGORIES.find((c) => c.id === selectedCategoryId)
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#07101d] text-slate-100">
      <TopBar
        searchQuery={globalSearch}
        onSearchChange={handleGlobalSearchChange}
        onSearchSubmit={() => setActiveView('catalog')}
        historyCount={history.length}
        activeSection={activeView}
        onSelectSection={(sec) => {
          setSelectedCategoryId(null);
          setActiveView(sec);
        }}
        onOpenSettings={() => {
          setSettingsTab('prefs');
          setSettingsOpen(true);
        }}
        onOpenAddDoc={() => {
          setSettingsTab('add');
          setSettingsOpen(true);
        }}
        onExportCsv={handleExportCsv}
        userName={workspacePrefs.userName}
        userRole={workspacePrefs.userRole}
      />

      {/* Mobile category drawer trigger */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#081221] px-4 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0d192b] px-3 py-1.5 text-xs font-medium text-slate-200"
        >
          <Menu className="h-4 w-4" />
          <span>Categorias ({CATEGORIES.length})</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setSettingsTab('add');
            setSettingsOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Novo documento</span>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/70" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-10 flex h-full">
            <LeftSidebar
              categories={CATEGORIES}
              activeCategoryId={selectedCategoryId}
              isHomeActive={activeView === 'home'}
              onSelectHome={handleSelectHome}
              onSelectCategory={handleSelectCategory}
            />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
              className="m-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main 3-Column Workspace */}
      <div className="flex flex-1 flex-col xl:flex-row">
        <div className="hidden lg:flex">
          <LeftSidebar
            categories={CATEGORIES}
            activeCategoryId={selectedCategoryId}
            isHomeActive={activeView === 'home'}
            onSelectHome={handleSelectHome}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* Center Main Viewport */}
        <main className="min-w-0 flex-1 px-5 py-5 lg:px-6">
          {activeView === 'home' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0b192c]">
                <div className="relative z-10 flex min-h-[144px] items-center justify-between gap-6 px-7 py-6">
                  <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-blue-400">
                      <FileText className="h-9 w-9 stroke-[1.75]" />
                    </div>
                    <div>
                      <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-white">
                        Consulta Técnica
                      </h1>
                      <p className="mt-1 text-sm sm:text-[15px] text-slate-300">
                        Pesquisa e visualização de documentos técnicos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blended Industrial Plant Background on Right */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-[62%] overflow-hidden">
                  <img
                    src={HERO_BANNER_IMAGE}
                    alt="Chão de fábrica industrial"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b192c] via-[#0b192c]/70 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b192c]/60 via-transparent to-[#0b192c]/30" />
                </div>
              </section>

              {/* Acesso rápido */}
              <section>
                <h2 className="mb-3 font-display text-[17px] font-bold text-white">
                  Acesso rápido
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {quickAccessCards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleQuickAccess(card.id)}
                      className="group flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0c192c] p-3.5 text-left transition-all duration-150 hover:border-blue-500/60 hover:bg-[#102138]"
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md ${card.iconBg}`}
                      >
                        {card.icon}
                      </div>
                      <div className="mt-3.5">
                        <div className="text-[13px] font-semibold leading-tight text-white group-hover:text-blue-300">
                          {card.title}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11.5px] text-slate-400">
                          <span className="tabular-nums">{card.subtitle}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-400" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Arquivos recentes */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-[17px] font-bold text-white">
                    Arquivos recentes
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setFilters(DEFAULT_FILTERS);
                      setActiveView('catalog');
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300"
                  >
                    <span>Ver todos</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
                  {recentSixDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      doc={doc}
                      isFavorite={favoriteIds.includes(doc.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenDocument={handleOpenDocument}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Todas as Categorias Grid */}
          {activeView === 'categories' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
                <div>
                  <button
                    type="button"
                    onClick={handleSelectHome}
                    className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Voltar ao Início</span>
                  </button>
                  <h1 className="font-display text-xl font-bold text-white">
                    Todas as Categorias ({CATEGORIES.length})
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0c192c] p-4 text-left transition-all hover:border-blue-500/60 hover:bg-[#102138]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/15 text-blue-400">
                        <Folder className="h-5 w-5" />
                      </div>
                      <span className="tabular-nums text-xs font-semibold text-slate-400">
                        {cat.fileCount} arquivos
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-blue-300">
                        {cat.label}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-400">{cat.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Catalog / Favorites / History Views */}
          {(activeView === 'catalog' || activeView === 'favorites' || activeView === 'history') && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
                <div>
                  <button
                    type="button"
                    onClick={handleSelectHome}
                    className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Voltar ao Início</span>
                  </button>
                  <h1 className="font-display text-xl font-bold text-white">
                    {activeView === 'favorites'
                      ? `Favoritos (${favoriteDocuments.length})`
                      : activeView === 'history'
                      ? `Histórico de Visualização (${historyDocuments.length})`
                      : activeCategoryObj
                      ? activeCategoryObj.label
                      : `Acervo Técnico (${filteredDocuments.length} encontrados)`}
                  </h1>
                  {activeCategoryObj && (
                    <p className="mt-0.5 text-xs text-slate-400">{activeCategoryObj.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsTab('add');
                      setSettingsOpen(true);
                    }}
                    className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Novo documento</span>
                  </button>

                  {activeView === 'catalog' && (
                    <div className="flex rounded-lg border border-slate-700 bg-[#0c192c] p-0.5">
                      <button
                        type="button"
                        onClick={() => setViewLayout('grid')}
                        aria-label="Visualização em grade"
                        className={`rounded-md p-1.5 ${
                          viewLayout === 'grid'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewLayout('list')}
                        aria-label="Visualização em lista"
                        className={`rounded-md p-1.5 ${
                          viewLayout === 'list'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters Summary Bar */}
              {activeView === 'catalog' &&
                (globalSearch ||
                  filters.query ||
                  filters.type !== 'Todos' ||
                  filters.equipment !== 'Todos' ||
                  filters.manufacturer !== 'Todos' ||
                  filters.revision !== 'Todas' ||
                  filters.tag ||
                  selectedCategoryId) && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400">Filtros ativos:</span>
                    {selectedCategoryId && (
                      <span className="rounded-md border border-blue-500/40 bg-blue-600/15 px-2.5 py-1 text-blue-300">
                        {activeCategoryObj?.label}
                      </span>
                    )}
                    {filters.type !== 'Todos' && (
                      <span className="rounded-md border border-slate-700 bg-[#0c192c] px-2.5 py-1 text-slate-200">
                        Tipo: {filters.type}
                      </span>
                    )}
                    {filters.equipment !== 'Todos' && (
                      <span className="rounded-md border border-slate-700 bg-[#0c192c] px-2.5 py-1 text-slate-200">
                        Equipamento: {filters.equipment}
                      </span>
                    )}
                    {filters.manufacturer !== 'Todos' && (
                      <span className="rounded-md border border-slate-700 bg-[#0c192c] px-2.5 py-1 text-slate-200">
                        Fabricante: {filters.manufacturer}
                      </span>
                    )}
                    {filters.tag && (
                      <span className="rounded-md border border-slate-700 bg-[#0c192c] px-2.5 py-1 font-mono text-blue-300">
                        TAG: {filters.tag}
                      </span>
                    )}
                    {(globalSearch || filters.query) && (
                      <span className="rounded-md border border-slate-700 bg-[#0c192c] px-2.5 py-1 text-slate-200">
                        Busca: "{globalSearch || filters.query}"
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="ml-auto flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Limpar tudo</span>
                    </button>
                  </div>
                )}

              {/* Content Display */}
              {(() => {
                const itemsToRender =
                  activeView === 'favorites'
                    ? favoriteDocuments.map((doc) => ({ doc, viewedAt: undefined }))
                    : activeView === 'history'
                    ? historyDocuments
                    : filteredDocuments.map((doc) => ({ doc, viewedAt: undefined }));

                if (itemsToRender.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/80 bg-[#0c192c]/60 px-6 py-16 text-center">
                      <SearchX className="h-10 w-10 text-slate-500" />
                      <h3 className="mt-3 font-display text-base font-semibold text-white">
                        Nenhum documento encontrado
                      </h3>
                      <p className="mt-1 max-w-md text-xs text-slate-400">
                        Nenhum arquivo corresponde aos filtros selecionados. Limpe os filtros ou
                        adicione um novo documento ao catálogo técnico.
                      </p>
                      <div className="mt-4 flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="rounded-lg border border-slate-700 bg-[#081221] px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
                        >
                          Limpar filtros
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSettingsTab('add');
                            setSettingsOpen(true);
                          }}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                        >
                          Adicionar documento
                        </button>
                      </div>
                    </div>
                  );
                }

                if (viewLayout === 'list' && activeView === 'catalog') {
                  return (
                    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c192c]">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-800 bg-[#081221] text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                          <tr>
                            <th className="px-4 py-3">Código</th>
                            <th className="px-4 py-3">Documento</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Setor</th>
                            <th className="px-4 py-3">Fabricante / Rev.</th>
                            <th className="px-4 py-3 text-right">Atualização</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/70">
                          {itemsToRender.map(({ doc }) => (
                            <tr
                              key={doc.id}
                              onClick={() => handleOpenDocument(doc)}
                              className="cursor-pointer transition-colors hover:bg-slate-800/40"
                            >
                              <td className="font-mono-tabular px-4 py-3 font-bold text-white">
                                {doc.code}
                              </td>
                              <td className="px-4 py-3 font-medium text-blue-300">{doc.title}</td>
                              <td className="px-4 py-3 text-slate-300">{doc.type}</td>
                              <td className="px-4 py-3 text-slate-300">{doc.categoryLabel}</td>
                              <td className="px-4 py-3 text-slate-400">
                                {doc.manufacturer} ·{' '}
                                <span className="font-mono-tabular text-slate-200">
                                  {doc.revision}
                                </span>
                              </td>
                              <td className="font-mono-tabular px-4 py-3 text-right text-slate-400">
                                {doc.updatedAt}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
                    {itemsToRender.map(({ doc, viewedAt }) => (
                      <DocumentCard
                        key={`${doc.id}-${viewedAt || 'cat'}`}
                        doc={doc}
                        isFavorite={favoriteIds.includes(doc.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenDocument={handleOpenDocument}
                        viewedAt={viewedAt}
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <RightSidebar
          filters={filters}
          onUpdateFilters={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          onApplySearch={handleApplyAdvancedSearch}
          onResetFilters={handleResetFilters}
          categories={CATEGORIES}
          equipments={equipments}
          manufacturers={manufacturers}
          revisions={revisions}
          onSelectCategory={handleSelectCategory}
          onViewAllCategories={() => {
            setSelectedCategoryId(null);
            setActiveView('categories');
          }}
        />
      </div>

      {/* Interactive Document Viewer Modal */}
      <DocumentViewerModal
        doc={selectedDoc}
        isFavorite={selectedDoc ? favoriteIds.includes(selectedDoc.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onClose={() => setSelectedDoc(null)}
        onSelectTag={(tag) => {
          setSelectedCategoryId(null);
          setFilters({ ...DEFAULT_FILTERS, tag });
          setActiveView('catalog');
        }}
      />

      {/* Settings & Add Document Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        initialTab={settingsTab}
        onClose={() => setSettingsOpen(false)}
        userName={workspacePrefs.userName}
        onUpdateWorkspace={(patch) =>
          setWorkspacePrefs((prev: typeof workspacePrefs) => ({ ...prev, ...patch }))
        }
        categories={CATEGORIES}
        onAddDocument={(newDoc) => {
          setDocuments((prev) => [newDoc, ...prev]);
          setActiveView('catalog');
          setSelectedCategoryId(newDoc.categoryId);
        }}
      />
    </div>
  );
}
