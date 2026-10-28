'use client';

import React, { useState, useMemo, useRef } from 'react';
import { ClientProfile, ClientActionItem, ClientToolAccess, VisualTheme, OperationMessage, OperationMessageTag } from '@/lib/types';
import { useUpsellStore } from '@/lib/store';
import { ContractModal } from './ContractModal';
import { TaskKanban } from './TaskKanban';
import {
  LogOut,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderOpen,
  LayoutGrid,
  Zap,
  FileCheck2,
  BarChart3,
  ShieldCheck,
  Building2,
  AlertCircle,
  Check,
  Sun,
  Moon,
  Sparkles,
  ChevronRight,
  Info,
  X,
  Lock,
  Copy,
  FileText,
  Video,
  Image as ImageIcon,
  MessageCircle,
  Send,
  CheckCheck
} from 'lucide-react';

interface ClientPortalProps {
  client: ClientProfile;
  clientsList: ClientProfile[];
  onSelectClient: (id: string) => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onUpdateClient?: (id: string, updates: Partial<ClientProfile>) => void;
  theme?: VisualTheme;
  onToggleTheme?: () => void;
}

const DEFAULT_ACTION_ITEMS: ClientActionItem[] = [
  {
    id: 'task-1',
    task: 'Gravação dos 2 vídeos de respostas a dúvidas frequentes',
    detail: 'Roteiros enviados pelo gestor no WhatsApp no dia 12/10. Duração de 45 a 60 segundos.',
    status: 'pending',
    due: 'Até 22/10'
  },
  {
    id: 'task-2',
    task: 'Envio de 5 fotos em alta resolução da nova sala de atendimento',
    detail: 'Material para os novos criativos estáticos de prova institucional.',
    status: 'completed',
    due: 'Concluído em 10/10'
  },
  {
    id: 'task-3',
    task: 'Validação da lista de contatos que fecharam consulta no último mês',
    detail: 'Para alimentar o público de conversão e exclusão no Meta Ads.',
    status: 'completed',
    due: 'Concluído em 05/10'
  }
];

const DEFAULT_ACTIVE_TOOLS: ClientToolAccess[] = [
  {
    id: 'tool-hospedagem',
    name: 'Hospedagem do Site & Servidor',
    category: 'Hospedagem & Servidor',
    accountEmail: 'Conta Oficial da Empresa',
    accessUrl: 'https://hpanel.hostinger.com',
    status: 'Ativo / Vinculado',
    detail: 'Servidor Cloud com SSL ativo e PHP 8.3'
  },
  {
    id: 'tool-1',
    name: 'Meta Business Manager',
    category: 'Instagram & Facebook Ads',
    accountEmail: 'Conta Oficial da Empresa',
    accessUrl: 'https://business.facebook.com',
    status: 'Ativo / Vinculado',
    detail: 'Pixel e CAPI operando com alta pontuação de eventos'
  },
  {
    id: 'tool-2',
    name: 'Google Ads (MCC Upsell)',
    category: 'Rede de Pesquisa & PMax',
    accountEmail: 'Conta Oficial da Empresa',
    accessUrl: 'https://ads.google.com',
    status: 'Ativo / Vinculado',
    detail: 'Campanhas de intenção ativa de busca no Google'
  },
  {
    id: 'tool-3',
    name: 'Google Analytics 4 & Tag Manager',
    category: 'Auditoria de Tráfego',
    accountEmail: 'Conta Oficial da Empresa',
    accessUrl: 'https://tagmanager.google.com',
    status: 'Ativo / Vinculado',
    detail: 'Eventos de clique e conversões mensuradas em tempo real'
  },
  {
    id: 'tool-4',
    name: 'WhatsApp Business API',
    category: 'Ponta de Conversão',
    accountEmail: 'Recepção / Comercial',
    accessUrl: 'https://api.whatsapp.com',
    status: 'Ativo / Vinculado',
    detail: 'Mensagens pré-configuradas e rastreamento de entrada'
  }
];

// Helper to format URLs to always include https:// if missing
function formatSafeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

