'use client';

import React, { useState, useMemo } from 'react';
import { ClientProfile, ClientActionItem, ClientToolAccess, OptimizationLog, VisualTheme } from '@/lib/types';
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
  Server,
  Globe,
  Search,
  Edit3,
  Sun,
  Moon,
  Layers,
  ListChecks,
  Share2,
  ChevronRight,
  ShieldAlert,
  UserPlus,
  X,
  CopyCheck,
  ArrowRight,
  KeyRound,
  MessageCircle,
  FileText,
  Video,
  Image as ImageIcon
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

// Helper to format URLs to always include https:// if missing
function formatSafeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

// Helper to calculate contract timelapse progress dynamically
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

// Strong password generator helper
function generateStrongPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
  let pass = '';
  for (let i = 0; i < 14; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

// Preset definitions for quick addition of hosting, ads, and web tools
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
    name: 'Meta Business Manager (BM Upsell)',
    category: 'Tráfego & Anúncios',
    accessUrl: 'https://business.facebook.com/settings',
    detail: 'Pixel, Conversions API, Contas de Anúncio e Catálogos vinculados',
    defaultLogin: 'bm_upsell'
  },
  {
    name: 'Google Ads (MCC Upsell)',
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
  const slug = companyName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `cliente-${now}`;

  const startDate = new Date();
  const renewalDate = new Date(now + 365 * 24 * 60 * 60 * 1000);

  return {
    id: slug,
    companyName: companyName.trim(),
    segment: segment.trim() || 'Serviços Especializados',
    responsibleName: responsibleName.trim() || 'Diretor Geral',
    email: email.trim() || 'contato@empresa.com.br',
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
      cpl: 41.66,
      roas: 4.2,
      revenue: 21000,
      growth: {
        investment: 'Início',
        leads: 'Início',
        cpl: 'Início',
        roas: 'Início'
      }
    },
    links: {
      lookerStudio: '',
      financialSheet: '',
      googleDrive: '',
      contractPdf: ''
    },
    accessPin: Math.floor(100000 + Math.random() * 900000).toString(),
    actionItems: [
      {
        id: `task-${now}-1`,
        task: 'Liberação de acessos ao Meta Business Manager e Google Ads',
        detail: 'Convidar a equipe da Upsell com papel de administrador ou agência.',
        status: 'pending',
        due: 'Nos primeiros 3 dias',
        assignee: 'client',
        priority: 'high',
        category: 'Onboarding'
      },
      {
        id: `task-${now}-2`,
        task: 'Instalação do Pixel e Conversions API (CAPI) no site',
        detail: 'Configurar evento de Purchase/Lead e testar envio de eventos no Gerenciador de Eventos.',
        status: 'in_progress',
        due: 'Até amanhã',
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
        accountEmail: email.trim() || 'contato@empresa.com.br',
        loginUser: 'gestor_upsell',
        password: generateStrongPassword(),
        accessUrl: 'https://business.facebook.com',
        status: 'Em Configuração',
        detail: 'Em processo de vinculação com a agência Upsell'
      }
    ],
    weeklyHistory: [
      { week: 'Sem 01', investment: 1250, revenue: 5250, leads: 30, cpl: 41.66 }
    ],
    optimizationLogs: []
  };
}

// Active Tabs for Admin Panel Navigation to avoid cognitive overload
type AdminTab = 'resumo' | 'ferramentas' | 'pendencias' | 'links' | 'visao-geral';

