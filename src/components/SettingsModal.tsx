import React, { useState } from 'react';
import { X, FolderSync, Plus, LockOpen, Check } from 'lucide-react';
import { CategoryItem, DocumentType, TechnicalDocument } from '../types/documents';

interface SettingsModalProps {
  isOpen: boolean;
  initialTab: 'drive' | 'add';
  onClose: () => void;
  rootFolderName: string;
  driveAccount: string;
  userName: string;
  onUpdateWorkspace: (patch: { rootFolderName: string; driveAccount: string; userName: string }) => void;
  categories: CategoryItem[];
  onAddDocument: (doc: TechnicalDocument) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  initialTab,
  onClose,
  rootFolderName,
  driveAccount,
  userName,
  onUpdateWorkspace,
  categories,
  onAddDocument,
}) => {
  const [tab, setTab] = useState<'drive' | 'add'>(initialTab);
  const [folderInput, setFolderInput] = useState(rootFolderName);
  const [accountInput, setAccountInput] = useState(driveAccount);
  const [userInput, setUserInput] = useState(userName);
  const [savedNotice, setSavedNotice] = useState(false);

  // Add document form state
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DocumentType>('Desenho técnico');
  const [categoryId, setCategoryId] = useState('07');
  const [equipment, setEquipment] = useState('Laminadora 01');
  const [manufacturer, setManufacturer] = useState('Kampf');
  const [revision, setRevision] = useState('REV. 01');
  const [tagsText, setTagsText] = useState('ELÉTRICA, MANUTENÇÃO');
  const [summary, setSummary] = useState('');
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | undefined>(undefined);

  React.useEffect(() => {
    setTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWorkspace({
      rootFolderName: folderInput.trim() || 'CONSULTA TÉCNICA',
      driveAccount: accountInput.trim() || 'usuario@empresa.com',
      userName: userInput.trim() || 'Fernando Franco',
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedPreviewUrl(reader.result);
          setType('Imagem');
        }
      };
      reader.readAsDataURL(file);
    }
    if (!title) {
      setTitle(file.name.replace(/\.[^.]+$/, ''));
    }
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCat = categories.find((c) => c.id === categoryId) || categories[0];
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const formattedDate = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}`;

    const finalCode =
      code.trim().toUpperCase() ||
      `${selectedCat.name.slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;

    const thumbnailKind = uploadedPreviewUrl
      ? 'photo-laminadora'
      : type === 'Desenho técnico'
      ? 'cad-electrical'
      : type === 'Manual'
      ? 'manual-kampf'
      : type === 'Imagem'
      ? 'photo-valve'
      : 'pdf-schematic';

    const newDoc: TechnicalDocument = {
      id: `doc-${Date.now()}`,
      code: finalCode,
      title: title.trim(),
      type,
      categoryId: selectedCat.id,
      categoryLabel: `${selectedCat.code} - ${
        selectedCat.name.charAt(0) + selectedCat.name.slice(1).toLowerCase()
      }`,
      equipment: equipment.trim() || 'Geral',
      manufacturer: manufacturer.trim() || 'Padrão',
      revision: type === 'Imagem' ? '-' : revision.trim() || 'REV. 01',
      updatedAt: formattedDate,
      updatedIso: now.toISOString(),
      tags: tagsText
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
      fileSize: '2,4 MB',
      pages: type === 'Imagem' ? undefined : 6,
      drivePath: `${rootFolderName} / ${selectedCat.label} / ${finalCode}`,
      thumbnailKind,
      imageUrl: uploadedPreviewUrl,
      summary:
        summary.trim() ||
        `Documento técnico cadastrado diretamente no acervo aberto (${selectedCat.label}).`,
      featuredRecent: true,
      revisions: [
        {
          rev: type === 'Imagem' ? '-' : revision.trim() || 'REV. 01',
          date: formattedDate.split(' ')[0],
          author: userName,
          notes: 'Documento adicionado ao catálogo de consulta.',
        },
      ],
    };

    onAddDocument(newDoc);
    setCode('');
    setTitle('');
    setSummary('');
    setUploadedPreviewUrl(undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0b1627] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#081221] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setTab('drive')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                tab === 'drive'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FolderSync className="h-3.5 w-3.5" />
              <span>Configurações & Drive</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('add')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                tab === 'add'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Adicionar Documento</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {tab === 'drive' ? (
          <form onSubmit={handleSaveSettings} className="space-y-4 p-5 text-sm">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-200">
              <LockOpen className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <div className="font-semibold text-emerald-300">
                  Portal em modo de acesso aberto
                </div>
                <p className="mt-0.5 text-emerald-200/80">
                  Todos os setores, desenhos técnicos, manuais e fotografias industriais estão
                  liberados para consulta direta na rede sem bloqueio de login.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Pasta raiz sincronizada (Google Drive)
              </label>
              <input
                type="text"
                value={folderInput}
                onChange={(e) => setFolderInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-700 bg-[#081221] px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Conta corporativa vinculada
              </label>
              <input
                type="email"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-700 bg-[#081221] px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Nome exibido no topo
              </label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-700 bg-[#081221] px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
              {savedNotice && (
                <span className="mr-auto flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <Check className="h-3.5 w-3.5" /> Preferências salvas
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Fechar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Salvar alterações
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateDocument} className="space-y-3.5 p-5 text-sm">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Código</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: LAM-042"
                  className="h-9 w-full rounded-lg border border-slate-700 bg-[#081221] px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Título do documento *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Esquema pneumático do desbobinador"
                  className="h-9 w-full rounded-lg border border-slate-700 bg-[#081221] px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as DocumentType)}
                  className="h-9 w-full rounded-lg border border-slate-700 bg-[#081221] px-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Desenho técnico">Desenho técnico</option>
                  <option value="PDF">PDF</option>
                  <option value="Imagem">Imagem</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Categoria</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-700 bg-[#081221] px-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Equipamento</label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-700 bg-[#081221] px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Fabricante</label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-700 bg-[#081221] px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Revisão</label>
                <input
                  type="text"
                  value={revision}
                  onChange={(e) => setRevision(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-700 bg-[#081221] px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  TAGs (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-700 bg-[#081221] px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Anexar imagem local (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-300 file:mr-2.5 file:rounded-md file:border-0 file:bg-slate-800 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-blue-300 hover:file:bg-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Resumo técnico</label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Breve descrição do desenho, manual ou inspeção..."
                className="w-full rounded-lg border border-slate-700 bg-[#081221] p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Cadastrar no acervo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
