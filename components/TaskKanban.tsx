'use client';

import React, { useState, useMemo } from 'react';
import { ClientActionItem, TaskStatus, TaskAssignee, TaskPriority } from '@/lib/types';
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  User,
  Zap,
  Edit3,
  Trash2,
  X,
  Tag,
  Briefcase,
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface TaskKanbanProps {
  tasks: ClientActionItem[];
  onUpdateTasks: (updated: ClientActionItem[]) => void;
  isAdmin?: boolean;
  clientName?: string;
  isLight: boolean;
  showToast?: (msg: string) => void;
  defaultAssigneeFilter?: 'all' | 'agency' | 'client';
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  lateralBorder: string;
  color: {
    lightBadge: string;
    darkBadge: string;
    border: string;
    dot: string;
  };
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'pending',
    title: 'A Fazer / Backlog',
    subtitle: 'Planejado para execução',
    icon: Clock,
    lateralBorder: 'border-l-4 border-l-slate-400 dark:border-l-slate-400',
    color: {
      lightBadge: 'bg-slate-200 text-slate-950 border-slate-400 font-bold',
      darkBadge: 'bg-slate-800 text-white border-slate-600 font-bold',
      border: 'border-slate-300 dark:border-white/15',
      dot: 'bg-slate-500 dark:bg-slate-400'
    }
  },
  {
    id: 'in_progress',
    title: 'Em Andamento',
    subtitle: 'Em execução ativa',
    icon: Zap,
    lateralBorder: 'border-l-4 border-l-amber-500',
    color: {
      lightBadge: 'bg-amber-100 text-amber-950 border-amber-400 font-bold',
      darkBadge: 'bg-amber-500/25 text-amber-200 border-amber-500/50 font-bold',
      border: 'border-amber-400 dark:border-amber-500/40',
      dot: 'bg-amber-500'
    }
  },
  {
    id: 'review',
    title: 'Em Revisão / Validação',
    subtitle: 'Aguardando validação',
    icon: Layers,
    lateralBorder: 'border-l-4 border-l-sky-500',
    color: {
      lightBadge: 'bg-sky-100 text-sky-950 border-sky-400 font-bold',
      darkBadge: 'bg-sky-500/25 text-sky-200 border-sky-500/50 font-bold',
      border: 'border-sky-400 dark:border-sky-500/40',
      dot: 'bg-sky-500'
    }
  },
  {
    id: 'completed',
    title: 'Concluído',
    subtitle: 'Entregue com sucesso',
    icon: CheckCircle2,
    lateralBorder: 'border-l-4 border-l-emerald-500',
    color: {
      lightBadge: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold',
      darkBadge: 'bg-emerald-500/25 text-emerald-200 border-emerald-500/50 font-bold',
      border: 'border-emerald-400 dark:border-emerald-500/40',
      dot: 'bg-emerald-500'
    }
  }
];

const PRESET_CATEGORIES = [
  'Tráfego Meta Ads',
  'Google Ads & Search',
  'Criativos & Vídeos',
  'Tracking & Pixel',
  'CRO & Landing Page',
  'Onboarding & Acessos',
  'Comercial & CRM',
  'Estratégia & Metas'
];

