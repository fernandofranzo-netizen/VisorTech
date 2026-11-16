export type DocumentType = 'Desenho técnico' | 'PDF' | 'Imagem' | 'Manual';

export type QuickAccessFilter =
  | 'all_categories'
  | 'Desenho técnico'
  | 'Imagem'
  | 'PDF'
  | 'Manual'
  | 'favorites';

export type DateRangePreset = 'today' | '7d' | '30d' | 'custom' | 'all';

export interface CategoryItem {
  id: string;
  code: string;
  name: string;
  label: string;
  fileCount: number;
  showInSidebar: boolean;
  description: string;
}

export interface RevisionEntry {
  rev: string;
  date: string;
  author: string;
  notes: string;
}

export interface TechnicalDocument {
  id: string;
  code: string;
  title: string;
  type: DocumentType;
  categoryId: string;
  categoryLabel: string;
  equipment: string;
  manufacturer: string;
  revision: string;
  updatedAt: string; // Display format DD/MM/YYYY HH:mm
  updatedIso: string; // ISO date string for filtering & sorting
  tags: string[];
  fileSize: string;
  pages?: number;
  drivePath: string;
  thumbnailKind:
    | 'cad-electrical'
    | 'cad-mechanical'
    | 'manual-kampf'
    | 'pdf-schematic'
    | 'photo-laminadora'
    | 'photo-valve'
    | 'photo-plant';
  imageUrl?: string;
  summary: string;
  revisions: RevisionEntry[];
  featuredRecent?: boolean;
}

export interface AdvancedSearchFilters {
  query: string;
  type: DocumentType | 'Todos';
  categoryId: string; // 'Todas' or category id
  equipment: string; // 'Todos' or equipment name
  manufacturer: string; // 'Todos' or manufacturer name
  revision: string; // 'Todas' or revision string
  tag: string;
  datePreset: DateRangePreset;
  customStartDate: string;
  customEndDate: string;
}

export interface HistoryEntry {
  documentId: string;
  viewedAt: string;
}
