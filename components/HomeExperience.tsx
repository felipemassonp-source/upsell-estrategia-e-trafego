'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  FileText,
  History,
  LayoutGrid,
  Lock,
  Menu,
  MessageCircle,
  Plus,
  X,
} from 'lucide-react';

type ServiceKey = 'trafego' | 'sites' | 'comercial';

/* ------------------------------------------------------------------ */
/* CONTATO — ajuste aqui                                                */
/* Quando `whatsapp` for preenchido (DDI + DDD + número, só dígitos,   */
/* ex.: '5548999999999'), todos os CTAs passam a abrir o WhatsApp.      */
/* Enquanto estiver vazio, os CTAs usam o e-mail.                       */
/* ------------------------------------------------------------------ */
const CONTACT = {
  email: 'contato@upsell.com.br',
  whatsapp: '',
};

const isWhatsApp = CONTACT.whatsapp.length > 0;

function contactHref(subject: string, body = '') {
  if (isWhatsApp) {
    const text = body ? `${subject}\n\n${body}` : subject;
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
  }
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
}

const externalProps = isWhatsApp ? { target: '_blank', rel: 'noopener noreferrer' } : {};

const d = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

/* ------------------------------------------------------------------ */
/* CONTEÚDO                                                             */
/* ------------------------------------------------------------------ */
const services: {
  id: ServiceKey;
  number: string;
  tag: string;
  name: [string, string];
  short: string;
  lead: string;
  forWho: string;
  deliverables: string[];
  promise: string;
  cta: string;
}[] = [
  {
    id: 'trafego',
    number: '01',
    tag: 'MÍDIA',
    name: ['Tráfego', 'pago'],
    short: 'Campanhas e mídia',
    lead: 'Planejamento e gestão de campanhas para alcançar pessoas com maior potencial de se interessar pela sua oferta.',
    forWho: 'Empresas que já vendem e querem previsibilidade na chegada de novos clientes.',
    deliverables: [
      'Planejamento de campanhas no Meta Ads e no Google Ads',
      'Estrutura de rastreamento: pixel, tags e eventos de conversão',
      'Otimizações contínuas, registradas e visíveis no portal',
      'Leitura periódica de resultados com próximos passos',
    ],
    promise: 'Menos verba no escuro. Mais conversas com quem pode comprar.',
    cta: 'Conversar sobre tráfego',
  },
  {
    id: 'sites',
    number: '02',
    tag: 'DIGITAL',
    name: ['Criação', 'de sites'],
    short: 'Presença digital',
    lead: 'Sites com identidade própria, conteúdo bem organizado e caminhos claros para o visitante entender sua oferta.',
    forWho: 'Marcas que precisam ser entendidas em segundos e transformar visita em contato.',
    deliverables: [
      'Roteiro de conteúdo e texto orientados à conversão',
      'Design autoral, sem cara de template',
      'Responsivo, rápido e com SEO técnico de base',
      'Botões e formulários ligados ao seu atendimento',
    ],
    promise: 'Um site que trabalha enquanto você atende.',
    cta: 'Conversar sobre um site',
  },
  {
    id: 'comercial',
    number: '03',
    tag: 'VENDAS',
    name: ['Consultoria', 'comercial'],
    short: 'Processo de vendas',
    lead: 'Uma análise prática do processo comercial para identificar gargalos no atendimento, na qualificação e no acompanhamento de oportunidades.',
    forWho: 'Equipes que recebem contatos, mas perdem oportunidades entre a conversa e o fechamento.',
    deliverables: [
      'Diagnóstico do funil: contato, conversa, proposta e decisão',
      'Roteiros de abordagem e de qualificação',
      'Rotina de follow-up e indicadores de acompanhamento',
      'Plano de ação priorizado por impacto',
    ],
    promise: 'Cada contato tratado como oportunidade, não como sorte.',
    cta: 'Conversar sobre consultoria',
  },
];

const heroWords = ['movem', 'vendem', 'escalam'];

const statement: { text: string; accent?: boolean }[] = [
  { text: 'Anúncio sem um site que converte é' },
  { text: 'verba jogada fora.', accent: true },
  { text: 'Site sem tráfego é' },
  { text: 'vitrine vazia.', accent: true },
  { text: 'E contato sem processo comercial' },
  { text: 'esfria antes da proposta.', accent: true },
  { text: 'A UPSELL atua no elo que está travando o seu crescimento.' },
];

const symptoms: {
  id: ServiceKey;
  n: string;
  pain: string;
  cause: string;
  howWeSolve: string;
  service: string;
}[] = [
  {
    id: 'trafego',
    n: '01',
    pain: 'Você investe em anúncios todo mês, mas não sabe exatamente de onde veio o retorno.',
    cause: 'Falta de rastreamento de conversão e campanhas distribuídas sem leitura clara de CAC.',
    howWeSolve: 'Configuramos pixels e eventos de ponta a ponta para direcionar a verba aos públicos e criativos que realmente trazem clientes.',
    service: 'Solução em Tráfego Pago',
  },
  {
    id: 'sites',
    n: '02',
    pain: 'Seu site até recebe visitas e parece bonito, mas quase ninguém clica para conversar.',
    cause: 'Páginas sem hierarquia de conteúdo, proposta de valor confusa e botões de contato escondidos.',
    howWeSolve: 'Criamos uma página com narrativa persuasiva, carregamento rápido e caminhos óbvios para o visitante virar lead qualificado.',
    service: 'Solução em Criação de Sites',
  },
  {
    id: 'comercial',
    n: '03',
    pain: 'Os contatos até chegam no WhatsApp, mas esfriam e se perdem antes da proposta.',
    cause: 'Atendimento sem padrão de tempo de resposta, sem qualificação prévia e sem rotina de follow-up.',
    howWeSolve: 'Mapeamos onde o lead trava no funil e criamos roteiros práticos para a equipe conduzir o contato até o fechamento.',
    service: 'Solução em Consultoria Comercial',
  },
];