// Sub-component for editing a specific client
function ClientEditor({
  client,
  onUpdateClient,
  onViewAsClient,
  onRequestDeleteClient,
  canDeleteClient,
  showToast,
  isLight
}: {
  client: ClientProfile;
  onUpdateClient: AdminPanelProps['onUpdateClient'];
  onViewAsClient: (id: string) => void;
  onRequestDeleteClient: (client: ClientProfile) => void;
  canDeleteClient: boolean;
  showToast: (msg: string) => void;
  isLight: boolean;
}) {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('resumo');

  // 1. Gestão de Vigência
  const [contractStart, setContractStart] = useState(client.contractStart || '15/10/2024');
  const [contractRenewal, setContractRenewal] = useState(client.contractRenewal || '15/10/2026');
  const [contractStatus, setContractStatus] = useState(client.contractStatus || 'Contrato Vigente');

  // 1.1 Chave de Acesso do Cliente (PIN de 6 dígitos)
  const [accessPin, setAccessPin] = useState(client.accessPin || '839102');
  const [showPin, setShowPin] = useState(false);

  const handleGenerateNewPin = () => {
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    setAccessPin(newPin);
    showToast(`Novo PIN gerado: ${newPin}. Lembre-se de clicar em "Salvar Alterações".`);
  };

  const handleCopyWhatsAppInvite = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const clientUrl = `${origin}/?cliente=${client.id}`;
    const text = `Olá ${client.responsibleName}! 👋\n\nSegue o link exclusivo e seguro para você acompanhar o Portal de Performance da sua empresa na UpSell:\n👉 ${clientUrl}\n\n🔑 Sua chave de acesso pessoal (PIN): *${accessPin}*\n\nPor este portal você confere relatórios atualizados em tempo real, métricas de tráfego, tarefas e documentos oficiais.`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    showToast(`Mensagem de convite com PIN copiada para o WhatsApp!`);
  };

  // 2. Resumo da Situação Atual
  const [currentFocus, setCurrentFocus] = useState(client.currentFocus || '');
  const [nextSteps, setNextSteps] = useState(client.nextSteps || '');

  // 3. Gerenciador de Pendências do Cliente
  const [actionItems, setActionItems] = useState<ClientActionItem[]>(() => {
    if (client.actionItems && client.actionItems.length > 0) {
      return client.actionItems;
    }
    return [
      {
        id: 'task-1',
        task: 'Gravação dos 2 vídeos de respostas a dúvidas frequentes',
        detail: 'Roteiros enviados pelo gestor no WhatsApp. Duração de 45 a 60 segundos.',
        status: 'pending',
        due: 'Até 22/10'
      },
      {
        id: 'task-2',
        task: 'Envio de 5 fotos em alta resolução da nova sala de atendimento',
        detail: 'Material para os novos criativos estáticos de prova institucional.',
        status: 'completed',
        due: 'Concluído em 10/10'
      }
    ];
  });

  // State to add a new task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDetail, setNewTaskDetail] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('Em 5 dias');

  // State for Editing a Task
  const [editingTask, setEditingTask] = useState<ClientActionItem | null>(null);
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // 5. Gerenciador de Ferramentas & Acessos (Cofre de Credenciais da Operação)
  const [activeTools, setActiveTools] = useState<ClientToolAccess[]>(() => {
    if (client.activeTools && client.activeTools.length > 0) {
      return client.activeTools;
    }
    return [
      {
        id: 'tool-hospedagem',
        name: 'Hospedagem do Site (Hostinger Cloud)',
        category: 'Hospedagem & Servidor',
        accountEmail: client.email,
        loginUser: 'adm_servidor',
        password: generateStrongPassword(),
        accessUrl: 'https://hpanel.hostinger.com',
        status: 'Ativo / Vinculado',
        detail: 'Servidor Cloud com SSL ativo e PHP 8.3'
      },
      {
        id: 'tool-1',
        name: 'Meta Business Manager',
        category: 'Instagram & Facebook Ads',
        accountEmail: client.email,
        loginUser: 'gestor_upsell',
        password: generateStrongPassword(),
        accessUrl: 'https://business.facebook.com',
        status: 'Ativo / Vinculado',
        detail: 'Pixel e CAPI operando normalmente'
      },
      {
        id: 'tool-2',
        name: 'Google Ads (MCC Upsell)',
        category: 'Rede de Pesquisa & PMax',
        accountEmail: client.email,
        loginUser: 'ads_upsell',
        password: generateStrongPassword(),
        accessUrl: 'https://ads.google.com',
        status: 'Ativo / Vinculado',
        detail: 'Campanhas de intenção de fundo de funil ativas'
      }
    ];
  });

  // State for Tools Filter & Search
  const [toolSearch, setToolSearch] = useState('');
  const [toolCategoryFilter, setToolCategoryFilter] = useState('Todas');
  const [isAddingTool, setIsAddingTool] = useState(false);

  // EDITING TOOL STATE
  const [editingTool, setEditingTool] = useState<ClientToolAccess | null>(null);
  const [confirmDeleteToolId, setConfirmDeleteToolId] = useState<string | null>(null);

  // New Tool Form State
  const [newToolName, setNewToolName] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('Hospedagem & Servidor');
  const [newToolEmail, setNewToolEmail] = useState(client.email);
  const [newToolLogin, setNewToolLogin] = useState('');
  const [newToolPassword, setNewToolPassword] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');
  const [newToolDetail, setNewToolDetail] = useState('');
  const [newToolStatus, setNewToolStatus] = useState<'Ativo / Vinculado' | 'Pendente de Acesso' | 'Em Configuração'>('Ativo / Vinculado');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Visible passwords toggles map: { [toolId]: boolean }
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Copied feedback map: { [key: string]: boolean }
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 6. Central de Links Externos & Repositórios Segmentados
  const [googleDrive, setGoogleDrive] = useState(client.links.googleDrive || '');
  const [contractPdf, setContractPdf] = useState(client.links.contractPdf || '');
  const [lookerStudio, setLookerStudio] = useState(client.links.lookerStudio || '');
  const [creativeCopies, setCreativeCopies] = useState(client.links.creativeCopies || '');
  const [creativeVideos, setCreativeVideos] = useState(client.links.creativeVideos || '');
  const [creativeImages, setCreativeImages] = useState(client.links.creativeImages || '');

  // Calculate live timelapse
  const { daysRemaining, progressPercent } = calculateTimelapse(contractStart, contractRenewal);

  // Toggle visible password for a tool
  const togglePasswordVisibility = (toolId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  // Safe copy to clipboard helper
  const copyToClipboard = (text: string, identifier: string, label: string) => {
    if (!text) {
      showToast('Nenhum dado informado para copiar.');
      return;
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedKey(identifier);
      showToast(`${label} copiado com sucesso!`);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      showToast('Erro ao copiar.');
    }
  };

  // Test link helper
  const handleTestLink = (url: string, name: string) => {
    if (!url || !url.trim()) {
      showToast(`O link de "${name}" ainda não foi preenchido.`);
      return;
    }
    const safeUrl = formatSafeUrl(url);
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  };

  // Preset button click handler
  const applyPreset = (preset: ToolPreset) => {
    setNewToolName(preset.name);
    setNewToolCategory(preset.category);
    setNewToolUrl(preset.accessUrl);
    setNewToolDetail(preset.detail);
    setNewToolLogin(preset.defaultLogin);
    setNewToolPassword(generateStrongPassword());
    setIsAddingTool(true);
    showToast(`Modelo "${preset.name}" carregado no formulário.`);
  };

  // ==========================================
  // TASK HANDLERS (Toggle, Add, Edit, Delete)
  // ==========================================
  const toggleTask = (taskId: string) => {
    setActionItems(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setActionItems(prev => prev.filter(t => t.id !== taskId));
    setConfirmDeleteTaskId(null);
    showToast('Pendência excluída com sucesso.');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      showToast('Informe o título da tarefa.');
      return;
    }
    const newItem: ClientActionItem = {
      id: `task-${Date.now()}`,
      task: newTaskTitle.trim(),
      detail: newTaskDetail.trim() || 'Ação solicitada pelo gestor da Upsell',
      status: 'pending',
      due: newTaskDue.trim() || 'Pendente'
    };
    setActionItems(prev => [newItem, ...prev]);
    setNewTaskTitle('');
    setNewTaskDetail('');
    setNewTaskDue('Em 5 dias');
    showToast('Nova pendência criada com sucesso!');
  };

  const handleSaveEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    if (!editingTask.task.trim()) {
      showToast('O título da pendência não pode ficar vazio.');
      return;
    }
    setActionItems(prev => prev.map(t => (t.id === editingTask.id ? editingTask : t)));
    setEditingTask(null);
    showToast('Pendência atualizada com sucesso!');
  };

  // ==========================================
  // TOOL HANDLERS (Add, Edit, Delete, Duplicate)
  // ==========================================
  const updateToolStatus = (
    toolId: string,
    status: 'Ativo / Vinculado' | 'Pendente de Acesso' | 'Em Configuração'
  ) => {
    setActiveTools(prev => prev.map(t => (t.id === toolId ? { ...t, status } : t)));
    showToast(`Status atualizado para: ${status}`);
  };

  const deleteTool = (toolId: string) => {
    setActiveTools(prev => prev.filter(t => t.id !== toolId));
    setConfirmDeleteToolId(null);
    showToast('Ferramenta excluída do cofre.');
  };

  const duplicateTool = (tool: ClientToolAccess) => {
    const duplicated: ClientToolAccess = {
      ...tool,
      id: `tool-${Date.now()}`,
      name: `${tool.name} (Cópia)`
    };
    setActiveTools(prev => [duplicated, ...prev]);
    showToast(`Ferramenta "${tool.name}" duplicada com sucesso.`);
  };

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim()) {
      showToast('Informe o nome da ferramenta.');
      return;
    }
    const newTool: ClientToolAccess = {
      id: `tool-${Date.now()}`,
      name: newToolName.trim(),
      category: newToolCategory.trim() || 'Hospedagem & Servidor',
      accountEmail: newToolEmail.trim() || client.email,
      loginUser: newToolLogin.trim() || '',
      password: newToolPassword.trim() || '',
      accessUrl: formatSafeUrl(newToolUrl.trim()),
      detail: newToolDetail.trim() || 'Acesso configurado e monitorado pela Upsell',
      status: newToolStatus
    };
    setActiveTools(prev => [newTool, ...prev]);
    setNewToolName('');
    setNewToolCategory('Hospedagem & Servidor');
    setNewToolEmail(client.email);
    setNewToolLogin('');
    setNewToolPassword('');
    setNewToolUrl('');
    setNewToolDetail('');
    setIsAddingTool(false);
    showToast('Nova ferramenta e credencial adicionadas ao cofre!');
  };

  const handleSaveEditTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool) return;
    if (!editingTool.name.trim()) {
      showToast('O nome da ferramenta é obrigatório.');
      return;
    }
    const safeEdited: ClientToolAccess = {
      ...editingTool,
      name: editingTool.name.trim(),
      category: editingTool.category.trim() || 'Hospedagem & Servidor',
      accountEmail: editingTool.accountEmail.trim() || client.email,
      loginUser: editingTool.loginUser?.trim() || '',
      password: editingTool.password?.trim() || '',
      accessUrl: formatSafeUrl(editingTool.accessUrl || ''),
      detail: editingTool.detail.trim() || 'Gerenciado pela Upsell'
    };
    setActiveTools(prev => prev.map(t => (t.id === safeEdited.id ? safeEdited : t)));
    setEditingTool(null);
    showToast(`Ferramenta "${safeEdited.name}" atualizada com sucesso!`);
  };

  // Filtered tools based on search and category
  const filteredTools = activeTools.filter(tool => {
    const matchesCategory =
      toolCategoryFilter === 'Todas' ||
      tool.category.toLowerCase().includes(toolCategoryFilter.toLowerCase());
    const matchesSearch =
      !toolSearch.trim() ||
      tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.category.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.accountEmail.toLowerCase().includes(toolSearch.toLowerCase()) ||
      (tool.loginUser && tool.loginUser.toLowerCase().includes(toolSearch.toLowerCase())) ||
      (tool.detail && tool.detail.toLowerCase().includes(toolSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered tasks based on taskFilter
  const filteredActionItems = actionItems.filter(item => {
    if (taskFilter === 'pending') return item.status === 'pending';
    if (taskFilter === 'completed') return item.status === 'completed';
    return true;
  });

  // Master Save handler
  const handleSaveAll = () => {
    onUpdateClient(client.id, {
      contractStart,
      contractRenewal,
      contractStatus,
      currentFocus,
      nextSteps,
      metrics: {
        ...client.metrics,
      },
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
      accessPin: accessPin.trim()
    });

    showToast(`Todas as alterações de ${client.companyName} foram salvas!`);
  };

  // Color classes helper based on isLight - Alto Contraste Rigoroso
  const cardBg = isLight
    ? 'bg-white border-2 border-slate-300 shadow-sm text-[#0f172a]'
    : 'bg-[#12141a] border border-white/15 shadow-xl text-white';

  const innerBg = isLight
    ? 'bg-white border-2 border-slate-200/90 shadow-xs text-[#0f172a]'
    : 'bg-[#181b24] border border-white/12 text-slate-100';

  const inputClass = isLight
    ? 'w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-xs text-[#0f172a] placeholder-slate-400 focus:outline-none focus:border-[#b58c56] focus:ring-2 focus:ring-[#b58c56]/20 transition-all font-semibold'
    : 'w-full px-3.5 py-2.5 bg-[#0e1016] border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#c8a97e] transition-colors font-semibold';

  const labelClass = isLight
    ? 'block text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1.5'
    : 'block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5';

  const pendingTasksCount = actionItems.filter(t => t.status === 'pending').length;
  const completedTasksCount = actionItems.filter(t => t.status === 'completed').length;

  const handleCopyClientLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const clientUrl = `${origin}/?cliente=${client.id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(clientUrl);
    }
    showToast(`Link de acesso direto copiado: ${clientUrl}`);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* 1. Visão Geral do Cliente & Barra de Ações Rápidas */}
      <div className={`p-6 sm:p-7 rounded-2xl ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b58c56] bg-[#b58c56]/10 px-2.5 py-0.5 rounded-full">
              {client.segment}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {client.id}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {client.contractStatus}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {client.companyName}
          </h2>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#8e8d96]'} font-normal`}>
            Responsável direto: <strong className={isLight ? 'text-slate-700' : 'text-slate-300'}>{client.responsibleName}</strong> · E-mail: {client.email}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopyClientLink}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 text-[#b58c56] border border-[#b58c56]/30'
                : 'bg-[#b58c56]/15 hover:bg-[#b58c56]/25 text-[#dfc7a7] border border-[#b58c56]/30'
            }`}
            title="Copiar link de acesso direto para enviar ao cliente no WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-[#b58c56]" />
            <span>Copiar Link do Cliente</span>
          </button>

          <button
            type="button"
            onClick={() => onViewAsClient(client.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                : 'bg-white/5 hover:bg-white/10 text-[#eae8e3] border border-white/10'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#b58c56]" />
            <span>Visualizar como Cliente</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#b58c56] hover:bg-[#9d7644] transition-all shadow-md group"
          >
            <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Salvar Alterações</span>
          </button>

          <button
            type="button"
            onClick={() => onRequestDeleteClient(client)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
              isLight
                ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200/80'
                : 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20'
            }`}
            title={`Excluir cliente ${client.companyName}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Excluir</span>
          </button>
        </div>
      </div>

      {/* 2. Menu de Navegação Focada (Tabs para evitar sobrecarga de informação) */}
      <div className={`p-1.5 rounded-2xl border-2 ${isLight ? 'border-slate-300 bg-slate-100' : 'border-white/12 bg-[#12141a]'} flex flex-wrap items-center gap-1.5 text-xs font-medium`}>
        <button
          type="button"
          onClick={() => setActiveTab('resumo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'resumo'
              ? isLight
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'bg-white text-slate-950 shadow-md font-bold'
              : isLight
              ? 'text-slate-800 hover:text-black hover:bg-slate-200/80 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-white/10 font-semibold'
          }`}
        >
          <Clock className="w-4 h-4 text-[#b58c56]" />
          <span>Vigência & Alinhamento</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ferramentas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'ferramentas'
              ? isLight
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'bg-white text-slate-950 shadow-md font-bold'
              : isLight
              ? 'text-slate-800 hover:text-black hover:bg-slate-200/80 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-white/10 font-semibold'
          }`}
        >
          <Key className="w-4 h-4 text-[#b58c56]" />
          <span>Cofre de Ferramentas & Senhas</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
            activeTab === 'ferramentas'
              ? isLight ? 'bg-white/20 text-white' : 'bg-black/20 text-slate-900'
              : 'bg-[#b58c56]/20 text-[#734e1c] dark:text-[#dfc7a7]'
          }`}>
            {activeTools.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pendencias')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'pendencias'
              ? isLight
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'bg-white text-slate-950 shadow-md font-bold'
              : isLight
              ? 'text-slate-800 hover:text-black hover:bg-slate-200/80 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-white/10 font-semibold'
          }`}
        >
          <LayoutGrid className="w-4 h-4 text-[#b58c56]" />
          <span>Fluxo & Tarefas (Kanban CRM)</span>
          {actionItems.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === 'pendencias'
                ? isLight ? 'bg-white/20 text-white' : 'bg-black/20 text-slate-900'
                : 'bg-[#b58c56]/20 text-[#734e1c] dark:text-[#dfc7a7]'
            }`}>
              {actionItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'links'
              ? isLight
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'bg-white text-slate-950 shadow-md font-bold'
              : isLight
              ? 'text-slate-800 hover:text-black hover:bg-slate-200/80 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-white/10 font-semibold'
          }`}
        >
          <Share2 className="w-4 h-4 text-[#b58c56]" />
          <span>Central de Links & Drive</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visao-geral')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'visao-geral'
              ? isLight
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'bg-white text-slate-950 shadow-md font-bold'
              : isLight
              ? 'text-slate-800 hover:text-black hover:bg-slate-200/80 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-white/10 font-semibold'
          }`}
        >
          <Layers className="w-4 h-4 text-[#b58c56]" />
          <span>Exibir Tudo em Fluxo Contínuo</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: RESUMO DA SITUAÇÃO & MÉTRICAS
      ========================================================================== */}
      {(activeTab === 'resumo' || activeTab === 'visao-geral') && (
        <div className="space-y-8">
          {/* Gestão de Vigência */}
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6 transition-colors`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#b58c56]" />
                <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">1. Gestão de Vigência do Contrato</h3>
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Alimenta a barra de progresso no portal do cliente
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Data de Início da Parceria</label>
                <input
                  type="text"
                  value={contractStart}
                  onChange={e => setContractStart(e.target.value)}
                  placeholder="DD/MM/AAAA (Ex: 15/10/2024)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Data de Renovação Prevista</label>
                <input
                  type="text"
                  value={contractRenewal}
                  onChange={e => setContractRenewal(e.target.value)}
                  placeholder="DD/MM/AAAA (Ex: 15/10/2026)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Status do Contrato</label>
                <input
                  type="text"
                  value={contractStatus}
                  onChange={e => setContractStatus(e.target.value)}
                  placeholder="Ex: Contrato Vigente - Renovação em Out/2026"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Preview da Barra de Progresso */}
            <div className={`p-4 rounded-xl ${innerBg} space-y-2`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Pré-visualização do Progresso da Parceria:
                </span>
                <span className="font-mono text-[#b58c56] dark:text-[#dfc7a7] font-bold">
                  {progressPercent}% decorrido · {daysRemaining} dias restantes
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-300 dark:bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#b58c56] to-[#dfc7a7] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Segurança & Chave de Acesso do Cliente (PIN de 6 Dígitos) */}
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6 transition-colors border-2 ${isLight ? 'border-amber-200/80 bg-amber-50/20' : 'border-[#b58c56]/30 bg-[#161822]'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b58c56]/15 flex items-center justify-center text-[#b58c56] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Chave de Acesso do Cliente (PIN de 6 Dígitos)</h3>
                  <p className="text-xs text-slate-500">
                    Código de segurança exclusivo para {client.companyName} desbloquear o portal e o cofre de credenciais.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateNewPin}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                  title="Gerar novo código PIN aleatório"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#b58c56]" />
                  <span>Gerar Novo PIN</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyWhatsAppInvite}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#b58c56] hover:bg-[#9d7644] transition-all shadow-sm"
                  title="Copiar mensagem formatada para WhatsApp com link e PIN"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copiar Convite com PIN (WhatsApp)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              <div>
                <label className={labelClass}>Código PIN de Desbloqueio (6 Dígitos)</label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={10}
                    value={accessPin}
                    onChange={e => setAccessPin(e.target.value)}
                    placeholder="Ex: 839102"
                    className={`${inputClass} font-mono tracking-[0.25em] text-base font-bold pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Você pode editar manualmente ou clicar em &quot;Gerar Novo PIN&quot; e salvar as alterações.
                </span>
              </div>

              <div className={`p-4 rounded-xl ${innerBg} text-xs space-y-2`}>
                <span className="font-semibold text-slate-700 dark:text-slate-200 block">
                  🛡️ Como funciona a proteção em produção:
                </span>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Ao abrir o portal da <strong>{client.companyName}</strong>, uma tela elegante de cofre solicitará o PIN <strong>{accessPin}</strong>. Se o cliente esquecer, ele tem o botão de solicitar a você pelo WhatsApp, garantindo segurança total para o cofre de senhas e relatórios.
                </p>
              </div>
            </div>
          </div>

          {/* Resumo da Situação Atual & Próximos Passos */}
          <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6 transition-colors`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#b58c56]" />
                <h3 className="text-lg font-bold">2. Resumo da Situação Atual (Parecer do Gestor)</h3>
              </div>
              <span className="text-xs text-slate-500">
                Texto exibido em destaque na entrada do portal
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Status Atual & Direcionamento Estratégico (O que estamos fazendo agora)
                </label>
                <textarea
                  rows={3}
                  value={currentFocus}
                  onChange={e => setCurrentFocus(e.target.value)}
                  placeholder="Descreva de forma clara e humana o foco das otimizações..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Próximos Passos Imediatos da Equipe da Upsell
                </label>
                <textarea
                  rows={2}
                  value={nextSteps}
                  onChange={e => setNextSteps(e.target.value)}
                  placeholder="Ações planejadas para os próximos 7 a 15 dias..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: COFRE DE FERRAMENTAS & SENHAS (EDIÇÃO, EXCLUSÃO, DUPLICAÇÃO)
      ========================================================================== */}
      {(activeTab === 'ferramentas' || activeTab === 'visao-geral') && (
        <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-6 transition-colors`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-[#b58c56]" />
                <h3 className="text-lg font-bold">Cofre de Ferramentas, Hospedagem & Acessos</h3>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#8e8d96]'} mt-1`}>
                Centralize logins, senhas, hospedagens e links necessários para operar o tráfego da empresa.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingTool(!isAddingTool);
                  setEditingTool(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#b58c56] hover:bg-[#9d7644] transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingTool ? 'Fechar Formulário' : 'Adicionar Nova Ferramenta'}</span>
              </button>
            </div>
          </div>

          {/* Modelos Prontos de Preenchimento Rápido */}
          <div className={`p-4 rounded-xl ${innerBg} space-y-2.5`}>
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-[#8e8d96]'}`}>
              Atalhos de Cadastro Rápido (1 Clique para Preencher):
            </span>
            <div className="flex flex-wrap gap-2">
              {TOOL_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs'
                      : 'bg-white/5 hover:bg-white/10 text-[#eae8e3] border border-white/10'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#b58c56]" />
                  <span>{preset.name.split(' (')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FORMULÁRIO DE EDIÇÃO DE FERRAMENTA EXISTENTE */}
          {editingTool && (
            <form onSubmit={handleSaveEditTool} className={`p-6 rounded-2xl ${innerBg} space-y-4 border-2 border-[#b58c56] shadow-lg animate-fadeIn`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#b58c56]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b58c56]">
                    Editar Ferramenta: {editingTool.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Nome */}
                <div>
                  <label className={labelClass}>Nome da Ferramenta *</label>
                  <input
                    type="text"
                    required
                    value={editingTool.name}
                    onChange={e => setEditingTool({ ...editingTool, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className={labelClass}>Categoria</label>
                  <input
                    type="text"
                    value={editingTool.category}
                    onChange={e => setEditingTool({ ...editingTool, category: e.target.value })}
                    placeholder="Ex: Hospedagem & Servidor, Website & CMS..."
                    className={inputClass}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className={labelClass}>Status Operacional</label>
                  <select
                    value={editingTool.status}
                    onChange={e =>
                      setEditingTool({
                        ...editingTool,
                        status: e.target.value as 'Ativo / Vinculado' | 'Pendente de Acesso' | 'Em Configuração'
                      })
                    }
                    className={inputClass}
                  >
                    <option value="Ativo / Vinculado">Ativo / Vinculado</option>
                    <option value="Pendente de Acesso">Pendente de Acesso</option>
                    <option value="Em Configuração">Em Configuração</option>
                  </select>
                </div>

                {/* Link de Acesso com Teste */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Link / URL de Login</label>
                    {editingTool.accessUrl && (
                      <button
                        type="button"
                        onClick={() => handleTestLink(editingTool.accessUrl || '', editingTool.name)}
                        className="text-[11px] text-[#b58c56] hover:underline flex items-center gap-1 font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Testar Link</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={editingTool.accessUrl || ''}
                    onChange={e => setEditingTool({ ...editingTool, accessUrl: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {/* E-mail da Conta */}
                <div>
                  <label className={labelClass}>E-mail da Conta</label>
                  <input
                    type="text"
                    value={editingTool.accountEmail}
                    onChange={e => setEditingTool({ ...editingTool, accountEmail: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {/* Usuário / Login */}
                <div>
                  <label className={labelClass}>Usuário / Login</label>
                  <input
                    type="text"
                    value={editingTool.loginUser || ''}
                    onChange={e => setEditingTool({ ...editingTool, loginUser: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {/* Senha com Gerador */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Senha de Acesso</label>
                    <button
                      type="button"
                      onClick={() => setEditingTool({ ...editingTool, password: generateStrongPassword() })}
                      className="text-[11px] text-[#b58c56] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Gerar Senha Segura</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingTool.password || ''}
                    onChange={e => setEditingTool({ ...editingTool, password: e.target.value })}
                    className={`${inputClass} font-mono`}
                  />
                </div>

                {/* Observações Técnicas */}
                <div className="sm:col-span-3">
                  <label className={labelClass}>Notas Técnicas & Observações</label>
                  <input
                    type="text"
                    value={editingTool.detail}
                    onChange={e => setEditingTool({ ...editingTool, detail: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#b58c56] hover:bg-[#9d7644] transition-all shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Alterações da Ferramenta</span>
                </button>
              </div>
            </form>
          )}

          {/* FORMULÁRIO DE ADIÇÃO DE NOVA FERRAMENTA */}
          {isAddingTool && !editingTool && (
            <form onSubmit={handleAddTool} className={`p-6 rounded-2xl ${innerBg} space-y-4 border-2 border-[#b58c56]/40 animate-fadeIn`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#b58c56]">
                  Nova Ferramenta ou Hospedagem de Site
                </span>
                <span className="text-[11px] text-slate-500">
                  Preencha os dados e clique em Cadastrar
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Nome */}
                <div>
                  <label className={labelClass}>Nome da Ferramenta *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Hospedagem Hostinger, Cloudflare..."
                    value={newToolName}
                    onChange={e => setNewToolName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className={labelClass}>Categoria</label>
                  <input
                    type="text"
                    placeholder="Ex: Hospedagem & Servidor, Website & CMS..."
                    value={newToolCategory}
                    onChange={e => setNewToolCategory(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className={labelClass}>Status Operacional</label>
                  <select
                    value={newToolStatus}
                    onChange={e =>
                      setNewToolStatus(e.target.value as 'Ativo / Vinculado' | 'Pendente de Acesso' | 'Em Configuração')
                    }
                    className={inputClass}
                  >
                    <option value="Ativo / Vinculado">Ativo / Vinculado</option>
                    <option value="Pendente de Acesso">Pendente de Acesso</option>
                    <option value="Em Configuração">Em Configuração</option>
                  </select>
                </div>

                {/* Link de Acesso / Login */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Link / URL de Login</label>
                    {newToolUrl && (
                      <button
                        type="button"
                        onClick={() => handleTestLink(newToolUrl, newToolName)}
                        className="text-[11px] text-[#b58c56] hover:underline flex items-center gap-1 font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Testar Link</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://hpanel.hostinger.com ou https://site.com/wp-admin"
                    value={newToolUrl}
                    onChange={e => setNewToolUrl(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* E-mail da Conta */}
                <div>
                  <label className={labelClass}>E-mail da Conta</label>
                  <input
                    type="text"
                    placeholder="contato@empresa.com.br"
                    value={newToolEmail}
                    onChange={e => setNewToolEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Login / Usuário */}
                <div>
                  <label className={labelClass}>Usuário / Login (se aplicável)</label>
                  <input
                    type="text"
                    placeholder="adm_servidor ou admin"
                    value={newToolLogin}
                    onChange={e => setNewToolLogin(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Senha com Gerador */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Senha de Acesso</label>
                    <button
                      type="button"
                      onClick={() => setNewToolPassword(generateStrongPassword())}
                      className="text-[11px] text-[#b58c56] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Gerar Senha Segura</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Digite ou clique em 'Gerar Senha Segura'"
                      value={newToolPassword}
                      onChange={e => setNewToolPassword(e.target.value)}
                      className={`${inputClass} font-mono`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Observações Técnicas */}
                <div className="sm:col-span-3">
                  <label className={labelClass}>Notas Técnicas & Observações</label>
                  <input
                    type="text"
                    placeholder="Ex: Servidor Cloud Hostinger, PHP 8.3, 2FA no WhatsApp do cliente..."
                    value={newToolDetail}
                    onChange={e => setNewToolDetail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddingTool(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#b58c56] hover:bg-[#9d7644] transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Ferramenta</span>
                </button>
              </div>
            </form>
          )}

          {/* Barra de Busca e Filtro de Categorias */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por ferramenta, login, email ou hospedagem..."
                value={toolSearch}
                onChange={e => setToolSearch(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
              {['Todas', 'Hospedagem', 'Tráfego', 'Analytics', 'Website'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setToolCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                    toolCategoryFilter === cat
                      ? isLight
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-900'
                      : isLight
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-white/5 text-[#9d9ba7] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Ferramentas & Credenciais Cadastradas com EDIÇÃO E EXCLUSÃO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTools.length === 0 ? (
              <div className={`col-span-2 p-8 text-center rounded-2xl ${innerBg}`}>
                <Key className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Nenhuma ferramenta encontrada</p>
                <p className="text-xs text-slate-400 mt-1">
                  Adicione uma nova ferramenta ou limpe o filtro de busca.
                </p>
              </div>
            ) : (
              filteredTools.map(tool => {
                const isPasswordVisible = visiblePasswords[tool.id] || false;
                const isDeleting = confirmDeleteToolId === tool.id;

                return (
                  <div
                    key={tool.id}
                    className={`p-5 rounded-2xl ${innerBg} transition-all space-y-4 hover:border-[#b58c56]/40 relative`}
                  >
                    {/* Header do Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm">
                            {tool.name}
                          </span>
                          {tool.accessUrl && (
                            <button
                              type="button"
                              onClick={() => handleTestLink(tool.accessUrl || '', tool.name)}
                              className="text-slate-400 hover:text-[#b58c56] transition-colors p-1 rounded"
                              title="Abrir painel em nova aba"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>{tool.category}</span>
                          <span>·</span>
                          <span className="truncate max-w-[180px]">{tool.accountEmail}</span>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <select
                        value={tool.status}
                        onChange={e =>
                          updateToolStatus(
                            tool.id,
                            e.target.value as 'Ativo / Vinculado' | 'Pendente de Acesso' | 'Em Configuração'
                          )
                        }
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          tool.status === 'Ativo / Vinculado'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : tool.status === 'Pendente de Acesso'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}
                      >
                        <option value="Ativo / Vinculado">Ativo / Vinculado</option>
                        <option value="Pendente de Acesso">Pendente de Acesso</option>
                        <option value="Em Configuração">Em Configuração</option>
                      </select>
                    </div>

                    {/* Bloco de Credenciais (E-mail, Login, Senha e Link) */}
                    <div className={`p-3.5 rounded-xl ${isLight ? 'bg-white border border-slate-200/90' : 'bg-[#12141a] border border-white/5'} space-y-2 text-xs`}>
                      {/* E-mail */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">E-mail:</span>
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="truncate max-w-[190px]">{tool.accountEmail}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(tool.accountEmail, `${tool.id}-email`, 'E-mail')}
                            className="text-slate-400 hover:text-[#b58c56] p-0.5"
                            title="Copiar e-mail"
                          >
                            {copiedKey === `${tool.id}-email` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Login / Usuário */}
                      {tool.loginUser && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-500 font-medium">Usuário / Login:</span>
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{tool.loginUser}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(tool.loginUser || '', `${tool.id}-login`, 'Login')}
                              className="text-slate-400 hover:text-[#b58c56] p-0.5"
                              title="Copiar usuário"
                            >
                              {copiedKey === `${tool.id}-login` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Senha */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#b58c56]" />
                          Senha:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                            {tool.password
                              ? isPasswordVisible
                                ? tool.password
                                : '••••••••••••'
                              : 'Não cadastrada'}
                          </span>

                          {tool.password && (
                            <>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(tool.id)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5"
                                title={isPasswordVisible ? 'Ocultar senha' : 'Ver senha'}
                              >
                                {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#b58c56]" />}
                              </button>

                              <button
                                type="button"
                                onClick={() => copyToClipboard(tool.password || '', `${tool.id}-pass`, 'Senha')}
                                className="text-slate-400 hover:text-[#b58c56] p-0.5"
                                title="Copiar senha"
                              >
                                {copiedKey === `${tool.id}-pass` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Link de Acesso direto */}
                      {tool.accessUrl && (
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
                          <span className="text-[11px] text-slate-500 font-medium">Link do Painel:</span>
                          <button
                            type="button"
                            onClick={() => handleTestLink(tool.accessUrl || '', tool.name)}
                            className="text-[11px] font-medium text-[#b58c56] hover:underline flex items-center gap-1 truncate max-w-[220px]"
                          >
                            <span>Acessar Painel</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Detalhes Técnicos */}
                    <div className="text-[11px] text-slate-500">
                      <span className="truncate block">
                        {tool.detail || 'Gerenciado pela Upsell'}
                      </span>
                    </div>

                    {/* AÇÕES DA FERRAMENTA: EDITAR, DUPLICAR, EXCLUIR */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        {/* Botão Editar Ferramenta */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTool(tool);
                            setIsAddingTool(false);
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            isLight
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-white/5 hover:bg-white/10 text-slate-200'
                          }`}
                        >
                          <Edit3 className="w-3 h-3 text-[#b58c56]" />
                          <span>Editar</span>
                        </button>

                        {/* Botão Duplicar Ferramenta */}
                        <button
                          type="button"
                          onClick={() => duplicateTool(tool)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                            isLight
                              ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          }`}
                          title="Duplicar esta ferramenta para criar outra parecida"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Duplicar</span>
                        </button>
                      </div>

                      {/* Excluir Ferramenta com Diálogo de Confirmação */}
                      {isDeleting ? (
                        <div className="flex items-center gap-1.5 animate-fadeIn">
                          <span className="text-[10px] text-rose-600 font-semibold">Excluir?</span>
                          <button
                            type="button"
                            onClick={() => deleteTool(tool.id)}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white hover:bg-rose-700"
                          >
                            Sim
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteToolId(null)}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-700 hover:bg-slate-300"
                          >
                            Não
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteToolId(tool.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded"
                          title="Remover ferramenta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: FLUXO DE TAREFAS & CRM KANBAN (MINHAS TAREFAS & DEMANDAS DO CLIENTE)
      ========================================================================== */}
      {(activeTab === 'pendencias' || activeTab === 'visao-geral') && (
        <div className="space-y-4">
          <TaskKanban
            tasks={actionItems}
            onUpdateTasks={updated => {
              setActionItems(updated);
              onUpdateClient(client.id, { actionItems: updated });
            }}
            isAdmin={true}
            clientName={client.companyName}
            isLight={isLight}
            showToast={showToast}
            defaultAssigneeFilter="all"
          />
        </div>
      )}

      {/* =========================================================================
          TAB 4: CENTRAL DE DOCUMENTOS, PASTAS DE CRIATIVOS & ANÁLISE DE RESULTADOS
      ========================================================================== */}
      {(activeTab === 'links' || activeTab === 'visao-geral') && (
        <div className={`p-6 sm:p-8 rounded-2xl ${cardBg} space-y-8 transition-colors`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2.5">
                <Share2 className="w-5 h-5 text-[#b58c56]" />
                <h3 className="text-lg font-bold">Central de Documentos & Repositórios</h3>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#8e8d96]'} mt-1`}>
                Gerencie os links individuais das pastas de criativos (copys, vídeos, imagens), análise de resultados e arquivos oficiais.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#b58c56] hover:bg-[#9d7644] transition-all shadow-sm shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Links</span>
            </button>
          </div>

          {/* BLOCO 1: PASTAS DE CRIATIVOS ORGANIZADAS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#b58c56] bg-[#b58c56]/10 px-2.5 py-0.5 rounded-full">
                Pastas de Criativos
              </span>
              <span className="text-xs text-slate-400">
                Segmentadas por formato para visualização no Portal do Cliente
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* 1.1 Pasta de Copys & Roteiros */}
              <div className={`p-5 rounded-xl ${innerBg} space-y-3`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#b58c56]" />
                    Pasta de Copys & Roteiros
                  </span>
                  {creativeCopies ? (
                    <button
                      type="button"
                      onClick={() => handleTestLink(creativeCopies, 'Pasta de Copys')}
                      className="text-[11px] text-[#b58c56] hover:underline flex items-center gap-1"
                      title="Testar link em nova aba"
                    >
                      <span>Testar</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">Pendente</span>
                  )}
                </div>
                <input
                  type="text"
                  value={creativeCopies}
                  onChange={e => setCreativeCopies(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/copys..."
                  className={inputClass}
                />
                <span className="text-[11px] text-slate-500 block">
                  Briefings textuais, roteiros de gravação e copys validadas
                </span>
              </div>

              {/* 1.2 Pasta de Criativos em Vídeo */}
              <div className={`p-5 rounded-xl ${innerBg} space-y-3`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#b58c56]" />
                    Criativos de Vídeo (Reels & Ads)
                  </span>
                  {creativeVideos ? (
                    <button
                      type="button"
                      onClick={() => handleTestLink(creativeVideos, 'Pasta de Vídeos')}
                      className="text-[11px] text-[#b58c56] hover:underline flex items-center gap-1"
                      title="Testar link em nova aba"
                    >
                      <span>Testar</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">Pendente</span>
                  )}
                </div>
                <input
                  type="text"
                  value={creativeVideos}
                  onChange={e => setCreativeVideos(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/videos..."
                  className={inputClass}
                />
                <span className="text-[11px] text-slate-500 block">
                  Vídeos brutos e editados em 9:16 (Reels/TikTok) e 16:9
                </span>
              </div>

              {/* 1.3 Pasta de Criativos em Imagem */}
              <div className={`p-5 rounded-xl ${innerBg} space-y-3`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#b58c56]" />
                    Criativos em Imagem & Banners
                  </span>
                  {creativeImages ? (
                    <button
                      type="button"
                      onClick={() => handleTestLink(creativeImages, 'Pasta de Imagens')}
                      className="text-[11px] text-[#b58c56] hover:underline flex items-center gap-1"
                      title="Testar link em nova aba"
                    >
                      <span>Testar</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">Pendente</span>
                  )}
                </div>
                <input
                  type="text"
                  value={creativeImages}
                  onChange={e => setCreativeImages(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/imagens..."
                  className={inputClass}
                />
                <span className="text-[11px] text-slate-500 block">
                  Artes estáticas, carrosséis para feed e banners display
                </span>
              </div>
            </div>
          </div>

          {/* BLOCO 2: ANÁLISE DE RESULTADOS & DOCUMENTOS OFICIAIS */}
          <div className="space-y-4 pt-2 border-t border-slate-200/60 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#b58c56] bg-[#b58c56]/10 px-2.5 py-0.5 rounded-full">
                Análise de Resultados & Documentação
              </span>
              <span className="text-xs text-slate-400">
                Looker Studio, Contrato Formal e Repositório Raiz
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* 2.1 Análise de Resultados (Looker Studio) */}
              <div className={`p-5 rounded-xl ${innerBg} space-y-3`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#b58c56]" />
                    Análise de Resultados (Looker Studio)
                  </span>
                  {lookerStudio ? (
                    <button
                      type="button"
                      onClick={() => handleTestLink(lookerStudio, 'Análise de Resultados')}
                      className="text-[11px] text-[#b58c56] hover:underline flex items-center gap-1"
                      title="Testar link em nova aba"
                    >
                      <span>Testar</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">Pendente</span>
                  )}
                </div>
                <input
                  type="text"
                  value={lookerStudio}
                  onChange={e => setLookerStudio(e.target.value)}
                  placeholder="https://lookerstudio.google.com/reporting/..."
                  className={inputClass}
                />
                <span className="text-[11px] text-slate-500 block">
                  Painel de performance com ROAS, CPA e conversões
                </span>
              </div>

              {/* 2.2 Contrato Oficial PDF */}
              <div className={`p-5 rounded-xl ${innerBg} space-y-3`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-[#b58c56]" />
                    Contrato Oficial de Parceria
                  </span>
                  {contractPdf ? (
                    <button
                      type="button"
                      onClick={() => handleTestLink(contractPdf, 'Contrato Oficial')}
                      className="text-[11px] text-[#b58c56] hover:underline flex items-center gap-1"
                      title="Testar link em nova aba"
                    >
                      <span>Testar</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">Pendente</span>
                  )}
                </div>
                <input
                  type="text"
                  value={contractPdf}
                  onChange={e => setContractPdf(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... ou URL do PDF"
                  className={inputClass}
                />
                <span className="text-[11px] text-slate-500 block">
                  Documento formal assinado com escopo e vigência
                </span>
              </div>

              {/* 2.3 Repositório Geral no Google Drive */}
              <div className={`p-5 rounded-xl ${innerBg} space-y-3`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-[#b58c56]" />
                    Repositório Geral Raiz (Drive)
                  </span>
                  {googleDrive ? (
                    <button
                      type="button"
                      onClick={() => handleTestLink(googleDrive, 'Repositório Geral Drive')}
                      className="text-[11px] text-[#b58c56] hover:underline flex items-center gap-1"
                      title="Testar link em nova aba"
                    >
                      <span>Testar</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">Pendente</span>
                  )}
                </div>
                <input
                  type="text"
                  value={googleDrive}
                  onChange={e => setGoogleDrive(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className={inputClass}
                />
                <span className="text-[11px] text-slate-500 block">
                  Pasta raiz no Drive com todas as pastas sincronizadas
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zona de Gerenciamento da Conta (Exclusão Segura de Cliente) */}
      <div className={`p-5 rounded-2xl ${innerBg} flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs transition-colors`}>
        <div className="space-y-1">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Zona de Risco: Excluir Cliente</span>
          </span>
          <p className="text-[11px] text-slate-500">
            Remove permanentemente os dados, histórico, credenciais e métricas de <strong>{client.companyName}</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRequestDeleteClient(client)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-300 dark:border-rose-500/30 transition-all shrink-0 shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Excluir {client.companyName}</span>
        </button>
      </div>

      {/* Botão Flutuante de Salvar Sempre Acessível */}
      <div className="sticky bottom-6 z-20 flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          className="flex items-center gap-2.5 px-7 py-3 rounded-2xl text-xs font-bold text-white bg-[#b58c56] hover:bg-[#9d7644] transition-all shadow-xl group border border-white/20"
        >
          <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Salvar Todas as Alterações</span>
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
    deleteClient: storeDeleteClient,
    resetClientPin,
    dismissPinResetRequest
  } = useUpsellStore();
  const isLight = theme === 'light';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isManageClientsModalOpen, setIsManageClientsModalOpen] = useState(false);
  const [isAgencyTasksModalOpen, setIsAgencyTasksModalOpen] = useState(false);
  const [agencyModalClientFilter, setAgencyModalClientFilter] = useState<string>('all');
  const [agencyModalPriorityFilter, setAgencyModalPriorityFilter] = useState<string>('all');
  const [clientToDelete, setClientToDelete] = useState<ClientProfile | null>(null);

  // Clientes com solicitação de recuperação de senha/PIN pendente
  const pendingPinRequests = useMemo(() => {
    return clients.filter(c => c.pinResetRequested);
  }, [clients]);

  const handleInstantResetAndSendPin = (c: ClientProfile) => {
    const newPin = resetClientPin(c.id);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const clientUrl = `${origin}/?cliente=${c.id}`;
    const text = encodeURIComponent(
      `Olá ${c.responsibleName}! 👋\n\nSua nova chave de acesso (PIN) ao Portal da *${c.companyName}* na UpSell foi gerada:\n\n🔑 Novo PIN: *${newPin}*\n👉 Acesse o portal: ${clientUrl}\n\nGuarde esta chave com você para consultar relatórios em tempo real e entregas da agência.`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511987654321&text=${text}`, '_blank');
    showToast(`Novo PIN ${newPin} gerado e salvo para ${c.companyName}!`);
  };

  const handleDismissPinRequest = (clientId: string, companyName: string) => {
    dismissPinResetRequest(clientId);
    showToast(`Alerta de recuperação de ${companyName} finalizado.`);
  };

  // Compute all tasks across all clients that belong to the Agency
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

  const pendingAgencyTasks = useMemo(() => {
    return allAgencyTasks.filter(item => item.task.status !== 'completed');
  }, [allAgencyTasks]);

  const handleUpdateTaskStatusFromGlobal = (clientId: string, taskId: string, nextStatus: any) => {
    const targetClient = clients.find(c => c.id === clientId);
    if (!targetClient) return;
    const updatedTasks = (targetClient.actionItems || []).map(t =>
      t.id === taskId ? { ...t, status: nextStatus } : t
    );
    onUpdateClient(clientId, { actionItems: updatedTasks });
    showToast('Status da tarefa atualizado com sucesso!');
  };

  // Form for New Client
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newSegment, setNewSegment] = useState('');
  const [newResponsible, setNewResponsible] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleConfirmDeleteClient = (clientId: string, clientName: string) => {
    const deleteFn = onDeleteClient || storeDeleteClient;
    deleteFn(clientId);
    const remaining = clients.filter(c => c.id !== clientId);
    if (remaining.length > 0 && selectedClientId === clientId) {
      onSelectClient(remaining[0].id);
    }
    setClientToDelete(null);
    setIsManageClientsModalOpen(false);
    showToast(`Cliente "${clientName}" excluído com sucesso!`);
  };

  const handleCreateNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) {
      showToast('O nome da empresa é obrigatório.');
      return;
    }
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
    showToast(`Novo cliente "${newProfile.companyName}" cadastrado com sucesso!`);
  };

  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isLight
          ? 'bg-[#f8fafc] text-[#0f172a] selection:bg-[#b58c56]/20'
          : 'bg-[#090a0f] text-white selection:bg-[#c8a97e]/30'
      }`}
    >
      {/* 1. SELETOR DE CLIENTE NA BARRA SUPERIOR & CONTROLES DE TEMA */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md px-6 sm:px-12 py-3.5 transition-colors border-b-2 ${
          isLight ? 'bg-white/95 border-slate-300 shadow-xs' : 'bg-[#090a0f]/95 border-white/15'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Brand & Client Selector */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="font-bold tracking-[0.25em] text-sm uppercase text-[#b58c56] dark:text-[#dfc7a7]">
              UPSELL
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-bold">/</span>
            <span className={`text-xs font-bold ${isLight ? 'text-[#0f172a]' : 'text-slate-200'}`}>
              Console do Gestor
            </span>

            <div className={`hidden sm:block h-3.5 w-px ${isLight ? 'bg-slate-300' : 'bg-white/15'}`} />

            {/* Client Selector Dropdown */}
            <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 border-2 transition-colors ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#181a24] border-white/20'
            }`}>
              <Building2 className="w-3.5 h-3.5 text-[#b58c56]" />
              <select
                value={currentClient.id}
                onChange={e => onSelectClient(e.target.value)}
                className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id} className={isLight ? 'bg-white text-slate-900' : 'bg-[#181a24] text-white'}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Botão + Novo Cliente */}
            <button
              type="button"
              onClick={() => setIsAddClientModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#734e1c] dark:text-[#dfc7a7] bg-[#b58c56]/15 hover:bg-[#b58c56]/25 transition-all border-2 border-[#b58c56]/40"
              title="Cadastrar uma nova empresa parceira"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Novo Cliente</span>
            </button>

            {/* Botão Gerenciar Clientes (Lista com Exclusão e Troca Rápida) */}
            <button
              type="button"
              onClick={() => setIsManageClientsModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  : 'bg-[#181a24] hover:bg-[#222533] text-white border-white/20'
              }`}
              title="Ver e gerenciar todos os clientes cadastrados"
            >
              <Users className="w-3.5 h-3.5 text-[#b58c56]" />
              <span className="hidden sm:inline">Gerenciar Clientes</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                isLight ? 'bg-slate-200 text-slate-900' : 'bg-white/10 text-[#dfc7a7]'
              }`}>
                {clients.length}
              </span>
            </button>

            {/* Botão Central de Minhas Tarefas da Agência (Global across clients) */}
            <button
              type="button"
              onClick={() => setIsAgencyTasksModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                isLight
                  ? 'bg-amber-100 hover:bg-amber-200/80 text-amber-950 border-amber-300 shadow-2xs'
                  : 'bg-[#b58c56]/20 hover:bg-[#b58c56]/30 text-[#dfc7a7] border-[#b58c56]/50'
              }`}
              title="Visualizar todas as tarefas atribuídas à equipe UpSell em todas as contas"
            >
              <Zap className="w-3.5 h-3.5 text-[#b58c56]" />
              <span className="hidden sm:inline">Minhas Tarefas (UpSell)</span>
              <span className="sm:hidden">Minhas Tarefas</span>
              {pendingAgencyTasks.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[#b58c56] text-white">
                  {pendingAgencyTasks.length}
                </span>
              )}
            </button>

            {/* Alerta de Solicitação de Recuperação de Senha/PIN */}
            {pendingPinRequests.length > 0 && (
              <button
                type="button"
                onClick={() => setIsManageClientsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-950 dark:text-amber-200 bg-amber-200 dark:bg-amber-500/25 hover:bg-amber-300 border-2 border-amber-400 dark:border-amber-500/50 transition-all animate-pulse shadow-sm"
                title={`${pendingPinRequests.length} solicitação(ões) de recuperação de PIN`}
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{pendingPinRequests.length} Reset de PIN</span>
              </button>
            )}
          </div>

          {/* Right Action Buttons: Theme Toggle, View As Client, Reset, Logout */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isLight ? 'Alternar para Modo Noturno' : 'Alternar para Modo Claro Arejado'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  : 'bg-[#181a24] hover:bg-[#222533] text-white border-white/20'
              }`}
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#b58c56]" />
                  <span>Modo Noturno</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#dfc7a7]" />
                  <span>Modo Claro</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onViewAsClient(currentClient.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  : 'bg-[#181a24] hover:bg-[#222533] text-white border-white/20'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#b58c56]" />
              <span>Ver como Cliente</span>
            </button>

            <button
              type="button"
              onClick={onResetDefault}
              title="Restaurar dados de demonstração originais"
              className={`p-2 rounded-xl text-xs transition-colors ${
                isLight ? 'text-slate-600 hover:bg-slate-200 text-slate-900' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isLight ? 'text-slate-700 hover:text-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 sm:pt-10">
        {/* Banner de Solicitações Pendentes de Redefinição de PIN */}
        {pendingPinRequests.length > 0 && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#b58c56]/15 to-amber-500/10 border border-amber-500/40 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-black mt-0.5 sm:mt-0 shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm block text-amber-900 dark:text-amber-200">
                    {pendingPinRequests.length} Solicitação de Recuperação de Acesso Pendente
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    O cliente esqueceu a senha ou PIN. Você pode gerar uma nova chave de 6 dígitos e disparar mensagem oficial com 1 clique.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {pendingPinRequests.map(reqClient => (
                  <div key={reqClient.id} className="flex items-center gap-2 p-1.5 rounded-xl bg-black/20 border border-white/10">
                    <span className="text-xs font-semibold px-2 text-[#eae8e3]">
                      {reqClient.companyName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleInstantResetAndSendPin(reqClient)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-[#c8a97e] hover:bg-[#dfc7a7] transition-all flex items-center gap-1.5 shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Gerar PIN & Enviar WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismissPinRequest(reqClient.id, reqClient.companyName)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                      title="Dispensar aviso"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <ClientEditor
          key={currentClient.id}
          client={currentClient}
          onUpdateClient={onUpdateClient}
          onViewAsClient={onViewAsClient}
          onRequestDeleteClient={(c) => setClientToDelete(c)}
          canDeleteClient={clients.length > 1}
          showToast={showToast}
          isLight={isLight}
        />
      </main>

      {/* MODAL DE CADASTRO DE NOVO CLIENTE */}
      {isAddClientModalOpen && (
        <div
          onClick={() => setIsAddClientModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl border ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#151720] border-white/10 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-[#b58c56]" />
                <h3 className="text-lg font-bold">Cadastrar Novo Cliente</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddClientModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Nome da Empresa / Clínica *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Clínica São Lucas, Lumina Odontologia..."
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#101217] border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Segmento de Atuação
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cirurgia Plástica, Dermatologia, B2B SaaS..."
                  value={newSegment}
                  onChange={e => setNewSegment(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#101217] border-white/10 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Nome do Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dra. Mariana Costa"
                    value={newResponsible}
                    onChange={e => setNewResponsible(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#101217] border-white/10 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    E-mail Institucional
                  </label>
                  <input
                    type="email"
                    placeholder="contato@empresa.com.br"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#101217] border-white/10 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#b58c56] hover:bg-[#9d7644] transition-all shadow-md"
                >
                  Criar Conta do Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE GERENCIAMENTO GERAL DE TODOS OS CLIENTES */}
      {isManageClientsModalOpen && (
        <div
          onClick={() => setIsManageClientsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-2xl max-h-[85vh] flex flex-col p-6 sm:p-7 rounded-2xl shadow-2xl border ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#151720] border-white/10 text-white'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-[#b58c56]" />
                <h3 className="text-base sm:text-lg font-bold">
                  Gerenciar Clientes Cadastrados ({clients.length})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsManageClientsModalOpen(false);
                    setIsAddClientModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#b58c56] bg-[#b58c56]/10 hover:bg-[#b58c56]/20 transition-all border border-[#b58c56]/30"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Novo Cliente</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsManageClientsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lista de Clientes */}
            <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
              {clients.map(c => {
                const isSelected = c.id === currentClient.id;
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? isLight
                          ? 'bg-amber-50/60 border-[#b58c56]/60 shadow-sm'
                          : 'bg-[#1f2230] border-[#b58c56]/60'
                        : isLight
                        ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                        : 'bg-[#1a1d26] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm">{c.companyName}</span>
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#b58c56] text-white">
                            Em Edição
                          </span>
                        )}
                        {c.pinResetRequested && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-500 border border-amber-500/40 animate-pulse">
                            ⚠️ Solicitou Reset de PIN
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono">{c.email}</span>
                        <span>·</span>
                        <span>Resp: {c.responsibleName}</span>
                        <span>·</span>
                        <span className="font-mono font-bold text-[#b58c56] bg-[#b58c56]/10 px-1.5 py-0.5 rounded">
                          PIN: {c.accessPin || '839102'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-center">
                      {c.pinResetRequested ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantResetAndSendPin(c);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-[#c8a97e] hover:bg-[#dfc7a7] transition-all shadow"
                          title="Gerar novo PIN e abrir WhatsApp com mensagem pronta"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Atender & Enviar PIN</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantResetAndSendPin(c);
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isLight
                              ? 'bg-amber-100/70 hover:bg-amber-200 text-amber-900'
                              : 'bg-white/5 hover:bg-white/10 text-amber-300'
                          }`}
                          title="Gerar novo PIN e enviar no WhatsApp"
                        >
                          <KeyRound className="w-3 h-3 text-[#b58c56]" />
                          <span>Redefinir</span>
                        </button>
                      )}

                      {!isSelected && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectClient(c.id);
                            setIsManageClientsModalOpen(false);
                            showToast(`Alternado para ${c.companyName}.`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isLight
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                        >
                          Selecionar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onViewAsClient(c.id);
                          setIsManageClientsModalOpen(false);
                        }}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isLight
                            ? 'text-slate-600 hover:bg-slate-200'
                            : 'text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                        title="Visualizar portal deste cliente"
                      >
                        <Eye className="w-4 h-4 text-[#b58c56]" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const origin = typeof window !== 'undefined' ? window.location.origin : '';
                          const clientUrl = `${origin}/?cliente=${c.id}`;
                          const text = `Olá ${c.responsibleName}! 👋\n\nSegue o link exclusivo para acompanhar o Portal da sua empresa na UpSell:\n👉 ${clientUrl}\n\n🔑 Sua chave de acesso pessoal (PIN): *${c.accessPin || '839102'}*`;
                          if (navigator?.clipboard?.writeText) {
                            navigator.clipboard.writeText(text);
                          }
                          showToast(`Dados de acesso de ${c.companyName} copiados!`);
                        }}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isLight
                            ? 'text-slate-600 hover:bg-slate-200'
                            : 'text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                        title="Copiar convite com PIN para WhatsApp"
                      >
                        <Share2 className="w-4 h-4 text-[#b58c56]" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setClientToDelete(c);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 border border-rose-300 dark:border-rose-500/30 transition-colors"
                        title="Excluir este cliente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500">
              <span>{clients.length} empresas gerenciadas no sistema</span>
              <button
                type="button"
                onClick={() => setIsManageClientsModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE CLIENTE (100% IN-APP, SEM WINDOW.CONFIRM) */}
      {clientToDelete && (
        <div
          onClick={() => setClientToDelete(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-md p-6 sm:p-7 rounded-2xl shadow-2xl border ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#151720] border-white/10 text-white'
            }`}
          >
            {/* Header com ícone de alerta */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Excluir Cliente
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Você está prestes a remover o cliente:
                </p>
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  {clientToDelete.companyName}
                </p>
              </div>
            </div>

            {/* Detalhes do que será removido */}
            <div className="py-4 space-y-3">
              <div className={`p-3 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200/80' : 'bg-[#1a1d26] border border-white/5'} text-xs space-y-2`}>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Segmento:</span>
                  <span className="font-semibold">{clientToDelete.segment}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Responsável:</span>
                  <span className="font-semibold">{clientToDelete.responsibleName}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Credenciais no Cofre:</span>
                  <span className="font-semibold text-[#b58c56]">{clientToDelete.activeTools?.length || 0} cadastradas</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Tarefas Registradas:</span>
                  <span className="font-semibold text-amber-600">{clientToDelete.actionItems?.length || 0} pendências</span>
                </div>
              </div>

              {clients.length <= 1 ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <strong>Atenção:</strong> Este é o único cliente ativo no momento. Ao confirmar a exclusão, todos os seus dados serão removidos e o sistema iniciará uma conta limpa em branco para que você possa continuar cadastrando seus novos projetos.
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Esta ação é irreversível e removerá todos os dados, credenciais, links, tarefas e métricas de <strong>{clientToDelete.companyName}</strong> tanto localmente quanto no Firebase Firestore.
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setClientToDelete(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => handleConfirmDeleteClient(clientToDelete.id, clientToDelete.companyName)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md bg-rose-600 hover:bg-rose-700 hover:shadow-rose-600/25 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirmar Exclusão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CENTRAL DE MINHAS TAREFAS (AGÊNCIA UPSELL EM TODAS AS CONTAS) */}
      {isAgencyTasksModalOpen && (
        <div
          onClick={() => setIsAgencyTasksModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-3xl max-h-[88vh] flex flex-col p-6 sm:p-7 rounded-3xl shadow-2xl border ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#151720] border-white/10 text-white'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#b58c56]/15 flex items-center justify-center text-[#b58c56]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight">
                    Minhas Tarefas & Entregas (Central UpSell)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Visão unificada das demandas operacionais sob responsabilidade da agência
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAgencyTasksModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Sub-bar inside Modal */}
            <div className="py-3.5 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Filtrar por Cliente:</span>
                <select
                  value={agencyModalClientFilter}
                  onChange={e => setAgencyModalClientFilter(e.target.value)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#1a1d26] border-white/10 text-slate-200'
                  }`}
                >
                  <option value="all">Todos os Clientes ({allAgencyTasks.length})</option>
                  {clients.map(c => {
                    const clientAgencyCount = allAgencyTasks.filter(item => item.client.id === c.id).length;
                    return (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({clientAgencyCount})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Prioridade:</span>
                <select
                  value={agencyModalPriorityFilter}
                  onChange={e => setAgencyModalPriorityFilter(e.target.value)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#1a1d26] border-white/10 text-slate-200'
                  }`}
                >
                  <option value="all">Todas as Prioridades</option>
                  <option value="high">🔴 Alta Prioridade</option>
                  <option value="medium">🟡 Média Prioridade</option>
                  <option value="low">🔵 Baixa Prioridade</option>
                </select>
              </div>
            </div>

            {/* Tasks List */}
            <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
              {allAgencyTasks
                .filter(item => {
                  if (agencyModalClientFilter !== 'all' && item.client.id !== agencyModalClientFilter) {
                    return false;
                  }
                  if (agencyModalPriorityFilter !== 'all' && item.task.priority !== agencyModalPriorityFilter) {
                    return false;
                  }
                  return true;
                })
                .length === 0 ? (
                <div className={`p-8 text-center rounded-2xl ${isLight ? 'bg-slate-50' : 'bg-[#1a1d26]'}`}>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Tudo em dia!</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Nenhuma tarefa operacional pendente da agência com os filtros selecionados.
                  </p>
                </div>
              ) : (
                allAgencyTasks
                  .filter(item => {
                    if (agencyModalClientFilter !== 'all' && item.client.id !== agencyModalClientFilter) {
                      return false;
                    }
                    if (agencyModalPriorityFilter !== 'all' && item.task.priority !== agencyModalPriorityFilter) {
                      return false;
                    }
                    return true;
                  })
                  .map(({ client: c, task: t }) => {
                    const isCompleted = t.status === 'completed';

                    return (
                      <div
                        key={`${c.id}-${t.id}`}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                          isCompleted
                            ? 'opacity-60 bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5'
                            : isLight
                            ? 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-[#b58c56]/60 shadow-xs'
                            : 'bg-[#1a1d26] hover:bg-[#202330] border-white/5 hover:border-[#c8a97e]/40'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Client Pill */}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#b58c56]/15 text-[#b58c56] border border-[#b58c56]/30">
                              <Building2 className="w-3 h-3" />
                              <span>{c.companyName}</span>
                            </span>

                            {/* Priority Badge */}
                            {t.priority === 'high' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                Alta
                              </span>
                            ) : t.priority === 'medium' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Média
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                Baixa
                              </span>
                            )}

                            {t.category && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                · {t.category}
                              </span>
                            )}
                          </div>

                          <h5
                            className={`text-xs sm:text-sm font-semibold ${
                              isCompleted ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {t.task}
                          </h5>

                          {t.detail && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              {t.detail}
                            </p>
                          )}

                          <span className="text-[10px] text-slate-400 font-mono block">
                            Prazo: {t.due}
                          </span>
                        </div>

                        {/* Status selector & Action */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <select
                            value={t.status}
                            onChange={e => handleUpdateTaskStatusFromGlobal(c.id, t.id, e.target.value as any)}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                              t.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : t.status === 'in_progress'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : t.status === 'review'
                                ? 'bg-sky-50 text-sky-800 border-sky-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="pending">A Fazer</option>
                            <option value="in_progress">Em Andamento</option>
                            <option value="review">Em Revisão</option>
                            <option value="completed">Concluído</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              onSelectClient(c.id);
                              setIsAgencyTasksModalOpen(false);
                              showToast(`Abrindo console de ${c.companyName}...`);
                            }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              isLight
                                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                            title="Abrir este cliente no painel"
                          >
                            <span>Ir p/ Cliente</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500">
              <span>{pendingAgencyTasks.length} tarefas pendentes da agência</span>
              <button
                type="button"
                onClick={() => setIsAgencyTasksModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-fadeIn">
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-slate-900 text-white text-xs shadow-2xl border border-[#b58c56]/40 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-[#b58c56] shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
