import React, { useState } from 'react';
import {
  X,
  Star,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Printer,
  Copy,
  Check,
  FolderOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
} from 'lucide-react';
import { TechnicalDocument } from '../types/documents';
import { TechnicalThumbnail } from './TechnicalThumbnail';

interface DocumentViewerModalProps {
  doc: TechnicalDocument | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSelectTag: (tag: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  doc,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelectTag,
}) => {
  const [zoom, setZoom] = useState(1);
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!doc) return null;

  const totalPages = doc.pages || 1;
  const isDrawing = doc.type === 'Desenho técnico';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/?doc=${doc.code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTechnicalSheet = () => {
    const content = [
      `CONSULTA TÉCNICA - FICHA DE DOCUMENTO`,
      `==================================================`,
      `Código:       ${doc.code}`,
      `Título:       ${doc.title}`,
      `Tipo:         ${doc.type}`,
      `Categoria:    ${doc.categoryLabel}`,
      `Equipamento:  ${doc.equipment}`,
      `Fabricante:   ${doc.manufacturer}`,
      `Revisão:      ${doc.revision}`,
      `Atualizado:   ${doc.updatedAt}`,
      `Tamanho:      ${doc.fileSize}`,
      `Caminho Drive:${doc.drivePath}`,
      `TAGs:         ${doc.tags.join(', ')}`,
      ``,
      `Resumo Técnico:`,
      `${doc.summary}`,
      ``,
      `Histórico de Revisões:`,
      ...doc.revisions.map((r) => `- ${r.rev} (${r.date}) [${r.author}]: ${r.notes}`),
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.code}_ficha_tecnica.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={`Visualizando ${doc.title}`}
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0b1627] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#081221] px-5 py-3.5">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="font-mono-tabular text-xs font-bold tracking-wide text-blue-400">
                {doc.code}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-medium text-slate-300">{doc.type}</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono-tabular text-xs font-semibold text-slate-300">
                {doc.revision}
              </span>
            </div>
            <h2 className="mt-0.5 truncate font-display text-lg font-bold text-white">
              {doc.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(doc.id)}
              className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                isFavorite
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                  : 'border-slate-700 bg-[#0d192b] text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-700 bg-[#0d192b] px-3 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar link'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadTechnicalSheet}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Baixar ficha</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              title="Imprimir"
              aria-label="Imprimir visualização"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-[#0d192b] text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Printer className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar visualizador"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body Split */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-12">
          {/* Left: Interactive Canvas */}
          <div className="flex flex-col border-b border-slate-800 bg-[#060d18] lg:col-span-8 lg:border-r lg:border-b-0">
            {/* Canvas Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-[#091322] px-4 py-2 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))}
                  aria-label="Reduzir zoom"
                  className="rounded-md border border-slate-700 bg-[#0d192b] p-1.5 text-slate-200 hover:bg-slate-800"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="tabular-nums w-12 text-center font-mono text-[11px] text-slate-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.4, +(z + 0.2).toFixed(1)))}
                  aria-label="Aumentar zoom"
                  className="rounded-md border border-slate-700 bg-[#0d192b] p-1.5 text-slate-200 hover:bg-slate-800"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="ml-1 flex items-center gap-1 rounded-md border border-slate-700 bg-[#0d192b] px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-800"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Ajustar</span>
                </button>

                {isDrawing && (
                  <button
                    type="button"
                    onClick={() => setBlueprintMode((b) => !b)}
                    className={`ml-2 flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      blueprintMode
                        ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                        : 'border-slate-700 bg-[#0d192b] text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Layers className="h-3 w-3" />
                    <span>{blueprintMode ? 'Modo Papel Claro' : 'Modo Blueprint'}</span>
                  </button>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded border border-slate-700 bg-[#0d192b] p-1 text-slate-300 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="tabular-nums text-[11px] text-slate-300">
                    Folha {page} de {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded border border-slate-700 bg-[#0d192b] p-1 text-slate-300 disabled:opacity-40"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Viewport */}
            <div className="flex flex-1 items-center justify-center overflow-auto p-6">
              <div
                className="aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-lg border border-slate-700/80 shadow-xl transition-transform duration-150"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
              >
                <TechnicalThumbnail doc={doc} large blueprintMode={blueprintMode} />
              </div>
            </div>
          </div>

          {/* Right: Technical Metadata & Revisions */}
          <div className="flex flex-col overflow-y-auto bg-[#0b1627] p-5 lg:col-span-4">
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Especificações do arquivo
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{doc.summary}</p>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-800 pt-4 text-xs">
              <div>
                <dt className="text-slate-400">Categoria</dt>
                <dd className="mt-0.5 font-semibold text-slate-100">{doc.categoryLabel}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Equipamento</dt>
                <dd className="mt-0.5 font-semibold text-slate-100">{doc.equipment}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Fabricante</dt>
                <dd className="mt-0.5 font-semibold text-slate-100">{doc.manufacturer}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Tamanho / Páginas</dt>
                <dd className="mt-0.5 font-mono-tabular font-semibold text-slate-100">
                  {doc.fileSize}
                  {doc.pages ? ` · ${doc.pages} págs` : ''}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Última atualização</dt>
                <dd className="mt-0.5 font-mono-tabular font-semibold text-slate-100">
                  {doc.updatedAt}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Revisão vigente</dt>
                <dd className="mt-0.5 font-mono-tabular font-semibold text-blue-400">
                  {doc.revision}
                </dd>
              </div>
            </dl>

            {/* Drive Path */}
            <div className="mt-4 rounded-lg border border-slate-800 bg-[#081221] p-3 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-400">
                <FolderOpen className="h-3.5 w-3.5 text-blue-400" />
                <span>Caminho sincronizado no Google Drive</span>
              </div>
              <div className="mt-1 break-all font-mono text-[11px] text-slate-200">
                {doc.drivePath}
              </div>
            </div>

            {/* TAGs */}
            <div className="mt-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Tag className="h-3.5 w-3.5" />
                <span>TAGs técnicas (clique para filtrar)</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {doc.tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      onSelectTag(t);
                      onClose();
                    }}
                    className="rounded-md border border-slate-700 bg-[#081221] px-2.5 py-1 font-mono text-[11px] text-blue-300 transition-colors hover:border-blue-500 hover:bg-blue-600/20"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Revision History */}
            <div className="mt-5 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                <Clock className="h-3.5 w-3.5" />
                <span>Histórico de revisões</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {doc.revisions.map((rev, i) => (
                  <div
                    key={`${rev.rev}-${i}`}
                    className="rounded-lg border border-slate-800/80 bg-[#081221] p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tabular font-bold text-blue-400">{rev.rev}</span>
                      <span className="font-mono-tabular text-[11px] text-slate-400">
                        {rev.date}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-200">{rev.notes}</p>
                    <div className="mt-1 text-[11px] text-slate-400">Resp.: {rev.author}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