const steps = [
  { n: '01', title: 'Diagnóstico', text: 'Entendemos seu momento, seus números e onde está o gargalo antes de propor qualquer coisa.' },
  { n: '02', title: 'Plano', text: 'Escopo claro: o que será feito, em que ordem e como vamos medir.' },
  { n: '03', title: 'Execução', text: 'Implementamos com registro de cada ação, para você saber o que mudou e por quê.' },
  { n: '04', title: 'Leitura e ajuste', text: 'Analisamos os resultados e definimos os próximos passos com você.' },
];

const portalFeatures = [
  { icon: Activity, title: 'Métricas das campanhas', text: 'Investimento, resultados e evolução em um só painel.' },
  { icon: History, title: 'Histórico de otimizações', text: 'Cada ajuste registrado, com data e motivo.' },
  { icon: LayoutGrid, title: 'Tarefas e entregas', text: 'Acompanhe em um quadro o que está em andamento.' },
  { icon: FileText, title: 'Contratos e documentos', text: 'Tudo o que foi combinado, acessível quando você precisar.' },
];

const principles = [
  { n: 'I', title: 'Escopo antes de começar', text: 'Você sabe o que será entregue antes do primeiro passo.' },
  { n: 'II', title: 'Uma especialidade por vez', text: 'Contrate só o que faz sentido agora. Sem pacote obrigatório.' },
  { n: 'III', title: 'Tudo registrado', text: 'Ações e resultados ficam visíveis no seu portal.' },
];

const faqs = [
  {
    q: 'Preciso contratar os três serviços?',
    a: 'Não. Cada especialidade tem escopo, objetivo e contrato próprios. Você pode começar só pelo tráfego, só pelo site ou só pela consultoria comercial.',
  },
  {
    q: 'Como funciona o portal do cliente?',
    a: 'Cada cliente recebe um acesso protegido onde acompanha métricas, histórico de otimizações, tarefas em andamento e documentos do projeto.',
  },
  {
    q: 'Em quanto tempo vejo resultado?',
    a: 'Depende do ponto de partida e do serviço. No diagnóstico, alinhamos expectativas realistas e os indicadores que vamos acompanhar em cada etapa.',
  },
  {
    q: 'A verba de anúncios está incluída?',
    a: 'Não. O investimento em mídia é pago diretamente às plataformas (Meta e Google), na conta da sua empresa. Nosso trabalho é a estratégia, a gestão e a leitura dos resultados.',
  },
  {
    q: 'Como começa a conversa?',
    a: 'Você conta, no formulário abaixo, qual frente quer explorar. A partir disso, marcamos uma conversa para entender o cenário e dizer com franqueza se faz sentido avançar.',
  },
];

/* ------------------------------------------------------------------ */
/* MICRO-COMPONENTES                                                    */
/* ------------------------------------------------------------------ */
function Magnetic({ children, strength = 0.22, className = '' }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`magnetic inline-flex ${className}`}>
      {children}
    </span>
  );
}

function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((v) => (v + 1) % heroWords.length), 2600);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="rotating-word text-[#ed1c24]">
      <span key={heroWords[index]} className="rotating-word-inner">
        {heroWords[index]}
      </span>
    </span>
  );
}

function ServiceLink({ id, number, name, short, active, onSelect }: {
  id: ServiceKey; number: string; name: string; short: string; active: boolean; onSelect: (id: ServiceKey) => void;
}) {
  return (
    <a
      href={`#${id}`}
      onClick={() => onSelect(id)}
      className={`service-route group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-white/15 py-5 transition-colors ${active ? 'text-[#ff3b42]' : 'text-white/80 hover:text-white'}`}
    >
      <span className={`route-index grid h-8 w-8 place-items-center rounded-full border font-mono text-[10px] transition-colors ${active ? 'border-[#ed1c24] bg-[#ed1c24] text-white' : 'border-white/25 bg-[#111] text-white/70 group-hover:border-white/70'}`}>{number}</span>
      <span>
        <span className="font-display block text-2xl font-black uppercase tracking-[-0.02em] sm:text-3xl">{name}</span>
        <span className={`mt-1 block text-[10px] uppercase tracking-[0.18em] ${active ? 'text-[#ff8388]' : 'text-white/45'}`}>{short}</span>
      </span>
      <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
    </a>
  );
}

