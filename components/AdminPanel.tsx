'use client';

import React, { useState, useMemo } from 'react';
import {
  ClientProfile,
  ClientActionItem,
  ClientToolAccess,
  OptimizationLog,
  WeeklyDataPoint,
  VisualTheme
} from '@/lib/types';
import { useUpsellStore } from '@/lib/store';
import { TaskKanban } from './TaskKanban';
import {
  Building2,
  Eye,
  EyeOff,
  Zap,
  LayoutGrid,
  LogOut,
  Save,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Plus,
  Trash2,
  Check,
  FolderOpen,
  FileCheck2,
  BarChart3,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Key,
  Lock,
  Copy,
  Search,
  Edit3,
  Sun,
  Moon,
  Layers,
  Share2,
  UserPlus,
  X,
  ArrowRight,
  FileText,
  Video,
  Image as ImageIcon,
  TrendingUp,
  Compass,
  Calculator
} from 'lucide-react';

interface AdminPanelProps {
  clients: ClientProfile[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onUpdateClient: (id: string, updates: Partial<ClientProfile>) => void;
  onAddOptimizationLog?: (id: string, log: Omit<OptimizationLog, 'id'>) => void;
  onAddNewClient?: (client: ClientProfile) => void;
  onDeleteClient?: (id: string) => boolean | void;
  onViewAsClient: (id: string) => void;
  onLogout: () => void;
  onResetDefault: () => void;
  theme?: VisualTheme;
  onToggleTheme?: () => void;
}

function formatSafeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function calculateTimelapse(startStr: string, endStr: string) {
  const parseDate = (str: string) => {
    if (!str) return null;
    const trimmed = str.trim();
    const match = trimmed.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      return new Date(year, month, day);
    }
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  };

  const start = parseDate(startStr) || new Date(2024, 9, 15);
  const end = parseDate(endStr) || new Date(2026, 9, 15);
  const now = new Date();

  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  const remaining = end.getTime() - now.getTime();

  const daysRemaining = Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
  const progressPercent = total > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / total) * 100))) : 0;

  return { daysRemaining, progressPercent };
}

function generateStrongPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
  let pass = '';
  for (let i = 0; i < 14; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

interface ToolPreset {
  name: string;
  category: string;
  accessUrl: string;
  detail: string;
  defaultLogin: string;
}

const TOOL_PRESETS: ToolPreset[] = [
  {
    name: 'Hospedagem do Site (Hostinger Cloud)',
    category: 'Hospedagem & Servidor',
    accessUrl: 'https://hpanel.hostinger.com',
    detail: 'Painel hPanel Cloud com SSL ativo e PHP 8.3',
    defaultLogin: 'adm_servidor'
  },
  {
    name: 'Painel WordPress Admin (Site Principal)',
    category: 'Website & CMS',
    accessUrl: 'https://seusite.com.br/wp-admin',
    detail: 'Acesso administrador para instalação de tags, pixels e landing pages',
    defaultLogin: 'admin'
  },
  {
    name: 'Cloudflare / DNS & CDN',
    category: 'Domínio & DNS',
    accessUrl: 'https://dash.cloudflare.com',
    detail: 'Gerenciamento de DNS, SSL ponta a ponta e CAPI Gateway',
    defaultLogin: 'admin_cloudflare'
  },
  {
    name: 'Meta Business Manager (BM UPSELL)',
    category: 'Tráfego & Anúncios',
    accessUrl: 'https://business.facebook.com/settings',
    detail: 'Pixel, Conversions API, Contas de Anúncio e Catálogos vinculados',
    defaultLogin: 'bm_upsell'
  },
  {
    name: 'Google Ads (MCC UPSELL)',
    category: 'Tráfego & Anúncios',
    accessUrl: 'https://ads.google.com',
    detail: 'Conta vinculada à MCC com faturamento direto do cliente',
    defaultLogin: 'mcc_gestor'
  },
  {
    name: 'Google Analytics 4 & Tag Manager',
    category: 'Web Analytics',
    accessUrl: 'https://tagmanager.google.com',
    detail: 'Container GTM ativo com mensuração avançada de eventos e conversões',
    defaultLogin: 'gtm_upsell'
  }
];

function createDefaultNewClientProfile(
  companyName: string,
  segment: string,
  responsibleName: string,
  email: string
): ClientProfile {
  const now = Date.now();
  const slug =
    companyName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `cliente-${now}`;

  const startDate = new Date();
  const renewalDate = new Date(now + 365 * 24 * 60 * 60 * 1000);
  const cleanEmail = email.trim().toLowerCase() || 'contato@empresa.com.br';

  return {
    id: slug,
    companyName: companyName.trim(),
    segment: segment.trim() || 'Serviços Especializados',
    responsibleName: responsibleName.trim() || 'Diretor Geral',
    email: cleanEmail,
    allowedEmails: [cleanEmail],
    contractStatus: 'Contrato Vigente',
    contractStart: startDate.toLocaleDateString('pt-BR'),
    contractRenewal: renewalDate.toLocaleDateString('pt-BR'),
    scope: [
      'Gestão Estratégica de Tráfego Meta Ads (Instagram & Facebook)',
      'Campanhas de Alta Intenção no Google Search',
      'Configuração de Tracking Avançado & Conversions API'
    ],
    activeChannels: ['Meta Ads', 'Google Ads'],
    currentFocus: 'Onboarding inicial e auditoria dos pixels de conversão.',
    nextSteps: 'Configuração do BM, instalação de tags e validação de criativos.',
    metrics: {
      investment: 5000,
      leads: 120,
      cpl: 41.67,
      roas: 4.2,
      revenue: 21000,
      growth: {
        investment: 'Ativo',
        leads: '+18%',
        cpl: '-12%',
        roas: '+0.6x'
      }
    },
    links: {
      lookerStudio: '',
      financialSheet: '',
      googleDrive: '',
      contractPdf: ''
    },
    actionItems: [
      {
        id: `task-${now}-1`,
        task: 'Liberação de acessos ao Meta Business Manager e Google Ads',
        detail: 'Convidar a equipe da UPSELL com papel de administrador ou agência.',
        status: 'pending',
        due: 'Nos primeiros 3 dias',
        assignee: 'client',
        priority: 'high',
        category: 'Onboarding & Acessos'
      },
      {
        id: `task-${now}-2`,
        task: 'Instalação do Pixel e Conversions API (CAPI) no site',
        detail: 'Configurar evento de Lead e testar envio de eventos no Gerenciador.',
        status: 'in_progress',
        due: 'Em execução',
        assignee: 'agency',
        priority: 'high',
        category: 'Tracking & Pixel'
      }
    ],
    activeTools: [
      {
        id: `tool-${now}-1`,
        name: 'Meta Business Manager',
        category: 'Tráfego & Anúncios',
        accountEmail: cleanEmail,
        loginUser: 'gestor_upsell',
        password: generateStrongPassword(),
        accessUrl: 'https://business.facebook.com',
        status: 'Em Configuração',
        detail: 'Em processo de vinculação com a agência UPSELL'
      }
    ],
    weeklyHistory: [
      { week: 'Sem 01', investment: 1250, revenue: 5250, leads: 30, cpl: 41.67 },
      { week: 'Sem 02', investment: 1250, revenue: 5400, leads: 32, cpl: 39.06 },
      { week: 'Sem 03', investment: 1250, revenue: 5100, leads: 28, cpl: 44.64 },
      { week: 'Sem 04', investment: 1250, revenue: 5250, leads: 30, cpl: 41.67 }
    ],
    optimizationLogs: [
      {
        id: `opt-${now}-1`,
        date: 'Início do ciclo',
        channel: 'Tracking & CAPI',
        action: 'Estruturação inicial da conta e configuração de rastreamento de conversões',
        expectedImpact: 'Leitura precisa de origem dos contatos comerciais',
        status: 'Concluído'
      }
    ]
  };
}

type AdminTab = 'resumo' | 'metricas' | 'pendencias' | 'links' | 'ferramentas' | 'visao-geral';

function ClientEditor({
  client,
  onUpdateClient,
  onViewAsClient,
  onRequestDeleteClient,
  showToast,
  isLight
}: {
  client: ClientProfile;
  onUpdateClient: AdminPanelProps['onUpdateClient'];
  onViewAsClient: (id: string) => void;
  onRequestDeleteClient: (client: ClientProfile) => void;
  showToast: (msg: string) => void;
  isLight: boolean;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>('resumo');

  // 1. Dados Cadastrais & Vigência
  const [companyName, setCompanyName] = useState(client.companyName || '');
  const [segment, setSegment] = useState(client.segment || '');
  const [responsibleName, setResponsibleName] = useState(client.responsibleName || '');
  const [primaryEmail, setPrimaryEmail] = useState(client.email || '');
  const [contractStart, setContractStart] = useState(client.contractStart || '15/10/2024');
  const [contractRenewal, setContractRenewal] = useState(client.contractRenewal || '15/10/2026');
  const [contractStatus, setContractStatus] = useState(client.contractStatus || 'Contrato Vigente');

  // 1.1 Contas Google Autorizadas
  const [allowedEmailsInput, setAllowedEmailsInput] = useState(() => {
    const list = client.allowedEmails || [];
    if (list.length === 0 && client.email) return client.email;
    return list.join(', ');
  });

  // 2. Bússola do Mês & Escopo
  const [currentFocus, setCurrentFocus] = useState(client.currentFocus || '');
  const [nextSteps, setNextSteps] = useState(client.nextSteps || '');
  const [scopeText, setScopeText] = useState(() => (client.scope || []).join('\n'));
  const [channelsInput, setChannelsInput] = useState(() =>
    (client.activeChannels || ['Meta Ads', 'Google Ads']).join(', ')
  );

  // 3. Métricas do Mês (KPIs)
  const [investment, setInvestment] = useState<number>(client.metrics?.investment ?? 5000);
  const [leads, setLeads] = useState<number>(client.metrics?.leads ?? 120);
  const [cpl, setCpl] = useState<number>(client.metrics?.cpl ?? 41.67);
  const [roas, setRoas] = useState<number>(client.metrics?.roas ?? 4.2);
  const [revenue, setRevenue] = useState<number>(client.metrics?.revenue ?? 21000);
  const [growthInvestment, setGrowthInvestment] = useState(client.metrics?.growth?.investment || 'Ativo');
  const [growthLeads, setGrowthLeads] = useState(client.metrics?.growth?.leads || '+15%');
  const [growthCpl, setGrowthCpl] = useState(client.metrics?.growth?.cpl || '-10%');
  const [growthRoas, setGrowthRoas] = useState(client.metrics?.growth?.roas || '+0.4x');

  // 3.1 Histórico Semanal (Gráfico)
  const [weeklyHistory, setWeeklyHistory] = useState<WeeklyDataPoint[]>(() => {
    if (client.weeklyHistory && client.weeklyHistory.length > 0) {
      return client.weeklyHistory;
    }
    return [
      { week: 'Sem 01', investment: 1200, revenue: 4800, leads: 30, cpl: 40.0 },
      { week: 'Sem 02', investment: 1300, revenue: 5500, leads: 35, cpl: 37.14 },
      { week: 'Sem 03', investment: 1250, revenue: 5300, leads: 32, cpl: 39.06 },
      { week: 'Sem 04', investment: 1400, revenue: 6200, leads: 40, cpl: 35.0 }
    ];
  });

  // 3.2 Diário de Otimizações
  const [optimizationLogs, setOptimizationLogs] = useState<OptimizationLog[]>(() => {
    return client.optimizationLogs || [];
  });
  const [newLogChannel, setNewLogChannel] = useState<OptimizationLog['channel']>('Meta Ads');
  const [newLogDate, setNewLogDate] = useState('Hoje');
  const [newLogAction, setNewLogAction] = useState('');
  const [newLogImpact, setNewLogImpact] = useState('');
  const [newLogStatus, setNewLogStatus] = useState<OptimizationLog['status']>('Concluído');

  // 4. Tarefas (Kanban)
  const [actionItems, setActionItems] = useState<ClientActionItem[]>(() => {
    return client.actionItems || [];
  });

  // 5. Cofre de Ferramentas
  const [activeTools, setActiveTools] = useState<ClientToolAccess[]>(() => {
    return client.activeTools || [];
  });
  const [toolSearch, setToolSearch] = useState('');
  const [toolCategoryFilter, setToolCategoryFilter] = useState('Todas');
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [editingTool, setEditingTool] = useState<ClientToolAccess | null>(null);
  const [confirmDeleteToolId, setConfirmDeleteToolId] = useState<string | null>(null);

  const [newToolName, setNewToolName] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('Hospedagem & Servidor');
  const [newToolEmail, setNewToolEmail] = useState(client.email);
  const [newToolLogin, setNewToolLogin] = useState('');
  const [newToolPassword, setNewToolPassword] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');
  const [newToolDetail, setNewToolDetail] = useState('');
  const [newToolStatus, setNewToolStatus] = useState<'Ativo / Vinculado' | 'Pendente de Acesso' | 'Em Configuração'>('Ativo / Vinculado');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 6. Links Externos & Drive
  const [googleDrive, setGoogleDrive] = useState(client.links?.googleDrive || '');
  const [contractPdf, setContractPdf] = useState(client.links?.contractPdf || '');
  const [lookerStudio, setLookerStudio] = useState(client.links?.lookerStudio || '');
  const [creativeCopies, setCreativeCopies] = useState(client.links?.creativeCopies || '');
  const [creativeVideos, setCreativeVideos] = useState(client.links?.creativeVideos || '');
  const [creativeImages, setCreativeImages] = useState(client.links?.creativeImages || '');

  const { daysRemaining, progressPercent } = calculateTimelapse(contractStart, contractRenewal);

  // Auto-calculate CPL and ROAS helper
  const handleAutoCalculateMetrics = () => {
    const calculatedCpl = leads > 0 ? Number((investment / leads).toFixed(2)) : 0;
    const calculatedRoas = investment > 0 ? Number((revenue / investment).toFixed(2)) : 0;
    setCpl(calculatedCpl);
    setRoas(calculatedRoas);
    showToast(`CPL (R$ ${calculatedCpl}) e ROAS (${calculatedRoas}x) recalculados com base no Investimento, Leads e Receita!`);
  };

  // Weekly History Handlers
  const handleUpdateWeek = (index: number, field: keyof WeeklyDataPoint, value: string | number) => {
    setWeeklyHistory(prev =>
      prev.map((w, i) => {
        if (i !== index) return w;
        const updated = { ...w, [field]: value };
        if (field === 'investment' || field === 'leads') {
          const inv = field === 'investment' ? Number(value) : w.investment;
          const lds = field === 'leads' ? Number(value) : w.leads;
          updated.cpl = lds > 0 ? Number((inv / lds).toFixed(2)) : 0;
        }
        return updated;
      })
    );
  };

  const handleAddWeek = () => {
    const nextNum = String(weeklyHistory.length + 1).padStart(2, '0');
    setWeeklyHistory(prev => [
      ...prev,
      { week: `Sem ${nextNum}`, investment: 1300, revenue: 5500, leads: 35, cpl: 37.14 }
    ]);
    showToast(`Semana "Sem ${nextNum}" adicionada ao gráfico.`);
  };

  const handleRemoveWeek = (index: number) => {
    if (weeklyHistory.length <= 1) {
      showToast('Mantenha pelo menos 1 semana no gráfico.');
      return;
    }
    setWeeklyHistory(prev => prev.filter((_, i) => i !== index));
  };

  // Optimization Log Handlers
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogAction.trim()) {
      showToast('Descreva a ação técnica realizada.');
      return;
    }
    const created: OptimizationLog = {
      id: `opt-${Date.now()}`,
      channel: newLogChannel,
      date: newLogDate.trim() || 'Hoje',
      action: newLogAction.trim(),
      expectedImpact: newLogImpact.trim() || 'Melhoria de eficiência e conversão das campanhas',
      status: newLogStatus
    };
    setOptimizationLogs(prev => [created, ...prev]);
    setNewLogAction('');
    setNewLogImpact('');
    showToast('Otimização adicionada ao diário do cliente!');
  };

  const handleRemoveLog = (id: string) => {
    setOptimizationLogs(prev => prev.filter(l => l.id !== id));
    showToast('Registro removido do diário.');
  };

  // Master Save
  const handleSaveAll = () => {
    const parsedAllowedEmails = allowedEmailsInput
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    const parsedScope = scopeText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const parsedChannels = channelsInput
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    onUpdateClient(client.id, {
      companyName: companyName.trim() || client.companyName,
      segment: segment.trim() || client.segment,
      responsibleName: responsibleName.trim() || client.responsibleName,
      email: primaryEmail.trim().toLowerCase() || client.email,
      contractStart,
      contractRenewal,
      contractStatus,
      currentFocus,
      nextSteps,
      scope: parsedScope.length > 0 ? parsedScope : client.scope,
      activeChannels: parsedChannels.length > 0 ? parsedChannels : ['Meta Ads', 'Google Ads'],
      metrics: {
        investment: Number(investment) || 0,
        leads: Number(leads) || 0,
        cpl: Number(cpl) || 0,
        roas: Number(roas) || 0,
        revenue: Number(revenue) || 0,
        growth: {
          investment: growthInvestment,
          leads: growthLeads,
          cpl: growthCpl,
          roas: growthRoas
        }
      },
      weeklyHistory,
      optimizationLogs,
      actionItems,
      activeTools,
      links: {
        ...client.links,
        googleDrive: formatSafeUrl(googleDrive),
        contractPdf: formatSafeUrl(contractPdf),
        lookerStudio: formatSafeUrl(lookerStudio),
        creativeCopies: formatSafeUrl(creativeCopies),
        creativeVideos: formatSafeUrl(creativeVideos),
        creativeImages: formatSafeUrl(creativeImages)
      },
      allowedEmails:
        parsedAllowedEmails.length > 0
          ? parsedAllowedEmails
          : [primaryEmail.toLowerCase().trim() || client.email.toLowerCase().trim()]
    });

    showToast(`Dados de ${companyName || client.companyName} salvos e sincronizados no Firebase!`);
  };

  // Clipboard & Link Helpers
  const copyToClipboard = (text: string, identifier: string, label: string) => {
    if (!text) {
      showToast('Nenhum dado informado para copiar.');
      return;
    }
    try {
      navigator?.clipboard?.writeText(text);
      setCopiedKey(identifier);
      showToast(`${label} copiado!`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      showToast('Erro ao copiar.');
    }
  };

  const handleTestLink = (url: string, name: string) => {
    if (!url || !url.trim()) {
      showToast(`O link de "${name}" ainda não foi preenchido.`);
      return;
    }
    window.open(formatSafeUrl(url), '_blank', 'noopener,noreferrer');
  };

  const handleCopyClientLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const clientUrl = `${origin}/?cliente=${client.id}`;
    const text = `Olá ${responsibleName}! 👋\n\nSegue o link oficial para você acessar o Portal de Performance da ${companyName} na UPSELL:\n👉 ${clientUrl}\n\n🔐 O acesso é liberado automaticamente ao entrar com a sua conta Google cadastrada (${allowedEmailsInput || primaryEmail}).`;
    navigator?.clipboard?.writeText(text);
    showToast('Convite de acesso com link copiado para enviar no WhatsApp!');
  };

  // Tool Handlers
  const applyPreset = (preset: ToolPreset) => {
    setNewToolName(preset.name);
    setNewToolCategory(preset.category);
    setNewToolUrl(preset.accessUrl);
    setNewToolDetail(preset.detail);
    setNewToolLogin(preset.defaultLogin);
    setNewToolPassword(generateStrongPassword());
    setIsAddingTool(true);
    showToast(`Modelo "${preset.name}" carregado.`);
  };

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim()) return;
    const newTool: ClientToolAccess = {
      id: `tool-${Date.now()}`,
      name: newToolName.trim(),
      category: newToolCategory.trim() || 'Hospedagem & Servidor',
      accountEmail: newToolEmail.trim() || primaryEmail,
      loginUser: newToolLogin.trim() || '',
      password: newToolPassword.trim() || '',
      accessUrl: formatSafeUrl(newToolUrl.trim()),
      detail: newToolDetail.trim() || 'Acesso configurado e monitorado pela UPSELL',
      status: newToolStatus
    };
    setActiveTools(prev => [newTool, ...prev]);
    setNewToolName('');
    setNewToolUrl('');
    setNewToolDetail('');
    setIsAddingTool(false);
    showToast('Ferramenta adicionada ao cofre!');
  };

  const handleSaveEditTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool || !editingTool.name.trim()) return;
    setActiveTools(prev => prev.map(t => (t.id === editingTool.id ? editingTool : t)));
    setEditingTool(null);
    showToast('Ferramenta atualizada!');
  };

  const filteredTools = activeTools.filter(tool => {
    const matchesCategory =
      toolCategoryFilter === 'Todas' ||
      tool.category.toLowerCase().includes(toolCategoryFilter.toLowerCase());
    const matchesSearch =
      !toolSearch.trim() ||
      tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.category.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.accountEmail.toLowerCase().includes(toolSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Swiss Editorial Styling Classes
  const surfaceCard = isLight
    ? 'bg-white border border-[#141414]/12 text-[#141414] shadow-[0_12px_32px_-18px_rgba(20,20,20,0.06)]'
    : 'bg-[#12141a] border border-white/10 text-[#f7f7f4]';

  const subtleBox = isLight
    ? 'bg-[#f7f7f4] border border-[#141414]/10 text-[#141414]'
    : 'bg-[#0c0d10] border border-white/10 text-[#f7f7f4]';

  const inputClass = isLight
    ? 'w-full px-3.5 py-2.5 bg-white border border-[#141414]/20 rounded-xl text-xs text-[#141414] placeholder-[#141414]/40 focus:outline-none focus:border-[#141414] font-semibold transition-all'
    : 'w-full px-3.5 py-2.5 bg-[#0c0d10] border border-white/15 rounded-xl text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#ed1c24] font-semibold transition-all';

  const labelClass = `block font-mono text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5 ${
    isLight ? 'text-[#141414]/75' : 'text-white/75'
  }`;

  const hairline = isLight ? 'border-[#141414]/10' : 'border-white/10';
  const mutedText = isLight ? 'text-[#141414]/60' : 'text-white/60';

  return (
    <div className="space-y-8 pb-24">
      {/* 1. CABEÇALHO DO CLIENTE EM EDIÇÃO */}
      <div className={`p-6 sm:p-8 rounded-2xl ${surfaceCard} flex flex-col lg:flex-row lg:items-center justify-between gap-6`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wide text-[#ed1c24] bg-[#ed1c24]/10 px-2.5 py-1 rounded">
              {segment || client.segment}
            </span>
            <span className={`text-xs ${mutedText}`}>ID: {client.id}</span>
            <span className="text-xs uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded">
              ● {contractStatus}
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
            {companyName || client.companyName}
          </h2>
          <p className={`text-xs ${mutedText}`}>
            Responsável: <strong className={isLight ? 'text-[#141414]' : 'text-white'}>{responsibleName}</strong> · E-mail autorizado:{' '}
            <span className="font-mono">{allowedEmailsInput || primaryEmail}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyClientLink}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isLight
                ? 'bg-[#f7f7f4] hover:bg-[#141414]/5 text-[#141414] border-[#141414]/15'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/15'
            }`}
            title="Copiar convite com link de acesso Google para WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-[#ed1c24]" />
            <span>Copiar Convite WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => onViewAsClient(client.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-[#f7f7f4] text-[#141414] border-[#141414]/15'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/15'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#ed1c24]" />
            <span>Ver Portal como Cliente</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#ed1c24] hover:bg-[#c8141b] transition-all shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      {/* 2. NAVEGAÇÃO POR ABAS ESPELHANDO O PORTAL DO CLIENTE */}
      <nav
        aria-label="Abas de edição do cliente"
        className={`p-1.5 rounded-2xl border ${
          isLight ? 'bg-white border-[#141414]/12 shadow-xs' : 'bg-[#12141a] border-white/10'
        } flex flex-wrap items-center gap-1.5`}
      >
        <button
          type="button"
          onClick={() => setActiveTab('resumo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'resumo'
              ? 'bg-[#141414] text-white dark:bg-[#ed1c24]'
              : isLight
              ? 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#f7f7f4]'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="font-mono text-[10px] opacity-70">01</span>
          <Compass className="w-3.5 h-3.5" />
          <span>Cadastro, Acessos Gmail & Bússola</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('metricas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'metricas'
              ? 'bg-[#141414] text-white dark:bg-[#ed1c24]'
              : isLight
              ? 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#f7f7f4]'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="font-mono text-[10px] opacity-70">02</span>
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Métricas, Gráfico Semanal & Otimizações</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pendencias')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pendencias'
              ? 'bg-[#141414] text-white dark:bg-[#ed1c24]'
              : isLight
              ? 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#f7f7f4]'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="font-mono text-[10px] opacity-70">03</span>
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Tarefas & Pendências ({actionItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'links'
              ? 'bg-[#141414] text-white dark:bg-[#ed1c24]'
              : isLight
              ? 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#f7f7f4]'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="font-mono text-[10px] opacity-70">04</span>
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Links, Pastas Drive & BI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ferramentas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ferramentas'
              ? 'bg-[#141414] text-white dark:bg-[#ed1c24]'
              : isLight
              ? 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#f7f7f4]'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="font-mono text-[10px] opacity-70">05</span>
          <Key className="w-3.5 h-3.5" />
          <span>Cofre de Senhas ({activeTools.length})</span>
        </button>

        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setActiveTab('visao-geral')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === 'visao-geral'
                ? 'bg-[#141414] text-white dark:bg-[#ed1c24]'
                : isLight
                ? 'text-[#141414]/60 hover:text-[#141414]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Expandir Tudo</span>
          </button>
        </div>
      </nav>

      {/* =====================================================================
          ABA 01: CADASTRO, ACESSOS GOOGLE, VIGÊNCIA & BÚSSOLA DO MÊS
      ====================================================================== */}
      {(activeTab === 'resumo' || activeTab === 'visao-geral') && (
        <div className="space-y-8">
          {/* Bloco 1.1: Contas Google Autorizadas (Destaque Segurança Firebase) */}
          <div className={`p-6 sm:p-8 rounded-2xl ${surfaceCard} border-l-4 border-l-[#ed1c24] space-y-5`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b ${hairline} gap-3`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ed1c24]/10 flex items-center justify-center text-[#ed1c24] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-[#ed1c24] font-bold block">
                    Controle de Acesso Blindado · Firebase Auth
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
                    Contas Google Autorizadas para Este Cliente
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-2">
                <label className={labelClass}>
                  E-mails Google Permitidos (Separe múltiplos e-mails por vírgula)
                </label>
                <input
                  type="text"
                  value={allowedEmailsInput}
                  onChange={e => setAllowedEmailsInput(e.target.value)}
                  placeholder="ex: cliente@gmail.com, socio@empresa.com.br"
                  className={`${inputClass} font-mono`}
                />
                <p className={`text-xs leading-relaxed ${mutedText}`}>
                  Basta o cliente clicar em <strong>&ldquo;Já sou cliente?&rdquo;</strong> no topo do site e entrar com qualquer uma das contas Google listadas acima. Nenhuma senha manual é necessária.
                </p>
              </div>

              <div className={`lg:col-span-5 p-4 rounded-xl ${subtleBox} text-xs space-y-2`}>
                <span className="text-xs uppercase tracking-wide font-bold text-[#ed1c24] block">
                  Onde isso reflete?
                </span>
                <p className={`text-xs leading-relaxed ${mutedText}`}>
                  As regras de segurança do Firestore bloqueiam qualquer leitura de terceiros e liberam os dados da <strong>{companyName}</strong> exclusivamente para os e-mails autorizados aqui e para o Gestor Master (<code>felipemassonp@gmail.com</code>).
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 1.2: Dados Cadastrais & Vigência */}
          <div className={`p-6 sm:p-8 rounded-2xl ${surfaceCard} space-y-6`}>
            <div className={`flex items-center justify-between pb-3 border-b ${hairline}`}>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#ed1c24]" />
                <h3 className="font-heading text-lg font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
                  Identificação da Empresa & Vigência do Contrato
                </h3>
              </div>
              <span className={`text-xs ${mutedText}`}>
                Aparece no Cabeçalho Executivo do Portal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Nome da Empresa / Marca</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Segmento / Nicho</label>
                <input
                  type="text"
                  value={segment}
                  onChange={e => setSegment(e.target.value)}
                  placeholder="Ex: Odontologia, E-commerce..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Nome do Responsável</label>
                <input
                  type="text"
                  value={responsibleName}
                  onChange={e => setResponsibleName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>E-mail Principal de Contato</label>
                <input
                  type="email"
                  value={primaryEmail}
                  onChange={e => setPrimaryEmail(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className={labelClass}>Início da Parceria (DD/MM/AAAA)</label>
                <input
                  type="text"
                  value={contractStart}
                  onChange={e => setContractStart(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Renovação Prevista (DD/MM/AAAA)</label>
                <input
                  type="text"
                  value={contractRenewal}
                  onChange={e => setContractRenewal(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Status do Contrato</label>
                <input
                  type="text"
                  value={contractStatus}
                  onChange={e => setContractStatus(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className={`p-4 rounded-xl ${subtleBox} space-y-2`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">Barra de Ciclo no Portal do Cliente:</span>
                <span className="font-mono text-[#ed1c24] font-bold">
                  {progressPercent}% concluído · {daysRemaining} dias até renovação
                </span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-[#141414]/10' : 'bg-white/10'}`}>
                <div
                  className="h-full bg-[#ed1c24] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bloco 1.3: Bússola Estratégica & Escopo */}
          <div className={`p-6 sm:p-8 rounded-2xl ${surfaceCard} space-y-6`}>
            <div className={`flex items-center justify-between pb-3 border-b ${hairline}`}>
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-[#ed1c24]" />
                <h3 className="font-heading text-lg font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
                  Bússola do Mês (Foco Atual, Próximos Passos & Escopo)
                </h3>
              </div>
              <span className={`text-xs ${mutedText}`}>
                Aparece na Aba 01 do Portal do Cliente
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  O que estamos fazendo agora (Foco Atual das Campanhas)
                </label>
                <textarea
                  rows={3}
                  value={currentFocus}
                  onChange={e => setCurrentFocus(e.target.value)}
                  placeholder="Explique em linguagem simples o que está sendo otimizado neste momento..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Próximos Passos Imediatos (Plano dos Próximos 7 a 15 Dias)
                </label>
                <textarea
                  rows={3}
                  value={nextSteps}
                  onChange={e => setNextSteps(e.target.value)}
                  placeholder="Descreva os próximos testes, criativos ou ajustes planejados..."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
              <div>
                <label className={labelClass}>
                  Escopo Contratado (1 item por linha — aparece no Portal e no Contrato)
                </label>
                <textarea
                  rows={4}
                  value={scopeText}
                  onChange={e => setScopeText(e.target.value)}
                  placeholder="Gestão de Meta Ads&#10;Campanhas Google Search&#10;Configuração de Rastreamento GA4"
                  className={inputClass}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Canais Ativos na Operação (Separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={channelsInput}
                    onChange={e => setChannelsInput(e.target.value)}
                    placeholder="Meta Ads, Google Ads, Landing Page, CRM"
                    className={inputClass}
                  />
                </div>
                <div className={`p-4 rounded-xl ${subtleBox} text-xs space-y-1`}>
                  <span className="text-xs uppercase font-bold text-[#ed1c24] block">
                    Dica Didática
                  </span>
                  <p className={`text-xs leading-relaxed ${mutedText}`}>
                    Mantenha os textos de &ldquo;Foco Atual&rdquo; e &ldquo;Próximos Passos&rdquo; diretos e sem excesso de siglas técnicas. O objetivo é que o cliente abra o portal e entenda em 10 segundos o valor que a UPSELL está gerando.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ABA 02: MÉTRICAS DO MÊS, GRÁFICO SEMANAL & DIÁRIO DE OTIMIZAÇÕES
      ====================================================================== */}
      {(activeTab === 'metricas' || activeTab === 'visao-geral') && (
        <div className="space-y-8">
          {/* 2.1: Editor dos 4 KPIs Principais do Mês */}
          <div className={`p-6 sm:p-8 rounded-2xl ${surfaceCard} space-y-6`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${hairline}`}>
              <div>
                <span className="text-xs uppercase tracking-wide text-[#ed1c24] font-bold block">
                  Indicadores Principais · Aba 01 do Cliente
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
                  Métricas Consolidadas do Ciclo Atual
                </h3>
              </div>

              <button
                type="button"
                onClick={handleAutoCalculateMetrics}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isLight
                    ? 'bg-[#f7f7f4] hover:bg-[#141414] hover:text-white text-[#141414] border-[#141414]/15'
                    : 'bg-white/5 hover:bg-[#ed1c24] text-white border-white/15'
                }`}
                title="Calcular automaticamente CPL (Investimento / Leads) e ROAS (Receita / Investimento)"
              >
                <Calculator className="w-3.5 h-3.5 text-[#ed1c24]" />
                <span>Recalcular CPL e ROAS Automaticamente</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className={`p-4 rounded-xl ${subtleBox} space-y-3`}>
                <label className={labelClass}>1. Investimento (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={investment}
                  onChange={e => setInvestment(Number(e.target.value))}
                  className={`${inputClass} font-mono text-sm`}
                />
                <div>
                  <label className={labelClass}>Badge Variação</label>
                  <input
                    type="text"
                    value={growthInvestment}
                    onChange={e => setGrowthInvestment(e.target.value)}
                    placeholder="Ex: +12% ou Meta Mensal"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl ${subtleBox} space-y-3`}>
                <label className={labelClass}>2. Total de Leads</label>
                <input
                  type="number"
                  value={leads}
                  onChange={e => setLeads(Number(e.target.value))}
                  className={`${inputClass} font-mono text-sm`}
                />
                <div>
                  <label className={labelClass}>Badge Variação</label>
                  <input
                    type="text"
                    value={growthLeads}
                    onChange={e => setGrowthLeads(e.target.value)}
                    placeholder="Ex: +24% vs mês ant."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl ${subtleBox} space-y-3`}>
                <label className={labelClass}>3. Custo por Lead (CPL R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={cpl}
                  onChange={e => setCpl(Number(e.target.value))}
                  className={`${inputClass} font-mono text-sm`}
                />
                <div>
                  <label className={labelClass}>Badge Variação</label>
                  <input
                    type="text"
                    value={growthCpl}
                    onChange={e => setGrowthCpl(e.target.value)}
                    placeholder="Ex: -15% mais barato"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl ${subtleBox} space-y-3`}>
                <label className={labelClass}>4. Receita Gerada (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={revenue}
                  onChange={e => setRevenue(Number(e.target.value))}
                  className={`${inputClass} font-mono text-sm`}
                />
                <span className={`text-[11px] block pt-2 ${mutedText}`}>
                  Faturamento rastreado vindo das campanhas no período.
                </span>
              </div>

              <div className={`p-4 rounded-xl ${subtleBox} space-y-3`}>
                <label className={labelClass}>5. Multiplicador (ROAS x)</label>
                <input
                  type="number"
                  step="0.1"
                  value={roas}
                  onChange={e => setRoas(Number(e.target.value))}
                  className={`${inputClass} font-mono text-sm`}
                />
                <div>
                  <label className={labelClass}>Badge Variação</label>
                  <input
                    type="text"
                    value={growthRoas}
                    onChange={e => setGrowthRoas(e.target.value)}
                    placeholder="Ex: +0.8x evolução"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2.2: Editor do Gráfico Semanal (weeklyHistory) */}
          <div className={`p-6 sm:p-8 rounded-2xl ${surfaceCard} space-y-6`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${hairline}`}>
              <div>
                <span className="text-xs uppercase tracking-wide text-[#ed1c24] font-bold block">
                  Gráfico Interativo · Aba 02 do Cliente
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
                  Histórico Semanal do Gráfico de Performance
                </h3>
              </div>

              <button
                type="button"
                onClick={handleAddWeek}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#141414] dark:bg-[#ed1c24] hover:opacity-90 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Nova Semana</span>
              </button>
            </div>

            <div className="space-y-3">
              {weeklyHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl ${subtleBox} grid grid-cols-2 sm:grid-cols-6 gap-3 items-end`}
                >
                  <div>
                    <label className={labelClass}>Rótulo da Semana</label>
                    <input
                      type="text"
                      value={item.week}
                      onChange={e => handleUpdateWeek(idx, 'week', e.target.value)}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Investimento (R$)</label>
                    <input
                      type="number"
                      value={item.investment}
                      onChange={e => handleUpdateWeek(idx, 'investment', Number(e.target.value))}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Retorno / Receita (R$)</label>
                    <input
                      type="number"
                      value={item.revenue}
                      onChange={e => handleUpdateWeek(idx, 'revenue', Number(e.target.value))}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Qtd. de Leads</label>
                    <input
                      type="number"
                      value={item.leads}
                      onChange={e => handleUpdateWeek(idx, 'leads', Number(e.target.value))}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>CPL da Semana (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.cpl}
                      onChange={e => handleUpdateWeek(idx, 'cpl', Number(e.target.value))}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveWeek(idx)}
                      className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remover semana"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2.3: Diário Técnico de Otimizações */}
          <div className={`p-6 sm:p-8 rounded-2xl ${surfaceCard} space-y-6`}>
            <div className={`flex items-center justify-between pb-4 border-b ${hairline}`}>
              <div>
                <span className="text-xs uppercase tracking-wide text-[#ed1c24] font-bold block">
                  Bastidores da Agência · Aba 02 do Cliente
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
                  Diário de Otimizações Executadas ({optimizationLogs.length})
                </h3>
              </div>
            </div>

            {/* Formulário de Nova Otimização */}
            <form onSubmit={handleAddLog} className={`p-5 rounded-xl ${subtleBox} space-y-4`}>
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#ed1c24] block">
                + Registrar Nova Otimização no Histórico do Cliente
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Canal / Frente</label>
                  <select
                    value={newLogChannel}
                    onChange={e => setNewLogChannel(e.target.value as OptimizationLog['channel'])}
                    className={inputClass}
                  >
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Tracking & CAPI">Tracking & CAPI</option>
                    <option value="Criativos & LP">Criativos & LP</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Data / Período</label>
                  <input
                    type="text"
                    value={newLogDate}
                    onChange={e => setNewLogDate(e.target.value)}
                    placeholder="Ex: 28/10 ou Esta semana"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Status da Ação</label>
                  <select
                    value={newLogStatus}
                    onChange={e => setNewLogStatus(e.target.value as OptimizationLog['status'])}
                    className={inputClass}
                  >
                    <option value="Concluído">Concluído</option>
                    <option value="Em Teste">Em Teste</option>
                    <option value="Monitorando">Monitorando</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>O que foi executado?</label>
                  <input
                    type="text"
                    value={newLogAction}
                    onChange={e => setNewLogAction(e.target.value)}
                    placeholder="Ex: Pausamos 3 criativos saturados e subimos 2 novos vídeos Reels..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Qual o impacto esperado?</label>
                  <input
                    type="text"
                    value={newLogImpact}
                    onChange={e => setNewLogImpact(e.target.value)}
                    placeholder="Ex: Redução de 15% no CPL nos próximos 7 dias"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#141414] dark:bg-[#ed1c24] hover:opacity-90 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar ao Diário de Otimizações</span>
                </button>
              </div>
            </form>

            {/* Lista de Otimizações */}
            <div className="space-y-2.5">
              {optimizationLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 rounded-xl ${subtleBox} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#ed1c24]/10 text-[#ed1c24]">
                        {log.channel}
                      </span>
                      <span className={`font-mono text-[11px] ${mutedText}`}>{log.date}</span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold">{log.action}</p>
                    <p className={`text-[11px] ${mutedText}`}>Impacto: {log.expectedImpact}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLog(log.id)}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-500/10 self-end sm:self-center cursor-pointer"
                    title="Remover registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ABA 03: TAREFAS & CO-RESPONSABILIDADE (KANBAN)
      ====================================================================== */}
      {(activeTab === 'pendencias' || activeTab === 'visao-geral') && (
        <div className="space-y-4">
          <TaskKanban
            tasks={actionItems}
            onUpdateTasks={updated => {
              setActionItems(updated);
              onUpdateClient(client.id, { actionItems: updated });
            }}
            isAdmin={true}
            clientName={companyName || client.companyName}
            isLight={isLight}
            showToast={showToast}
            defaultAssigneeFilter="all"
          />
        </div>
      )}

      {/* =====================================================================
          ABA 04: CENTRAL DE LINKS, PASTAS DE CRIATIVOS & LOOKER STUDIO
      ====================================================================== */}
      {(activeTab === 'links' || activeTab === 'visao-geral') && (
        <div className={`p-6 sm:p-8 rounded-2xl ${surfaceCard} space-y-8`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${hairline}`}>
            <div>
              <span className="text-xs uppercase tracking-wide text-[#ed1c24] font-bold block">
                Repositórios em Nuvem · Aba 04 do Cliente
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
                Central de Links, Pastas do Google Drive & Looker Studio
              </h3>
            </div>
            <button
              type="button"
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#ed1c24] hover:bg-[#c8141b] transition-all cursor-pointer shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Links</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Copys */}
            <div className={`p-5 rounded-xl ${subtleBox} space-y-3`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#ed1c24]" />
                  01 · Pasta de Copys & Roteiros
                </span>
                {creativeCopies && (
                  <button
                    type="button"
                    onClick={() => handleTestLink(creativeCopies, 'Pasta de Copys')}
                    className="text-[11px] text-[#ed1c24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Testar</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={creativeCopies}
                onChange={e => setCreativeCopies(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className={inputClass}
              />
            </div>

            {/* 2. Vídeos */}
            <div className={`p-5 rounded-xl ${subtleBox} space-y-3`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#ed1c24]" />
                  02 · Pasta de Criativos em Vídeo
                </span>
                {creativeVideos && (
                  <button
                    type="button"
                    onClick={() => handleTestLink(creativeVideos, 'Pasta de Vídeos')}
                    className="text-[11px] text-[#ed1c24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Testar</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={creativeVideos}
                onChange={e => setCreativeVideos(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className={inputClass}
              />
            </div>

            {/* 3. Imagens */}
            <div className={`p-5 rounded-xl ${subtleBox} space-y-3`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#ed1c24]" />
                  03 · Pasta de Imagens & Banners
                </span>
                {creativeImages && (
                  <button
                    type="button"
                    onClick={() => handleTestLink(creativeImages, 'Pasta de Imagens')}
                    className="text-[11px] text-[#ed1c24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Testar</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={creativeImages}
                onChange={e => setCreativeImages(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className={inputClass}
              />
            </div>

            {/* 4. Looker Studio */}
            <div className={`p-5 rounded-xl ${subtleBox} space-y-3`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#ed1c24]" />
                  04 · Dashboard Looker Studio (BI)
                </span>
                {lookerStudio && (
                  <button
                    type="button"
                    onClick={() => handleTestLink(lookerStudio, 'Looker Studio')}
                    className="text-[11px] text-[#ed1c24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Testar</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={lookerStudio}
                onChange={e => setLookerStudio(e.target.value)}
                placeholder="https://lookerstudio.google.com/reporting/..."
                className={inputClass}
              />
            </div>

            {/* 5. Contrato PDF */}
            <div className={`p-5 rounded-xl ${subtleBox} space-y-3`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#ed1c24]" />
                  05 · Link do Contrato Assinado (PDF)
                </span>
                {contractPdf && (
                  <button
                    type="button"
                    onClick={() => handleTestLink(contractPdf, 'Contrato PDF')}
                    className="text-[11px] text-[#ed1c24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Testar</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={contractPdf}
                onChange={e => setContractPdf(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className={inputClass}
              />
            </div>

            {/* 6. Drive Geral */}
            <div className={`p-5 rounded-xl ${subtleBox} space-y-3`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-[#ed1c24]" />
                  06 · Repositório Raiz no Google Drive
                </span>
                {googleDrive && (
                  <button
                    type="button"
                    onClick={() => handleTestLink(googleDrive, 'Drive Geral')}
                    className="text-[11px] text-[#ed1c24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Testar</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={googleDrive}
                onChange={e => setGoogleDrive(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ABA 05: COFRE DE FERRAMENTAS, HOSPEDAGEM & SENHAS
      ====================================================================== */}
      {(activeTab === 'ferramentas' || activeTab === 'visao-geral') && (
        <div className={`p-6 sm:p-8 rounded-2xl ${surfaceCard} space-y-6`}>
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${hairline}`}>
            <div>
              <span className="text-xs uppercase tracking-wide text-[#ed1c24] font-bold block">
                Ativos & Credenciais · Aba 04 do Cliente
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
                Cofre de Ferramentas, Hospedagem & Acessos
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddingTool(!isAddingTool);
                setEditingTool(null);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#141414] dark:bg-[#ed1c24] hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingTool ? 'Fechar Formulário' : 'Adicionar Ferramenta'}</span>
            </button>
          </div>

          {/* Atalhos Rápidos */}
          <div className={`p-4 rounded-xl ${subtleBox} space-y-2.5`}>
            <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>
              Modelos Rápidos (1 clique para carregar):
            </span>
            <div className="flex flex-wrap gap-2">
              {TOOL_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-[#141414] hover:text-white text-[#141414] border-[#141414]/15'
                      : 'bg-white/5 hover:bg-white/15 text-white border-white/10'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#ed1c24]" />
                  <span>{preset.name.split(' (')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulário Edição */}
          {editingTool && (
            <form onSubmit={handleSaveEditTool} className={`p-6 rounded-2xl ${subtleBox} border-2 border-[#ed1c24] space-y-4`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase text-[#ed1c24]">
                  Editando: {editingTool.name}
                </span>
                <button type="button" onClick={() => setEditingTool(null)} className="p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Nome</label>
                  <input
                    type="text"
                    value={editingTool.name}
                    onChange={e => setEditingTool({ ...editingTool, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Categoria</label>
                  <input
                    type="text"
                    value={editingTool.category}
                    onChange={e => setEditingTool({ ...editingTool, category: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={editingTool.status}
                    onChange={e => setEditingTool({ ...editingTool, status: e.target.value as any })}
                    className={inputClass}
                  >
                    <option value="Ativo / Vinculado">Ativo / Vinculado</option>
                    <option value="Pendente de Acesso">Pendente de Acesso</option>
                    <option value="Em Configuração">Em Configuração</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>E-mail da Conta</label>
                  <input
                    type="text"
                    value={editingTool.accountEmail}
                    onChange={e => setEditingTool({ ...editingTool, accountEmail: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Usuário / Login</label>
                  <input
                    type="text"
                    value={editingTool.loginUser || ''}
                    onChange={e => setEditingTool({ ...editingTool, loginUser: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Senha</label>
                  <input
                    type="text"
                    value={editingTool.password || ''}
                    onChange={e => setEditingTool({ ...editingTool, password: e.target.value })}
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>URL de Acesso</label>
                  <input
                    type="text"
                    value={editingTool.accessUrl || ''}
                    onChange={e => setEditingTool({ ...editingTool, accessUrl: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Observação</label>
                  <input
                    type="text"
                    value={editingTool.detail}
                    onChange={e => setEditingTool({ ...editingTool, detail: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#ed1c24] cursor-pointer"
                >
                  Concluir Edição
                </button>
              </div>
            </form>
          )}

          {/* Formulário Adição */}
          {isAddingTool && !editingTool && (
            <form onSubmit={handleAddTool} className={`p-6 rounded-2xl ${subtleBox} space-y-4`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Nome da Ferramenta *</label>
                  <input
                    type="text"
                    required
                    value={newToolName}
                    onChange={e => setNewToolName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Categoria</label>
                  <input
                    type="text"
                    value={newToolCategory}
                    onChange={e => setNewToolCategory(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={newToolStatus}
                    onChange={e => setNewToolStatus(e.target.value as any)}
                    className={inputClass}
                  >
                    <option value="Ativo / Vinculado">Ativo / Vinculado</option>
                    <option value="Pendente de Acesso">Pendente de Acesso</option>
                    <option value="Em Configuração">Em Configuração</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>E-mail</label>
                  <input
                    type="text"
                    value={newToolEmail}
                    onChange={e => setNewToolEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Login</label>
                  <input
                    type="text"
                    value={newToolLogin}
                    onChange={e => setNewToolLogin(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Senha</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newToolPassword}
                      onChange={e => setNewToolPassword(e.target.value)}
                      className={`${inputClass} font-mono`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>URL do Painel</label>
                  <input
                    type="text"
                    value={newToolUrl}
                    onChange={e => setNewToolUrl(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Detalhes</label>
                  <input
                    type="text"
                    value={newToolDetail}
                    onChange={e => setNewToolDetail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#ed1c24] cursor-pointer"
                >
                  Cadastrar no Cofre
                </button>
              </div>
            </form>
          )}

          {/* Lista de Ferramentas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTools.map(tool => {
              const isPasswordVisible = visiblePasswords[tool.id] || false;
              const isDeleting = confirmDeleteToolId === tool.id;

              return (
                <div key={tool.id} className={`p-5 rounded-xl ${subtleBox} space-y-3`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-sm block">{tool.name}</span>
                      <span className={`font-mono text-[11px] ${mutedText}`}>
                        {tool.category} · {tool.accountEmail}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      {tool.status}
                    </span>
                  </div>

                  <div className={`p-3 rounded-lg ${surfaceCard} space-y-1.5 text-xs`}>
                    <div className="flex items-center justify-between">
                      <span className={mutedText}>E-mail:</span>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span>{tool.accountEmail}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(tool.accountEmail, `${tool.id}-email`, 'E-mail')}
                        >
                          {copiedKey === `${tool.id}-email` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={mutedText}>Senha:</span>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span>
                          {tool.password ? (isPasswordVisible ? tool.password : '••••••••••') : 'Não cadastrada'}
                        </span>
                        {tool.password && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setVisiblePasswords(p => ({ ...p, [tool.id]: !p[tool.id] }))
                              }
                            >
                              {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(tool.password || '', `${tool.id}-pass`, 'Senha')}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between pt-2 border-t ${hairline}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTool(tool);
                        setIsAddingTool(false);
                      }}
                      className="text-xs font-bold flex items-center gap-1 hover:text-[#ed1c24] cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>

                    {isDeleting ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTools(prev => prev.filter(t => t.id !== tool.id));
                            setConfirmDeleteToolId(null);
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white"
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteToolId(null)}
                          className="px-2 py-0.5 rounded text-[10px]"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteToolId(tool.id)}
                        className="text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Zona de Exclusão */}
      <div className={`p-5 rounded-2xl ${subtleBox} flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs`}>
        <div>
          <span className="font-bold flex items-center gap-2 text-rose-600">
            <Trash2 className="w-4 h-4" />
            <span>Remover Conta de Cliente</span>
          </span>
          <p className={`text-[11px] mt-0.5 ${mutedText}`}>
            Exclui permanentemente os relatórios e dados de <strong>{companyName || client.companyName}</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRequestDeleteClient(client)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 border border-rose-500/30 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0"
        >
          Excluir {companyName || client.companyName}
        </button>
      </div>

      {/* Botão Flutuante de Salvar */}
      <div className="sticky bottom-6 z-20 flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-xs font-bold text-white bg-[#141414] dark:bg-[#ed1c24] hover:opacity-95 transition-all shadow-2xl border border-white/15 cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#ed1c24] dark:text-white" />
          <span>Salvar Todas as Alterações no Firebase</span>
        </button>
      </div>
    </div>
  );
}

export function AdminPanel({
  clients,
  selectedClientId,
  onSelectClient,
  onUpdateClient,
  onViewAsClient,
  onLogout,
  onResetDefault,
  onDeleteClient,
  onAddNewClient
}: AdminPanelProps) {
  const {
    theme,
    toggleTheme,
    addNewClient: storeAddNewClient,
    deleteClient: storeDeleteClient
  } = useUpsellStore();
  const isLight = theme === 'light';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isManageClientsModalOpen, setIsManageClientsModalOpen] = useState(false);
  const [isAgencyTasksModalOpen, setIsAgencyTasksModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientProfile | null>(null);

  const [newCompanyName, setNewCompanyName] = useState('');
  const [newSegment, setNewSegment] = useState('');
  const [newResponsible, setNewResponsible] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const allAgencyTasks = useMemo(() => {
    const list: { client: ClientProfile; task: ClientActionItem }[] = [];
    clients.forEach(c => {
      (c.actionItems || []).forEach(t => {
        if (t.assignee === 'agency' || !t.assignee) {
          list.push({ client: c, task: t });
        }
      });
    });
    return list;
  }, [clients]);

  const pendingAgencyTasks = useMemo(
    () => allAgencyTasks.filter(item => item.task.status !== 'completed'),
    [allAgencyTasks]
  );

  const handleConfirmDeleteClient = (clientId: string, clientName: string) => {
    const deleteFn = onDeleteClient || storeDeleteClient;
    deleteFn(clientId);
    const remaining = clients.filter(c => c.id !== clientId);
    if (remaining.length > 0 && selectedClientId === clientId) {
      onSelectClient(remaining[0].id);
    }
    setClientToDelete(null);
    setIsManageClientsModalOpen(false);
    showToast(`Cliente "${clientName}" excluído.`);
  };

  const handleCreateNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    const newProfile = createDefaultNewClientProfile(
      newCompanyName,
      newSegment,
      newResponsible,
      newEmail
    );
    const addFn = onAddNewClient || storeAddNewClient;
    addFn(newProfile);
    onSelectClient(newProfile.id);
    setIsAddClientModalOpen(false);
    setNewCompanyName('');
    setNewSegment('');
    setNewResponsible('');
    setNewEmail('');
    showToast(`Cliente "${newProfile.companyName}" criado com sucesso!`);
  };

  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isLight
          ? 'bg-[#f7f7f4] text-[#141414] selection:bg-[#ed1c24] selection:text-white'
          : 'bg-[#0c0d10] text-[#f7f7f4] selection:bg-[#ed1c24] selection:text-white'
      }`}
    >
      {/* TOP BAR CONSOLE DO GESTOR */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md px-5 sm:px-10 py-3.5 transition-colors border-b ${
          isLight ? 'bg-[#f7f7f4]/95 border-[#141414]/12' : 'bg-[#0c0d10]/95 border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#ed1c24]" />
              <span className="font-bold tracking-wide text-base">
                UPSELL
              </span>
            </div>
            <span className="opacity-30">/</span>
            <span className="text-xs uppercase tracking-wide font-bold text-[#ed1c24]">
              Console Master do Gestor
            </span>

            {/* Seletor de Cliente */}
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border ${
                isLight ? 'bg-white border-[#141414]/15' : 'bg-[#161922] border-white/15'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#ed1c24]" />
              <select
                value={currentClient.id}
                onChange={e => onSelectClient(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
              >
                {clients.map(c => (
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

            <button
              type="button"
              onClick={() => setIsAddClientModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#ed1c24] text-white hover:bg-[#c8141b] transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Novo Cliente</span>
            </button>

            <button
              type="button"
              onClick={() => setIsManageClientsModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                isLight ? 'bg-white border-[#141414]/15' : 'bg-[#161922] border-white/15'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#ed1c24]" />
              <span>Clientes ({clients.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAgencyTasksModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                isLight ? 'bg-white border-[#141414]/15' : 'bg-[#161922] border-white/15'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#ed1c24]" />
              <span>Fila UPSELL ({pendingAgencyTasks.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                isLight ? 'bg-white border-[#141414]/15' : 'bg-[#161922] border-white/15'
              }`}
            >
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-[#ed1c24]" />}
              <span className="hidden sm:inline">{isLight ? 'Escuro' : 'Claro'}</span>
            </button>

            <button
              type="button"
              onClick={() => onViewAsClient(currentClient.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                isLight ? 'bg-white border-[#141414]/15' : 'bg-[#161922] border-white/15'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#ed1c24]" />
              <span>Ver Portal do Cliente</span>
            </button>

            <button
              type="button"
              onClick={onResetDefault}
              title="Restaurar demonstração"
              className="p-2 rounded-lg opacity-60 hover:opacity-100 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold opacity-75 hover:opacity-100 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-5 sm:px-10 pt-8">
        <ClientEditor
          key={currentClient.id}
          client={currentClient}
          onUpdateClient={onUpdateClient}
          onViewAsClient={onViewAsClient}
          onRequestDeleteClient={c => setClientToDelete(c)}
          showToast={showToast}
          isLight={isLight}
        />
      </main>

      {/* MODAL NOVO CLIENTE */}
      {isAddClientModalOpen && (
        <div
          onClick={() => setIsAddClientModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl border ${
              isLight ? 'bg-white border-[#141414]/15 text-[#141414]' : 'bg-[#151720] border-white/10 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#141414]/10 dark:border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-[#ed1c24]" />
                <h3 className="font-heading text-xl font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">Cadastrar Novo Cliente</h3>
              </div>
              <button type="button" onClick={() => setIsAddClientModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewClient} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase mb-1">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Clínica São Lucas"
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-[#141414]/20 dark:border-white/15 bg-transparent"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase mb-1">
                  Segmento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dermatologia, E-commerce..."
                  value={newSegment}
                  onChange={e => setNewSegment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-[#141414]/20 dark:border-white/15 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dra. Mariana"
                    value={newResponsible}
                    onChange={e => setNewResponsible(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-[#141414]/20 dark:border-white/15 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase mb-1">
                    E-mail Google Autorizado *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="cliente@gmail.com"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-[#141414]/20 dark:border-white/15 bg-transparent font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#ed1c24] cursor-pointer"
                >
                  Criar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GERENCIAR CLIENTES */}
      {isManageClientsModalOpen && (
        <div
          onClick={() => setIsManageClientsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-2xl max-h-[85vh] flex flex-col p-6 sm:p-7 rounded-2xl shadow-2xl border ${
              isLight ? 'bg-white border-[#141414]/15 text-[#141414]' : 'bg-[#151720] border-white/10 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#141414]/10 dark:border-white/10">
              <h3 className="font-heading text-xl font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
                Empresas Gerenciadas ({clients.length})
              </h3>
              <button type="button" onClick={() => setIsManageClientsModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 flex-1">
              {clients.map(c => (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    c.id === currentClient.id
                      ? 'border-[#ed1c24] bg-[#ed1c24]/5'
                      : 'border-[#141414]/10 dark:border-white/10'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">{c.companyName}</span>
                    <span className="font-mono text-xs opacity-70">
                      {c.allowedEmails?.join(', ') || c.email} · Resp: {c.responsibleName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectClient(c.id);
                        setIsManageClientsModalOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#141414] text-white dark:bg-[#ed1c24] cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setClientToDelete(c)}
                      className="p-1.5 text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO EXCLUSÃO */}
      {clientToDelete && (
        <div
          onClick={() => setClientToDelete(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-md p-6 rounded-2xl border ${
              isLight ? 'bg-white border-[#141414]/15 text-[#141414]' : 'bg-[#151720] border-white/10 text-white'
            } space-y-4`}
          >
            <h3 className="font-heading text-xl font-bold tracking-tight text-rose-600">
              Excluir {clientToDelete.companyName}?
            </h3>
            <p className="text-xs opacity-75 leading-relaxed">
              Esta ação removerá os dados desta empresa do painel e do Firestore.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setClientToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteClient(clientToDelete.id, clientToDelete.companyName)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FILA DE TAREFAS DA UPSELL */}
      {isAgencyTasksModalOpen && (
        <div
          onClick={() => setIsAgencyTasksModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-3xl max-h-[85vh] flex flex-col p-6 rounded-2xl border ${
              isLight ? 'bg-white border-[#141414]/15 text-[#141414]' : 'bg-[#151720] border-white/10 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#141414]/10 dark:border-white/10">
              <h3 className="font-heading text-xl font-bold tracking-tight text-[#141414] dark:text-[#f7f7f4]">
                Fila de Execução da UPSELL ({pendingAgencyTasks.length} ativas)
              </h3>
              <button type="button" onClick={() => setIsAgencyTasksModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 flex-1">
              {allAgencyTasks.map(({ client: c, task: t }) => (
                <div
                  key={`${c.id}-${t.id}`}
                  className="p-4 rounded-xl border border-[#141414]/10 dark:border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#ed1c24]">
                      {c.companyName} · {t.due}
                    </span>
                    <p className="text-xs font-bold">{t.task}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectClient(c.id);
                      setIsAgencyTasksModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#141414] text-white dark:bg-[#ed1c24] shrink-0"
                  >
                    Abrir Conta &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50">
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#141414] text-white text-xs shadow-2xl border border-[#ed1c24]">
            <CheckCircle2 className="w-4 h-4 text-[#ed1c24] shrink-0" />
            <span className="font-bold">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
