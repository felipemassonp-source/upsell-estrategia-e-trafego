'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
interface EditorialFilosofiaProps {
  onOpenClientPortal?: () => void;
  onOpenAuth?: () => void;
}

export function EditorialFilosofia({ onOpenClientPortal: _portal, onOpenAuth: _auth }: EditorialFilosofiaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Left Column Text Reveal
      gsap.from(leftColRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
        y: 35,
        opacity: 0,
        duration: 1.1,
        ease: 'power4.out',
      });

      // Right Column Card Reveal
      gsap.from(rightColRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
        y: 45,
        opacity: 0,
        duration: 1.25,
        ease: 'power4.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="filosofia"
      className="py-16 sm:py-20 px-6 sm:px-12 max-w-7xl mx-auto hairline-b"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Big Philosophy Statement */}
        <div
          ref={leftColRef}
          style={{ willChange: 'transform, opacity' }}
          className="lg:col-span-7 space-y-8"
        >
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#c8a97e] block font-light font-mono">
            § 04 · Filosofia de Parceria
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#eae8e3] font-normal leading-[1.12] [text-wrap:balance]">
            Alinhamento com a realidade do negócio. <span className="italic text-[#dfc7a7]">Clareza sobre cada real</span> alocado em mídia.
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#9d9ba7] leading-relaxed font-light max-w-xl">
            <p>
              Não acreditamos em discursos grandiosos ou promessas de retorno fácil. O ambiente de mídia digital exige método: hipóteses claras, orçamento controlado, análise pragmática dos números e comunicação direta.
            </p>
            <p>
              Nosso papel é operar os canais de tráfego com responsabilidade técnica e manter você informado sobre o que funciona e o que precisa ser ajustado, com total acesso aos bastidores.
            </p>
          </div>

          {/* Princípio de Governança e Transparência */}
          <div className="pt-4 hairline-t max-w-xl space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c8a97e] block">
              Princípio de Governança
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-light leading-relaxed">
              <div className="space-y-1">
                <span className="text-[#8e8d96] font-mono text-[10px] uppercase tracking-wider block">
                  Sem Atalhos
                </span>
                <p className="text-[#9d9ba7]">
                  Recusamos promessas de retorno instantâneo, métricas de vaidade e qualquer retenção de acessos às suas contas.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[#c8a97e] font-mono text-[10px] uppercase tracking-wider block">
                  Com Método
                </span>
                <p className="text-[#eae8e3]">
                  Governança diária de investimento, rastreamento técnico auditável e titularidade 100% sua em todas as contas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Critérios de Seleção & Diálogo Estratégico em Coluna Editorial */}
        <div className="lg:col-span-5">
          <div
            ref={rightColRef}
            style={{ willChange: 'transform, opacity' }}
            className="space-y-6 lg:pl-10 lg:hairline-l"
          >
            <div className="flex items-center justify-between text-xs pb-3 hairline-b">
              <span className="text-[#eae8e3] font-medium tracking-wide">Critérios de Parceria</span>
              <span className="font-mono text-[10px] text-[#8e8d96] uppercase">Vagas Limitadas</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-[#eae8e3] font-normal leading-snug">
                Como operamos com cada empresa parceira:
              </h3>
              <p className="text-xs text-[#9d9ba7] leading-relaxed font-light">
                Preservamos a exclusividade e a atenção necessária para que a estratégia funcione:
              </p>
            </div>

            <ul className="space-y-3.5 text-xs text-[#eae8e3]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#c8a97e] font-serif text-sm leading-none pt-0.5 select-none">—</span>
                <span><strong>Exclusividade territorial:</strong> Não atendemos concorrentes diretos no mesmo nicho e raio de atuação.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#c8a97e] font-serif text-sm leading-none pt-0.5 select-none">—</span>
                <span><strong>Acesso direto aos estrategistas:</strong> Canal sem intermediários ou atendentes terceirizados.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#c8a97e] font-serif text-sm leading-none pt-0.5 select-none">—</span>
                <span><strong>Sem amarras forçadas:</strong> Clientes permanecem conosco pela qualidade e transparência da entrega.</span>
              </li>
            </ul>

            <div className="pt-4 hairline-t">
              <button
                type="button"
                onClick={() => {
                  const text = encodeURIComponent(
                    'Olá! Gostaria de conversar com a equipe da UPSELL sobre a viabilidade de parceria para a minha empresa.'
                  );
                  window.open(`https://api.whatsapp.com/send?phone=5511987654321&text=${text}`, '_blank');
                }}
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#eae8e3] hover:text-[#c8a97e] transition-colors"
              >
                <span>Consultar Viabilidade de Atendimento</span>
                <span className="text-[#c8a97e] group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