export function TaskKanban({
  tasks,
  onUpdateTasks,
  isAdmin = false,
  clientName,
  isLight,
  showToast = () => {},
  defaultAssigneeFilter = 'all'
}: TaskKanbanProps) {
  // View mode: 'kanban' or 'list'
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Filters
  const [assigneeFilter, setAssigneeFilter] = useState<'all' | 'agency' | 'client'>(defaultAssigneeFilter);
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & form state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [targetColumnForNew, setTargetColumnForNew] = useState<TaskStatus>('pending');
  const [editingTask, setEditingTask] = useState<ClientActionItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form Fields for Create / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formDetail, setFormDetail] = useState('');
  const [formDue, setFormDue] = useState('Em 5 dias');
  const [formAssignee, setFormAssignee] = useState<TaskAssignee>('agency');
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium');
  const [formStatus, setFormStatus] = useState<TaskStatus>('pending');
  const [formCategory, setFormCategory] = useState('Tráfego Meta Ads');

  // Ensure every task has valid default fields
  const normalizedTasks = useMemo(() => {
    return tasks.map(t => ({
      ...t,
      status: (['pending', 'in_progress', 'review', 'completed'].includes(t.status)
        ? t.status
        : 'pending') as TaskStatus,
      assignee: (t.assignee || 'agency') as TaskAssignee,
      priority: (t.priority || 'medium') as TaskPriority,
      category: t.category || 'Geral'
    }));
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return normalizedTasks.filter(item => {
      // Assignee filter
      if (assigneeFilter !== 'all' && item.assignee !== assigneeFilter) {
        return false;
      }
      // Priority filter
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.task.toLowerCase().includes(q);
        const matchesDetail = item.detail.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDetail && !matchesCat) return false;
      }
      return true;
    });
  }, [normalizedTasks, assigneeFilter, priorityFilter, searchQuery]);

  // Counts
  const totalTasks = normalizedTasks.length;
  const agencyTasksCount = normalizedTasks.filter(t => t.assignee === 'agency' && t.status !== 'completed').length;
  const clientTasksCount = normalizedTasks.filter(t => t.assignee === 'client' && t.status !== 'completed').length;
  const completedCount = normalizedTasks.filter(t => t.status === 'completed').length;

  // Move task to adjacent column
  const moveTaskColumn = (taskId: string, direction: 'prev' | 'next') => {
    const statusOrder: TaskStatus[] = ['pending', 'in_progress', 'review', 'completed'];
    const currentTask = normalizedTasks.find(t => t.id === taskId);
    if (!currentTask) return;

    const currentIndex = statusOrder.indexOf(currentTask.status);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < statusOrder.length) {
      const nextStatus = statusOrder[newIndex];
      const updated = normalizedTasks.map(t =>
        t.id === taskId ? { ...t, status: nextStatus } : t
      );
      onUpdateTasks(updated);

      const colName = COLUMNS.find(c => c.id === nextStatus)?.title || nextStatus;
      showToast(`Tarefa movida para "${colName}"`);
    }
  };

  // Direct set status
  const setTaskStatus = (taskId: string, status: TaskStatus) => {
    const updated = normalizedTasks.map(t =>
      t.id === taskId ? { ...t, status } : t
    );
    onUpdateTasks(updated);
    const colName = COLUMNS.find(c => c.id === status)?.title || status;
    showToast(`Status atualizado para "${colName}"`);
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    const updated = normalizedTasks.filter(t => t.id !== taskId);
    onUpdateTasks(updated);
    setConfirmDeleteId(null);
    showToast('Tarefa removida com sucesso.');
  };

  // Open Create Modal
  const openCreateModal = (initialCol: TaskStatus = 'pending') => {
    setFormTitle('');
    setFormDetail('');
    setFormDue('Em 5 dias');
    setFormAssignee(isAdmin ? 'agency' : 'client');
    setFormPriority('medium');
    setFormStatus(initialCol);
    setFormCategory('Tráfego Meta Ads');
    setTargetColumnForNew(initialCol);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (task: ClientActionItem) => {
    setEditingTask(task);
    setFormTitle(task.task);
    setFormDetail(task.detail);
    setFormDue(task.due);
    setFormAssignee(task.assignee || 'agency');
    setFormPriority(task.priority || 'medium');
    setFormStatus(task.status);
    setFormCategory(task.category || 'Tráfego Meta Ads');
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('O título da tarefa é obrigatório.');
      return;
    }
    const newTask: ClientActionItem = {
      id: `task-${Date.now()}`,
      task: formTitle.trim(),
      detail: formDetail.trim() || 'Ação registrada no fluxo do projeto.',
      status: formStatus,
      due: formDue.trim() || 'Sem prazo fixado',
      assignee: formAssignee,
      priority: formPriority,
      category: formCategory.trim() || 'Geral'
    };
    onUpdateTasks([newTask, ...normalizedTasks]);
    setIsCreateModalOpen(false);
    showToast('Nova tarefa adicionada ao fluxo!');
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    if (!formTitle.trim()) {
      showToast('O título não pode ficar vazio.');
      return;
    }
    const updatedTask: ClientActionItem = {
      ...editingTask,
      task: formTitle.trim(),
      detail: formDetail.trim() || 'Ação registrada no fluxo do projeto.',
      status: formStatus,
      due: formDue.trim() || 'Sem prazo fixado',
      assignee: formAssignee,
      priority: formPriority,
      category: formCategory.trim() || 'Geral'
    };
    const updated = normalizedTasks.map(t => (t.id === editingTask.id ? updatedTask : t));
    onUpdateTasks(updated);
    setEditingTask(null);
    showToast('Tarefa atualizada com sucesso!');
  };

  // Theme helper classes - Alto contraste rigoroso (Linear / Suíço)
  const cardBg = isLight
    ? 'bg-white border border-[#141414]/12 shadow-[0_12px_32px_-18px_rgba(20,20,20,0.06)] text-[#141414]'
    : 'bg-[#12141a] border border-white/10 shadow-xl text-white';

  const innerBg = isLight
    ? 'bg-[#f7f7f4] border border-[#141414]/12 text-[#141414]'
    : 'bg-[#181b24] border border-white/10 text-slate-100';

  const inputClass = isLight
    ? 'w-full px-3.5 py-2.5 bg-white border border-[#141414]/20 rounded-xl text-xs text-[#141414] placeholder-[#141414]/45 focus:outline-none focus:border-[#141414] transition-all font-semibold'
    : 'w-full px-3.5 py-2.5 bg-[#0c0d10] border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ed1c24] transition-colors font-semibold';

  const labelClass = isLight
    ? 'block font-mono text-[10px] font-bold uppercase tracking-wider text-[#141414]/80 mb-1.5'
    : 'block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-200 mb-1.5';

  const getStatusLateralBorder = (status: TaskStatus) => {
    switch (status) {
      case 'in_progress':
        return 'border-l-4 border-l-amber-500';
      case 'review':
        return 'border-l-4 border-l-sky-500';
      case 'completed':
        return 'border-l-4 border-l-emerald-500';
      case 'pending':
      default:
        return 'border-l-4 border-l-slate-400 dark:border-l-slate-400';
    }
  };

  // Render priority badge com alto contraste
  const renderPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 border-2 border-rose-300 text-rose-950 dark:bg-rose-500/25 dark:border-rose-500/50 dark:text-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 animate-pulse" />
            Alta
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 border-2 border-amber-300 text-amber-950 dark:bg-amber-500/25 dark:border-amber-500/50 dark:text-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
            Média
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 border-2 border-slate-300 text-slate-900 dark:bg-slate-800 dark:border-white/20 dark:text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-300" />
            Baixa
          </span>
        );
    }
  };

  // Render assignee badge com alto contraste
  const renderAssigneeBadge = (assignee?: TaskAssignee) => {
    if (assignee === 'agency') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[#141414] text-white dark:bg-white/15 dark:text-white">
          <Zap className="w-3 h-3 text-[#ed1c24]" />
          <span>{isAdmin ? 'UPSELL (Agência)' : 'Equipe UPSELL'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[#ed1c24]/15 border border-[#ed1c24]/30 text-[#ed1c24]">
        <User className="w-3 h-3 text-[#ed1c24]" />
        <span>{isAdmin ? 'Pendente do Cliente' : 'Sua Ação (Cliente)'}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Controls, Summary Badges, View Toggle and Add Button */}
      <div className={`p-5 rounded-2xl ${cardBg} space-y-4`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 ${
                isLight ? 'bg-amber-100 text-[#ed1c24] border-amber-300' : 'bg-[#ed1c24]/15 text-[#ed1c24] border-transparent'
              }`}>
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  {isAdmin ? 'Fluxo de Tarefas & CRM de Operação' : 'Fluxo de Entregas & Pendências da Parceria'}
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-700 font-medium' : 'text-[#8e8d96]'}`}>
                  {isAdmin
                    ? `Gestão visual tipo Kanban das entregas da agência e demandas do cliente ${clientName ? `(${clientName})` : ''}`
                    : 'Acompanhe as ações em andamento pela UpSell e as pendências que requerem sua validação'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badges & Add Task Button */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border-2 ${
              isLight ? 'bg-slate-200 text-slate-900 border-slate-300' : 'bg-white/5 text-slate-300 border-transparent'
            }`}>
              Total: {totalTasks}
            </span>

            {agencyTasksCount > 0 && (
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border-2 flex items-center gap-1 ${
                isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-[#ed1c24]/15 text-[#dfc7a7] border-[#ed1c24]/30'
              }`}>
                <Zap className="w-3 h-3" />
                <span>{isAdmin ? 'Minhas:' : 'UpSell:'} {agencyTasksCount}</span>
              </span>
            )}

            {clientTasksCount > 0 && (
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border-2 flex items-center gap-1 ${
                isLight ? 'bg-indigo-100 text-indigo-950 border-indigo-300' : 'bg-indigo-500/10 text-indigo-300 border-indigo-200/50'
              }`}>
                <User className="w-3 h-3" />
                <span>Cliente: {clientTasksCount}</span>
              </span>
            )}

            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border-2 ${
              isLight ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-transparent'
            }`}>
              Concluídas: {completedCount}
            </span>

            {/* Nova Tarefa Button */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => openCreateModal('pending')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#ed1c24] hover:bg-[#c8141b] transition-all shadow-sm ml-auto sm:ml-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Tarefa</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className={`pt-3 border-t-2 ${isLight ? 'border-slate-300' : 'border-white/10'} flex flex-col md:flex-row md:items-center justify-between gap-3`}>
          {/* Assignee Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className={`text-[11px] font-black mr-1 ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>Responsável:</span>
            <button
              type="button"
              onClick={() => setAssigneeFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all font-bold ${
                assigneeFilter === 'all'
                  ? isLight
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-900 font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              Todas ({totalTasks})
            </button>

            <button
              type="button"
              onClick={() => setAssigneeFilter('agency')}
              className={`px-3 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
                assigneeFilter === 'agency'
                  ? isLight
                    ? 'bg-[#ed1c24] text-white font-semibold'
                    : 'bg-[#ed1c24] text-white font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>{isAdmin ? 'Minhas Tarefas (UpSell)' : 'Equipe UpSell'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAssigneeFilter('client')}
              className={`px-3 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
                assigneeFilter === 'client'
                  ? isLight
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-indigo-500 text-white font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              <span>{isAdmin ? 'Tarefas do Cliente' : 'Suas Ações'}</span>
            </button>
          </div>

          {/* Right side: Priority filter, search and View switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority filter */}
            <div className="flex items-center gap-1 text-xs">
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value as 'all' | TaskPriority)}
                className={`text-[11px] px-2.5 py-1.5 rounded-lg border-2 font-bold transition-colors ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-[#1a1d26] border-white/10 text-slate-200'
                }`}
              >
                <option value="all">Todas as Prioridades</option>
                <option value="high">🔴 Alta Prioridade</option>
                <option value="medium">🟡 Média Prioridade</option>
                <option value="low">🔵 Baixa Prioridade</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Buscar tarefa..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`pl-8 pr-3 py-1.5 rounded-lg text-xs w-36 sm:w-44 border-2 focus:outline-none focus:border-[#ed1c24] font-medium transition-colors ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-500'
                    : 'bg-[#1a1d26] border-white/10 text-white placeholder:text-slate-400'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* View Mode Toggle: Kanban vs List */}
            <div className={`p-1 rounded-xl border flex items-center ${isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-white/5 border-white/10'}`}>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`p-1 rounded-lg transition-all ${
                  viewMode === 'kanban'
                    ? isLight
                      ? 'bg-white text-slate-950 shadow-sm font-bold'
                      : 'bg-[#222634] text-white'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Modo Quadro Kanban"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? isLight
                      ? 'bg-white text-slate-950 shadow-sm font-bold'
                      : 'bg-[#222634] text-white'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Modo Lista Compacta"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: QUADRO KANBAN (4 COLUNAS)
      ========================================================================== */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {COLUMNS.map(col => {
            const ColumnIcon = col.icon;
            const columnTasks = filteredTasks.filter(t => t.status === col.id);

            return (
              <div
                key={col.id}
                className={`p-4 rounded-2xl ${cardBg} space-y-3.5 flex flex-col min-h-[380px] transition-all border ${col.color.border}`}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between pb-2.5 border-b ${isLight ? 'border-slate-300' : 'border-white/10'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.color.dot}`} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <ColumnIcon className={`w-3.5 h-3.5 ${isLight ? 'text-[#ed1c24]' : 'text-[#ed1c24]'}`} />
                        <h4 className={`text-xs font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>{col.title}</h4>
                      </div>
                      <span className={`text-[10px] block font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{col.subtitle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${
                        isLight ? col.color.lightBadge : col.color.darkBadge
                      }`}
                    >
                      {columnTasks.length}
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => openCreateModal(col.id)}
                        className={`p-1 rounded transition-colors ${isLight ? 'text-slate-600 hover:text-[#ed1c24]' : 'text-slate-400 hover:text-[#ed1c24]'}`}
                        title={`Adicionar tarefa em "${col.title}"`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Column Task Cards */}
                <div className="space-y-3 flex-1">
                  {columnTasks.length === 0 ? (
                    <div className={`p-6 text-center rounded-xl border-2 border-dashed ${isLight ? 'border-slate-300 bg-slate-100/90' : 'border-white/15 bg-white/[0.03]'}`}>
                      <p className={`text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Nenhuma tarefa nesta etapa</p>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => openCreateModal(col.id)}
                          className={`mt-2 text-[10px] font-black hover:underline inline-flex items-center gap-1 ${isLight ? 'text-[#ed1c24]' : 'text-[#ed1c24]'}`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>Adicionar tarefa</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    columnTasks.map(task => {
                      const isDeleting = confirmDeleteId === task.id;

                      return (
                        <div
                          key={task.id}
                          className={`p-3.5 rounded-xl ${innerBg} ${col.lateralBorder} transition-all space-y-2.5 hover:border-[#ed1c24]/60 shadow-sm relative group`}
                        >
                          {/* Card Badges: Assignee, Priority & Tag */}
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            {renderAssigneeBadge(task.assignee)}
                            {renderPriorityBadge(task.priority || 'medium')}
                          </div>

                          {/* Task Title com Alto Contraste */}
                          <h5
                            className={`text-xs font-bold leading-snug ${
                              task.status === 'completed'
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : isLight
                                ? 'text-[#0f172a]'
                                : 'text-white'
                            }`}
                          >
                            {task.task}
                          </h5>

                          {/* Task Detail / Description */}
                          {task.detail && (
                            <p className={`text-[11px] leading-relaxed line-clamp-3 ${isLight ? 'text-slate-800 font-normal' : 'text-slate-200 font-normal'}`}>
                              {task.detail}
                            </p>
                          )}

                          {/* Card Footer: Category tag & Due date */}
                          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 text-[10px] text-slate-600 dark:text-slate-300">
                            {task.category && (
                              <span className="flex items-center gap-1 truncate max-w-[120px] font-bold text-[#ed1c24] dark:text-[#dfc7a7]">
                                <Tag className="w-2.5 h-2.5" />
                                <span className="truncate">{task.category}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1 shrink-0 font-mono font-semibold text-slate-700 dark:text-slate-200">
                              <Calendar className="w-2.5 h-2.5 text-[#ed1c24]" />
                              <span>{task.due}</span>
                            </span>
                          </div>

                          {/* Action Toolbar on Card */}
                          <div className="pt-1.5 flex items-center justify-between gap-1 border-t border-slate-200/40 dark:border-white/5">
                            {/* Direction Arrows to Move Between Columns */}
                            <div className="flex items-center gap-1">
                              {col.id !== 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => moveTaskColumn(task.id, 'prev')}
                                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
                                  title="Mover para coluna anterior"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}

                              {col.id !== 'completed' && (
                                <button
                                  type="button"
                                  onClick={() => moveTaskColumn(task.id, 'next')}
                                  className="p-1 rounded text-slate-400 hover:text-[#ed1c24] hover:bg-[#ed1c24]/10 transition-colors"
                                  title="Avançar para próxima coluna"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}

                              {/* Client quick toggle: if client role, allow completing task */}
                              {!isAdmin && task.assignee === 'client' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')
                                  }
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all ${
                                    task.status === 'completed'
                                      ? 'bg-slate-200 text-slate-700'
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  }`}
                                >
                                  {task.status === 'completed' ? 'Reabrir' : 'Marcar Feito'}
                                </button>
                              )}
                            </div>

                            {/* Admin Controls: Edit & Delete */}
                            {isAdmin && (
                              <div className="flex items-center gap-1">
                                {isDeleting ? (
                                  <div className="flex items-center gap-1 animate-fadeIn">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-600 text-white hover:bg-rose-700"
                                    >
                                      Sim
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-200 text-slate-700"
                                    >
                                      Não
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => openEditModal(task)}
                                      className="text-slate-400 hover:text-[#ed1c24] p-1 rounded transition-colors"
                                      title="Editar tarefa"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(task.id)}
                                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                                      title="Excluir tarefa"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: LISTA COMPACTA
      ========================================================================== */}
      {viewMode === 'list' && (
        <div className={`p-5 rounded-2xl ${cardBg} space-y-3`}>
          {filteredTasks.length === 0 ? (
            <div className={`p-8 text-center rounded-xl ${innerBg}`}>
              <p className="text-xs text-slate-500">Nenhuma tarefa encontrada com os filtros atuais.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/80 dark:divide-white/10">
              {filteredTasks.map(task => {
                const isDeleting = confirmDeleteId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`py-3.5 px-3.5 mb-2 rounded-xl border border-slate-300 dark:border-white/12 ${getStatusLateralBorder(task.status)} ${
                      isLight ? 'bg-white hover:bg-slate-50' : 'bg-[#181b24] hover:bg-[#1f232e]'
                    } flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')
                        }
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          task.status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : isLight
                            ? 'border border-slate-400 hover:border-[#ed1c24]'
                            : 'border border-white/30 hover:border-[#c8a97e]'
                        }`}
                        title="Alternar conclusão"
                      >
                        {task.status === 'completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-bold ${
                              task.status === 'completed'
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : isLight
                                ? 'text-[#0f172a]'
                                : 'text-white'
                            }`}
                          >
                            {task.task}
                          </span>
                          {renderAssigneeBadge(task.assignee)}
                          {renderPriorityBadge(task.priority || 'medium')}
                          {task.category && (
                            <span className="text-[10px] text-slate-700 dark:text-slate-200 font-mono bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded border border-slate-300 dark:border-white/10 font-medium">
                              {task.category}
                            </span>
                          )}
                        </div>
                        {task.detail && (
                          <p className={`text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                            {task.detail}
                          </p>
                        )}
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono block">
                          Prazo: {task.due}
                        </span>
                      </div>
                    </div>

                    {/* Status selector & Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <select
                        value={task.status}
                        onChange={e => setTaskStatus(task.id, e.target.value as TaskStatus)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                          task.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : task.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : task.status === 'review'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="pending">A Fazer</option>
                        <option value="in_progress">Em Andamento</option>
                        <option value="review">Em Revisão</option>
                        <option value="completed">Concluído</option>
                      </select>

                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            onClick={() => openEditModal(task)}
                            className="text-slate-400 hover:text-[#ed1c24] p-1 rounded"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {isDeleting ? (
                            <div className="flex items-center gap-1 animate-fadeIn">
                              <button
                                type="button"
                                onClick={() => handleDeleteTask(task.id)}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white"
                              >
                                Excluir
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-700"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(task.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL: CRIAR OU EDITAR TAREFA
      ========================================================================== */}
      {(isCreateModalOpen || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-lg p-6 sm:p-7 rounded-3xl ${cardBg} border shadow-2xl space-y-5 animate-scaleUp`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#ed1c24]/15 flex items-center justify-center text-[#ed1c24]">
                  {editingTask ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-base font-bold">
                    {editingTask ? 'Editar Tarefa do Fluxo' : 'Nova Tarefa no Fluxo CRM'}
                  </h4>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#8e8d96]'}`}>
                    Defina o título, responsável, prioridade e orientações
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingTask(null);
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={editingTask ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
              {/* Título */}
              <div>
                <label className={labelClass}>Título da Tarefa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gravação dos novos criativos de Reels ou Escala da campanha"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Responsável (Toggle Agência UpSell vs Cliente) */}
              <div>
                <label className={labelClass}>Responsável pela Execução *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormAssignee('agency')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      formAssignee === 'agency'
                        ? 'bg-[#ed1c24] text-white border-[#ed1c24] shadow-sm'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>⚡ Agência UpSell (Minha Parte)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormAssignee('client')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      formAssignee === 'client'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>👤 Ação do Cliente</span>
                  </button>
                </div>
              </div>

              {/* Prioridade & Coluna Inicial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Prioridade da Tarefa</label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as TaskPriority)}
                    className={inputClass}
                  >
                    <option value="high">🔴 Alta Prioridade (Urgente)</option>
                    <option value="medium">🟡 Média Prioridade (Padrão)</option>
                    <option value="low">🔵 Baixa Prioridade (Desejável)</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Coluna / Status Inicial</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as TaskStatus)}
                    className={inputClass}
                  >
                    <option value="pending">A Fazer / Backlog</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="review">Em Revisão / Aprovação</option>
                    <option value="completed">Concluído</option>
                  </select>
                </div>
              </div>

              {/* Prazo & Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Prazo Previsto</label>
                  <input
                    type="text"
                    placeholder="Ex: Até 25/10 ou Imediato"
                    value={formDue}
                    onChange={e => setFormDue(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Área / Categoria</label>
                  <input
                    type="text"
                    list="task-categories"
                    placeholder="Ex: Tráfego Meta Ads"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className={inputClass}
                  />
                  <datalist id="task-categories">
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Detalhes / Orientações */}
              <div>
                <label className={labelClass}>Orientações & Detalhes da Ação</label>
                <textarea
                  rows={3}
                  placeholder="Instruções claras para a equipe ou para o cliente..."
                  value={formDetail}
                  onChange={e => setFormDetail(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingTask(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#ed1c24] hover:bg-[#9d7644] transition-all shadow-md"
                >
                  {editingTask ? 'Salvar Alterações' : 'Criar Tarefa no Kanban'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
