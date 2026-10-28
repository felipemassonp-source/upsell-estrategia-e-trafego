'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MapPin, ArrowDown } from 'lucide-react';

export function EditorialHero() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const indexListRef = useRef<HTMLDivElement>(null);
  const topStripRef = useRef<HTMLDivElement>(null);
  const cornerSvgRef = useRef<SVGPathElement>(null);

  // Live Florianópolis Clock in BRT
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(formatted);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // GSAP Cinematic Orchestration
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // 1. Top Strip Entrance
      if (topStripRef.current) {
        tl.from(topStripRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.9,
        }, 0);
      }

      // 2. Corner Hairline Draw
      if (cornerSvgRef.current) {
        try {
          const length = cornerSvgRef.current.getTotalLength() || 100;
          gsap.set(cornerSvgRef.current, { strokeDasharray: length, strokeDashoffset: length });
          tl.to(cornerSvgRef.current, {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: 'power3.inOut'
          }, 0.15);
        } catch {
          // fallback
        }
      }

      // 3. Monumental Word-by-Word Mask Reveal with power4.out & stagger
      const titleWords = gsap.utils.toArray<HTMLElement>('.hero-reveal-word');
      if (titleWords.length > 0) {
        tl.from(titleWords, {
          yPercent: 125,
          opacity: 0,
          stagger: 0.045,
          duration: 1.4,
          ease: 'power4.out',
        }, 0.1);
      }

      // 4. Supporting Narrative Reveal
      if (narrativeRef.current) {
        tl.from(narrativeRef.current, {
          y: 25,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
        }, 0.65);
      }

      // 5. Editorial Index List Lines Stagger
      const indexRows = gsap.utils.toArray<HTMLElement>('.editorial-index-row');
      if (indexRows.length > 0) {
        tl.from(indexRows, {
          y: 30,
          opacity: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: 'power4.out',
        }, 0.85);
      }

      // 7. Parallax Watermark Scrub with ScrollTrigger
      if (parallaxBgRef.current && heroRef.current) {
        gsap.to(parallaxBgRef.current, {
          yPercent: 35,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá! Gostaria de conversar com a equipe da UPSELL em Florianópolis sobre a estratégia e tráfego do meu negócio.'
    );
    window.open(`https://api.whatsapp.com/send?phone=5511987654321&text=${text}`, '_blank');
  };

  const indiceItems = [
    {
      num: '01',
      romano: 'I',
      titulo: 'Gestão de Tráfego Pago',
      escopo: 'Meta Ads & Google Search',
      detalhe: 'Alocação disciplinada de orçamento com base em intenção de compra, negativação contínua de termos irrelevantes e mensuração precisa.',
      tag: 'Gestão de Mídia'
    },
    {
      num: '02',
      romano: 'II',
      titulo: 'Criação de Sites & Interfaces',
      escopo: 'Presença Digital & Clareza',
      detalhe: 'Páginas rápidas, estruturadas e com tipografia refinada para apresentar o seu serviço sem ruídos ou artifícios visuais.',
      tag: 'Presença Digital'
    },
    {
      num: '03',
      romano: 'III',
      titulo: 'Análise e Acompanhamento do Processo Comercial',
      escopo: 'Fluxo de Atendimento no WhatsApp',
      detalhe: 'Observação do tempo de resposta, alinhamento entre o perfil dos contatos atraídos e a capacidade de acolhimento da equipe comercial.',
      tag: 'Processo Comercial'
    }
  ];

  return (
    <section
      ref={heroRef}
      id="manifesto"
      className="relative pt-6 sm:pt-10 pb-6 sm:pb-8 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* 4. PARALLAX COM SCROLLTRIGGER (SCRUB): Massive Monumental Outlined Watermark */}
      <div
        ref={parallaxBgRef}
        aria-hidden="true"
        className="absolute top-12 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none -z-20 gpu-accelerated overflow-hidden"
        style={{ willChange: 'transform' }}
      >
        <span
          className="font-serif text-[18vw] font-bold leading-none uppercase tracking-[-0.04em] text-transparent"
          style={{
            WebkitTextStroke: '1px rgba(200, 169, 126, 0.05)',
          }}
        >
          UPSELL · 2026
        </span>
      </div>

      {/* Ambient Breathing Light Aura (Compositor only) */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-0 sm:right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#c8a97e]/12 via-[#dfc7a7]/5 to-transparent blur-[110px] pointer-events-none -z-10 gpu-accelerated"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Top Header Strip: Location, Live BRT Clock & Coordinates */}
      <div
        ref={topStripRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] uppercase tracking-[0.25em] text-[#8e8d96] font-light hairline-b pb-4 sm:pb-5"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#eae8e3] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#c8a97e]" />
            Florianópolis, SC
          </span>
          <span className="text-[#8e8d96]/40">·</span>
          <span className="font-mono text-[10px] text-[#8e8d96]">27°35′S 48°32′W</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8a97e] animate-pulse" />
            <span className="text-[#dfc7a7]" suppressHydrationWarning>
              {currentTime ? `${currentTime} BRT` : 'Florianópolis Horário'}
            </span>
          </div>
          <span className="text-[#8e8d96]/40">·</span>
          <span>Meta Ads & Google Ads</span>
        </div>
      </div>

      {/* 1. TIPOGRAFIA MONUMENTAL & WORD-BY-WORD MASK REVEAL */}
      <div ref={wordsContainerRef} className="pt-6 sm:pt-8 pb-2 max-w-6xl relative">
        {/* Animated Corner Hairline */}
        <div className="hidden lg:block absolute -top-3 -left-6 pointer-events-none opacity-40">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              ref={cornerSvgRef}
              d="M0 40V0H40"
              stroke="#c8a97e"
              strokeWidth="1"
            />
          </svg>
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl xl:text-[6.4rem] text-[#eae8e3] font-normal leading-[1.03] tracking-[-0.02em]">
          {/* Line 1 */}
          <span className="block overflow-hidden pb-1">
            <span className="hero-reveal-word inline-block mr-3 sm:mr-6 will-change-transform">
              Reconhecimento
            </span>
            <span className="hero-reveal-word inline-block italic font-normal text-[#dfc7a7] will-change-transform">
              de marca.
            </span>
          </span>

          {/* Line 2 */}
          <span className="block overflow-hidden pb-1">
            <span className="hero-reveal-word inline-block mr-3 sm:mr-5 will-change-transform">
              Sem
            </span>
            <span className="hero-reveal-word inline-block mr-3 sm:mr-5 will-change-transform">
              fórmulas
            </span>
            <span className="hero-reveal-word inline-block italic font-normal text-[#dfc7a7] will-change-transform">
              mágicas.
            </span>
          </span>
        </h1>

        {/* Narrative & Action Block - Curto, direto e elegante */}
        <div ref={narrativeRef} className="mt-5 sm:mt-6 max-w-xl">
          <p className="text-sm sm:text-base text-[#9d9ba7] leading-relaxed font-light">
            Estratégia de mídia e posicionamento para empresas que buscam autoridade perante o público certo — sem promessas vazias de retorno imediato.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] font-medium text-[#eae8e3] hover:text-[#c8a97e] transition-colors group"
            >
              <span>Iniciar diálogo consultivo</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#c8a97e]" />
            </button>
            <span className="text-[#8e8d96]/40 text-xs">·</span>
            <a
              href="#atuacao"
              className="text-xs uppercase tracking-[0.2em] font-light text-[#8e8d96] hover:text-[#eae8e3] transition-colors"
            >
              Conhecer a atuação
            </a>
          </div>
        </div>

        {/* 2. LISTA DE ÍNDICE EDITORIAL COM ESPAÇAMENTO COMPACTO E ELEGANTE */}
        <div ref={indexListRef} className="mt-7 sm:mt-8 pt-5 hairline-t space-y-0">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#8e8d96] font-light mb-3">
            <span>Índice de Atuação Estratégica</span>
            <span>03 Dimensões Integradas</span>
          </div>

          <div className="divide-y divide-white/[0.08]">
            {indiceItems.map((item, idx) => {
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={item.num}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="editorial-index-row py-3 sm:py-3.5 transition-all duration-300 group cursor-pointer"
                  onClick={() => {
                    document.getElementById('atuacao')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="font-serif italic text-xl sm:text-2xl text-[#c8a97e] transition-colors group-hover:text-[#dfc7a7] shrink-0 font-light">
                        {item.num}
                      </span>
                      <h2 className="font-serif text-lg sm:text-2xl text-[#eae8e3] font-normal tracking-tight group-hover:text-white transition-colors">
                        {item.titulo}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6 text-xs text-[#8e8d96] pl-9 sm:pl-0">
                      <span className="font-light tracking-wide text-[#9d9ba7]">
                        {item.escopo}
                      </span>
                      <span className="hidden sm:inline-block text-[#8e8d96]/30">·</span>
                      <span className="hidden md:inline-block font-mono text-[10px] uppercase text-[#c8a97e]/80">
                        {item.tag}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#c8a97e] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </div>
                  </div>

                  {/* Subtle Expanding Editorial Detail on Hover */}
                  <div
                    className={`overflow-hidden transition-all duration-500 pl-9 sm:pl-12 ${
                      isHovered ? 'max-h-24 opacity-100 pt-3' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-xs text-[#8e8d96] font-light leading-relaxed max-w-3xl">
                      {item.detalhe}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
