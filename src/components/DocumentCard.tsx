import React from 'react';
import {
  Star,
  FileText,
  Image as ImageIcon,
  DraftingCompass,
  BookOpen,
  Building2,
} from 'lucide-react';
import { TechnicalDocument } from '../types/documents';
import { TechnicalThumbnail } from './TechnicalThumbnail';

interface DocumentCardProps {
  doc: TechnicalDocument;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDocument: (doc: TechnicalDocument) => void;
  viewedAt?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  isFavorite,
  onToggleFavorite,
  onOpenDocument,
  viewedAt,
}) => {
  const renderTypeIcon = () => {
    switch (doc.type) {
      case 'Desenho técnico':
        return <DraftingCompass className="h-3.5 w-3.5 shrink-0 text-sky-400" />;
      case 'Imagem':
        return <ImageIcon className="h-3.5 w-3.5 shrink-0 text-violet-400" />;
      case 'Manual':
        return <BookOpen className="h-3.5 w-3.5 shrink-0 text-amber-400" />;
      case 'PDF':
      default:
        return <FileText className="h-3.5 w-3.5 shrink-0 text-rose-400" />;
    }
  };

  return (
    <article
      onClick={() => onOpenDocument(doc)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-800/90 bg-[#0c192c] p-2.5 transition-all duration-150 hover:border-blue-500/60 hover:bg-[#102038]"
    >
      {/* Thumbnail Preview Box */}
      <div className="relative aspect-[16/8.6] w-full overflow-hidden rounded-lg border border-slate-700/60 bg-slate-900">
        <TechnicalThumbnail doc={doc} />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(doc.id);
          }}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md border backdrop-blur-xs transition-colors ${
            isFavorite
              ? 'border-amber-400/70 bg-slate-900/75 text-amber-400'
              : 'border-slate-500/50 bg-slate-900/65 text-slate-200 hover:border-amber-400 hover:text-amber-300'
          }`}
        >
          <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
      </div>

      {/* Metadata Body */}
      <div className="mt-2.5 flex flex-1 flex-col px-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono-tabular text-[13px] font-bold tracking-tight text-white">
            {doc.code}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(doc.id);
            }}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
            className="text-slate-400 transition-colors hover:text-amber-400"
          >
            <Star
              className={`h-3.5 w-3.5 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : 'text-blue-400/80'
              }`}
            />
          </button>
        </div>

        <h3 className="mt-0.5 line-clamp-1 text-[13.5px] font-medium text-blue-300 transition-colors group-hover:text-blue-200">
          {doc.title}
        </h3>

        <div className="mt-2 space-y-1 text-[11.5px] text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            {renderTypeIcon()}
            <span className="truncate font-medium text-slate-200">{doc.type}</span>
            <span className="text-slate-500" aria-hidden="true">
              ·
            </span>
            <span className="truncate text-blue-400">{doc.categoryLabel}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate text-slate-400">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span className="truncate">{doc.manufacturer}</span>
            <span className="text-slate-600" aria-hidden="true">
              ·
            </span>
            <span className="font-mono-tabular text-slate-300">{doc.revision}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <span className="font-mono-tabular">
            {viewedAt ? `Visto: ${viewedAt}` : doc.updatedAt}
          </span>
        </div>
      </div>
    </article>
  );
};
