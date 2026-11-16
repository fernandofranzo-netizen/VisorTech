import React, { useState } from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { TechnicalDocument } from '../types/documents';

interface TechnicalThumbnailProps {
  doc: TechnicalDocument;
  large?: boolean;
  blueprintMode?: boolean;
}

export const TechnicalThumbnail: React.FC<TechnicalThumbnailProps> = ({
  doc,
  large = false,
  blueprintMode = false,
}) => {
  const [imgError, setImgError] = useState(false);

  if (doc.imageUrl && !imgError) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-slate-900">
        <img
          src={doc.imageUrl}
          alt={doc.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (doc.imageUrl && imgError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300">
        <ImageIcon className="mb-1.5 h-8 w-8 text-blue-400" />
        <span className="px-3 text-center text-xs font-medium">{doc.code}</span>
      </div>
    );
  }

  if (doc.thumbnailKind === 'cad-electrical') {
    const bg = blueprintMode ? '#0a2540' : '#f8fafc';
    const stroke = blueprintMode ? '#7dd3fc' : '#1e293b';
    const faint = blueprintMode ? '#1e4976' : '#cbd5e1';
    const accent = blueprintMode ? '#38bdf8' : '#2563eb';

    return (
      <svg
        viewBox="0 0 320 180"
        className="h-full w-full select-none"
        style={{ backgroundColor: bg }}
        aria-label={`Diagrama elétrico ${doc.code}`}
      >
        <defs>
          <pattern id={`grid-el-${doc.id}-${large ? 'lg' : 'sm'}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke={faint} strokeWidth="0.4" opacity="0.55" />
          </pattern>
        </defs>
        <rect width="320" height="180" fill={`url(#grid-el-${doc.id}-${large ? 'lg' : 'sm'})`} />
        <rect x="8" y="8" width="304" height="164" fill="none" stroke={stroke} strokeWidth="1.2" />
        <rect x="218" y="140" width="94" height="32" fill="none" stroke={stroke} strokeWidth="0.9" />
        <line x1="218" y1="154" x2="312" y2="154" stroke={stroke} strokeWidth="0.7" />
        <text x="223" y="150" fontSize="6.5" fontFamily="monospace" fontWeight="700" fill={stroke}>
          {doc.code}
        </text>
        <text x="223" y="165" fontSize="5.5" fontFamily="monospace" fill={stroke}>
          {doc.manufacturer.toUpperCase()} · {doc.revision}
        </text>

        {/* Busbars L1, L2, L3, PE */}
        <line x1="22" y1="26" x2="296" y2="26" stroke={stroke} strokeWidth="1.1" />
        <line x1="22" y1="34" x2="296" y2="34" stroke={stroke} strokeWidth="1.1" />
        <line x1="22" y1="42" x2="296" y2="42" stroke={stroke} strokeWidth="1.1" />
        <text x="14" y="28" fontSize="5" fontFamily="monospace" fill={accent}>L1</text>
        <text x="14" y="36" fontSize="5" fontFamily="monospace" fill={accent}>L2</text>
        <text x="14" y="44" fontSize="5" fontFamily="monospace" fill={accent}>L3</text>

        {/* Vertical Columns / Motor & PLC Drive Branches */}
        {[56, 112, 168, 232].map((x, idx) => (
          <g key={x}>
            <line x1={x} y1="26" x2={x} y2="128" stroke={stroke} strokeWidth="0.85" />
            <line x1={x + 10} y1="34" x2={x + 10} y2="128" stroke={stroke} strokeWidth="0.85" />
            <line x1={x + 20} y1="42" x2={x + 20} y2="128" stroke={stroke} strokeWidth="0.85" />
            {/* Breaker symbol */}
            <rect x={x - 4} y="54" width="28" height="14" fill={bg} stroke={stroke} strokeWidth="0.8" />
            <line x1={x} y1="57" x2={x + 4} y2="65" stroke={accent} strokeWidth="1" />
            <line x1={x + 10} y1="57" x2={x + 14} y2="65" stroke={accent} strokeWidth="1" />
            <line x1={x + 20} y1="57" x2={x + 24} y2="65" stroke={accent} strokeWidth="1" />
            {/* Contactor / Drive Block */}
            <rect x={x - 6} y="82" width="32" height="22" fill={bg} stroke={stroke} strokeWidth="0.9" />
            <text x={x - 1} y="95" fontSize="5.5" fontFamily="monospace" fill={stroke}>
              {idx === 0 ? 'K1M' : idx === 1 ? 'U1-VSD' : idx === 2 ? 'PLC-01' : 'F4-REL'}
            </text>
            {/* Motor circle */}
            <circle cx={x + 10} cy="136" r="10" fill={bg} stroke={stroke} strokeWidth="1" />
            <text x={x + 6.5} y="138.5" fontSize="7" fontFamily="monospace" fontWeight="700" fill={stroke}>
              M
            </text>
          </g>
        ))}

        {/* Control relay ladder lines */}
        <line x1="22" y1="114" x2="296" y2="114" stroke={accent} strokeWidth="0.6" strokeDasharray="3 2" />
        <text x="24" y="165" fontSize="6" fontFamily="monospace" fill={stroke}>
          ESCALA 1:1 · FOLHA 01/{doc.pages || 12} · {doc.equipment.toUpperCase()}
        </text>
      </svg>
    );
  }

  if (doc.thumbnailKind === 'cad-mechanical') {
    const bg = blueprintMode ? '#0a2540' : '#f8fafc';
    const stroke = blueprintMode ? '#7dd3fc' : '#1e293b';
    const faint = blueprintMode ? '#1e4976' : '#cbd5e1';
    const accent = blueprintMode ? '#38bdf8' : '#0284c7';

    return (
      <svg
        viewBox="0 0 320 180"
        className="h-full w-full select-none"
        style={{ backgroundColor: bg }}
        aria-label={`Desenho mecânico ${doc.code}`}
      >
        <defs>
          <pattern id={`grid-mec-${doc.id}-${large ? 'lg' : 'sm'}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke={faint} strokeWidth="0.4" opacity="0.55" />
          </pattern>
        </defs>
        <rect width="320" height="180" fill={`url(#grid-mec-${doc.id}-${large ? 'lg' : 'sm'})`} />
        <rect x="8" y="8" width="304" height="164" fill="none" stroke={stroke} strokeWidth="1.2" />

        {/* Centerline */}
        <line x1="24" y1="86" x2="210" y2="86" stroke={accent} strokeWidth="0.7" strokeDasharray="10 3 2 3" />
        {/* Roller / Shaft longitudinal cross-section */}
        <rect x="34" y="68" width="22" height="36" fill="none" stroke={stroke} strokeWidth="1.1" />
        <rect x="56" y="52" width="118" height="68" fill="none" stroke={stroke} strokeWidth="1.3" />
        <rect x="64" y="58" width="102" height="56" fill="none" stroke={stroke} strokeWidth="0.7" strokeDasharray="3 2" />
        <rect x="174" y="68" width="26" height="36" fill="none" stroke={stroke} strokeWidth="1.1" />
        {/* Bearings */}
        <rect x="42" y="64" width="10" height="44" fill="none" stroke={accent} strokeWidth="0.9" />
        <line x1="42" y1="64" x2="52" y2="74" stroke={accent} strokeWidth="0.7" />
        <line x1="52" y1="64" x2="42" y2="74" stroke={accent} strokeWidth="0.7" />
        <rect x="178" y="64" width="10" height="44" fill="none" stroke={accent} strokeWidth="0.9" />
        <line x1="178" y1="64" x2="188" y2="74" stroke={accent} strokeWidth="0.7" />
        <line x1="188" y1="64" x2="178" y2="74" stroke={accent} strokeWidth="0.7" />

        {/* Dimension lines */}
        <line x1="56" y1="36" x2="174" y2="36" stroke={accent} strokeWidth="0.7" />
        <line x1="56" y1="32" x2="56" y2="50" stroke={accent} strokeWidth="0.6" />
        <line x1="174" y1="32" x2="174" y2="50" stroke={accent} strokeWidth="0.6" />
        <text x="98" y="33" fontSize="6.5" fontFamily="monospace" fill={accent}>Ø 240 H7/g6</text>

        <line x1="34" y1="134" x2="200" y2="134" stroke={accent} strokeWidth="0.7" />
        <text x="95" y="143" fontSize="6.5" fontFamily="monospace" fill={accent}>L = 1850 mm</text>

        {/* Side detail view */}
        <circle cx="258" cy="78" r="34" fill="none" stroke={stroke} strokeWidth="1.2" />
        <circle cx="258" cy="78" r="22" fill="none" stroke={stroke} strokeWidth="0.8" strokeDasharray="4 2" />
        <circle cx="258" cy="78" r="9" fill="none" stroke={accent} strokeWidth="1" />
        <line x1="218" y1="78" x2="298" y2="78" stroke={accent} strokeWidth="0.6" strokeDasharray="6 2 2 2" />
        <line x1="258" y1="38" x2="258" y2="118" stroke={accent} strokeWidth="0.6" strokeDasharray="6 2 2 2" />

        {/* Title Block */}
        <rect x="206" y="138" width="106" height="34" fill="none" stroke={stroke} strokeWidth="0.9" />
        <line x1="206" y1="154" x2="312" y2="154" stroke={stroke} strokeWidth="0.7" />
        <text x="211" y="149" fontSize="6.5" fontFamily="monospace" fontWeight="700" fill={stroke}>
          {doc.code}
        </text>
        <text x="211" y="166" fontSize="5.5" fontFamily="monospace" fill={stroke}>
          TOL. ISO 2768-m · {doc.revision}
        </text>
      </svg>
    );
  }

  if (doc.thumbnailKind === 'manual-kampf') {
    return (
      <div className="relative flex h-full w-full overflow-hidden bg-white text-slate-900 select-none">
        <div className="flex w-[32%] flex-col justify-between bg-[#e11d2a] p-3 text-white">
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/80 text-[9px] font-bold">
              K
            </div>
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {doc.manufacturer}
            </span>
          </div>
          <div className="space-y-1 opacity-85">
            <div className="h-1 w-10 bg-white/70" />
            <div className="h-1 w-7 bg-white/50" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="flex justify-end">
            <span className="font-mono-tabular text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
              {doc.code} · {doc.revision}
            </span>
          </div>
          <div className="my-auto">
            <p className="text-sm font-bold leading-snug text-[#1d5ec4]">
              Manual do Equipamento
            </p>
            <p className="mt-1 text-[11px] font-medium text-slate-500 line-clamp-2">
              {doc.equipment}
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-[9px] text-slate-400">
            <span>Operação & Manutenção</span>
            <span className="font-mono-tabular">{doc.pages || 48} págs</span>
          </div>
        </div>
      </div>
    );
  }

  // pdf-schematic
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#f1f5f9] p-3 select-none">
      <div className="relative flex h-full w-[78%] flex-col justify-between rounded-sm border border-slate-300 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
          <span className="font-mono-tabular text-[9px] font-bold text-slate-600">{doc.code}</span>
          <span className="text-[8px] font-semibold text-slate-400">{doc.revision}</span>
        </div>
        <div className="my-auto flex flex-col items-center justify-center">
          <div className="flex h-12 w-10 flex-col items-center justify-center rounded-md border-2 border-red-500 bg-red-50/70 text-red-600 shadow-xs">
            <FileText className="h-4 w-4 text-red-500" />
            <span className="mt-0.5 text-[9px] font-extrabold tracking-tight">PDF</span>
          </div>
          <span className="mt-1.5 max-w-full truncate text-[9px] font-semibold text-slate-600">
            {doc.equipment}
          </span>
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-slate-200" />
          <div className="h-1 w-3/4 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
};