// Helper to parse dates in DD/MM/YYYY or YYYY-MM-DD
function parseContractDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  const match = trimmed.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function ClientPortal({
  client,
  clientsList,
  onSelectClient,
  onLogout,
  onOpenAdmin,
  onUpdateClient
}: ClientPortalProps) {
  const { theme, toggleTheme, userRole, authUser, requestPinReset, addOperationMessage } = useUpsellStore();
  const isLight = theme === 'light';

  const requiredPin = (client.accessPin || '839102').trim();
  const isGestorSession = userRole === 'admin' || authUser?.email === 'felipemassonp@gmail.com' || authUser?.email?.includes('upsell');

  // Feed de Mensagens / Pareceres da Operação (estilo WhatsApp)
  const operationMessages: OperationMessage[] = useMemo(() => {
    if (client.operationMessages && client.operationMessages.length > 0) {
      return client.operationMessages;
    }
    return [
      {
        id: 'msg-fallback-1',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UpSell',
        text: client.currentFocus || 'Campanhas ativas em Meta Ads e Google Ads com foco em escala qualificada.',
        date: '10/10/2026',
        time: '09:30',
        tag: 'Parecer Estratégico'
      },
      {
        id: 'msg-fallback-2',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UpSell',
        text: client.nextSteps || 'Próximos passos imediatos: ativação das novas variações de criativos e monitoramento de agendamentos.',
        date: 'Hoje',
        time: '11:15',
        tag: 'Atualização de Campanhas'
      }
    ];
  }, [client.operationMessages, client.currentFocus, client.nextSteps]);

  const [messageInput, setMessageInput] = useState('');
  const [selectedTag, setSelectedTag] = useState<OperationMessageTag>('Parecer Estratégico');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const isAgencyAuthor = isGestorSession;
    const authorName = isAgencyAuthor ? 'Felipe Masson · Gestor UpSell' : client.responsibleName;
    const sender = isAgencyAuthor ? ('gestor' as const) : ('client' as const);

    const now = new Date();
    const dateStr = 'Hoje';
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    addOperationMessage(client.id, {
      sender,
      authorName,
      text: messageInput.trim(),
      date: dateStr,
      time: timeStr,
      tag: isAgencyAuthor ? selectedTag : 'Alinhamento'
    });

    setMessageInput('');

    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`upsell_unlocked_${client.id}`);
      if (stored === 'true') return true;
      const params = new URLSearchParams(window.location.search);
      if (params.get('bypass') === 'admin' && isGestorSession) return true;
    }
    return false;
  });

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [pinRequestFeedback, setPinRequestFeedback] = useState<string | null>(null);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (enteredPin.trim() === requiredPin) {
      setIsUnlocked(true);
      setPinError(null);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`upsell_unlocked_${client.id}`, 'true');
      }
    } else {
      setPinError('Chave PIN incorreta. Digite o código de 6 dígitos fornecido pela UpSell.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleBypassGestor = () => {
    setIsUnlocked(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`upsell_unlocked_${client.id}`, 'true');
    }
  };

  const handleRequestPinSupport = () => {
    // Registra a solicitação na store e no Firestore para notificar o gestor em tempo real
    requestPinReset(client.id);
    setPinRequestFeedback('Solicitação registrada no painel da UpSell! Seu gestor foi notificado.');

    const text = encodeURIComponent(
      `Olá equipe UpSell! Sou o responsável pela empresa ${client.companyName} (${client.responsibleName}) e preciso recuperar/redefinir minha chave de acesso (PIN) ao portal.`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511987654321&text=${text}`, '_blank');
  };

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState<{ title: string; desc: string } | null>(null);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Read action items from client or fallback to default
  const actionItems = client.actionItems && client.actionItems.length > 0
    ? client.actionItems
    : DEFAULT_ACTION_ITEMS;

  // Read active tools from client or fallback to default
  const activeTools = client.activeTools && client.activeTools.length > 0
    ? client.activeTools
    : DEFAULT_ACTIVE_TOOLS;

  const toggleTaskStatus = (id: string) => {
    const updated = actionItems.map(item =>
      item.id === id
        ? { ...item, status: item.status === 'pending' ? ('completed' as const) : ('pending' as const) }
        : item
    );
    if (onUpdateClient) {
      onUpdateClient(client.id, { actionItems: updated });
    }
  };

  const copyToolInfo = (text: string | undefined, identifier: string) => {
    if (!text) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
      setCopiedKey(identifier);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore
    }
  };

  // Safe handler for external links in the documents section
  const handleOpenRepository = (url: string | undefined, repoName: string, defaultDesc: string) => {
    if (!url || !url.trim() || url === '#') {
      setInfoModalMessage({
        title: `${repoName} em Configuração`,
        desc: `O repositório oficial da sua empresa está sendo organizado pela equipe da Upsell. O link definitivo estará disponível aqui assim que a sincronização for concluída.`
      });
      return;
    }
    const safeUrl = formatSafeUrl(url);
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  };

  // Dynamic Contract Timelapse Progress Calculation
  const startDate = parseContractDate(client.contractStart) || new Date(2024, 9, 15);
  const endDate = parseContractDate(client.contractRenewal) || new Date(2026, 9, 15);
  const now = new Date();

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  const remainingMs = endDate.getTime() - now.getTime();

  const daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
  const contractProgressPercent = totalDuration > 0
    ? Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)))
    : 0;

  // Task metrics
  const completedTasks = actionItems.filter(t => t.status === 'completed').length;
  const totalTasks = actionItems.length;
  const tasksProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = actionItems.filter(t => {
    if (taskFilter === 'pending') return t.status === 'pending';
    if (taskFilter === 'completed') return t.status === 'completed';
    return true;
  });

  // Color classes helper - Alto contraste rigoroso (Linear / Design Editorial Suíço)
  const cardBg = isLight
    ? 'bg-white border-2 border-slate-300 shadow-[0_4px_20px_rgba(15,23,42,0.06)] text-slate-950'
    : 'bg-[#12141a] border border-white/15 shadow-xl text-white';

  const innerBg = isLight
    ? 'bg-white border-2 border-slate-300 shadow-xs text-slate-950'
    : 'bg-[#181b24] border border-white/12 text-slate-100';

  const accentColor = isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]';
  const borderLine = isLight ? 'border-slate-300' : 'border-white/12';

  // Se o portal estiver bloqueado, exibe a tela de cofre com PIN
  if (!isUnlocked) {
    return (
      <div
        className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
          isLight
            ? 'bg-[#f8fafc] text-slate-950 selection:bg-amber-200'
            : 'bg-[#090a0f] text-white selection:bg-[#c8a97e]/30'
        }`}
      >
        {/* Top Minimal Bar */}
        <header className={`w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b-2 backdrop-blur-md ${
          isLight ? 'bg-white/95 border-slate-300 shadow-xs' : 'bg-[#090a0f]/80 border-white/15'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`text-lg sm:text-xl font-extrabold tracking-[0.25em] uppercase ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`}>
              UPSELL
            </span>
            <span className={`hidden sm:inline-block w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#8c5e28]' : 'bg-[#b58c56]'}`} />
            <span className={`hidden sm:inline-flex text-[11px] uppercase tracking-wider font-extrabold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Portal do Cliente · Acesso Seguro
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border-2 transition-all shadow-xs ${
                isLight ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300' : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
              }`}
              title="Alternar tema"
            >
              {isLight ? <Moon className="w-4 h-4 text-slate-900" /> : <Sun className="w-4 h-4 text-[#dfc7a7]" />}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border-2 shadow-xs ${
                isLight ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300' : 'text-slate-300 hover:text-white border-white/10'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </header>

        {/* Center Lock Box */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div
            className={`w-full max-w-md p-7 sm:p-9 rounded-3xl shadow-2xl border-2 transition-all duration-300 ${
              isShaking ? 'translate-x-1' : ''
            } ${
              isLight
                ? 'bg-white border-slate-300 text-slate-950 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'
                : 'bg-[#12141a] border-white/15 text-white'
            }`}
          >
            {/* Header Icon & Badges */}
            <div className="text-center space-y-3 mb-6">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-1 shadow-xs border-2 ${
                isLight ? 'bg-amber-100 text-[#8c5e28] border-amber-300' : 'bg-[#b58c56]/15 border-[#b58c56]/30 text-[#b58c56]'
              }`}>
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-2 ${
                  isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-[#b58c56]/10 text-[#dfc7a7] border-[#b58c56]/20'
                }`}>
                  Acesso Protegido por Chave
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                {client.companyName}
              </h2>
              <p className={`text-xs leading-relaxed max-w-xs mx-auto font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Digite a chave PIN de 6 dígitos fornecida pelo seu gestor da UpSell para visualizar métricas, entregas e credenciais.
              </p>
            </div>

            {/* PIN Input Form */}
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <input
                  type="password"
                  inputMode="numeric"
                  autoFocus
                  maxLength={10}
                  value={enteredPin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setEnteredPin(val);
                    if (pinError) setPinError(null);
                    if (val.length === requiredPin.length && val === requiredPin) {
                      setIsUnlocked(true);
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem(`upsell_unlocked_${client.id}`, 'true');
                      }
                    }
                  }}
                  placeholder="••••••"
                  className={`w-full text-center py-3.5 px-4 rounded-2xl text-2xl font-mono font-bold tracking-[0.4em] border-2 transition-all outline-none shadow-xs ${
                    pinError
                      ? 'border-rose-500 bg-rose-50 text-rose-800'
                      : isLight
                      ? 'bg-white border-slate-400 focus:border-[#8c5e28] text-slate-950 placeholder-slate-400 focus:ring-4 focus:ring-amber-500/15'
                      : 'bg-[#0d0e12] border-white/15 focus:border-[#b58c56] text-white focus:ring-4 focus:ring-[#b58c56]/20'
                  }`}
                />
              </div>

              {pinError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-700 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3.5 px-5 rounded-2xl text-xs font-bold text-white active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 ${
                  isLight ? 'bg-[#8c5e28] hover:bg-[#734b1c]' : 'bg-[#b58c56] hover:bg-[#9d7644]'
                }`}
              >
                <span>Desbloquear Portal</span>
                <Check className="w-4 h-4" />
              </button>
            </form>

            {/* Suporte WhatsApp & Gestor Bypass */}
            <div className={`pt-6 mt-6 border-t-2 text-center space-y-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              {pinRequestFeedback ? (
                <div className={`p-3 rounded-xl border-2 text-xs flex items-center justify-center gap-2 ${
                  isLight ? 'bg-amber-100 text-amber-950 border-amber-300 font-bold' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{pinRequestFeedback}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestPinSupport}
                  className={`text-xs hover:underline inline-flex items-center gap-1.5 font-bold ${
                    isLight ? 'text-[#8c5e28] hover:text-[#5c3c15]' : 'text-[#dfc7a7] hover:text-white'
                  }`}
                >
                  <span>Esqueceu seu PIN? Solicitar ao Gestor no WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}

              {isGestorSession && (
                <div className={`pt-2 p-3.5 rounded-2xl border-2 text-left space-y-1.5 ${
                  isLight ? 'bg-amber-50 border-amber-300 text-slate-950 shadow-xs' : 'bg-[#b58c56]/10 border-[#b58c56]/30 text-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`}>
                      Console Gestor UpSell
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border-2 ${
                      isLight ? 'bg-white text-slate-950 border-slate-300' : 'bg-black/40 text-white border-white/20'
                    }`}>
                      PIN: {requiredPin}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}>Você tem acesso irrestrito de administrador</span>
                    <button
                      type="button"
                      onClick={handleBypassGestor}
                      className={`hover:underline font-bold ${isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'}`}
                    >
                      Entrar Direto &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={`py-4 text-center text-[11px] font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          UpSell Estratégia & Performance · Conexão Criptografada SSL
        </footer>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-300 ${
        isLight
          ? 'bg-[#f8fafc] text-slate-950 selection:bg-amber-200'
          : 'bg-[#090a0f] text-white selection:bg-[#c8a97e]/30'
      }`}
    >
      {/* Top Header */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md px-6 sm:px-12 py-3.5 transition-colors border-b-2 ${
          isLight ? 'bg-white/95 border-slate-300 shadow-xs' : 'bg-[#090a0f]/95 border-white/15'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Brand & Demo Switcher */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className={`font-black tracking-[0.25em] text-sm uppercase ${isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'}`}>
              UPSELL
            </span>
            <span className={isLight ? 'text-slate-400 font-black' : 'text-slate-500 font-bold'}>/</span>
            <span className={`text-xs font-black ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>
              Portal do Cliente
            </span>

            <div className={`hidden sm:block h-3.5 w-px ${isLight ? 'bg-slate-300' : 'bg-white/15'}`} />

            {/* Se for sessão do Gestor, exibe o switcher para alternar cliente facilmente; se for o cliente, mostra apenas o badge da empresa dele */}
            {isGestorSession ? (
              <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 border-2 transition-colors ${
                isLight ? 'bg-white border-slate-300 text-slate-950 shadow-xs' : 'bg-[#181a24] border-white/15 text-white'
              }`}>
                <Building2 className={`w-3.5 h-3.5 ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`} />
                <select
                  value={client.id}
                  onChange={e => onSelectClient(e.target.value)}
                  className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${
                    isLight ? 'text-slate-950' : 'text-white'
                  }`}
                  title="Alternar entre clientes (Visualização Gestor)"
                >
                  {clientsList.map(c => (
                    <option key={c.id} value={c.id} className={isLight ? 'bg-white text-slate-900' : 'bg-[#181a24] text-white'}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 border-2 text-xs font-bold ${
                isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-[#b58c56]/15 text-[#dfc7a7] border-[#b58c56]/40'
              }`}>
                <Building2 className="w-3.5 h-3.5" />
                <span>{client.companyName}</span>
              </div>
            )}
          </div>

          {/* Right Area: Status Badge, Theme Toggle, Console Gestor, Logout */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 ${
              isLight ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? 'bg-emerald-600' : 'bg-emerald-400'}`} />
              <span>Parceria Ativa</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isLight ? 'Alternar para Modo Noturno' : 'Alternar para Modo Claro Arejado'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 shadow-xs ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-[#181a24] hover:bg-[#222533] text-white border-white/15'
              }`}
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-900" />
                  <span>Modo Noturno</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#dfc7a7]" />
                  <span>Modo Claro</span>
                </>
              )}
            </button>

            {isGestorSession && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 shadow-xs ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                }`}
              >
                Console do Gestor
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isLight ? 'text-slate-700 hover:text-black hover:bg-slate-200/80' : 'text-slate-300 hover:text-white'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 sm:pt-12 space-y-12">
        {/* 1. HERO DO PORTAL: NOME DO CLIENTE & BARRA DE VIGÊNCIA */}
        <section className={`p-6 sm:p-10 rounded-3xl ${cardBg} space-y-6 transition-colors`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className={`text-xs uppercase tracking-widest font-black px-3 py-1 rounded-full border-2 ${
                  isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-[#b58c56]/15 text-[#dfc7a7] border-[#b58c56]/30'
                }`}>
                  {client.segment}
                </span>
                <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Início: {client.contractStart}
                </span>
              </div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                {client.companyName}
              </h1>
              <p className={`text-sm max-w-2xl font-medium leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                Painel transparente de acompanhamento das ações estratégicas, indicadores de aquisição e ferramentas de titularidade da sua empresa.
              </p>
            </div>

            {/* Card Lateral de Contrato & Contato */}
            <div className={`p-5 rounded-2xl ${innerBg} min-w-[280px] space-y-3`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold uppercase tracking-wider text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Responsável:</span>
                <strong className={`font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>{client.responsibleName}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold uppercase tracking-wider text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>E-mail:</span>
                <span className={`font-mono text-xs font-bold truncate max-w-[170px] ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>{client.email}</span>
              </div>
              <div className={`pt-2 border-t-2 flex items-center justify-between text-xs ${borderLine}`}>
                <span className={`font-bold uppercase tracking-wider text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Contrato Oficial:</span>
                <button
                  type="button"
                  onClick={() => setIsContractModalOpen(true)}
                  className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                    isLight ? 'text-[#8c5e28] hover:text-[#5c3c15]' : 'text-[#dfc7a7] hover:text-white'
                  }`}
                >
                  <span>Abrir Documento</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Barra de Vigência Humanizada e Amigável */}
          <div className={`p-5 rounded-2xl ${innerBg} space-y-3`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`} />
                <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {client.contractStatus}
                </span>
              </div>
              <div className={`flex items-center gap-3 font-mono text-[11px] font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                <span>Início: {client.contractStart}</span>
                <span>·</span>
                <span className={`font-black ${isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'}`}>
                  {contractProgressPercent}% da vigência ({daysRemaining} dias para renovação)
                </span>
                <span>·</span>
                <span>Término: {client.contractRenewal}</span>
              </div>
            </div>

            {/* Barra de Progresso com Trilho Marcado */}
            <div className={`w-full h-3 rounded-full overflow-hidden ${isLight ? 'bg-slate-200 border-2 border-slate-300' : 'bg-white/15'}`}>
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isLight ? 'bg-gradient-to-r from-[#8c5e28] to-[#b58c56]' : 'bg-gradient-to-r from-[#b58c56] to-[#dfc7a7]'
                }`}
                style={{ width: `${contractProgressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* 2. VISÃO GERAL DA OPERAÇÃO NESTE MÊS (FORMATO DE MENSAGENS TIPO WHATSAPP COM HISTÓRICO E ROLAGEM) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`font-serif italic text-lg font-bold ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`}>§</span>
              <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Visão Geral da Operação neste Mês
              </h2>
            </div>
            <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Linha Direta de Comunicação & Alinhamento</span>
          </div>

          {/* Card Conversacional tipo WhatsApp */}
          <div className={`rounded-3xl ${cardBg} overflow-hidden border-2 shadow-xl transition-colors`}>
            {/* Top Bar da Conversa estilo WhatsApp */}
            <div className={`px-6 py-4 border-b-2 flex items-center justify-between ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#12141a] border-white/15'
            }`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow ${
                    isLight ? 'bg-[#8c5e28] text-white' : 'bg-gradient-to-br from-[#b58c56] to-[#dfc7a7] text-black'
                  }`}>
                    UP
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 ${isLight ? 'border-white' : 'border-[#12141c]'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>Equipe UpSell Estratégia</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-2 ${
                      isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-[#b58c56]/15 text-[#dfc7a7] border-[#b58c56]/30'
                    }`}>
                      Oficial
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold block ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                    Online · Gestão ativa de Meta & Google Ads
                  </span>
                </div>
              </div>

              <div className={`flex items-center gap-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                <MessageCircle className={`w-4 h-4 ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`} />
                <span className="font-mono text-[11px] font-bold hidden sm:inline">
                  {operationMessages.length} pareceres registrados
                </span>
              </div>
            </div>

            {/* Área de Mensagens com Rolagem Suave */}
            <div
              ref={chatScrollRef}
              className={`p-5 sm:p-7 max-h-[380px] sm:max-h-[440px] overflow-y-auto space-y-4 ${
                isLight ? 'bg-[#f8fafc]' : 'bg-[#090a0f]'
              }`}
            >
              {/* Divisor de Início */}
              <div className="flex items-center justify-center my-2">
                <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border-2 ${
                  isLight ? 'bg-white text-slate-800 border-slate-300 shadow-xs' : 'bg-white/10 text-slate-300 border-white/10'
                }`}>
                  Histórico de Alinhamentos do Mês
                </span>
              </div>

              {operationMessages.map((msg) => {
                const isGestor = msg.sender === 'gestor';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isGestor ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[78%] p-4 rounded-2xl shadow-sm space-y-2 transition-all ${
                        isGestor
                          ? isLight
                            ? 'bg-white border-2 border-slate-300 text-slate-950 rounded-tl-sm'
                            : 'bg-[#181b24] border border-white/15 text-white rounded-tl-sm'
                          : isLight
                          ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-tr-sm'
                          : 'bg-[#16291d] border border-emerald-500/35 text-emerald-100 rounded-tr-sm'
                      }`}
                    >
                      {/* Top da Mensagem */}
                      <div className={`flex flex-wrap items-center justify-between gap-2 text-xs pb-1 border-b ${
                        isLight ? 'border-slate-200' : 'border-white/10'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <span className={isGestor ? (isLight ? 'text-[#8c5e28] font-black' : 'text-[#dfc7a7]') : (isLight ? 'text-emerald-900 font-black' : 'text-emerald-400')}>
                            {msg.authorName}
                          </span>
                        </div>
                        {msg.tag && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-2 ${
                            msg.tag === 'Parecer Estratégico'
                              ? isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                              : msg.tag === 'Atualização de Campanhas'
                              ? isLight ? 'bg-sky-100 text-sky-950 border-sky-300' : 'bg-sky-500/20 text-sky-200 border-sky-500/40'
                              : msg.tag === 'Entrega'
                              ? isLight ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                              : isLight ? 'bg-purple-100 text-purple-950 border-purple-300' : 'bg-purple-500/20 text-purple-200 border-purple-500/40'
                          }`}>
                            {msg.tag}
                          </span>
                        )}
                      </div>

                      {/* Conteúdo do Parecer / Mensagem */}
                      <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium ${isLight ? 'text-slate-950' : 'text-slate-100'}`}>
                        {msg.text}
                      </p>

                      {/* Rodapé com Horário e Status duplo ✓✓ */}
                      <div className={`flex items-center justify-end gap-1.5 pt-1 text-[10px] font-mono font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        <span>{msg.date} às {msg.time}</span>
                        <CheckCheck className={`w-3.5 h-3.5 ${isLight ? 'text-sky-700' : 'text-sky-400'}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barra Inferior de Envio de Parecer / Mensagem */}
            <form
              onSubmit={handleSendMessage}
              className={`p-3.5 sm:p-4 border-t-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${
                isLight ? 'bg-white border-slate-300' : 'bg-[#12141a] border-white/15'
              }`}
            >
              {isGestorSession && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[11px] font-bold hidden sm:inline ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Tag:</span>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value as OperationMessageTag)}
                    className={`text-xs font-bold py-2 px-2.5 rounded-xl border-2 focus:outline-none cursor-pointer shadow-xs ${
                      isLight
                        ? 'bg-white border-slate-400 text-slate-950 focus:border-[#8c5e28]'
                        : 'bg-[#181a24] border-white/20 text-white'
                    }`}
                  >
                    <option value="Parecer Estratégico">Parecer Estratégico</option>
                    <option value="Atualização de Campanhas">Atualização de Campanhas</option>
                    <option value="Entrega">Entrega</option>
                    <option value="Alinhamento">Alinhamento</option>
                  </select>
                </div>
              )}

              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={
                    isGestorSession
                      ? 'Adicionar novo parecer ou status da operação neste mês...'
                      : 'Enviar dúvida ou retorno para seu gestor UpSell...'
                  }
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm border-2 focus:outline-none transition-colors shadow-xs ${
                    isLight
                      ? 'bg-white border-slate-400 text-slate-950 placeholder-slate-500 focus:border-[#8c5e28] focus:ring-2 focus:ring-[#8c5e28]/20 font-semibold'
                      : 'bg-[#181a24] border-white/20 text-white placeholder-white/40 focus:border-[#c8a97e]'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${
                  isLight ? 'bg-[#8c5e28] hover:bg-[#734b1c]' : 'bg-[#b58c56] hover:bg-[#9d7644]'
                }`}
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>

        {/* 3. FLUXO DE ENTREGAS & CO-RESPONSABILIDADE (KANBAN CRM) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className={`font-serif italic text-lg font-bold ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`}>§</span>
            <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Fluxo de Entregas & Co-responsabilidade
            </h2>
          </div>

          <TaskKanban
            tasks={actionItems}
            onUpdateTasks={updated => {
              if (onUpdateClient) {
                onUpdateClient(client.id, { actionItems: updated });
              }
            }}
            isAdmin={false}
            clientName={client.companyName}
            isLight={isLight}
            defaultAssigneeFilter="all"
          />
        </section>

        {/* 4. FERRAMENTAS & ACESSOS VINCULADOS (COFRE DE ATIVOS DA MARCA) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`font-serif italic text-lg font-bold ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`}>§</span>
              <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Ferramentas & Acessos em Operação
              </h2>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 flex items-center gap-1.5 ${
              isLight ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Auditável e de Titularidade da Sua Marca</span>
            </span>
          </div>

          <div className={`p-6 sm:p-7 rounded-3xl ${cardBg} space-y-4 transition-colors`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTools.map((tool, idx) => (
                <div
                  key={tool.id || idx}
                  className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 transition-colors ${
                    isLight ? 'bg-white border-slate-300 shadow-xs hover:border-[#8c5e28]' : 'bg-[#181a24] border-white/15'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs sm:text-sm font-black truncate ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        {tool.name}
                      </span>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border-2 ${
                        tool.status === 'Ativo / Vinculado'
                          ? isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-950' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : tool.status === 'Pendente de Acesso'
                          ? isLight ? 'bg-amber-100 border-amber-300 text-amber-950' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : isLight ? 'bg-sky-100 border-sky-300 text-sky-950' : 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{tool.status}</span>
                      </div>
                    </div>
                    <p className={`text-[11px] leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      {tool.detail}
                    </p>
                    <div className={`flex items-center gap-2 text-[10px] font-mono pt-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      <span className="font-bold">{tool.category}</span>
                      <span>·</span>
                      <span className={`truncate max-w-[170px] font-semibold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>{tool.accountEmail}</span>
                    </div>
                  </div>

                  {tool.accessUrl && (
                    <div className={`pt-2 border-t-2 flex justify-end ${borderLine}`}>
                      <button
                        type="button"
                        onClick={() => handleOpenRepository(tool.accessUrl, tool.name, tool.detail)}
                        className={`text-[11px] font-bold hover:underline flex items-center gap-1 ${
                          isLight ? 'text-[#8c5e28] hover:text-[#5c3c15]' : 'text-[#dfc7a7] hover:text-white'
                        }`}
                      >
                        <span>Acessar Painel</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={`pt-4 border-t-2 text-[11px] font-semibold flex items-center gap-1.5 ${
              isLight ? 'border-slate-300 text-slate-800' : 'border-white/12 text-slate-300'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Nenhum ativo retido: todos os acessos pertencem integralmente à empresa parceira</span>
            </div>
          </div>
        </section>

        {/* 5. CENTRAL DE DOCUMENTOS & REPOSITÓRIOS (SEGMENTAÇÃO LIMPA: PASTAS DE CRIATIVOS & ANÁLISE DE RESULTADOS) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`font-serif italic text-lg font-bold ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`}>§</span>
                <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Central de Documentos & Repositórios
                </h2>
              </div>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                Arquivos em nuvem organizados por categoria · Titularidade 100% da sua marca
              </p>
            </div>
            <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Pastas Sincronizadas no Google Drive</span>
          </div>

          {/* BLOCO 1: PASTAS DE CRIATIVOS ORGANIZADAS POR FORMATO */}
          <div className={`p-6 sm:p-8 rounded-3xl ${cardBg} space-y-6 transition-colors shadow-sm`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 ${borderLine}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 ${
                  isLight ? 'bg-amber-100 text-[#8c5e28] border-amber-300' : `${innerBg} text-[#b58c56]`
                }`}>
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base sm:text-lg font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>Pastas de Criativos & Mídia</h3>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border-2 ${
                      isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-[#b58c56]/15 text-[#dfc7a7] border-[#b58c56]/30'
                    }`}>
                      Google Drive
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Estrutura organizada por formato para revisão de textos, aprovação de vídeos e artes estáticas.
                  </p>
                </div>
              </div>
              <span className={`text-xs font-mono hidden sm:inline font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>3 Diretórios Dedicados</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1.1 Pasta de Copys & Roteiros */}
              <div
                className={`p-6 rounded-2xl ${innerBg} flex flex-col justify-between border-2 transition-all text-left space-y-4 hover:border-[#8c5e28] shadow-xs`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${isLight ? 'bg-amber-100 text-[#8c5e28] border-amber-300' : 'bg-[#b58c56]/15 text-[#b58c56]'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
                      Textos & Roteiros
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      Pasta de Copys & Roteiros
                    </h4>
                    <p className={`text-xs mt-1.5 leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      Briefings de posicionamento, roteiros dinâmicos para gravação de vídeos e copys persuasivas aprovadas para Meta e Google Ads.
                    </p>
                  </div>
                </div>

                <div className={`pt-3 border-t-2 flex items-center justify-between ${borderLine}`}>
                  <button
                    type="button"
                    onClick={() => handleOpenRepository(
                      client.links.creativeCopies || client.links.googleDrive,
                      'Pasta de Copys & Roteiros',
                      'Repositório contendo roteiros de gravação, briefings e copys de alta conversão.'
                    )}
                    className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                      isLight ? 'text-[#8c5e28] hover:text-[#5c3c15]' : 'text-[#dfc7a7] hover:text-white'
                    }`}
                  >
                    <span>Abrir Pasta de Copys</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToolInfo(client.links.creativeCopies || client.links.googleDrive || '', 'copy-copys')}
                    className={`text-[11px] p-1.5 rounded transition-colors ${isLight ? 'text-slate-700 hover:text-black hover:bg-slate-200 border border-slate-300' : 'text-slate-400 hover:text-white'}`}
                    title="Copiar link da pasta"
                  >
                    {copiedKey === 'copy-copys' ? (
                      <span className="text-emerald-700 text-[10px] font-bold">Copiado!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 1.2 Pasta de Criativos em Vídeo */}
              <div
                className={`p-6 rounded-2xl ${innerBg} flex flex-col justify-between border-2 transition-all text-left space-y-4 hover:border-[#8c5e28] shadow-xs`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${isLight ? 'bg-amber-100 text-[#8c5e28] border-amber-300' : 'bg-[#b58c56]/15 text-[#b58c56]'}`}>
                      <Video className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
                      Reels & Vídeos
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      Criativos de Vídeo (Reels & Ads)
                    </h4>
                    <p className={`text-xs mt-1.5 leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      Vídeos brutos gravados pela empresa e edições finalizadas em 9:16 (Reels/TikTok) e 16:9 com legendas e ganchos validados.
                    </p>
                  </div>
                </div>

                <div className={`pt-3 border-t-2 flex items-center justify-between ${borderLine}`}>
                  <button
                    type="button"
                    onClick={() => handleOpenRepository(
                      client.links.creativeVideos || client.links.googleDrive,
                      'Pasta de Criativos em Vídeo',
                      'Repositório no Google Drive com vídeos em alta definição e edições de anúncios.'
                    )}
                    className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                      isLight ? 'text-[#8c5e28] hover:text-[#5c3c15]' : 'text-[#dfc7a7] hover:text-white'
                    }`}
                  >
                    <span>Abrir Pasta de Vídeos</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToolInfo(client.links.creativeVideos || client.links.googleDrive || '', 'copy-videos')}
                    className={`text-[11px] p-1.5 rounded transition-colors ${isLight ? 'text-slate-700 hover:text-black hover:bg-slate-200 border border-slate-300' : 'text-slate-400 hover:text-white'}`}
                    title="Copiar link da pasta"
                  >
                    {copiedKey === 'copy-videos' ? (
                      <span className="text-emerald-700 text-[10px] font-bold">Copiado!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 1.3 Pasta de Criativos em Imagem */}
              <div
                className={`p-6 rounded-2xl ${innerBg} flex flex-col justify-between border-2 transition-all text-left space-y-4 hover:border-[#8c5e28] shadow-xs`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${isLight ? 'bg-amber-100 text-[#8c5e28] border-amber-300' : 'bg-[#b58c56]/15 text-[#b58c56]'}`}>
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
                      Banners & Artes
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      Criativos Estáticos & Banners
                    </h4>
                    <p className={`text-xs mt-1.5 leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      Peças estáticas de alto impacto visual, carrosséis educativos para feed do Instagram e banners de display no Google Ads.
                    </p>
                  </div>
                </div>

                <div className={`pt-3 border-t-2 flex items-center justify-between ${borderLine}`}>
                  <button
                    type="button"
                    onClick={() => handleOpenRepository(
                      client.links.creativeImages || client.links.googleDrive,
                      'Pasta de Criativos em Imagem',
                      'Repositório no Google Drive com artes estáticas, carrosséis e banners.'
                    )}
                    className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                      isLight ? 'text-[#8c5e28] hover:text-[#5c3c15]' : 'text-[#dfc7a7] hover:text-white'
                    }`}
                  >
                    <span>Abrir Pasta de Imagens</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToolInfo(client.links.creativeImages || client.links.googleDrive || '', 'copy-images')}
                    className={`text-[11px] p-1.5 rounded transition-colors ${isLight ? 'text-slate-700 hover:text-black hover:bg-slate-200 border border-slate-300' : 'text-slate-400 hover:text-white'}`}
                    title="Copiar link da pasta"
                  >
                    {copiedKey === 'copy-images' ? (
                      <span className="text-emerald-700 text-[10px] font-bold">Copiado!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCO 2: ANÁLISE DE RESULTADOS & DOCUMENTAÇÃO OFICIAL */}
          <div className={`p-6 sm:p-8 rounded-3xl ${cardBg} space-y-6 transition-colors shadow-sm`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 ${borderLine}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 ${
                  isLight ? 'bg-amber-100 text-[#8c5e28] border-amber-300' : `${innerBg} text-[#b58c56]`
                }`}>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base sm:text-lg font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>Análise de Resultados & Documentação</h3>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border-2 ${
                      isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-[#b58c56]/15 text-[#dfc7a7] border-[#b58c56]/30'
                    }`}>
                      Oficial
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Painel de inteligência de tráfego, contrato com escopo de parceria e repositório raiz da sua empresa.
                  </p>
                </div>
              </div>
              <span className={`text-xs font-mono hidden sm:inline font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Auditoria & Transparência</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 2.1 Análise de Resultados */}
              <div
                className={`p-6 rounded-2xl ${innerBg} flex flex-col justify-between border-2 transition-all text-left space-y-4 hover:border-[#8c5e28] shadow-xs`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${isLight ? 'bg-amber-100 text-[#8c5e28] border-amber-300' : 'bg-[#b58c56]/15 text-[#b58c56]'}`}>
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
                      Looker Studio
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      Análise de Resultados
                    </h4>
                    <p className={`text-xs mt-1.5 leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      Painel detalhado de performance atualizado em tempo real com métricas consolidadas de CTR, custo por lead, conversões e ROAS.
                    </p>
                  </div>
                </div>

                <div className={`pt-3 border-t-2 flex items-center justify-between ${borderLine}`}>
                  <button
                    type="button"
                    onClick={() => handleOpenRepository(
                      client.links.lookerStudio,
                      'Análise de Resultados',
                      'Painel analítico detalhado com dados consolidados de tráfego, conversões, ROAS e comportamento do público.'
                    )}
                    className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                      isLight ? 'text-[#8c5e28] hover:text-[#5c3c15]' : 'text-[#dfc7a7] hover:text-white'
                    }`}
                  >
                    <span>Abrir Análise de Resultados</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToolInfo(client.links.lookerStudio, 'copy-looker')}
                    className={`text-[11px] p-1.5 rounded transition-colors ${isLight ? 'text-slate-700 hover:text-black hover:bg-slate-200 border border-slate-300' : 'text-slate-400 hover:text-white'}`}
                    title="Copiar link do relatório"
                  >
                    {copiedKey === 'copy-looker' ? (
                      <span className="text-emerald-700 text-[10px] font-bold">Copiado!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 2.2 Contrato Oficial de Parceria */}
              <div
                className={`p-6 rounded-2xl ${innerBg} flex flex-col justify-between border-2 transition-all text-left space-y-4 hover:border-[#8c5e28] shadow-xs`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${isLight ? 'bg-amber-100 text-[#8c5e28] border-amber-300' : 'bg-[#b58c56]/15 text-[#b58c56]'}`}>
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
                      Jurídico & Escopo
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      Contrato Oficial de Parceria
                    </h4>
                    <p className={`text-xs mt-1.5 leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      Documento formal assinado com cláusulas de transparência, escopo detalhado de trabalho e garantia de não-retenção de contas.
                    </p>
                  </div>
                </div>

                <div className={`pt-3 border-t-2 flex items-center justify-between ${borderLine}`}>
                  <button
                    type="button"
                    onClick={() => setIsContractModalOpen(true)}
                    className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                      isLight ? 'text-[#8c5e28] hover:text-[#5c3c15]' : 'text-[#dfc7a7] hover:text-white'
                    }`}
                  >
                    <span>Visualizar Contrato</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToolInfo(client.links.contractPdf, 'copy-contract')}
                    className={`text-[11px] p-1.5 rounded transition-colors ${isLight ? 'text-slate-700 hover:text-black hover:bg-slate-200 border border-slate-300' : 'text-slate-400 hover:text-white'}`}
                    title="Copiar link do contrato"
                  >
                    {copiedKey === 'copy-contract' ? (
                      <span className="text-emerald-700 text-[10px] font-bold">Copiado!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 2.3 Repositório Geral no Google Drive */}
              <div
                className={`p-6 rounded-2xl ${innerBg} flex flex-col justify-between border-2 transition-all text-left space-y-4 hover:border-[#8c5e28] shadow-xs`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${isLight ? 'bg-amber-100 text-[#8c5e28] border-amber-300' : 'bg-[#b58c56]/15 text-[#b58c56]'}`}>
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
                      Pasta Raiz
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      Repositório Geral Drive
                    </h4>
                    <p className={`text-xs mt-1.5 leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      Pasta raiz consolidada no Google Drive contendo todas as subpastas, arquivos sincronizados e backups de titularidade da sua marca.
                    </p>
                  </div>
                </div>

                <div className={`pt-3 border-t-2 flex items-center justify-between ${borderLine}`}>
                  <button
                    type="button"
                    onClick={() => handleOpenRepository(
                      client.links.googleDrive,
                      'Repositório Geral no Google Drive',
                      'Pasta raiz contendo todas as subpastas, arquivos sincronizados e backups da conta.'
                    )}
                    className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                      isLight ? 'text-[#8c5e28] hover:text-[#5c3c15]' : 'text-[#dfc7a7] hover:text-white'
                    }`}
                  >
                    <span>Abrir Drive Geral</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToolInfo(client.links.googleDrive, 'copy-drive')}
                    className={`text-[11px] p-1.5 rounded transition-colors ${isLight ? 'text-slate-700 hover:text-black hover:bg-slate-200 border border-slate-300' : 'text-slate-400 hover:text-white'}`}
                    title="Copiar link do drive geral"
                  >
                    {copiedKey === 'copy-drive' ? (
                      <span className="text-emerald-700 text-[10px] font-bold">Copiado!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal do Contrato Oficial */}
      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        client={client}
        isLight={isLight}
      />

      {/* Modal de Informação para Repositórios em Configuração (Evita Links Quebrados) */}
      {infoModalMessage && (
        <div
          onClick={() => setInfoModalMessage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-md p-6 sm:p-7 rounded-2xl shadow-2xl border-2 ${
              isLight ? 'bg-white border-slate-300 text-slate-950' : 'bg-[#151720] border-white/10 text-white'
            }`}
          >
            <div className={`flex items-center justify-between pb-3 border-b-2 mb-4 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="flex items-center gap-2">
                <Info className={`w-5 h-5 ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`} />
                <h3 className={`font-black text-base ${isLight ? 'text-slate-950' : 'text-white'}`}>{infoModalMessage.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInfoModalMessage(null)}
                className={`p-1 rounded-lg transition-colors ${isLight ? 'text-slate-500 hover:text-slate-950 hover:bg-slate-100' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-xs leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {infoModalMessage.desc}
            </p>
            <div className="pt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoModalMessage(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                  isLight ? 'bg-[#8c5e28] hover:bg-[#734b1c]' : 'bg-[#b58c56] hover:bg-[#9d7644]'
                }`}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