function ServiceArt({ id }: { id: ServiceKey }) {
  if (id === 'trafego') {
    return (
      <div className="route-art relative mt-8 min-h-[300px] overflow-hidden bg-[#ed1c24] p-6 text-white md:mt-0 sm:p-10">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/25 route-orbit" />
        <div className="absolute -right-2 -top-10 h-44 w-44 rounded-full border border-white/30" />
        <div className="relative flex h-full min-h-[240px] flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.18em]"><span>Campanhas / análise / otimização</span><BarChart3 className="h-5 w-5" /></div>
          <svg aria-label="Linha animada representando estratégia, execução e aprendizado" viewBox="0 0 600 150" className="mt-8 w-full" preserveAspectRatio="none">
            <path d="M0 125 C70 120 75 65 142 89 S236 112 286 52 S370 90 416 40 S520 62 600 5" fill="none" stroke="white" strokeOpacity=".4" strokeWidth="1" />
            <path d="M0 125 C70 120 75 65 142 89 S236 112 286 52 S370 90 416 40 S520 62 600 5" pathLength="1" fill="none" stroke="white" strokeWidth="2.5" className="chart-draw" />
            <circle r="5" fill="white" className="route-pulse"><animateMotion dur="5s" repeatCount="indefinite" path="M0 125 C70 120 75 65 142 89 S236 112 286 52 S370 90 416 40 S520 62 600 5" /></circle>
            <path d="M0 149H600" stroke="white" strokeOpacity=".25" />
          </svg>
          <div className="flex justify-between text-[9px] uppercase tracking-[0.14em] text-white/75"><span>Estratégia</span><span>Execução</span><span>Aprendizado</span></div>
        </div>
      </div>
    );
  }
  if (id === 'sites') {
    return (
      <div className="route-art site-case relative mt-8 overflow-hidden border border-black/15 bg-[#e9e7e2] p-3 md:mt-0 sm:p-5">
        <div className="site-browser overflow-hidden border border-black/15 bg-white shadow-[0_12px_32px_rgba(20,20,20,.12)]">
          <div className="flex h-7 items-center gap-1.5 border-b border-black/10 bg-[#f4f3f0] px-3"><span className="h-1.5 w-1.5 rounded-full bg-[#ed1c24]" /><span className="h-1.5 w-1.5 rounded-full bg-black/20" /><span className="h-1.5 w-1.5 rounded-full bg-black/20" /><span className="ml-3 flex-1 rounded-sm bg-white px-2 py-1 font-mono text-[7px] text-black/40"><span className="typing-url">ateliernorte.com.br</span></span></div>
          <div className="site-page relative bg-[#f8f7f3]">
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-2.5 sm:px-6"><span className="font-display text-[12px] font-black uppercase sm:text-sm">ATELIÊ NÓ<span className="text-[#ed1c24]">.</span></span><div className="hidden items-center gap-2 text-[6px] font-bold uppercase tracking-[.1em] text-black/55 lg:flex lg:gap-4 lg:text-[7px]"><span>Projetos</span><span>Estúdio</span><span>Processo</span></div><span className="border-b border-[#ed1c24] pb-1 text-[7px] font-black uppercase tracking-[.1em]">Contato ↗</span></div>
            <div className="grid min-h-[168px] grid-cols-2 sm:min-h-[190px]">
              <div className="flex flex-col items-start justify-center px-4 py-4 sm:px-7"><span className="mb-2 text-[7px] font-bold uppercase tracking-[.16em] text-[#ed1c24]">Arquitetura residencial · São Paulo</span><h4 className="font-display text-[clamp(1.45rem,3.2vw,2.7rem)] font-black uppercase leading-[.86]">Espaços<br />feitos para<br /><span className="text-[#ed1c24]">permanecer.</span></h4><p className="mt-2 max-w-[220px] text-[7px] leading-relaxed text-black/55 sm:mt-3 sm:text-[8px]">Projetos autorais pensados para a vida real, do primeiro traço à entrega.</p><span className="mt-3 inline-flex items-center gap-2 bg-[#141414] px-3 py-2 text-[7px] font-bold uppercase tracking-[.1em] text-white sm:mt-4">Ver projetos <ArrowUpRight className="h-2.5 w-2.5" /></span></div>
              <div className="site-project-panel relative m-2 overflow-hidden p-3 sm:m-3 sm:p-4"><div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:18px_18px]" /><div className="site-preview-sweep absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/15 to-transparent" /><div className="relative flex h-full flex-col justify-between"><span className="text-[6px] font-bold uppercase tracking-[.18em] text-white/60 sm:text-[7px]">Projeto em destaque · 2026</span><div><span className="font-display block text-[clamp(1rem,2.2vw,1.8rem)] font-black uppercase leading-[.86]">Casa<br />do <span className="text-[#ed1c24]">Norte.</span></span><span className="mt-2 block h-px w-8 bg-[#ed1c24]" /><span className="mt-2 block text-[6px] uppercase tracking-[.12em] text-white/55">Atibaia, SP · 186 m²</span></div></div><div className="absolute -bottom-8 -right-5 h-24 w-24 rotate-45 border border-white/20" /></div>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 px-4 py-2 text-[6px] font-bold uppercase tracking-[.1em] text-black/45 sm:px-6"><span>Residencial</span><span>Interiores</span><span>Comercial</span><span className="text-[#ed1c24]">01 — 03</span></div>
          </div>
        </div>
        <div className="pointer-events-none mt-2 pl-1 text-[7px] font-bold uppercase tracking-[.14em] text-black/45 sm:text-[8px]">Exemplo de layout · desktop e mobile</div>
      </div>
    );
  }
  return (
    <div className="route-art relative mt-8 flex min-h-[300px] items-center overflow-hidden bg-[#151515] p-6 text-white md:mt-0 sm:p-10">
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
      <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
      <div className="relative grid w-full grid-cols-4 gap-2 text-center">
        <svg aria-hidden="true" className="absolute left-[12.5%] top-[18px] h-px w-[75%] overflow-visible" viewBox="0 0 100 1" preserveAspectRatio="none"><path d="M0 .5H100" stroke="white" strokeOpacity=".32" strokeWidth="1" /><path d="M0 .5H100" stroke="#ed1c24" strokeWidth="2" strokeDasharray="18 82" className="route-draw" /></svg>
        {['Contato', 'Conversa', 'Proposta', 'Decisão'].map((step, index) => (
          <div key={step} className="relative flex flex-col items-center gap-4">
            <span className={`z-10 grid h-9 w-9 place-items-center rounded-full border ${index === 2 ? 'route-pulse border-[#ed1c24] bg-[#ed1c24]' : 'border-white/35 bg-[#151515]'}`}><span className="font-mono text-[10px]">0{index + 1}</span></span>
            <span className="text-[8px] font-bold uppercase tracking-[0.12em] sm:text-[10px]">{step}</span>
            {index === 2 && <span className="absolute -bottom-9 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.14em] text-[#ff5a60] sm:text-[9px]">gargalo comum</span>}
          </div>
        ))}
      </div>
      <span className="absolute bottom-4 left-5 text-[9px] uppercase tracking-[0.15em] text-white/45">Processo comercial / pontos de atenção</span>
    </div>
  );
}

function PortalMock() {
  const bars = [38, 52, 44, 61, 57, 70, 66, 78, 74, 86, 82, 94];
  const logs = [
    { when: 'Hoje', text: 'Público de remarketing refinado' },
    { when: 'Ontem', text: 'Novo criativo em teste A/B' },
    { when: 'Seg', text: 'Verba redistribuída para Google Search' },
  ];
  return (
    <div data-reveal className="reveal-item portal-mock relative overflow-hidden border border-white/10 bg-[#111] p-5 text-white shadow-[0_40px_80px_rgba(0,0,0,.25)] sm:p-7">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <span className="font-display text-sm font-black uppercase">UPSELL<span className="text-[#ed1c24]">✳</span> <span className="ml-1 font-sans text-[9px] font-semibold tracking-[0.16em] text-white/50">Portal do cliente</span></span>
        <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/60"><span className="live-dot h-1.5 w-1.5 rounded-full bg-[#38d27a]" /> Atualizado</span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: 'Investimento', value: 'R$ 8.420' },
          { label: 'Conversas', value: '312' },
          { label: 'Custo / conversa', value: 'R$ 26,99' },
        ].map((kpi, i) => (
          <div key={kpi.label} className="rise border border-white/10 bg-white/[0.03] p-3" style={d(150 + i * 90)}>
            <span className="block text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45">{kpi.label}</span>
            <span className="font-display mt-1 block text-lg font-black sm:text-2xl">{kpi.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-3 flex items-center justify-between text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45"><span>Conversas por semana</span><span className="text-[#ff5a60]">12 semanas</span></div>
        <div className="flex h-28 items-end gap-1.5">
          {bars.map((h, i) => (
            <span key={i} className="portal-bar flex-1 bg-gradient-to-t from-[#ed1c24] to-[#ff6a6f]" style={{ height: `${h}%`, ...d(250 + i * 45) }} />
          ))}
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <span className="block text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45">Histórico de otimizações</span>
        {logs.map((log, i) => (
          <div key={log.text} className="portal-log flex items-center justify-between border-b border-white/10 py-2 text-[11px]" style={d(700 + i * 140)}>
            <span className="flex items-center gap-2 text-white/85"><span className="h-1 w-1 rounded-full bg-[#ed1c24]" />{log.text}</span>
            <span className="font-mono text-[9px] text-white/40">{log.when}</span>
          </div>
        ))}
      </div>
      <span className="mt-4 block text-[8px] uppercase tracking-[0.14em] text-white/35">Visualização ilustrativa · dados fictícios</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PÁGINA                                                               */
/* ------------------------------------------------------------------ */
export function HomeExperience({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [activeService, setActiveService] = useState<ServiceKey>('trafego');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [brief, setBrief] = useState<{ services: ServiceKey[]; name: string; company: string; message: string }>({
    services: [],
    name: '',
    company: '',
    message: '',
  });
  const [briefError, setBriefError] = useState<string | null>(null);

  const progressRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const mobileCtaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const sections = services
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const words = statementRef.current ? Array.from(statementRef.current.querySelectorAll<HTMLElement>('.hl-word')) : [];
    const stepEls = processRef.current ? Array.from(processRef.current.querySelectorAll<HTMLElement>('[data-step]')) : [];

    let revealObserver: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      root.classList.add('has-scroll-reveal');
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver?.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => revealObserver?.observe(el));
    } else {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const maxScroll = root.scrollHeight - vh;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;

      const litLine = vh * 0.64;
      words.forEach((w) => w.classList.toggle('is-lit', w.getBoundingClientRect().top < litLine));

      if (processRef.current) {
        const r = processRef.current.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height * 0.75)));
        processRef.current.style.setProperty('--p', p.toFixed(3));
        stepEls.forEach((s, i) => {
          const threshold = Math.max(0.02, i / Math.max(1, stepEls.length - 1) - 0.02);
          s.classList.toggle('is-active', p >= threshold);
        });
      }

      mobileCtaRef.current?.classList.toggle('is-shown', window.scrollY > vh * 0.8);

      if (window.scrollY < 100) {
        setActiveService((c) => (c === 'trafego' ? c : 'trafego'));
        return;
      }
      const servicesIntro = document.getElementById('servicos');
      if (!servicesIntro || servicesIntro.getBoundingClientRect().top > vh * 0.42) {
        setActiveService((c) => (c === 'trafego' ? c : 'trafego'));
        return;
      }
      const focusLine = vh * 0.42;
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= focusLine && rect.bottom > focusLine;
      });
      if (current) setActiveService((c) => (c === current.id ? c : (current.id as ServiceKey)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      revealObserver?.disconnect();
      root.classList.remove('has-scroll-reveal');
    };
  }, []);

  const onCardMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 5}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 7}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };
  const onCardLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const toggleBriefService = (id: ServiceKey) =>
    setBrief((b) => ({ ...b, services: b.services.includes(id) ? b.services.filter((s) => s !== id) : [...b.services, id] }));

  const preselectAndScroll = (id: ServiceKey) => {
    setBrief((b) => (b.services.includes(id) ? b : { ...b, services: [...b.services, id] }));
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submitBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.name.trim() || brief.services.length === 0) {
      setBriefError('Escolha pelo menos um caminho e informe seu nome.');
      return;
    }
    setBriefError(null);
    const chosen = services.filter((s) => brief.services.includes(s.id)).map((s) => s.name.join(' ')).join(', ');
    const body = [
      `Nome: ${brief.name}`,
      brief.company ? `Empresa: ${brief.company}` : '',
      `Interesse: ${chosen}`,
      brief.message ? `\nContexto: ${brief.message}` : '',
    ].filter(Boolean).join('\n');
    const href = contactHref('Quero conversar | UPSELL', body);
    if (isWhatsApp) window.open(href, '_blank', 'noopener,noreferrer');
    else window.location.href = href;
  };

  const activeIndex = services.findIndex((item) => item.id === activeService);
  const marqueeItems = ['Tráfego pago', 'Criação de sites', 'Consultoria comercial', 'Meta Ads', 'Google Ads', 'Funil de vendas', 'Portal do cliente', 'Estratégia com dados'];

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f7f7f4] text-[#141414] selection:bg-[#ed1c24] selection:text-white">
      {/* Barra de progresso de leitura */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent">
        <div ref={progressRef} className="h-full origin-left bg-[#ed1c24]" style={{ transform: 'scaleX(0)' }} />
      </div>

      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f7f7f4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10 lg:px-14">
          <a href="#topo" onClick={() => setActiveService('trafego')} aria-label="UPSELL, início" className="font-display flex items-center gap-1 text-2xl font-black tracking-[-0.02em]">
            UPSELL<span className="logo-star text-[#ed1c24]">✳</span>
          </a>
          <nav className="hidden items-center gap-8 text-[10px] font-bold uppercase tracking-[0.16em] lg:flex">
            <a className="nav-link" href="#servicos">Serviços</a>
            <a className="nav-link" href="#processo">Como trabalhamos</a>
            <a className="nav-link" href="#portal">Portal</a>
            <a className="nav-link" href="#faq">Dúvidas</a>
            <button className="nav-link inline-flex items-center gap-1.5" onClick={onOpenAuth}><Lock className="h-3 w-3" /> Área do cliente</button>
          </nav>
          <Magnetic className="hidden sm:inline-flex">
            <a href="#contato" className="btn-fill group inline-flex items-center gap-2 bg-[#ed1c24] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              <span className="relative z-10">Vamos conversar</span> <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Magnetic>
          <button className="p-2 lg:hidden" aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="mobile-menu grid gap-4 border-t border-black/10 px-5 py-6 text-xs font-bold uppercase tracking-widest lg:hidden">
            <a href="#servicos" onClick={() => setMobileMenuOpen(false)}>Serviços</a>
            <a href="#processo" onClick={() => setMobileMenuOpen(false)}>Como trabalhamos</a>
            <a href="#portal" onClick={() => setMobileMenuOpen(false)}>Portal</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>Dúvidas</a>
            <button className="text-left" onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}>Área do cliente</button>
            <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="text-[#ed1c24]">Vamos conversar ↗</a>
          </nav>
        )}
      </header>

      <main id="topo">
        {/* ============================== HERO ============================== */}
        <section className="swiss-grid relative mx-auto max-w-[1440px] px-5 pb-12 pt-10 sm:px-10 sm:pb-16 sm:pt-14 lg:px-14">
          <div className="mb-8 flex items-center justify-between border-b border-black/15 pb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-black/55 sm:text-[10px]">
            <span>UPSELL / Estratégia e criação</span>
            <span className="hidden sm:inline">Serviços independentes · {new Date().getFullYear()}</span>
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
            <div className="relative z-10">
              <p className="hero-eyebrow mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#ed1c24]">
                <span className="h-px w-8 bg-[#ed1c24]" /> Uma marca. Três especialidades.
              </p>
              <h1 className="hero-title font-display max-w-4xl text-[clamp(4.2rem,11.5vw,10.8rem)] font-black uppercase leading-[.84] tracking-[-0.03em]">
                <span className="hero-line block"><span className="hero-line-inner block">Ideias que</span></span>
                <span className="hero-line block"><span className="hero-line-inner block"><RotatingWord /></span></span>
                <span className="hero-line block"><span className="hero-line-inner block">negócios<span className="text-[#ed1c24]">.</span></span></span>
              </h1>
              <div className="hero-copy mt-8 flex max-w-xl items-start gap-4">
                <span className="mt-1 h-12 w-1 shrink-0 bg-[#ed1c24]" />
                <p className="max-w-lg text-base leading-relaxed text-black/70 sm:text-lg">
                  Tráfego pago, criação de sites e consultoria comercial. <strong className="font-semibold text-black">Escolha a frente que sua empresa precisa agora</strong> e acompanhe cada passo em um portal próprio.
                </p>
              </div>
              <div className="hero-ctas mt-9 flex flex-wrap items-center gap-5">
                <Magnetic>
                  <a href="#contato" className="btn-fill group inline-flex items-center gap-3 bg-[#141414] px-7 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-white">
                    <span className="relative z-10">Quero conversar</span>
                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Magnetic>
                <a href="#servicos" className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.17em] hover:text-[#ed1c24]">
                  Explore os serviços <ArrowDown className="h-4 w-4 text-[#ed1c24] transition-transform group-hover:translate-y-1" />
                </a>
              </div>
              <ul className="hero-trust mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/55">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#ed1c24]" /> Contratação por especialidade</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#ed1c24]" /> Acompanhamento em portal próprio</li>
              </ul>
            </div>

            <div
              ref={cardRef}
              onPointerMove={onCardMove}
              onPointerLeave={onCardLeave}
              className="tilt-card hero-card relative mx-auto w-full max-w-[560px] overflow-hidden bg-[#111] px-6 py-8 text-white sm:px-10 sm:py-10"
            >
              <div aria-hidden="true" className="route-corner absolute right-0 top-0 grid h-24 w-24 place-items-center bg-[#ed1c24] sm:h-32 sm:w-32">
                <span key={activeIndex} className="corner-num font-display text-5xl font-black text-white/95 sm:text-6xl">0{activeIndex + 1}</span>
              </div>
              <div className="relative z-10 flex items-center justify-between pr-24 text-[9px] uppercase tracking-[0.2em] text-white/55 sm:pr-32">
                <span>Escolha seu caminho</span><span>{String(activeIndex + 1).padStart(2, '0')} / 03</span>
              </div>
              <div className="relative z-10 mt-8">
                <svg aria-hidden="true" viewBox="0 0 56 240" className="connecting-route pointer-events-none absolute left-0 top-0 h-full w-12" preserveAspectRatio="none">
                  <path d="M24 40 C47 54 47 106 24 120 S1 185 24 200" fill="none" stroke="white" strokeOpacity=".2" strokeWidth="1.25" />
                  <path d="M24 40 C47 54 47 106 24 120 S1 185 24 200" pathLength="1" fill="none" stroke="#ed1c24" strokeWidth="1.6" strokeDasharray=".12 .88" strokeLinecap="round" className="service-route-flow" />
                  <circle cx="24" cy="40" r="4" className={`service-route-node ${activeService === 'trafego' ? 'is-active' : ''}`} />
                  <circle cx="24" cy="120" r="4" className={`service-route-node ${activeService === 'sites' ? 'is-active' : ''}`} />
                  <circle cx="24" cy="200" r="4" className={`service-route-node ${activeService === 'comercial' ? 'is-active' : ''}`} />
                  <circle r="2.5" className="service-route-runner"><animateMotion dur="5.8s" repeatCount="indefinite" path="M24 40 C47 54 47 106 24 120 S1 185 24 200" /></circle>
                </svg>
                <div className="relative space-y-2 pl-1">
                  {services.map((service) => (
                    <ServiceLink key={service.id} id={service.id} number={service.number} name={service.name.join(' ')} short={service.short} active={activeService === service.id} onSelect={setActiveService} />
                  ))}
                </div>
              </div>
              <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/15 pt-4 text-[9px] uppercase tracking-[0.16em] text-white/45">
                <span>Contratações separadas</span><span className="text-[#ed1c24]">A linha guia. Você escolhe.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ MARQUEE ============================ */}
        <div aria-hidden="true" className="relative z-10 -rotate-[1.2deg] scale-[1.03] overflow-hidden border-y-2 border-[#141414] bg-[#ed1c24] py-4 text-white">
          <div className="animate-marquee">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {marqueeItems.map((item) => (
                  <span key={`${dup}-${item}`} className="font-display flex items-center gap-8 pr-8 text-3xl font-black uppercase sm:text-5xl">
                    {item}<span className="text-[#141414]">✳</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ========================= DECLARAÇÃO / DOR ========================= */}
        <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-10 sm:py-28 lg:px-14">
          <p className="mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#ed1c24]"><span className="h-px w-8 bg-[#ed1c24]" /> O ponto de partida</p>
          <p ref={statementRef} className="statement font-display max-w-6xl text-[clamp(2.2rem,5.4vw,5.2rem)] font-black uppercase leading-[.95] tracking-[-0.015em]">
            {statement.map((seg, si) => (
              <React.Fragment key={si}>
                {seg.text.split(' ').map((word, wi) => (
                  <React.Fragment key={`${si}-${wi}`}>
                    <span className="hl-word" data-accent={seg.accent ? 'true' : undefined}>{word}</span>{' '}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </p>

          <div className="mt-16 grid gap-px border border-black/15 bg-black/15 md:grid-cols-3">
            {symptoms.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActiveService(s.id)}
                data-reveal
                style={d(i * 120)}
                className="symptom reveal-item group relative flex flex-col justify-between overflow-hidden bg-[#f7f7f4] p-6 sm:p-8"
              >
                <span className="symptom-fill absolute inset-0 origin-bottom bg-[#141414]" aria-hidden="true" />
                
                {/* Cabeçalho do Card */}
                <div className="relative mb-6">
                  <div className="flex items-center justify-between font-mono text-xs text-[#ed1c24]">
                    <span>{s.n} / Diagnóstico de Gargalo</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <h3 className="mt-3 text-lg sm:text-xl font-bold leading-snug text-[#141414] transition-colors duration-500 group-hover:text-white">
                    “{s.pain}”
                  </h3>
                </div>

                {/* Conexão Causa -> Como a UPSELL Resolve */}
                <div className="relative my-4 space-y-3 border-y border-black/10 py-4 transition-colors duration-500 group-hover:border-white/15">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-black/45 transition-colors duration-500 group-hover:text-white/40">
                      Por que isso acontece:
                    </span>
                    <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-black/70 transition-colors duration-500 group-hover:text-white/70">
                      {s.cause}
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-[#ed1c24] transition-colors duration-500 group-hover:text-[#ff8388]">
                      Como a UPSELL resolve:
                    </span>
                    <p className="mt-1 text-xs sm:text-[13px] font-medium leading-relaxed text-[#141414] transition-colors duration-500 group-hover:text-white">
                      {s.howWeSolve}
                    </p>
                  </div>
                </div>

                {/* Rodapé do Card com CTA para a seção */}
                <div className="relative mt-4 flex items-center justify-between pt-2">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#ed1c24] transition-colors duration-500 group-hover:text-[#ff8388]">
                    <span className="h-px w-5 bg-[#ed1c24] transition-colors duration-500 group-hover:bg-[#ff8388]" />
                    {s.service}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/40 transition-colors duration-500 group-hover:text-white/50">
                    Ver detalhes ↓
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ============================ SERVIÇOS ============================ */}
        <section id="servicos" className="border-y border-black/10 bg-white px-5 py-16 sm:px-10 sm:py-24 lg:px-14">
          <div className="mx-auto max-w-[1440px]">
            <div data-reveal className="reveal-item mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#ed1c24]">Selecione uma especialidade</p>
                <h2 className="font-display max-w-3xl text-5xl font-black uppercase leading-[.88] tracking-[-0.02em] sm:text-7xl">Três caminhos.<br />Cada um com <span className="text-[#ed1c24]">seu foco.</span></h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-black/60">Conheça cada serviço por conta própria. Não é necessário contratar os outros para começar.</p>
            </div>

            {services.map((service, si) => (
              <section
                key={service.id}
                id={service.id}
                data-reveal
                className={`service-chapter reveal-item relative grid scroll-mt-24 border-t border-black/15 py-12 md:grid-cols-[.85fr_1.15fr] md:gap-16 ${si === services.length - 1 ? 'border-b' : ''}`}
              >
                <span aria-hidden="true" className="outline-num font-display pointer-events-none absolute -top-4 right-0 hidden text-[12rem] font-black leading-none md:block">{service.number}</span>
                <div className="relative flex min-w-0 flex-col justify-between">
                  <div>
                    <span className="rise font-mono text-xs text-[#ed1c24]" style={d(0)}>{service.number} / {service.tag}</span>
                    <h3 className="motion-heading font-display mt-5 max-w-md text-6xl font-black uppercase leading-[.86] tracking-[-0.02em] md:text-7xl 2xl:text-8xl">
                      <span className="text-line"><span>{service.name[0]}</span></span>
                      <span className="text-line"><span>{service.name[1]}<span className="text-[#ed1c24]">.</span></span></span>
                    </h3>
                    <p className="rise mt-5 max-w-md text-base leading-relaxed text-black/65" style={d(200)}>{service.lead}</p>

                    <div className="rise mt-6 max-w-md border-l-2 border-[#ed1c24] pl-4" style={d(280)}>
                      <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">Para quem é</span>
                      <span className="mt-1 block text-sm font-medium leading-relaxed">{service.forWho}</span>
                    </div>

                    <ul className="mt-6 max-w-md space-y-2.5">
                      {service.deliverables.map((item, i) => (
                        <li key={item} className="rise flex items-start gap-3 text-sm leading-snug text-black/80" style={d(360 + i * 80)}>
                          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center bg-[#141414] text-white"><Check className="h-2.5 w-2.5" strokeWidth={3} /></span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <p className="rise font-display mt-8 max-w-md text-2xl font-black uppercase leading-[1] tracking-[-0.01em] text-[#ed1c24]" style={d(700)}>{service.promise}</p>
                  </div>
                  <div className="rise mt-8 flex flex-wrap items-center gap-5" style={d(780)}>
                    <button onClick={() => preselectAndScroll(service.id)} className="btn-fill group inline-flex items-center gap-3 bg-[#141414] px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                      <span className="relative z-10">{service.cta}</span> <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
                <div className="relative md:sticky md:top-28 md:self-start">
                  <ServiceArt id={service.id} />
                </div>
              </section>
            ))}
          </div>
        </section>

        {/* ============================ PROCESSO ============================ */}
        <section id="processo" className="relative overflow-hidden bg-[#111] px-5 py-20 text-white sm:px-10 sm:py-28 lg:px-14">
          <div aria-hidden="true" className="dark-grid absolute inset-0 opacity-60" />
          <div className="relative mx-auto max-w-[1440px]">
            <div data-reveal className="reveal-item mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff5a60]">Como trabalhamos</p>
                <h2 className="font-display max-w-3xl text-5xl font-black uppercase leading-[.88] tracking-[-0.02em] sm:text-7xl">Método antes<br />de <span className="text-[#ed1c24]">movimento.</span></h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-white/60">Seja qual for a especialidade, o caminho é o mesmo: entender, planejar, executar e ler os resultados com você.</p>
            </div>

            <div ref={processRef} className="process relative" style={{ '--p': 0 } as React.CSSProperties}>
              <div aria-hidden="true" className="absolute left-0 right-0 top-[22px] hidden h-px bg-white/15 md:block">
                <div className="process-fill h-full origin-left bg-[#ed1c24]" />
              </div>
              <div aria-hidden="true" className="absolute bottom-0 left-[22px] top-0 w-px bg-white/15 md:hidden">
                <div className="process-fill-v w-full origin-top bg-[#ed1c24]" />
              </div>
              <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
                {steps.map((step) => (
                  <li key={step.n} data-step className="process-step relative pl-16 md:pl-0">
                    <span className="process-dot absolute left-0 top-0 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-[#111] font-mono text-xs md:relative">{step.n}</span>
                    <h3 className="font-display mt-0 text-3xl font-black uppercase md:mt-8">{step.title}</h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ============================== PORTAL ============================== */}
        <section id="portal" className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 sm:px-10 sm:py-28 lg:grid-cols-[.95fr_1.05fr] lg:gap-20 lg:px-14">
          <div data-reveal className="reveal-item">
            <p className="mb-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#ed1c24]"><span className="h-px w-8 bg-[#ed1c24]" /> Portal do cliente</p>
            <h2 className="font-display text-5xl font-black uppercase leading-[.88] tracking-[-0.02em] sm:text-7xl">Transparência<br />não é promessa.<br /><span className="text-[#ed1c24]">É acesso.</span></h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-black/65">Você não precisa pedir relatório para saber o que está acontecendo. Cada cliente acompanha o projeto em um ambiente próprio e protegido.</p>
            <div className="mt-10 grid gap-px border border-black/15 bg-black/15 sm:grid-cols-2">
              {portalFeatures.map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="rise group bg-[#f7f7f4] p-5 transition-colors duration-300 hover:bg-white" style={d(150 + i * 100)}>
                  <Icon className="h-5 w-5 text-[#ed1c24] transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <span className="mt-4 block text-sm font-bold">{title}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-black/60">{text}</span>
                </div>
              ))}
            </div>
            <button onClick={onOpenAuth} className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#141414] pb-2 text-[10px] font-black uppercase tracking-[0.16em] transition-colors hover:border-[#ed1c24] hover:text-[#ed1c24]">
              <Lock className="h-3.5 w-3.5" /> Já sou cliente: acessar portal
            </button>
          </div>
          <PortalMock />
        </section>

        {/* ============================== SOBRE ============================== */}
        <section id="sobre" className="border-t border-black/10 bg-white px-5 py-20 sm:px-10 sm:py-24 lg:px-14">
          <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[.8fr_1.2fr]">
            <div data-reveal className="reveal-item">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ed1c24]">A UPSELL</p>
              <h2 className="font-display mt-4 text-5xl font-black uppercase leading-[.86] tracking-[-0.02em] sm:text-7xl">Trabalho<br />com intenção<span className="text-[#ed1c24]">.</span></h2>
            </div>
            <div className="self-end">
              <p data-reveal className="reveal-item max-w-2xl text-lg leading-relaxed text-black/70">Cada serviço tem seu próprio objetivo, escopo e conversa. Você pode contratar a especialidade que faz sentido para sua empresa neste momento.</p>
              <div className="mt-10 grid gap-8 sm:grid-cols-3">
                {principles.map((p, i) => (
                  <div key={p.n} data-reveal style={d(i * 120)} className="reveal-item border-t-2 border-[#141414] pt-4">
                    <span className="font-display text-3xl font-black text-[#ed1c24]">{p.n}</span>
                    <span className="mt-2 block text-sm font-bold uppercase tracking-[0.04em]">{p.title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-black/60">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =============================== FAQ =============================== */}
        <section id="faq" className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-10 sm:py-28 md:grid-cols-[.8fr_1.2fr] lg:px-14">
          <div data-reveal className="reveal-item">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ed1c24]">Antes de conversar</p>
            <h2 className="font-display mt-4 text-5xl font-black uppercase leading-[.86] tracking-[-0.02em] sm:text-7xl">Perguntas<br />diretas<span className="text-[#ed1c24]">.</span></h2>
          </div>
          <div className="border-t border-black/15">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className="border-b border-black/15">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={`text-lg font-semibold transition-colors sm:text-xl ${open ? 'text-[#ed1c24]' : 'group-hover:text-[#ed1c24]'}`}>{item.q}</span>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center border transition-all duration-500 ${open ? 'rotate-45 border-[#ed1c24] bg-[#ed1c24] text-white' : 'border-black/25'}`}>
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 text-base leading-relaxed text-black/65">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ========================== CONTATO / RODAPÉ ========================== */}
      <footer id="contato" className="relative overflow-hidden bg-[#ed1c24] px-5 py-16 text-white sm:px-10 sm:py-24 lg:px-14">
        <span aria-hidden="true" className="footer-star font-display pointer-events-none absolute -right-16 -top-24 text-[26rem] font-black leading-none text-white/[0.07]">✳</span>
        <div className="relative mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div data-reveal className="reveal-item">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em]">Uma conversa de cada vez</span>
            <h2 className="font-display mt-4 max-w-3xl text-6xl font-black uppercase leading-[.84] tracking-[-0.02em] sm:text-8xl">Qual caminho<br />você quer<br />explorar?</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/85">Conte em poucas linhas onde está o gargalo. A primeira conversa serve para entender o seu cenário e dizer, com franqueza, se faz sentido avançar.</p>
          </div>

          <form onSubmit={submitBrief} data-reveal className="reveal-item bg-[#141414] p-6 sm:p-8" noValidate>
            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">01 · O que você quer explorar?</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {services.map((s) => {
                const on = brief.services.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleBriefService(s.id)}
                    aria-pressed={on}
                    className={`chip inline-flex items-center gap-2 border px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${on ? 'border-[#ed1c24] bg-[#ed1c24] text-white' : 'border-white/25 text-white/75 hover:border-white'}`}
                  >
                    {on ? <Check className="h-3 w-3" strokeWidth={3} /> : <Plus className="h-3 w-3" />}
                    {s.name.join(' ')}
                  </button>
                );
              })}
            </div>

            <span className="mt-7 block text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">02 · Sobre você</span>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={brief.name}
                onChange={(e) => setBrief((b) => ({ ...b, name: e.target.value }))}
                placeholder="Seu nome *"
                aria-label="Seu nome"
                className="field border-b border-white/25 bg-transparent py-3 text-sm text-white placeholder:text-white/40 focus:border-[#ed1c24] focus:outline-none"
              />
              <input
                value={brief.company}
                onChange={(e) => setBrief((b) => ({ ...b, company: e.target.value }))}
                placeholder="Empresa"
                aria-label="Empresa"
                className="field border-b border-white/25 bg-transparent py-3 text-sm text-white placeholder:text-white/40 focus:border-[#ed1c24] focus:outline-none"
              />
            </div>
            <textarea
              value={brief.message}
              onChange={(e) => setBrief((b) => ({ ...b, message: e.target.value }))}
              placeholder="Em uma frase: o que está travando seu crescimento hoje?"
              aria-label="Contexto"
              rows={2}
              className="field mt-3 w-full resize-none border-b border-white/25 bg-transparent py-3 text-sm text-white placeholder:text-white/40 focus:border-[#ed1c24] focus:outline-none"
            />
            {briefError && <p className="mt-3 text-xs font-semibold text-[#ff8388]">{briefError}</p>}
            <button type="submit" className="btn-fill btn-fill-light group mt-7 inline-flex w-full items-center justify-between gap-3 bg-white px-6 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#141414]">
              <span className="relative z-10">{isWhatsApp ? 'Enviar pelo WhatsApp' : 'Enviar e iniciar conversa'}</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button type="button" onClick={onOpenAuth} className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-white">
              <MessageCircle className="h-3.5 w-3.5" /> Já sou cliente? Acessar portal
            </button>
          </form>
        </div>
        <div className="relative mx-auto mt-16 flex max-w-[1440px] flex-col justify-between gap-3 border-t border-white/30 pt-5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/75 sm:flex-row">
          <span>UPSELL ✳</span>
          <span>Tráfego pago · Criação de sites · Consultoria comercial</span>
          <a href={contactHref('Contato | UPSELL')} {...externalProps} className="hover:text-white">{isWhatsApp ? 'WhatsApp' : CONTACT.email}</a>
          <span>© {new Date().getFullYear()} UPSELL</span>
        </div>
      </footer>

      {/* CTA fixo no mobile */}
      <div ref={mobileCtaRef} className="mobile-cta fixed inset-x-3 bottom-3 z-40 md:hidden">
        <a href="#contato" className="flex items-center justify-between bg-[#141414] px-5 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(0,0,0,.3)]">
          Vamos conversar <span className="grid h-7 w-7 place-items-center bg-[#ed1c24]"><ArrowUpRight className="h-4 w-4" /></span>
        </a>
      </div>
    </div>
  );
}
