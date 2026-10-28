'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';

export function EditorialAtuacao() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyColRef = useRef<HTMLDivElement>(null);
  const [activeHoverPillar, setActiveHoverPillar] = useState<number | null>(null);

  // Parallax mouse position for each pillar watermark
  const [mouseOffsets, setMouseOffsets] = useState<{ [key: number]: { x: number; y: number } }>({});

  const pilares = [
    {
      num: '01',
      romano: 'I',
      categoria: 'Mídia & Aquisição Consciente',
      titulo: 'Gestão de Tráfego Pago',
      subtitulo: 'Meta Ads e Google Ads com foco em intenção real de busca e controle de verba.',
      descricao:
        'Evitamos métricas de vaidade. Gerenciamos os orçamentos em Meta Ads e Google Search com base no perfil de cliente desejado, subida metódica de campanhas, análise de dados de resultados e rotina disciplinada de negativação de buscas irrelevantes.',
      entregaveis: [
        'Criação e subida de campanhas no Meta Ads e Google Ads',
        'Campanhas de Google Search focadas em termos de intenção clara',
        'Negativação frequente de buscas curiosas ou fora de escopo',
        'Análise de dados dos resultados do tráfego pago',
        'Registro transparente de alterações e alinhamentos no Portal do Cliente'
      ],
      impacto: 'Maior controle sobre o custo por contato e clareza sobre o destino de cada real alocado.'
    },
    {
      num: '02',
      romano: 'II',
      categoria: 'Presença Digital & Clareza',
      titulo: 'Criação de Sites & Interfaces',
      subtitulo: 'Páginas diretas e leves, concebidas para informar sem ruídos ou artifícios.',
      descricao:
        'A página de destino precisa esclarecer as dúvidas do interessado com rapidez, sem promessas grandiosas ou poluição visual. Desenvolvemos interfaces rápidas, com tipografia limpa, carregamento veloz e foco na clareza do serviço prestado.',
      entregaveis: [
        'Estrutura visual limpa com tipografia legível e hierarquia clara',
        'Carregamento ágil no celular e nos navegadores desktop',
        'Textos objetivos sobre a atuação e os diferenciais reais da empresa',
        'Encaminhamento direto e simples para o canal de contato no WhatsApp',
        'Marcação técnica de eventos para mensuração confiável de conversões'
      ],
      impacto: 'Clareza na apresentação da empresa e facilidade de contato para o visitante.'
    },
    {
      num: '03',
      romano: 'III',
      categoria: 'Processo & Acolhimento Comercial',
      titulo: 'Análise e Acompanhamento do Processo Comercial',
      subtitulo: 'O tráfego atrai interessados; o atendimento define a relação.',
      descricao:
        'Analisamos o fluxo de atendimento da sua equipe no WhatsApp, tempos de primeira resposta e principais dúvidas relatadas, buscando que os contatos gerados pelos anúncios sejam respondidos com presteza e alinhamento.',
      entregaveis: [
        'Diagnóstico do tempo de primeira resposta no WhatsApp',
        'Confronto entre contatos gerados pelos anúncios e conversas iniciadas',
        'Sugestões de roteiros para esclarecimento claro de dúvidas frequentes',
        'Identificação de gargalos entre o clique no anúncio e a resposta inicial',
        'Alinhamento periódico para ajuste de público e expectativas'
      ],
      impacto: 'Melhor aproveitamento dos contatos gerados e sintonia entre mídia e equipe de atendimento.'
    }
  ];

  // GSAP ScrollTrigger hairline scrub & block reveals
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hairlines that draw themselves from left to right linked to scroll (scrub)
      const hairlines = gsap.utils.toArray<HTMLElement>('.pillar-scrub-hairline');
      hairlines.forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left',
            ease: 'none',
            scrollTrigger: {
              trigger: line,
              start: 'top 92%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );
      });

      // 2. Smooth block entrance
      const blocks = gsap.utils.toArray<HTMLElement>('.editorial-pillar-block');
      blocks.forEach((block) => {
        gsap.from(block, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMovePillar = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 24;
    setMouseOffsets((prev) => ({ ...prev, [index]: { x, y } }));
  };

  const handleMouseLeavePillar = (index: number) => {
    setMouseOffsets((prev) => ({ ...prev, [index]: { x: 0, y: 0 } }));
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá! Gostaria de consultar a disponibilidade de atendimento da UPSELL para a minha empresa.'
    );
    window.open(`https://api.whatsapp.com/send?phone=5511987654321&text=${text}`, '_blank');
  };

  return (
    <section
      ref={sectionRef}
      id="atuacao"
      className="py-16 sm:py-24 px-6 sm:px-12 max-w-7xl mx-auto hairline-b relative"
    >
      {/* 1. ASYMMETRIC EDITORIAL MAGAZINE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LADO ESQUERDO: Sticky Title & Editorial Context (4 colunas) */}
        <div
          ref={stickyColRef}
          className="lg:col-span-4 lg:sticky lg:top-28 sm:lg:top-36 space-y-8"
        >
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#c8a97e] font-light mb-3 font-mono">
              <span>§ 02</span>
              <span>·</span>
              <span>Metodologia & Escopo</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#eae8e3] font-normal leading-[1.05] tracking-tight">
              Nossa <br />
              <span className="italic text-[#dfc7a7]">Atuação.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#9d9ba7] leading-relaxed font-light max-w-sm">
            Três dimensões que operam em uníssono. Acreditamos que a mídia só gera escala duradoura quando a presença digital transmite autoridade e o processo comercial sabe acolher o lead com sofisticação.
          </p>

          {/* Quick Pillar Jump Navigation */}
          <div className="pt-4 hairline-t space-y-2.5 text-xs text-[#8e8d96]">
            <span className="text-[10px] uppercase tracking-widest text-[#8e8d96]/70 block mb-2 font-mono">
              Os 3 Pilares Estruturais
            </span>
            {pilares.map((p, idx) => (
              <div
                key={p.num}
                className={`flex items-center gap-3 py-1 transition-colors ${
                  activeHoverPillar === idx ? 'text-[#eae8e3] font-medium' : 'text-[#8e8d96]'
                }`}
              >
                <span className="font-serif italic text-sm text-[#c8a97e]">{p.num}</span>
                <span className="text-xs">{p.titulo}</span>
              </div>
            ))}
          </div>

          {/* Consultation CTA */}
          <div className="pt-6 hairline-t">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#eae8e3] hover:text-[#c8a97e] transition-colors"
            >
              <span>Consultar disponibilidade</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#c8a97e] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <span className="block text-[11px] text-[#8e8d96]/60 mt-1 font-light">
              Florianópolis · Atendimento Nacional
            </span>
          </div>
        </div>

        {/* LADO DIREITO: 3 Pilares em Blocos Generosos (8 colunas) */}
        <div className="lg:col-span-8 space-y-20 sm:space-y-28">
          {pilares.map((pilar, index) => {
            const offset = mouseOffsets[index] || { x: 0, y: 0 };
            const isHovered = activeHoverPillar === index;

            return (
              <div
                key={pilar.num}
                className="editorial-pillar-block relative group"
                onMouseEnter={() => setActiveHoverPillar(index)}
                onMouseLeave={() => {
                  setActiveHoverPillar(null);
                  handleMouseLeavePillar(index);
                }}
                onMouseMove={(e) => handleMouseMovePillar(e, index)}
              >
                {/* 1. Hairline que se desenha da esquerda para a direita vinculada ao scroll (ScrollTrigger com scrub) */}
                <div
                  className="pillar-scrub-hairline w-full h-px bg-gradient-to-r from-[#c8a97e]/60 via-white/15 to-transparent mb-8 sm:mb-12 origin-left will-change-transform"
                />

                {/* Container do Bloco com Microinteração de Hover (Brilho Quente #c8a97e a 3%) */}
                <div
                  className={`relative p-6 sm:p-10 rounded-2xl transition-all duration-500 ease-out border ${
                    isHovered
                      ? 'bg-[#c8a97e]/[0.035] border-white/10 shadow-2xl'
                      : 'bg-transparent border-transparent'
                  }`}
                >
                  {/* Numeral Gigante em Serifa Fina como Marca d'Água de Fundo (com Parallax Mouse Move) */}
                  <div
                    aria-hidden="true"
                    className="pillar-watermark absolute top-0 right-4 sm:right-8 font-serif italic text-8xl sm:text-[11rem] font-light pointer-events-none select-none tracking-tighter transition-transform duration-300 ease-out z-0 text-[#c8a97e]/[0.07] group-hover:text-[#c8a97e]/[0.12]"
                    style={{
                      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                      willChange: 'transform',
                    }}
                  >
                    {pilar.num}
                  </div>

                  {/* Conteúdo em Primeiro Plano */}
                  <div className="relative z-10 space-y-6">
                    {/* Categoria Editorial */}
                    <div className="flex items-center gap-3">
                      <span className="font-serif italic text-base text-[#c8a97e]">
                        {pilar.romano}
                      </span>
                      <span className="text-[#8e8d96]/30">/</span>
                      <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-[0.2em] text-[#8e8d96]">
                        {pilar.categoria}
                      </span>
                    </div>

                    {/* Título Principal do Pilar */}
                    <div>
                      <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#eae8e3] font-normal tracking-tight group-hover:text-white transition-colors">
                        {pilar.titulo}
                      </h3>
                      <p className="font-serif italic text-lg sm:text-xl text-[#dfc7a7] font-normal mt-1.5">
                        {pilar.subtitulo}
                      </p>
                    </div>

                    {/* Descrição Madura */}
                    <p className="text-xs sm:text-sm text-[#9d9ba7] leading-relaxed font-light max-w-2xl">
                      {pilar.descricao}
                    </p>

                    {/* Lista Detalhada de Entregáveis com Marcadores Minimalistas (Traços "—") */}
                    <div className="pt-6 hairline-t space-y-3">
                      <span className="text-[10px] uppercase tracking-widest text-[#8e8d96] font-mono block mb-2">
                        Escopo & Entregáveis Chave
                      </span>
                      <ul className="space-y-2.5">
                        {pilar.entregaveis.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-xs sm:text-sm text-[#eae8e3] font-light leading-snug group/item"
                          >
                            <span className="text-[#c8a97e] select-none shrink-0 font-serif font-light text-base leading-none pt-0.5">
                              —
                            </span>
                            <span className="group-hover/item:text-white transition-colors">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Impacto Esperado */}
                    <div className="pt-6 hairline-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8e8d96]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#c8a97e] shrink-0" />
                        <span className="text-[#9d9ba7] font-light">
                          <strong className="text-[#eae8e3] font-medium">Impacto esperado:</strong> {pilar.impacto}
                        </span>
                      </div>

                      <span className="font-mono text-[10px] uppercase text-[#c8a97e]/70 shrink-0">
                        Atuação Contínua
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
