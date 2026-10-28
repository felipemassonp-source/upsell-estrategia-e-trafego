'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function EditorialTese() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const essayRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.from(headlineRef.current, {
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 25,
          opacity: 0,
          duration: 1.0,
          ease: 'power4.out',
        });
      }

      if (essayRef.current) {
        gsap.from(essayRef.current, {
          scrollTrigger: {
            trigger: essayRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 25,
          opacity: 0,
          duration: 1.0,
          delay: 0.1,
          ease: 'power4.out',
        });
      }

      const cols = gsap.utils.toArray<HTMLElement>('.tese-column-item');
      if (cols.length > 0) {
        gsap.from(cols, {
          scrollTrigger: {
            trigger: columnsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const fundamentos = [
    {
      num: '01',
      romano: 'I',
      titulo: 'Análise da Operação',
      texto:
        'Não existe mídia eficiente que compense um negócio desarticulado. Antes do primeiro anúncio veicular, examinamos a capacidade de atendimento da equipe, a dinâmica de vendas e os diferenciais reais do seu serviço.'
    },
    {
      num: '02',
      romano: 'II',
      titulo: 'Análise de Criativos & Conteúdo Autoral',
      texto:
        'Avaliação minuciosa das peças, mensagens e vídeos existentes para identificar o que realmente comunica e constrói consideração, preservando a coerência e a autoridade da sua marca.'
    },
    {
      num: '03',
      romano: 'III',
      titulo: 'Reconhecimento como Foco Primordial',
      texto:
        'Mídia paga é um instrumento para colocar o seu nome diante de quem realmente importa. Quando o público certo reconhece a sua autoridade, as vendas e o retorno financeiro emergem como consequência natural.'
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="tese"
      className="pt-10 sm:pt-12 pb-14 sm:pb-16 px-6 sm:px-12 max-w-7xl mx-auto hairline-b relative"
    >
      {/* Rubrica Editorial de Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-[#8e8d96] font-light mb-10 hairline-b pb-4">
        <div className="flex items-center gap-3">
          <span className="text-[#c8a97e] font-mono">§ 01</span>
          <span>·</span>
          <span className="text-[#eae8e3]">A Tese do Reconhecimento</span>
        </div>
        <div className="font-mono text-[10px] text-[#8e8d96]">
          Manifesto de Mídia Consciente · UpSell
        </div>
      </div>

      {/* Ensaio Tipográfico Asimétrico (Puro Editorial, sem Cards ou Caixas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-12 sm:mb-14">
        {/* Coluna Esquerda: Enunciado Central em Serifa Monumental */}
        <div ref={headlineRef} className="lg:col-span-6 space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-[#eae8e3] font-normal leading-[1.14] tracking-tight">
            Tráfego pago não é dinheiro imediato.{' '}
            <span className="italic text-[#dfc7a7]">
              É divulgação contínua para gerar reconhecimento de marca.
            </span>
          </h2>

          <div className="pt-2 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#c8a97e]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8a97e]" />
            <span>Minimalismo nas Promessas · Rigor no Método</span>
          </div>
        </div>

        {/* Coluna Direita: Texto do Manifesto Editorial */}
        <div ref={essayRef} className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-[#9d9ba7] font-light leading-relaxed">
          <p>
            Tráfego pago não é depositar mil reais e esperar retirar cinco mil no dia seguinte. O mercado acostumou-se a vender números descolados da realidade, tratando a mídia digital como se fosse um bilhete premiado.
          </p>
          <p>
            Na prática séria, tráfego envolve toda a estrutura da empresa: análise operacional, coerência de comunicação e padrão criativo. O foco primordial é levar a sua marca ao conhecimento e à consideração do público que você deseja atender.
          </p>
          <p className="text-[#eae8e3]">
            Quando o seu negócio se torna a referência respeitada na sua praça ou setor, o retorno financeiro e as conversões não dependem de truques: tornam-se o fruto maduro dessa reputação.
          </p>
        </div>
      </div>

      {/* Grelha de Colunas de Revista (Tipografia Pura, 3 Fundamentos) */}
      <div
        ref={columnsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-8 hairline-t divide-y md:divide-y-0 md:divide-x divide-white/[0.08]"
      >
        {fundamentos.map((item, idx) => (
          <div key={item.num} className={`tese-column-item space-y-3 ${idx > 0 ? 'pt-6 md:pt-0 md:pl-8 lg:pl-10' : ''}`}>
            <div className="flex items-baseline gap-2 font-mono text-[11px] text-[#c8a97e]">
              <span className="font-serif italic text-lg leading-none">{item.romano}</span>
              <span className="text-[#8e8d96]/40">·</span>
              <span className="text-[10px] uppercase tracking-widest text-[#8e8d96]">{item.num}</span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl text-[#eae8e3] font-normal tracking-tight">
              {item.titulo}
            </h3>

            <p className="text-xs text-[#9d9ba7] font-light leading-relaxed">
              {item.texto}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
