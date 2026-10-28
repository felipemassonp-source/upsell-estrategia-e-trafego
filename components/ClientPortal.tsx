'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  ClientProfile,
  ClientActionItem,
  ClientToolAccess,
  VisualTheme,
  OperationMessage,
  OperationMessageTag,
  OptimizationLog
} from '@/lib/types';
import { useUpsellStore } from '@/lib/store';
import { ContractModal } from './ContractModal';
import { TaskKanban } from './TaskKanban';
import { PerformanceChart } from './PerformanceChart';
import {
  LogOut,
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
  Info,
  X,
  Copy,
  FileText,
  Video,
  Image as ImageIcon,
  MessageCircle,
  Send,
  CheckCheck,
  TrendingUp,
  Target,
  Layers,
  ArrowUpRight,
  Compass,
  CheckCircle2,
  Sliders
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

type PortalTab = 'visao-geral' | 'evolucao' | 'plano-acao' | 'materiais' | 'tudo';

const DEFAULT_ACTION_ITEMS: ClientActionItem[] = [
  {
    id: 'task-1',
    task: 'Gravação dos 2 vídeos de respostas a dúvidas frequentes',
    detail: 'Roteiros enviados pelo gestor no WhatsApp no dia 12/10. Duração de 45 a 60 segundos.',
    status: 'pending',
    due: 'Até 22/10',
    assignee: 'client',
    priority: 'high',
    category: 'Criativos & Vídeos'
  },
  {
    id: 'task-2',
    task: 'Envio de 5 fotos em alta resolução da estrutura de atendimento',
    detail: 'Material para os novos criativos estáticos de prova institucional.',
    status: 'completed',
    due: 'Concluído em 10/10',
    assignee: 'client',
    priority: 'medium',
    category: 'Criativos & Vídeos'
  },
  {
    id: 'task-3',
    task: 'Refinamento de público e exclusão de curiosos no Meta Ads',
    detail: 'Ajuste de segmentação e lookalike de clientes compradores.',
    status: 'in_progress',
    due: 'Em execução',
    assignee: 'agency',
    priority: 'high',
    category: 'Tráfego Meta Ads'
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
    detail: 'Servidor Cloud com SSL ativo e alta velocidade'
  },
  {
    id: 'tool-1',
    name: 'Meta Business Manager',
    category: 'Instagram & Facebook Ads',
    accountEmail: 'Conta Oficial da Empresa',
    accessUrl: 'https://business.facebook.com',
    status: 'Ativo / Vinculado',
    detail: 'Pixel e Conversions API (CAPI) operando com eventos ativos'
  },
  {
    id: 'tool-2',
    name: 'Google Ads (MCC UPSELL)',
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
  }
];

const DEFAULT_OPTIMIZATION_LOGS: OptimizationLog[] = [
  {
    id: 'opt-default-1',
    date: 'Esta semana',
    channel: 'Meta Ads',
    action: 'Rotação de criativos e realocação de verba para os anúncios de menor custo por conversa',
    expectedImpact: 'Redução do CPL em 15% e maior qualificação no WhatsApp',
    status: 'Concluído'
  },
  {
    id: 'opt-default-2',
    date: 'Semana anterior',
    channel: 'Google Ads',
    action: 'Negativação de termos irrelevantes e ajuste de lances em palavras-chave de fundo de funil',
    expectedImpact: 'Aumento na taxa de conversão da página de destino',
    status: 'Monitorando'
  },
  {
    id: 'opt-default-3',
    date: 'Início do ciclo',
    channel: 'Tracking & CAPI',
    action: 'Auditoria dos eventos de clique no WhatsApp e envio de conversões via API',
    expectedImpact: 'Atribuição precisa de quais anúncios geram vendas reais',
    status: 'Concluído'
  }
];

function formatSafeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

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
  const { theme, toggleTheme, userRole, authUser, addOperationMessage } = useUpsellStore();
  const isLight = theme === 'light';

  const isGestorSession =
    userRole === 'admin' ||
    authUser?.email?.toLowerCase().trim() === 'felipemassonp@gmail.com';

  const [activeTab, setActiveTab] = useState<PortalTab>('visao-geral');
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState<{ title: string; desc: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Feed de Mensagens / Pareceres da Operação
  const operationMessages: OperationMessage[] = useMemo(() => {
    if (client.operationMessages && client.operationMessages.length > 0) {
      return client.operationMessages;
    }
    return [
      {
        id: 'msg-fallback-1',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UPSELL',
        text:
          client.currentFocus ||
          'Campanhas ativas em Meta Ads e Google Ads com foco em atrair demanda qualificada para o comercial.',
        date: '10/10/2026',
        time: '09:30',
        tag: 'Parecer Estratégico'
      },
      {
        id: 'msg-fallback-2',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UPSELL',
        text:
          client.nextSteps ||
          'Próximos passos imediatos: ativação das novas variações de criativos e monitoramento diário do custo por oportunidade.',
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
    const authorName = isAgencyAuthor ? 'Felipe Masson · Gestor UPSELL' : client.responsibleName;
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

  // Dados normalizados
  const actionItems = useMemo(() => {
    return client.actionItems && client.actionItems.length > 0
      ? client.actionItems
      : DEFAULT_ACTION_ITEMS;
  }, [client.actionItems]);

  const activeTools = useMemo(() => {
    return client.activeTools && client.activeTools.length > 0
      ? client.activeTools
      : DEFAULT_ACTIVE_TOOLS;
  }, [client.activeTools]);

  const optimizationLogs = useMemo(() => {
    return client.optimizationLogs && client.optimizationLogs.length > 0
      ? client.optimizationLogs
      : DEFAULT_OPTIMIZATION_LOGS;
  }, [client.optimizationLogs]);

  const clientPendingTasks = useMemo(
    () => actionItems.filter(t => t.assignee === 'client' && t.status !== 'completed'),
    [actionItems]
  );
  const agencyActiveTasks = useMemo(
    () => actionItems.filter(t => (t.assignee === 'agency' || !t.assignee) && t.status !== 'completed'),
    [actionItems]
  );
  const completedTasks = useMemo(
    () => actionItems.filter(t => t.status === 'completed'),
    [actionItems]
  );

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

  const handleOpenRepository = (url: string | undefined, repoName: string, defaultDesc: string) => {
    if (!url || !url.trim() || url === '#') {
      setInfoModalMessage({
        title: `${repoName} em Sincronização`,
        desc: `Este repositório está sendo organizado pela equipe da UPSELL (${defaultDesc}). Assim que o link definitivo estiver vinculado no Console do Gestor, ele abrirá diretamente por aqui.`
      });
      return;
    }
    const safeUrl = formatSafeUrl(url);
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  };

  // Cálculo da barra de vigência
  const startDate = parseContractDate(client.contractStart) || new Date(2024, 9, 15);
  const endDate = parseContractDate(client.contractRenewal) || new Date(2026, 9, 15);
  const now = new Date();

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  const remainingMs = endDate.getTime() - now.getTime();

  const daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
  const contractProgressPercent =
    totalDuration > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100))) : 0;

  // Classes de estilo Editorial Suíço UPSELL
  const surfaceCard = isLight
    ? 'bg-white border border-[#141414]/12 text-[#141414] shadow-[0_12px_32px_-18px_rgba(20,20,20,0.06)]'
    : 'bg-[#12141a] border border-white/10 text-[#f7f7f4]';

  const subtleBox = isLight
    ? 'bg-[#f7f7f4] border border-[#141414]/10 text-[#141414]'
    : 'bg-[#0c0d10] border border-white/10 text-[#f7f7f4]';

  const hairline = isLight ? 'border-[#141414]/10' : 'border-white/10';
  const mutedText = isLight ? 'text-[#141414]/60' : 'text-white/60';

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-300 ${
        isLight
          ? 'bg-[#f7f7f4] text-[#141414] selection:bg-[#ed1c24] selection:text-white'
          : 'bg-[#0c0d10] text-[#f7f7f4] selection:bg-[#ed1c24] selection:text-white'
      }`}
    >
      {/* =====================================================================
          1. TOP HEADER BAR (SWISS EDITORIAL)
      ====================================================================== */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md px-5 sm:px-10 py-3.5 transition-colors border-b ${
          isLight ? 'bg-[#f7f7f4]/95 border-[#141414]/12' : 'bg-[#0c0d10]/95 border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Left: Brand & Client Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#ed1c24]" />
              <span className="font-display tracking-[0.14em] text-base uppercase">
                UPSELL
              </span>
            </div>
            <span className={isLight ? 'text-[#141414]/30' : 'text-white/30'}>/</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] font-semibold">
              Portal do Cliente
            </span>

            <div className={`hidden sm:block h-4 w-px ${isLight ? 'bg-[#141414]/15' : 'bg-white/15'}`} />

            {isGestorSession ? (
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border ${
                  isLight ? 'bg-white border-[#141414]/15' : 'bg-[#161922] border-white/15'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#ed1c24]" />
                <span className={`font-mono text-[10px] uppercase ${mutedText}`}>Cliente:</span>
                <select
                  value={client.id}
                  onChange={e => onSelectClient(e.target.value)}
                  className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
                  title="Alternar entre clientes (Modo Gestor)"
                >
                  {clientsList.map(c => (
                    <option
                      key={c.id}
                      value={c.id}
                      className={isLight ? 'bg-white text-[#141414]' : 'bg-[#161922] text-white'}
                    >
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border text-xs font-bold ${
                  isLight ? 'bg-white border-[#141414]/15' : 'bg-[#161922] border-white/15'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#ed1c24]" />
                <span>{client.companyName}</span>
              </div>
            )}
          </div>

          {/* Right: Status, Theme, Admin Console, Logout */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider font-bold border ${
                isLight
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operação Ativa</span>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-[#141414]/5 text-[#141414] border-[#141414]/15'
                  : 'bg-[#161922] hover:bg-white/10 text-white border-white/15'
              }`}
              title={isLight ? 'Ativar Modo Escuro' : 'Ativar Modo Claro Editorial'}
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Escuro</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#ed1c24]" />
                  <span className="hidden sm:inline">Claro</span>
                </>
              )}
            </button>

            {isGestorSession && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#ed1c24] text-white hover:bg-[#c8141b] transition-all cursor-pointer shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Editar no Console do Gestor</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isLight ? 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#141414]/5' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN PORTAL CONTAINER
      ====================================================================== */}
      <main className="max-w-7xl mx-auto px-5 sm:px-10 pt-8 space-y-8">
        {/* 2. CABEÇALHO EXECUTIVO DA CONTA (CONTEXTO SEMPRE VISÍVEL) */}
        <section className={`p-6 sm:p-8 rounded-2xl ${surfaceCard} space-y-6`}>
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded bg-[#ed1c24]/10 text-[#ed1c24] font-bold">
                  {client.segment}
                </span>
                {(client.activeChannels || ['Meta Ads', 'Google Ads']).map((ch) => (
                  <span
                    key={ch}
                    className={`font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded border ${
                      isLight ? 'bg-[#f7f7f4] border-[#141414]/12 text-[#141414]/80' : 'bg-white/5 border-white/10 text-white/80'
                    }`}
                  >
                    {ch}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-3xl sm:text-5xl uppercase tracking-tight leading-[0.95]">
                {client.companyName}
              </h1>

              <p className={`text-xs sm:text-sm leading-relaxed ${mutedText}`}>
                Bem-vindo ao seu painel de inteligência e acompanhamento. Aqui você visualiza de forma didática onde seu orçamento está sendo investido, o retorno gerado, o que nossa equipe executou e quais são os próximos passos.
              </p>
            </div>

            {/* Ficha Técnica da Parceria */}
            <div className={`p-4 sm:p-5 rounded-xl ${subtleBox} min-w-[290px] sm:min-w-[330px] space-y-2.5 text-xs`}>
              <div className="flex items-center justify-between gap-4">
                <span className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>Responsável:</span>
                <strong className="font-bold text-right">{client.responsibleName}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>Conta Autorizada:</span>
                <span className="font-mono text-[11px] font-semibold truncate max-w-[190px]">{client.email}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>Vigência:</span>
                <span className="font-mono text-[11px] font-semibold">
                  {client.contractStart} → {client.contractRenewal}
                </span>
              </div>
              <div className={`pt-2.5 border-t ${hairline} flex items-center justify-between`}>
                <span className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>Instrumento Legal:</span>
                <button
                  type="button"
                  onClick={() => setIsContractModalOpen(true)}
                  className="text-xs font-bold text-[#ed1c24] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver Contrato & Escopo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Barra Didática de Ciclo & Vigência */}
          <div className={`p-4 rounded-xl ${subtleBox} space-y-2.5`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#ed1c24]" />
                <span className="font-bold">{client.contractStatus}</span>
              </div>
              <div className={`flex flex-wrap items-center gap-2 font-mono text-[11px] ${mutedText}`}>
                <span>Início: {client.contractStart}</span>
                <span>·</span>
                <span className="font-bold text-[#ed1c24]">
                  {contractProgressPercent}% do ciclo concluído ({daysRemaining} dias até renovação)
                </span>
                <span>·</span>
                <span>Renovação: {client.contractRenewal}</span>
              </div>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-[#141414]/10' : 'bg-white/10'}`}>
              <div
                className="h-full rounded-full bg-[#ed1c24] transition-all duration-700"
                style={{ width: `${contractProgressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* =====================================================================
            3. MENU DE NAVEGAÇÃO DIDÁTICO POR ETAPAS (EVITA EXCESSO DE INFORMAÇÃO)
        ====================================================================== */}
        <nav
          aria-label="Navegação do Portal do Cliente"
          className={`p-1.5 rounded-2xl border ${
            isLight ? 'bg-white border-[#141414]/12 shadow-xs' : 'bg-[#12141a] border-white/10'
          } flex flex-wrap items-center gap-1.5`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('visao-geral')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'visao-geral'
                ? 'bg-[#141414] text-white dark:bg-[#ed1c24] dark:text-white shadow-xs'
                : isLight
                ? 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#f7f7f4]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-mono text-[10px] opacity-70">01</span>
            <Compass className="w-3.5 h-3.5" />
            <span>Resumo & Indicadores do Mês</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evolucao')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'evolucao'
                ? 'bg-[#141414] text-white dark:bg-[#ed1c24] dark:text-white shadow-xs'
                : isLight
                ? 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#f7f7f4]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-mono text-[10px] opacity-70">02</span>
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Gráfico Semanal & Otimizações</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                activeTab === 'evolucao'
                  ? 'bg-white/20 text-white'
                  : isLight
                  ? 'bg-[#141414]/8 text-[#141414]'
                  : 'bg-white/10 text-white'
              }`}
            >
              {optimizationLogs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('plano-acao')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'plano-acao'
                ? 'bg-[#141414] text-white dark:bg-[#ed1c24] dark:text-white shadow-xs'
                : isLight
                ? 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#f7f7f4]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-mono text-[10px] opacity-70">03</span>
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tarefas & Pendências</span>
            {clientPendingTasks.length > 0 && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#ed1c24] text-white font-bold">
                {clientPendingTasks.length} sua(s)
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('materiais')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'materiais'
                ? 'bg-[#141414] text-white dark:bg-[#ed1c24] dark:text-white shadow-xs'
                : isLight
                ? 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#f7f7f4]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-mono text-[10px] opacity-70">04</span>
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Criativos, Relatórios & Acessos</span>
          </button>

          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setActiveTab('tudo')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[11px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'tudo'
                  ? 'bg-[#141414] text-white dark:bg-[#ed1c24] dark:text-white'
                  : isLight
                  ? 'text-[#141414]/60 hover:text-[#141414] hover:bg-[#f7f7f4]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              title="Exibir todas as seções abaixo uma da outra"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ver Página Completa</span>
            </button>
          </div>
        </nav>

        {/* =====================================================================
            MÓDULO 01: VISÃO GERAL, RESUMO EXECUTIVO, KPIS DIDÁTICOS & ALINHAMENTO
        ====================================================================== */}
        {(activeTab === 'visao-geral' || activeTab === 'tudo') && (
          <div className="space-y-8">
            {/* Alerta Didático se houver pendências que dependem do Cliente */}
            {clientPendingTasks.length > 0 && (
              <div
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isLight
                    ? 'bg-white border-l-4 border-l-[#ed1c24] border-[#141414]/15 shadow-xs'
                    : 'bg-[#161922] border-l-4 border-l-[#ed1c24] border-white/10'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ed1c24]/10 text-[#ed1c24] flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ed1c24] font-bold">
                        Ação Necessária da Sua Equipe
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold">
                      Você possui {clientPendingTasks.length}{' '}
                      {clientPendingTasks.length === 1 ? 'item aguardando aprovação ou envio' : 'itens aguardando aprovação ou envio'}
                    </h3>
                    <p className={`text-xs ${mutedText}`}>
                      Próxima pendência: <strong>&ldquo;{clientPendingTasks[0].task}&rdquo;</strong> ({clientPendingTasks[0].due}).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('plano-acao')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#141414] text-white dark:bg-[#ed1c24] hover:opacity-90 transition-all shrink-0 cursor-pointer"
                >
                  Ver Pendências ({clientPendingTasks.length}) &rarr;
                </button>
              </div>
            )}

            {/* BÚSSOLA DO MÊS: O QUE ESTAMOS FAZENDO AGORA vs PRÓXIMOS PASSOS */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-bold block">
                    01.A · Bússola da Operação
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mt-0.5">
                    Direcionamento Estratégico Atual
                  </h2>
                </div>
                <span className={`text-xs ${mutedText}`}>
                  Resumo executivo em linguagem direta sobre o momento da sua conta
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Card 1: O que estamos fazendo agora */}
                <div className={`p-6 sm:p-7 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-4`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded bg-[#ed1c24]/10 text-[#ed1c24] font-bold">
                        Em Execução Agora
                      </span>
                      <Target className="w-4 h-4 text-[#ed1c24]" />
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-tight">
                      Qual é o foco atual das campanhas?
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed font-medium">
                      {client.currentFocus ||
                        'Otimização contínua das campanhas ativas em Meta Ads e Google Ads para reduzir o custo por conversa qualificada.'}
                    </p>
                  </div>
                  <div className={`pt-3 border-t ${hairline} flex items-center justify-between text-[11px] ${mutedText}`}>
                    <span>Monitoramento diário pelo Gestor UPSELL</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">● Ativo</span>
                  </div>
                </div>

                {/* Card 2: Próximos passos */}
                <div className={`p-6 sm:p-7 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-4`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded font-bold ${
                          isLight ? 'bg-[#141414] text-white' : 'bg-white/15 text-white'
                        }`}
                      >
                        Próximos 7 a 15 Dias
                      </span>
                      <Zap className="w-4 h-4 text-[#ed1c24]" />
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-tight">
                      O que entrará em ação a seguir?
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed font-medium">
                      {client.nextSteps ||
                        'Validação de novos criativos de anúncios, revisão das termos de pesquisa no Google e escala gradual das campanhas vencedoras.'}
                    </p>
                  </div>
                  <div className={`pt-3 border-t ${hairline} flex items-center justify-between text-[11px] ${mutedText}`}>
                    <span>Planejamento tático da equipe</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('plano-acao')}
                      className="font-bold text-[#ed1c24] hover:underline cursor-pointer"
                    >
                      Abrir cronograma de tarefas &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* INDICADORES DO MÊS EXPLICADOS DIDATICAMENTE */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-bold block">
                    01.B · Números Consolidados do Ciclo
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mt-0.5">
                    Indicadores de Resultado (Com Explicação)
                  </h2>
                </div>
                <span className={`text-xs ${mutedText}`}>
                  Cada indicador abaixo inclui uma legenda explicando seu significado prático
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Investimento */}
                <div className={`p-5 sm:p-6 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-4`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-mono text-[10px] uppercase tracking-[0.16em] font-bold ${mutedText}`}>
                        01 · Investimento em Mídia
                      </span>
                      {client.metrics?.growth?.investment && (
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                            isLight ? 'bg-[#f7f7f4] text-[#141414]' : 'bg-white/10 text-white'
                          }`}
                        >
                          {client.metrics.growth.investment}
                        </span>
                      )}
                    </div>
                    <div className="font-display text-3xl sm:text-4xl tracking-tight">
                      R$ {(client.metrics?.investment || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${subtleBox} text-[11px] leading-relaxed`}>
                    <strong className="block mb-0.5 text-[#ed1c24] font-mono uppercase text-[10px]">
                      O que significa:
                    </strong>
                    Valor aplicado diretamente nas plataformas de anúncio (Meta Ads e Google Ads) para exibir sua marca.
                  </div>
                </div>

                {/* KPI 2: Oportunidades / Leads */}
                <div className={`p-5 sm:p-6 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-4`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-mono text-[10px] uppercase tracking-[0.16em] font-bold ${mutedText}`}>
                        02 · Oportunidades (Leads)
                      </span>
                      {client.metrics?.growth?.leads && (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                          {client.metrics.growth.leads}
                        </span>
                      )}
                    </div>
                    <div className="font-display text-3xl sm:text-4xl tracking-tight">
                      {(client.metrics?.leads || 0).toLocaleString('pt-BR')} <span className="text-lg font-sans font-semibold">contatos</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${subtleBox} text-[11px] leading-relaxed`}>
                    <strong className="block mb-0.5 text-[#ed1c24] font-mono uppercase text-[10px]">
                      O que significa:
                    </strong>
                    Pessoas interessadas que clicaram nos seus anúncios e chamaram no WhatsApp ou preencheram cadastro.
                  </div>
                </div>

                {/* KPI 3: CPL */}
                <div className={`p-5 sm:p-6 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-4`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-mono text-[10px] uppercase tracking-[0.16em] font-bold ${mutedText}`}>
                        03 · Custo por Lead (CPL)
                      </span>
                      {client.metrics?.growth?.cpl && (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                          {client.metrics.growth.cpl}
                        </span>
                      )}
                    </div>
                    <div className="font-display text-3xl sm:text-4xl tracking-tight">
                      R$ {Number(client.metrics?.cpl || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${subtleBox} text-[11px] leading-relaxed`}>
                    <strong className="block mb-0.5 text-[#ed1c24] font-mono uppercase text-[10px]">
                      O que significa:
                    </strong>
                    Quanto custou em média atrair cada novo interessado (Investimento dividido pelo total de contatos).
                  </div>
                </div>

                {/* KPI 4: ROAS & Receita */}
                <div className={`p-5 sm:p-6 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-4`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-mono text-[10px] uppercase tracking-[0.16em] font-bold ${mutedText}`}>
                        04 · Multiplicador (ROAS)
                      </span>
                      {client.metrics?.growth?.roas && (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#ed1c24]/15 text-[#ed1c24]">
                          {client.metrics.growth.roas}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl sm:text-4xl tracking-tight text-[#ed1c24]">
                        {Number(client.metrics?.roas || 0).toFixed(1)}x
                      </span>
                      <span className={`font-mono text-xs font-bold ${mutedText}`}>
                        (R$ {(client.metrics?.revenue || 0).toLocaleString('pt-BR')})
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${subtleBox} text-[11px] leading-relaxed`}>
                    <strong className="block mb-0.5 text-[#ed1c24] font-mono uppercase text-[10px]">
                      O que significa:
                    </strong>
                    Para cada R$ 1 investido em mídia, retornaram R$ {Number(client.metrics?.roas || 0).toFixed(2)} em receita rastreada.
                  </div>
                </div>
              </div>
            </section>

            {/* MURAL DE ALINHAMENTO & COMUNICAÇÃO DIRETA */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-bold block">
                    01.C · Canal de Alinhamento Registrado
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mt-0.5">
                    Mural de Pareceres & Alinhamento
                  </h2>
                </div>
                <span className={`text-xs ${mutedText}`}>
                  Histórico oficial de atualizações do seu gestor e espaço para você enviar dúvidas
                </span>
              </div>

              <div className={`rounded-2xl ${surfaceCard} overflow-hidden`}>
                {/* Top Bar do Mural */}
                <div
                  className={`px-6 py-4 border-b ${hairline} flex items-center justify-between ${
                    isLight ? 'bg-[#f7f7f4]' : 'bg-[#0c0d10]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#141414] dark:bg-[#ed1c24] text-white flex items-center justify-center font-display text-sm tracking-wider">
                      UP
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold">Equipe UPSELL Estratégia</span>
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#ed1c24]/10 text-[#ed1c24] font-bold">
                          Canal Direto
                        </span>
                      </div>
                      <span className={`text-[11px] block ${mutedText}`}>
                        Todas as mensagens ficam salvas no histórico da sua operação
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 font-mono text-[11px] ${mutedText}`}>
                    <MessageCircle className="w-3.5 h-3.5 text-[#ed1c24]" />
                    <span>{operationMessages.length} registros</span>
                  </div>
                </div>

                {/* Lista de Mensagens */}
                <div
                  ref={chatScrollRef}
                  className="p-5 sm:p-6 max-h-[360px] overflow-y-auto space-y-4"
                >
                  {operationMessages.map((msg) => {
                    const isGestor = msg.sender === 'gestor';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isGestor ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[92%] sm:max-w-[78%] p-4 rounded-2xl space-y-2 border ${
                            isGestor
                              ? isLight
                                ? 'bg-[#f7f7f4] border-[#141414]/12 text-[#141414] rounded-tl-xs'
                                : 'bg-[#181b24] border-white/10 text-white rounded-tl-xs'
                              : isLight
                              ? 'bg-[#141414] text-white border-[#141414] rounded-tr-xs'
                              : 'bg-[#ed1c24]/20 border-[#ed1c24]/40 text-white rounded-tr-xs'
                          }`}
                        >
                          <div
                            className={`flex flex-wrap items-center justify-between gap-2 text-xs pb-1.5 border-b ${
                              isGestor ? hairline : 'border-white/15'
                            }`}
                          >
                            <span className="font-bold text-xs">
                              {msg.authorName}
                            </span>
                            {msg.tag && (
                              <span
                                className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                                  isGestor
                                    ? 'bg-[#ed1c24]/10 text-[#ed1c24]'
                                    : 'bg-white/15 text-white'
                                }`}
                              >
                                {msg.tag}
                              </span>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                            {msg.text}
                          </p>

                          <div
                            className={`flex items-center justify-end gap-1.5 pt-1 text-[10px] font-mono ${
                              isGestor ? mutedText : 'text-white/70'
                            }`}
                          >
                            <span>
                              {msg.date} às {msg.time}
                            </span>
                            <CheckCheck className="w-3.5 h-3.5 text-[#ed1c24]" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Formulário de Envio */}
                <form
                  onSubmit={handleSendMessage}
                  className={`p-4 border-t ${hairline} flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${
                    isLight ? 'bg-[#f7f7f4]' : 'bg-[#0c0d10]'
                  }`}
                >
                  {isGestorSession && (
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value as OperationMessageTag)}
                      className={`text-xs font-bold py-2.5 px-3 rounded-xl border focus:outline-none cursor-pointer ${
                        isLight
                          ? 'bg-white border-[#141414]/15 text-[#141414]'
                          : 'bg-[#161922] border-white/15 text-white'
                      }`}
                    >
                      <option value="Parecer Estratégico">Parecer Estratégico</option>
                      <option value="Atualização de Campanhas">Atualização de Campanhas</option>
                      <option value="Entrega">Entrega</option>
                      <option value="Alinhamento">Alinhamento</option>
                    </select>
                  )}

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      isGestorSession
                        ? 'Registrar novo parecer estratégico ou atualização para o cliente...'
                        : 'Escreva uma dúvida, observação ou feedback para seu gestor UPSELL...'
                    }
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm border focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-white border-[#141414]/15 text-[#141414] placeholder-[#141414]/45 focus:border-[#141414]'
                        : 'bg-[#161922] border-white/15 text-white placeholder-white/40 focus:border-[#ed1c24]'
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#ed1c24] hover:bg-[#c8141b] transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shrink-0"
                  >
                    <span>Registrar Mensagem</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            MÓDULO 02: GRÁFICO SEMANAL, DIÁRIO DE OTIMIZAÇÕES & ESCOPO
        ====================================================================== */}
        {(activeTab === 'evolucao' || activeTab === 'tudo') && (
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-bold block">
                    02.A · Inteligência de Dados Semanal
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mt-0.5">
                    Gráfico de Evolução da Operação
                  </h2>
                </div>
                <span className={`text-xs ${mutedText}`}>
                  Acompanhe o comportamento semanal de investimento, retorno e custo por lead
                </span>
              </div>

              <PerformanceChart data={client.weeklyHistory} isLight={isLight} />
            </section>

            {/* DIÁRIO DE OTIMIZAÇÕES TÉCNICAS DA UPSELL */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-bold block">
                    02.B · Bastidores Técnicos
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mt-0.5">
                    Diário de Otimizações Executadas pela UPSELL
                  </h2>
                </div>
                <span className={`text-xs ${mutedText}`}>
                  Registro transparente das intervenções técnicas feitas nas suas campanhas
                </span>
              </div>

              <div className={`rounded-2xl ${surfaceCard} overflow-hidden`}>
                <div className="divide-y divide-[#141414]/10 dark:divide-white/10">
                  {optimizationLogs.map((log, index) => (
                    <div
                      key={log.id || index}
                      className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#141414]/[0.015] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-[#ed1c24]/10 text-[#ed1c24]">
                            {log.channel}
                          </span>
                          <span className={`font-mono text-[11px] ${mutedText}`}>
                            Registrado em: {log.date}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold">
                          {log.action}
                        </h4>
                        <p className={`text-xs ${mutedText}`}>
                          <strong className={isLight ? 'text-[#141414]' : 'text-white'}>Objetivo / Impacto esperado:</strong>{' '}
                          {log.expectedImpact}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-bold px-3 py-1.5 rounded-full border ${
                            log.status === 'Concluído'
                              ? isLight
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : log.status === 'Em Teste'
                              ? isLight
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : isLight
                              ? 'bg-sky-50 text-sky-900 border-sky-300'
                              : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{log.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ESCOPO CONTRATADO */}
            <section className={`p-6 sm:p-7 rounded-2xl ${surfaceCard} space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#141414]/10 dark:border-white/10">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ed1c24] font-bold block">
                    02.C · Entregas Contratadas
                  </span>
                  <h3 className="font-display text-xl uppercase tracking-tight">
                    Escopo de Atuação Ativo na Sua Conta
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsContractModalOpen(true)}
                  className="text-xs font-bold text-[#ed1c24] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Abrir Contrato Completo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(client.scope || []).map((item, i) => (
                  <div key={i} className={`p-4 rounded-xl ${subtleBox} flex items-start gap-3`}>
                    <CheckCircle2 className="w-4 h-4 text-[#ed1c24] shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            MÓDULO 03: PLANO DE AÇÃO, PENDÊNCIAS & CO-RESPONSABILIDADE (KANBAN)
        ====================================================================== */}
        {(activeTab === 'plano-acao' || activeTab === 'tudo') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-bold block">
                  03 · Gestão de Entregas & Co-responsabilidade
                </span>
                <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mt-0.5">
                  Quadro de Tarefas: O que está com a UPSELL vs. Com Você
                </h2>
              </div>
              <span className={`text-xs ${mutedText}`}>
                Você pode avançar o status das tarefas ou adicionar solicitações diretamente abaixo
              </span>
            </div>

            {/* 3 Cards Didáticos de Co-responsabilidade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-5 rounded-2xl border ${
                  clientPendingTasks.length > 0
                    ? 'bg-[#ed1c24]/5 border-[#ed1c24]/40'
                    : surfaceCard
                } space-y-1.5`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#ed1c24] font-bold block">
                  Responsabilidade do Cliente
                </span>
                <div className="font-display text-3xl">
                  {clientPendingTasks.length} {clientPendingTasks.length === 1 ? 'pendência' : 'pendências'}
                </div>
                <p className={`text-xs ${mutedText}`}>
                  Envio de fotos, gravação de vídeos ou validação comercial que dependem da sua equipe.
                </p>
              </div>

              <div className={`p-5 rounded-2xl ${surfaceCard} space-y-1.5`}>
                <span className={`font-mono text-[10px] uppercase tracking-[0.16em] font-bold block ${mutedText}`}>
                  Responsabilidade da UPSELL
                </span>
                <div className="font-display text-3xl">
                  {agencyActiveTasks.length} em execução
                </div>
                <p className={`text-xs ${mutedText}`}>
                  Configurações de campanhas, testes de público, copywriting e tracking técnico.
                </p>
              </div>

              <div className={`p-5 rounded-2xl ${surfaceCard} space-y-1.5`}>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400 font-bold block">
                  Histórico de Entregas
                </span>
                <div className="font-display text-3xl text-emerald-600 dark:text-emerald-400">
                  {completedTasks.length} concluídas
                </div>
                <p className={`text-xs ${mutedText}`}>
                  Demandas já finalizadas e validadas ao longo da parceria.
                </p>
              </div>
            </div>

            <TaskKanban
              tasks={actionItems}
              onUpdateTasks={updated => {
                if (onUpdateClient) {
                  onUpdateClient(client.id, { actionItems: updated });
                }
              }}
              isAdmin={isGestorSession}
              clientName={client.companyName}
              isLight={isLight}
              defaultAssigneeFilter="all"
            />
          </section>
        )}

        {/* =====================================================================
            MÓDULO 04: MATERIAIS, PASTAS DE CRIATIVOS, RELATÓRIOS & ACESSOS
        ====================================================================== */}
        {(activeTab === 'materiais' || activeTab === 'tudo') && (
          <div className="space-y-10">
            {/* BLOCO A: RELATÓRIOS OFICIAIS & CONTRATO */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-bold block">
                    04.A · Inteligência & Documentação Oficial
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mt-0.5">
                    Relatórios em Tempo Real & Instrumento Legal
                  </h2>
                </div>
                <span className={`text-xs ${mutedText}`}>
                  Acesso direto ao BI interativo, pasta geral e contrato assinado
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1: Looker Studio */}
                <div className={`p-6 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-5`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#ed1c24]/10 text-[#ed1c24] flex items-center justify-center">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-[#ed1c24]/10 text-[#ed1c24] font-bold">
                        Looker Studio BI
                      </span>
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-tight">
                      Dashboard Ao Vivo (BI)
                    </h3>
                    <p className={`text-xs leading-relaxed ${mutedText}`}>
                      Painel analítico conectado diretamente às contas de anúncio para consulta detalhada de cliques, impressões, CTR e conversões por campanha.
                    </p>
                  </div>

                  <div className={`pt-3.5 border-t ${hairline} flex items-center justify-between`}>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenRepository(
                          client.links.lookerStudio,
                          'Dashboard Looker Studio',
                          'Painel analítico de BI em tempo real'
                        )
                      }
                      className="text-xs font-bold text-[#ed1c24] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Abrir Dashboard de BI</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToolInfo(client.links.lookerStudio, 'copy-looker')}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-[#141414]/5 text-[#141414]/60' : 'hover:bg-white/10 text-white/60'
                      }`}
                      title="Copiar link"
                    >
                      {copiedKey === 'copy-looker' ? (
                        <span className="text-emerald-600 font-mono text-[10px] font-bold">Copiado!</span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Card 2: Contrato Oficial */}
                <div className={`p-6 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-5`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#ed1c24]/10 text-[#ed1c24] flex items-center justify-center">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <span className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded ${subtleBox} font-bold`}>
                        Escopo & Garantias
                      </span>
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-tight">
                      Contrato Oficial de Parceria
                    </h3>
                    <p className={`text-xs leading-relaxed ${mutedText}`}>
                      Instrumento formal com descrição das entregas contratadas, vigência, SLA de atendimento e cláusula de titularidade integral do cliente.
                    </p>
                  </div>

                  <div className={`pt-3.5 border-t ${hairline} flex items-center justify-between`}>
                    <button
                      type="button"
                      onClick={() => setIsContractModalOpen(true)}
                      className="text-xs font-bold text-[#ed1c24] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Ler Contrato na Tela</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToolInfo(client.links.contractPdf, 'copy-contract')}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-[#141414]/5 text-[#141414]/60' : 'hover:bg-white/10 text-white/60'
                      }`}
                      title="Copiar link do PDF"
                    >
                      {copiedKey === 'copy-contract' ? (
                        <span className="text-emerald-600 font-mono text-[10px] font-bold">Copiado!</span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Card 3: Drive Geral */}
                <div className={`p-6 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-5`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#ed1c24]/10 text-[#ed1c24] flex items-center justify-center">
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <span className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded ${subtleBox} font-bold`}>
                        Google Drive Raiz
                      </span>
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-tight">
                      Repositório Geral da Marca
                    </h3>
                    <p className={`text-xs leading-relaxed ${mutedText}`}>
                      Pasta mãe no Google Drive reunindo briefings, manuais de identidade visual, planilhas de apoio e histórico de arquivos da empresa.
                    </p>
                  </div>

                  <div className={`pt-3.5 border-t ${hairline} flex items-center justify-between`}>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenRepository(
                          client.links.googleDrive,
                          'Repositório Geral no Google Drive',
                          'Pasta raiz com todos os arquivos sincronizados da marca'
                        )
                      }
                      className="text-xs font-bold text-[#ed1c24] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Abrir Pasta Geral no Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToolInfo(client.links.googleDrive, 'copy-drive')}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-[#141414]/5 text-[#141414]/60' : 'hover:bg-white/10 text-white/60'
                      }`}
                      title="Copiar link"
                    >
                      {copiedKey === 'copy-drive' ? (
                        <span className="text-emerald-600 font-mono text-[10px] font-bold">Copiado!</span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* BLOCO B: BIBLIOTECA DE CRIATIVOS SEGMENTADA POR FORMATO */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-bold block">
                    04.B · Biblioteca de Anúncios & Conteúdo
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mt-0.5">
                    Pastas de Criativos Organizadas por Formato
                  </h2>
                </div>
                <span className={`text-xs ${mutedText}`}>
                  Acesse rapidamente roteiros para gravação, vídeos editados e peças estáticas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Copys & Roteiros */}
                <div className={`p-6 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-5`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${subtleBox} flex items-center justify-center`}>
                        <FileText className="w-5 h-5 text-[#ed1c24]" />
                      </div>
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
                        01 · Textos & Roteiros
                      </span>
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-tight">
                      Pasta de Copys & Roteiros
                    </h3>
                    <p className={`text-xs leading-relaxed ${mutedText}`}>
                      Roteiros passo a passo para gravação de vídeos, ganchos de atenção e legendas persuasivas desenvolvidas para os anúncios.
                    </p>
                  </div>

                  <div className={`pt-3.5 border-t ${hairline} flex items-center justify-between`}>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenRepository(
                          client.links.creativeCopies || client.links.googleDrive,
                          'Pasta de Copys & Roteiros',
                          'Documentos de copywriting e roteiros de vídeo'
                        )
                      }
                      className="text-xs font-bold text-[#ed1c24] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Acessar Roteiros & Copys</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToolInfo(client.links.creativeCopies || client.links.googleDrive, 'copy-copys')}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-[#141414]/5 text-[#141414]/60' : 'hover:bg-white/10 text-white/60'
                      }`}
                    >
                      {copiedKey === 'copy-copys' ? (
                        <span className="text-emerald-600 font-mono text-[10px] font-bold">Copiado!</span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Vídeos */}
                <div className={`p-6 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-5`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${subtleBox} flex items-center justify-center`}>
                        <Video className="w-5 h-5 text-[#ed1c24]" />
                      </div>
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
                        02 · Reels & Vídeo Ads
                      </span>
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-tight">
                      Criativos em Vídeo
                    </h3>
                    <p className={`text-xs leading-relaxed ${mutedText}`}>
                      Arquivos de vídeo brutos enviados pela empresa e versões editadas em formato vertical (Reels/Stories) prontas para veiculação.
                    </p>
                  </div>

                  <div className={`pt-3.5 border-t ${hairline} flex items-center justify-between`}>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenRepository(
                          client.links.creativeVideos || client.links.googleDrive,
                          'Pasta de Criativos em Vídeo',
                          'Vídeos editados e brutos da operação'
                        )
                      }
                      className="text-xs font-bold text-[#ed1c24] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Acessar Pasta de Vídeos</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToolInfo(client.links.creativeVideos || client.links.googleDrive, 'copy-videos')}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-[#141414]/5 text-[#141414]/60' : 'hover:bg-white/10 text-white/60'
                      }`}
                    >
                      {copiedKey === 'copy-videos' ? (
                        <span className="text-emerald-600 font-mono text-[10px] font-bold">Copiado!</span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Imagens */}
                <div className={`p-6 rounded-2xl ${surfaceCard} flex flex-col justify-between space-y-5`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${subtleBox} flex items-center justify-center`}>
                        <ImageIcon className="w-5 h-5 text-[#ed1c24]" />
                      </div>
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
                        03 · Artes & Carrosséis
                      </span>
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-tight">
                      Criativos Estáticos & Banners
                    </h3>
                    <p className={`text-xs leading-relaxed ${mutedText}`}>
                      Artes estáticas de alta conversão, carrosséis para feed/stories e banners otimizados para a rede de display do Google Ads.
                    </p>
                  </div>

                  <div className={`pt-3.5 border-t ${hairline} flex items-center justify-between`}>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenRepository(
                          client.links.creativeImages || client.links.googleDrive,
                          'Pasta de Criativos Estáticos',
                          'Artes estáticas, carrosséis e banners'
                        )
                      }
                      className="text-xs font-bold text-[#ed1c24] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Acessar Pasta de Imagens</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToolInfo(client.links.creativeImages || client.links.googleDrive, 'copy-images')}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-[#141414]/5 text-[#141414]/60' : 'hover:bg-white/10 text-white/60'
                      }`}
                    >
                      {copiedKey === 'copy-images' ? (
                        <span className="text-emerald-600 font-mono text-[10px] font-bold">Copiado!</span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* BLOCO C: ECOSSISTEMA DE FERRAMENTAS & SOBERANIA DIGITAL */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-bold block">
                    04.C · Soberania Digital da Sua Empresa
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mt-0.5">
                    Ferramentas & Contas Vinculadas à Operação
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% de Titularidade da Sua Marca (Zero Retenção)</span>
                </span>
              </div>

              <div className={`p-6 sm:p-7 rounded-2xl ${surfaceCard} space-y-5`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeTools.map((tool, idx) => (
                    <div
                      key={tool.id || idx}
                      className={`p-5 rounded-xl ${subtleBox} flex flex-col justify-between gap-4`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-bold leading-snug">
                            {tool.name}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                              tool.status === 'Ativo / Vinculado'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                : tool.status === 'Pendente de Acesso'
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                : 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                            }`}
                          >
                            {tool.status}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${mutedText}`}>
                          {tool.detail}
                        </p>
                      </div>

                      <div className={`pt-3 border-t ${hairline} flex items-center justify-between text-[11px]`}>
                        <span className={`font-mono truncate max-w-[170px] ${mutedText}`}>
                          {tool.accountEmail || tool.category}
                        </span>
                        {tool.accessUrl && (
                          <button
                            type="button"
                            onClick={() => handleOpenRepository(tool.accessUrl, tool.name, tool.detail)}
                            className="font-bold text-[#ed1c24] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <span>Abrir</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Modal do Contrato Oficial */}
      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        client={client}
        isLight={isLight}
      />

      {/* Modal Informativo quando um link externo ainda está sendo configurado */}
      {infoModalMessage && (
        <div
          onClick={() => setInfoModalMessage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-md p-6 sm:p-7 rounded-2xl shadow-2xl border ${surfaceCard}`}
          >
            <div className={`flex items-center justify-between pb-3 border-b ${hairline} mb-4`}>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#ed1c24]" />
                <h3 className="font-display text-lg uppercase tracking-tight">{infoModalMessage.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInfoModalMessage(null)}
                className="p-1 rounded-lg opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${mutedText}`}>
              {infoModalMessage.desc}
            </p>
            <div className="pt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoModalMessage(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#141414] dark:bg-[#ed1c24] hover:opacity-90 transition-all cursor-pointer"
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
