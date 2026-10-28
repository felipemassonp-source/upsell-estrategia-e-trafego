'use client';

import React, { useState } from 'react';
import {
  Lock,
  ArrowUpRight,
  FolderOpen,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  Clock,
  Check,
  ShieldCheck,
  FileText,
  Send,
  MessageCircle,
  Sun,
  Moon,
  Key,
  Video,
  ImageIcon,
  LayoutGrid,
  Laptop
} from 'lucide-react';
import { INITIAL_CLIENTS } from '@/lib/mockData';
import { ClientActionItem, OperationMessage, OperationMessageTag } from '@/lib/types';
import { TaskKanban } from './TaskKanban';

interface EditorialPortalShowcaseProps {
  onOpenClientPortal?: () => void;
  onOpenAuth: () => void;
}

type ScreenTab = 'visao-geral' | 'kanban' | 'ferramentas' | 'documentos';

export function EditorialPortalShowcase({
  onOpenClientPortal: _portal,
  onOpenAuth
}: EditorialPortalShowcaseProps) {
  const client = INITIAL_CLIENTS[0]; // Clínica Bem Estar (Dra. Camila Nogueira)
  const [activeTab, setActiveTab] = useState<ScreenTab>('visao-geral');
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  // Estados locais interativos para permitir que o visitante teste o Kanban e o Chat em tempo real
  const [demoTasks, setDemoTasks] = useState<ClientActionItem[]>(client.actionItems || []);
  const [demoMessages, setDemoMessages] = useState<OperationMessage[]>(client.operationMessages || []);
  const [messageInput, setMessageInput] = useState('');
  const [selectedTag, setSelectedTag] = useState<OperationMessageTag>('Parecer Estratégico');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: OperationMessage = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      authorName: client.responsibleName,
      text: messageInput.trim(),
      date: 'Agora',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      tag: selectedTag
    };

    setDemoMessages(prev => [...prev, newMsg]);
    setMessageInput('');
  };

  const handleWhatsApp = (assunto: string) => {
    const text = encodeURIComponent(
      `Olá! Vi as telas reais do portal exclusivo no site da UPSELL e gostaria de conversar sobre a plataforma (${assunto}).`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511987654321&text=${text}`, '_blank');
  };

  // Cores exatas do ClientPortal.tsx
  const isLight = isLightMode;
  const portalBg = isLight ? 'bg-[#f8fafc]' : 'bg-[#0f1117]';
  const cardBg = isLight
    ? 'bg-white border-2 border-slate-300 shadow-[0_4px_20px_rgba(15,23,42,0.06)]'
    : 'bg-[#181a24] border border-white/10';
  const innerBg = isLight
    ? 'bg-slate-50 border-2 border-slate-300'
    : 'bg-[#10121a] border border-white/10';
  const borderLine = isLight ? 'border-slate-300' : 'border-white/10';

  const screensInfo: Record<
    ScreenTab,
    {
      num: string;
      title: string;
      badge: string;
      url: string;
      whatItShows: string;
      benefit: string;
      keyPoints: string[];
    }
  > = {
    'visao-geral': {
      num: 'Tela 01',
      title: 'Visão Geral da Operação, Vigência & Linha Direta',
      badge: 'Painel de Entrada & Pareceres',
      url: 'https://portal.upsell.com.br/clinica-bem-estar#visao-geral',
      whatItShows:
        'A tela inicial que o cliente visualiza após digitar seu PIN de 6 dígitos. Apresenta o status contratual da parceria com régua de progresso ao vivo e o canal oficial de mensagens tipo WhatsApp com histórico completo de alinhamentos e pareceres estratégicos do gestor.',
      benefit:
        'Elimina a dispersão de dúvidas e relatórios perdidos em conversas pessoais. Tudo fica registrado cronologicamente em um painel executivo.',
      keyPoints: [
        'Status e vigência com cálculo de dias para renovação',
        'Feed de mensagens com pareceres categorizados (Estratégico, Entrega, Alinhamento)',
        'Link direto para o contrato oficial em formato digital com titularidade 100% sua'
      ]
    },
    kanban: {
      num: 'Tela 02',
      title: 'Quadro Kanban de Co-responsabilidade & Entregas',
      badge: 'Gestão Ágil de Demandas',
      url: 'https://portal.upsell.com.br/clinica-bem-estar#kanban',
      whatItShows:
        'A esteira de trabalho transparente da operação. Divide as demandas entre o que a equipe da UpSell está executando e o que depende de validação da sua empresa (aprovação de vídeos, fotos ou acessos).',
      benefit:
        'Fim do "em que pé está nosso projeto?". Você sabe exatamente os prazos, o responsável por cada etapa e o que precisa ser liberado para os anúncios rodarem.',
      keyPoints: [
        'Filtro instantâneo por responsável: Todos, UpSell ou Sua Empresa',
        'Etiquetas de prioridade (Alta, Média, Baixa) e categorias de mídia',
        'Alternância entre visão em colunas Kanban ou lista cronológica'
      ]
    },
    ferramentas: {
      num: 'Tela 03',
      title: 'Cofre de Ferramentas, Hospedagem & Acessos em Operação',
      badge: 'Segurança & Titularidade',
      url: 'https://portal.upsell.com.br/clinica-bem-estar#ferramentas',
      whatItShows:
        'O inventário seguro de todos os ativos digitais da sua marca: Meta Business Manager, Google Ads, GA4, Registro.br, Hospedagem VPS e API de WhatsApp.',
      benefit:
        'Garantia de que nenhum ativo fica retido pela agência. Todas as contas de anúncios, acessos e faturamento permanecem 100% registrados no nome e no CNPJ da sua empresa.',
      keyPoints: [
        'Status em tempo real de cada ferramenta vinculada',
        'Auditoria clara de titularidade da empresa contratante',
        'Links seguros e centralizados para acesso direto aos painéis'
      ]
    },
    documentos: {
      num: 'Tela 04',
      title: 'Central de Documentos & Repositórios Segmentados',
      badge: 'Ativos no Google Drive',
      url: 'https://portal.upsell.com.br/clinica-bem-estar#documentos',
      whatItShows:
        'Pastas dedicadas e sincronizadas no Google Drive para cada formato de mídia (Copys & Roteiros, Gravações de Vídeos Brutos e Imagens/Banners Finais), além do link para análise de dados e contrato formal.',
      benefit:
        'Organização corporativa imediata. Sua equipe médica ou comercial nunca mais precisa perguntar "onde está aquele vídeo?" ou "qual é o link da página?".',
      keyPoints: [
        'Estrutura em nuvem dividida por formato de criativo',
        'Dashboard de inteligência de dados em tempo real',
        'Contrato digital com cláusulas de propriedade intelectual 100% da sua marca'
      ]
    }
  };

  const currentInfo = screensInfo[activeTab];

  return (
    <section
      id="portal"
      className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto hairline-b relative"
    >
      {/* 1. CABEÇALHO DA SEÇÃO (ESTILO EDITORIAL DA LANDING PAGE) */}
      <div className="space-y-4 max-w-4xl mb-12 sm:mb-16">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#c8a97e] font-mono">
          <span>§ 03</span>
          <span>·</span>
          <span>Diferencial de Transparência</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#eae8e3] font-normal leading-[1.1] tracking-tight">
          O controle da sua operação.{' '}
          <span className="italic text-[#dfc7a7]">
            Por dentro do portal exclusivo do cliente.
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-[#9d9ba7] font-light leading-relaxed max-w-2xl">
          Tráfego pago e criação de sites muitas agências oferecem. O nosso diferencial é a{' '}
          <strong className="text-[#eae8e3] font-medium">transparência absoluta do que está sendo executado</strong>.
          Abaixo estão as <strong className="text-[#eae8e3] font-medium">telas reais e interativas</strong> com a tipografia, cores e controles exatos que cada parceiro da UpSell utiliza diariamente.
        </p>
      </div>

      {/* 2. BARRA DE SELEÇÃO DE TELAS & TEMA (DARK / LIGHT) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4">
        {/* Abas das Telas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('visao-geral')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'visao-geral'
                ? 'bg-[#c8a97e] text-black font-bold shadow-md'
                : 'bg-white/5 text-[#9d9ba7] hover:text-white hover:bg-white/10 hairline-all'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>1. Visão Geral & Vigência</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'kanban'
                ? 'bg-[#c8a97e] text-black font-bold shadow-md'
                : 'bg-white/5 text-[#9d9ba7] hover:text-white hover:bg-white/10 hairline-all'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>2. Quadro Kanban (CRM)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ferramentas')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ferramentas'
                ? 'bg-[#c8a97e] text-black font-bold shadow-md'
                : 'bg-white/5 text-[#9d9ba7] hover:text-white hover:bg-white/10 hairline-all'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>3. Cofre de Ferramentas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documentos')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'documentos'
                ? 'bg-[#c8a97e] text-black font-bold shadow-md'
                : 'bg-white/5 text-[#9d9ba7] hover:text-white hover:bg-white/10 hairline-all'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>4. Central de Arquivos</span>
          </button>
        </div>

        {/* Controles de Demonstração: Alternador de Modo Claro/Escuro & Acesso PIN */}
        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto">
          {/* Alternador de Tema Real */}
          <button
            type="button"
            onClick={() => setIsLightMode(!isLightMode)}
            title="Alternar entre Modo Escuro e Modo Claro nas telas reais"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hairline-all bg-white/5 hover:bg-white/10 text-[#eae8e3] transition-all"
          >
            {isLightMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Visualizar Modo Escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Visualizar Modo Claro</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-black bg-[#c8a97e] hover:bg-[#dfc7a7] transition-all shadow"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Entrar com PIN 839102</span>
          </button>
        </div>
      </div>

      {/* 3. SIMULADOR DE JANELA DE NAVEGADOR COM AS TELAS 100% REAIS */}
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#090a0f] transition-all">
        {/* Barra de Janela do Navegador (Chrome / Safari macOS) */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 bg-[#12141c] flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* Barra de URL real do portal */}
          <div className="flex-1 max-w-xl mx-auto px-4 py-1.5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between text-[11px] font-mono text-[#9d9ba7] truncate">
            <div className="flex items-center gap-2 truncate">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{currentInfo.url}</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold shrink-0 ml-2 hidden sm:inline">
              Ambiente Seguro
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-[#c8a97e] shrink-0">
            <span className="hidden md:inline">Clínica Bem Estar</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">
              {currentInfo.num}
            </span>
          </div>
        </div>

        {/* CONTAINER DO PORTAL REAL: STRICT SANS-SERIF, CORES EXATAS DO APP */}
        <div
          className={`${portalBg} p-4 sm:p-8 lg:p-10 font-sans antialiased text-slate-100 transition-colors duration-300 min-h-[580px]`}
        >
          {/* ========================================================================= */}
          {/* TELA 01: VISÃO GERAL, VIGÊNCIA DE CONTRATO & PARECERES TIPO WHATSAPP      */}
          {/* ========================================================================= */}
          {activeTab === 'visao-geral' && (
            <div className="space-y-8 animate-fadeIn">
              {/* 1. Hero do Cliente & Vigência */}
              <section className={`p-6 sm:p-8 rounded-3xl ${cardBg} space-y-6 transition-colors`}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs uppercase tracking-widest font-black px-3 py-1 rounded-full border-2 ${
                          isLight
                            ? 'bg-amber-100 text-amber-950 border-amber-300'
                            : 'bg-[#b58c56]/15 text-[#dfc7a7] border-[#b58c56]/30'
                        }`}
                      >
                        {client.segment}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold ${
                          isLight ? 'text-slate-700' : 'text-slate-300'
                        }`}
                      >
                        Início: {client.contractStart}
                      </span>
                    </div>

                    <h1
                      className={`text-2xl sm:text-4xl font-black tracking-tight ${
                        isLight ? 'text-slate-950' : 'text-white'
                      }`}
                    >
                      {client.companyName}
                    </h1>

                    <p
                      className={`text-xs sm:text-sm max-w-2xl font-medium leading-relaxed ${
                        isLight ? 'text-slate-700' : 'text-slate-200'
                      }`}
                    >
                      Painel transparente de acompanhamento das ações estratégicas, indicadores de aquisição e ferramentas de titularidade da sua empresa.
                    </p>
                  </div>

                  {/* Card Lateral de Contrato & Contato */}
                  <div className={`p-5 rounded-2xl ${innerBg} min-w-[270px] space-y-2.5`}>
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-bold uppercase tracking-wider text-[11px] ${
                          isLight ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        Responsável:
                      </span>
                      <strong className={`font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        {client.responsibleName}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-bold uppercase tracking-wider text-[11px] ${
                          isLight ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        E-mail:
                      </span>
                      <span
                        className={`font-mono text-xs font-bold truncate max-w-[150px] ${
                          isLight ? 'text-slate-950' : 'text-slate-200'
                        }`}
                      >
                        {client.email}
                      </span>
                    </div>

                    <div className={`pt-2 border-t-2 flex items-center justify-between text-xs ${borderLine}`}>
                      <span
                        className={`font-bold uppercase tracking-wider text-[11px] ${
                          isLight ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        Contrato Oficial:
                      </span>
                      <span
                        className={`text-xs font-bold flex items-center gap-1 ${
                          isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'
                        }`}
                      >
                        <span>Vigente & Assinado</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barra de Vigência Humanizada e Amigável */}
                <div className={`p-4 sm:p-5 rounded-2xl ${innerBg} space-y-3`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`} />
                      <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        {client.contractStatus}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 sm:gap-3 font-mono text-[11px] font-bold ${
                        isLight ? 'text-slate-800' : 'text-slate-300'
                      }`}
                    >
                      <span>Início: {client.contractStart}</span>
                      <span>·</span>
                      <span className={`font-black ${isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'}`}>
                        93% da vigência (6 dias para renovação)
                      </span>
                      <span>·</span>
                      <span>Término: {client.contractRenewal}</span>
                    </div>
                  </div>

                  {/* Barra de Progresso Real */}
                  <div
                    className={`w-full h-3 rounded-full overflow-hidden ${
                      isLight ? 'bg-slate-200 border-2 border-slate-300' : 'bg-white/15'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isLight
                          ? 'bg-gradient-to-r from-[#8c5e28] to-[#b58c56]'
                          : 'bg-gradient-to-r from-[#b58c56] to-[#dfc7a7]'
                      }`}
                      style={{ width: '93%' }}
                    />
                  </div>
                </div>
              </section>

              {/* 2. Seção de Visão Geral da Operação neste Mês (Feed de Mensagens Tipo WhatsApp) */}
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`italic text-lg font-bold ${
                        isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'
                      }`}
                    >
                      §
                    </span>
                    <h2
                      className={`text-lg sm:text-2xl font-black tracking-tight ${
                        isLight ? 'text-slate-950' : 'text-white'
                      }`}
                    >
                      Visão Geral da Operação neste Mês
                    </h2>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isLight ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    Linha Direta de Comunicação & Alinhamento
                  </span>
                </div>

                <div className={`rounded-3xl ${cardBg} overflow-hidden border-2 shadow-lg transition-colors`}>
                  {/* Top Bar do Chat */}
                  <div
                    className={`px-5 py-3.5 border-b-2 flex items-center justify-between ${
                      isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#12141a] border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shadow ${
                            isLight
                              ? 'bg-[#8c5e28] text-white'
                              : 'bg-gradient-to-br from-[#b58c56] to-[#dfc7a7] text-black'
                          }`}
                        >
                          UP
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 ${
                            isLight ? 'border-white' : 'border-[#12141c]'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs sm:text-sm font-bold tracking-tight ${
                              isLight ? 'text-slate-950' : 'text-white'
                            }`}
                          >
                            Equipe UpSell Estratégia
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border-2 ${
                              isLight
                                ? 'bg-amber-100 text-amber-950 border-amber-300'
                                : 'bg-[#b58c56]/15 text-[#dfc7a7] border-[#b58c56]/30'
                            }`}
                          >
                            Oficial
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-bold block ${
                            isLight ? 'text-emerald-800' : 'text-emerald-400'
                          }`}
                        >
                          Online · Gestão ativa de Meta & Google Ads
                        </span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      <MessageCircle className={`w-4 h-4 ${isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'}`} />
                      <span className="font-mono text-[11px] font-bold hidden sm:inline">
                        {demoMessages.length} pareceres registrados
                      </span>
                    </div>
                  </div>

                  {/* Feed de Mensagens */}
                  <div
                    className={`p-4 sm:p-6 max-h-[340px] overflow-y-auto space-y-4 ${
                      isLight ? 'bg-[#f8fafc]' : 'bg-[#090a0f]'
                    }`}
                  >
                    <div className="flex items-center justify-center my-1">
                      <span
                        className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border-2 ${
                          isLight
                            ? 'bg-white text-slate-800 border-slate-300 shadow-xs'
                            : 'bg-white/10 text-slate-300 border-white/10'
                        }`}
                      >
                        Histórico de Alinhamentos do Mês
                      </span>
                    </div>

                    {demoMessages.map(msg => {
                      const isGestor = msg.sender === 'gestor';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isGestor ? 'items-start' : 'items-end'}`}
                        >
                          <div
                            className={`max-w-[92%] sm:max-w-[80%] p-3.5 sm:p-4 rounded-2xl shadow-sm space-y-1.5 transition-all ${
                              isGestor
                                ? isLight
                                  ? 'bg-white border-2 border-slate-300 text-slate-950 rounded-tl-sm'
                                  : 'bg-[#181b24] border border-white/15 text-white rounded-tl-sm'
                                : isLight
                                ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-tr-sm'
                                : 'bg-[#16291d] border border-emerald-500/35 text-emerald-100 rounded-tr-sm'
                            }`}
                          >
                            <div
                              className={`flex flex-wrap items-center justify-between gap-2 text-xs pb-1 border-b ${
                                isLight ? 'border-slate-200' : 'border-white/10'
                              }`}
                            >
                              <span
                                className={
                                  isGestor
                                    ? isLight
                                      ? 'text-[#8c5e28] font-black'
                                      : 'text-[#dfc7a7] font-bold'
                                    : isLight
                                    ? 'text-emerald-900 font-black'
                                    : 'text-emerald-400 font-bold'
                                }
                              >
                                {msg.authorName}
                              </span>
                              {msg.tag && (
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border-2 ${
                                    msg.tag === 'Parecer Estratégico'
                                      ? isLight
                                        ? 'bg-amber-100 text-amber-950 border-amber-300'
                                        : 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                                      : msg.tag === 'Atualização de Campanhas'
                                      ? isLight
                                        ? 'bg-sky-100 text-sky-950 border-sky-300'
                                        : 'bg-sky-500/20 text-sky-200 border-sky-500/40'
                                      : msg.tag === 'Entrega'
                                      ? isLight
                                        ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                        : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                                      : isLight
                                      ? 'bg-purple-100 text-purple-950 border-purple-300'
                                      : 'bg-purple-500/20 text-purple-200 border-purple-500/40'
                                  }`}
                                >
                                  {msg.tag}
                                </span>
                              )}
                            </div>

                            <p
                              className={`text-xs leading-relaxed whitespace-pre-line font-medium ${
                                isLight ? 'text-slate-950' : 'text-slate-100'
                              }`}
                            >
                              {msg.text}
                            </p>

                            <div
                              className={`text-[10px] font-mono flex items-center justify-end gap-1.5 pt-0.5 ${
                                isLight ? 'text-slate-500' : 'text-slate-400'
                              }`}
                            >
                              <span>{msg.date}</span>
                              <span>·</span>
                              <span>{msg.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Barra Interativa de Envio (permite testar digitação real) */}
                  <form
                    onSubmit={handleSendMessage}
                    className={`p-3 sm:p-4 border-t-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#10121a] border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 shrink-0">
                      <select
                        value={selectedTag}
                        onChange={e => setSelectedTag(e.target.value as OperationMessageTag)}
                        className={`text-xs font-bold py-1.5 px-2 rounded-xl border-2 cursor-pointer ${
                          isLight
                            ? 'bg-white border-slate-400 text-slate-950'
                            : 'bg-[#181a24] border-white/20 text-white'
                        }`}
                      >
                        <option value="Parecer Estratégico">Parecer Estratégico</option>
                        <option value="Atualização de Campanhas">Atualização de Campanhas</option>
                        <option value="Entrega">Entrega</option>
                        <option value="Alinhamento">Alinhamento</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      placeholder="Simule enviando uma dúvida ou feedback para o gestor..."
                      className={`flex-1 py-2 px-3 rounded-xl text-xs border-2 focus:outline-none font-medium ${
                        isLight
                          ? 'bg-white border-slate-400 text-slate-950 placeholder-slate-500'
                          : 'bg-[#181a24] border-white/20 text-white placeholder-white/40'
                      }`}
                    />

                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                        isLight ? 'bg-[#8c5e28] hover:bg-[#734b1c]' : 'bg-[#b58c56] hover:bg-[#9d7644]'
                      }`}
                    >
                      <span>Enviar</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                </div>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TELA 02: QUADRO KANBAN DE CO-RESPONSABILIDADE & ENTREGAS (TASKKANBAN REAL)*/}
          {/* ========================================================================= */}
          {activeTab === 'kanban' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between gap-4 flex-wrap pb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`italic text-lg font-bold ${
                      isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'
                    }`}
                  >
                    §
                  </span>
                  <h2
                    className={`text-lg sm:text-2xl font-black tracking-tight ${
                      isLight ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    Fluxo de Entregas & Co-responsabilidade
                  </h2>
                </div>
                <span
                  className={`text-xs font-mono font-bold ${
                    isLight ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  Quadro Interativo em Tempo Real (Você pode filtrar e testar abaixo)
                </span>
              </div>

              {/* RENDERIZAÇÃO DIRETA DO COMPONENTE REAL TASKKANBAN */}
              <TaskKanban
                tasks={demoTasks}
                onUpdateTasks={updated => setDemoTasks(updated)}
                isAdmin={false}
                clientName={client.companyName}
                isLight={isLight}
                defaultAssigneeFilter="all"
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TELA 03: COFRE DE FERRAMENTAS, HOSPEDAGENS & ACESSOS EM OPERAÇÃO          */}
          {/* ========================================================================= */}
          {activeTab === 'ferramentas' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className={`italic text-lg font-bold ${
                      isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'
                    }`}
                  >
                    §
                  </span>
                  <h2
                    className={`text-lg sm:text-2xl font-black tracking-tight ${
                      isLight ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    Ferramentas & Acessos em Operação
                  </h2>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border-2 flex items-center gap-1.5 ${
                    isLight
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Auditável e de Titularidade da Sua Marca</span>
                </span>
              </div>

              <div className={`p-6 sm:p-7 rounded-3xl ${cardBg} space-y-4 transition-colors`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(client.activeTools || []).map((tool, idx) => (
                    <div
                      key={tool.id || idx}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 transition-colors ${
                        isLight
                          ? 'bg-white border-slate-300 shadow-xs hover:border-[#8c5e28]'
                          : 'bg-[#181a24] border-white/15 hover:border-white/30'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs sm:text-sm font-black truncate ${
                              isLight ? 'text-slate-950' : 'text-white'
                            }`}
                          >
                            {tool.name}
                          </span>
                          <div
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border-2 ${
                              tool.status === 'Ativo / Vinculado'
                                ? isLight
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : isLight
                                ? 'bg-amber-100 border-amber-300 text-amber-950'
                                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span>{tool.status}</span>
                          </div>
                        </div>

                        <p
                          className={`text-[11px] leading-relaxed font-medium ${
                            isLight ? 'text-slate-700' : 'text-slate-200'
                          }`}
                        >
                          {tool.detail}
                        </p>

                        <div
                          className={`flex items-center gap-2 text-[10px] font-mono pt-1 ${
                            isLight ? 'text-slate-700' : 'text-slate-400'
                          }`}
                        >
                          <span className="font-bold">{tool.category}</span>
                          <span>·</span>
                          <span
                            className={`truncate max-w-[150px] font-semibold ${
                              isLight ? 'text-slate-900' : 'text-slate-300'
                            }`}
                          >
                            {tool.accountEmail}
                          </span>
                        </div>
                      </div>

                      <div className={`pt-2 border-t-2 flex justify-between items-center ${borderLine}`}>
                        <span
                          className={`text-[10px] font-mono ${
                            isLight ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          Login: {tool.loginUser}
                        </span>
                        <span
                          className={`text-[11px] font-bold flex items-center gap-1 ${
                            isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'
                          }`}
                        >
                          <span>Acesso Vinculado</span>
                          <Check className="w-3 h-3 text-emerald-500" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`pt-4 border-t-2 text-[11px] font-semibold flex items-center gap-2 ${
                    isLight ? 'border-slate-300 text-slate-800' : 'border-white/12 text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Nenhum ativo retido: todos os acessos pertencem integralmente à empresa parceira, sem dependência ou aprisionamento de dados.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TELA 04: CENTRAL DE DOCUMENTOS & REPOSITÓRIOS NO GOOGLE DRIVE             */}
          {/* ========================================================================= */}
          {activeTab === 'documentos' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`italic text-lg font-bold ${
                        isLight ? 'text-[#8c5e28]' : 'text-[#b58c56]'
                      }`}
                    >
                      §
                    </span>
                    <h2
                      className={`text-lg sm:text-2xl font-black tracking-tight ${
                        isLight ? 'text-slate-950' : 'text-white'
                      }`}
                    >
                      Central de Documentos & Repositórios
                    </h2>
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      isLight ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    Arquivos em nuvem organizados por categoria · Titularidade 100% da sua marca
                  </p>
                </div>
                <span
                  className={`text-xs font-mono font-bold ${
                    isLight ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  Pastas Sincronizadas no Google Drive
                </span>
              </div>

              {/* Bloco 1: Pastas de Criativos Organizadas por Formato */}
              <div className={`p-6 sm:p-8 rounded-3xl ${cardBg} space-y-6 transition-colors shadow-sm`}>
                <div
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 ${borderLine}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 ${
                        isLight
                          ? 'bg-amber-100 text-[#8c5e28] border-amber-300'
                          : `${innerBg} text-[#b58c56]`
                      }`}
                    >
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-base sm:text-lg font-black ${
                            isLight ? 'text-slate-950' : 'text-white'
                          }`}
                        >
                          Pastas de Criativos & Mídia
                        </h3>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border-2 ${
                            isLight
                              ? 'bg-amber-100 text-amber-950 border-amber-300'
                              : 'bg-[#b58c56]/15 text-[#dfc7a7] border-[#b58c56]/30'
                          }`}
                        >
                          Google Drive
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-0.5 font-medium ${
                          isLight ? 'text-slate-700' : 'text-slate-300'
                        }`}
                      >
                        Estrutura organizada por formato para revisão de textos, aprovação de vídeos e artes estáticas.
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-mono hidden sm:inline font-bold ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}
                  >
                    3 Diretórios Dedicados
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Pasta 1: Copys & Roteiros */}
                  <div
                    className={`p-5 rounded-2xl ${innerBg} flex flex-col justify-between border-2 transition-all text-left space-y-4 hover:border-[#8c5e28] shadow-xs`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 ${
                            isLight
                              ? 'bg-amber-100 text-[#8c5e28] border-amber-300'
                              : 'bg-[#b58c56]/15 text-[#b58c56]'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                            isLight ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          Textos & Roteiros
                        </span>
                      </div>
                      <h4
                        className={`text-sm font-black ${
                          isLight ? 'text-slate-950' : 'text-white'
                        }`}
                      >
                        Pasta de Copys & Roteiros
                      </h4>
                      <p
                        className={`text-xs leading-relaxed font-medium ${
                          isLight ? 'text-slate-700' : 'text-slate-200'
                        }`}
                      >
                        Briefings de posicionamento, roteiros dinâmicos para gravação de vídeos e copys persuasivas aprovadas para Meta e Google Ads.
                      </p>
                    </div>
                    <div
                      className={`pt-3 border-t-2 flex items-center justify-between text-xs font-bold ${borderLine} ${
                        isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'
                      }`}
                    >
                      <span>Abrir Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Pasta 2: Vídeos & Gravações Brutas */}
                  <div
                    className={`p-5 rounded-2xl ${innerBg} flex flex-col justify-between border-2 transition-all text-left space-y-4 hover:border-[#8c5e28] shadow-xs`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 ${
                            isLight
                              ? 'bg-purple-100 text-purple-800 border-purple-300'
                              : 'bg-purple-500/15 text-purple-400'
                          }`}
                        >
                          <Video className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                            isLight ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          Vídeos & Reels
                        </span>
                      </div>
                      <h4
                        className={`text-sm font-black ${
                          isLight ? 'text-slate-950' : 'text-white'
                        }`}
                      >
                        Pasta de Vídeos & Gravações
                      </h4>
                      <p
                        className={`text-xs leading-relaxed font-medium ${
                          isLight ? 'text-slate-700' : 'text-slate-200'
                        }`}
                      >
                        Repositório em nuvem para você subir gravações de celular da equipe médica e baixar os vídeos finalizados em alta definição.
                      </p>
                    </div>
                    <div
                      className={`pt-3 border-t-2 flex items-center justify-between text-xs font-bold ${borderLine} ${
                        isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'
                      }`}
                    >
                      <span>Abrir Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Pasta 3: Imagens & Banners Finais */}
                  <div
                    className={`p-5 rounded-2xl ${innerBg} flex flex-col justify-between border-2 transition-all text-left space-y-4 hover:border-[#8c5e28] shadow-xs`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 ${
                            isLight
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-emerald-500/15 text-emerald-400'
                          }`}
                        >
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                            isLight ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          Design & Banners
                        </span>
                      </div>
                      <h4
                        className={`text-sm font-black ${
                          isLight ? 'text-slate-950' : 'text-white'
                        }`}
                      >
                        Pasta de Imagens & Banners
                      </h4>
                      <p
                        className={`text-xs leading-relaxed font-medium ${
                          isLight ? 'text-slate-700' : 'text-slate-200'
                        }`}
                      >
                        Carrosséis institucionais, banners para Google Display e criativos estáticos catalogados por tema e campanha.
                      </p>
                    </div>
                    <div
                      className={`pt-3 border-t-2 flex items-center justify-between text-xs font-bold ${borderLine} ${
                        isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'
                      }`}
                    >
                      <span>Abrir Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco 2: Contrato Oficial & Looker Studio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`p-6 rounded-3xl ${cardBg} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider font-mono ${
                        isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'
                      }`}
                    >
                      Inteligência de Dados
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Ao Vivo
                    </span>
                  </div>
                  <h4 className={`text-base font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    Painel Looker Studio Oficial
                  </h4>
                  <p className={`text-xs font-medium leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Relatório dinâmico com taxas de conversão de cliques em consultas, custo por aquisição e comparativo mensal.
                  </p>
                  <div className="pt-2">
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-[#8c5e28]' : 'text-[#dfc7a7]'}`}>
                      <span>Acesso Sincronizado</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className={`p-6 rounded-3xl ${cardBg} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-500">
                      Segurança Jurídica
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ✓ Assinado
                    </span>
                  </div>
                  <h4 className={`text-base font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    Contrato Oficial com Assinatura Digital
                  </h4>
                  <p className={`text-xs font-medium leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Cláusulas de escopo técnico, conformidade com a LGPD e garantia expressa de titularidade de todos os ativos digitais pela empresa contratante.
                  </p>
                  <div className="pt-2">
                    <span className={`text-xs font-bold flex items-center gap-1.5 text-emerald-500`}>
                      <span>Documento Oficial Registrado</span>
                      <FileCheck2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. PAINEL EXPLICATIVO EDITORIAL DA TELA SELECIONADA */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-10">
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c8a97e]">
              {currentInfo.num}
            </span>
            <span className="text-[#8e8d96]/40">·</span>
            <span className="font-mono text-xs uppercase text-[#8e8d96]">
              {currentInfo.badge}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#eae8e3] font-normal leading-tight">
            {currentInfo.title}
          </h3>

          <p className="text-xs text-[#c8a97e] font-mono pt-1">
            Benefício prático para a sua empresa:
          </p>
          <p className="text-xs sm:text-sm text-[#eae8e3] font-medium leading-relaxed">
            {currentInfo.benefit}
          </p>
        </div>

        <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-[#9d9ba7] font-light leading-relaxed">
          <p>{currentInfo.whatItShows}</p>

          <div className="p-4 rounded-xl bg-white/5 hairline-all space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#eae8e3] block font-medium">
              Destaques desta tela na rotina da sua marca:
            </span>
            <ul className="space-y-1.5">
              {currentInfo.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#eae8e3]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c8a97e] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 5. CHAMADA PARA AÇÃO EDITORIAL E LOGIN COM PIN */}
      <div className="mt-16 sm:mt-20 p-6 sm:p-8 hairline-all bg-[#0a0b0e] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <h4 className="font-serif text-lg sm:text-xl text-[#eae8e3] font-normal">
            Quer experimentar o portal da sua empresa em funcionamento?
          </h4>
          <p className="text-xs text-[#9d9ba7] font-light leading-relaxed">
            Você pode navegar agora com a chave demo <strong>839102</strong> ou solicitar uma apresentação consultiva para entender a viabilidade da sua operação.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleWhatsApp('Demonstração do Portal')}
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-[#0d0e12] bg-[#eae8e3] hover:bg-[#c8a97e] transition-colors"
          >
            <span>Conversar no WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#0d0e12]" />
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-medium text-[#eae8e3] hover:text-white hairline-all transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-[#c8a97e]" />
            <span>Entrar com PIN 839102</span>
          </button>
        </div>
      </div>
    </section>
  );
}
