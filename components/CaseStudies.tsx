'use client';

import React from 'react';
import { ArrowUpRight, TrendingUp, CheckCircle, Shield } from 'lucide-react';

export function CaseStudies() {
  const cases = [
    {
      company: 'Clínica Bem Estar',
      segment: 'Medicina Integrativa & Longevidade',
      headline: 'Redução de 48% no CPL e escala de consultas particulares',
      challenge: 'A clínica recebia contatos desqualificados no WhatsApp perguntando por convênios e preços baixos.',
      solution: 'Implementação de CAPI Server-Side, exclusão de termos populares no Google e vídeos com roteiro educativo de alta percepção de valor.',
      stats: [
        { label: 'CPL Anterior', value: 'R$ 49,20' },
        { label: 'CPL Atual', value: 'R$ 25,51', highlight: true },
        { label: 'ROAS Médio', value: '5.64x', highlight: true },
        { label: 'Consultas / Mês', value: '+140%' }
      ]
    },
    {
      company: 'Instituto Odontológico Prime',
      segment: 'Implantes & Reabilitação Oral',
      headline: 'R$ 154.800 faturados no mês com ticket médio de R$ 18.000',
      challenge: 'Dificuldade em vender protocolos de implantes totais através da internet.',
      solution: 'Segmentação por raio nobre de 5km, anúncios de depoimentos reais de pacientes reabilitados e integração de CRM com a recepção.',
      stats: [
        { label: 'Investimento Mês', value: 'R$ 21.500' },
        { label: 'Faturamento', value: 'R$ 154.800', highlight: true },
        { label: 'ROAS Médio', value: '7.20x', highlight: true },
        { label: 'Taxa de Fechamento', value: '31.4%' }
      ]
    },
    {
      company: 'Dermacare Estética Avançada',
      segment: 'Dermatologia & Procedimentos a Laser',
      headline: '488 leads qualificados para bioestimuladores de colágeno',
      challenge: 'Concorrência intensa e bloqueios de contas frequentes por políticas da Meta.',
      solution: 'Adequação rigorosa de criativos às normas médicas e do CFM, com páginas de captura rápidas e foco na ciência do procedimento.',
      stats: [
        { label: 'Custo por Lead', value: 'R$ 22,95', highlight: true },
        { label: 'Leads no Mês', value: '488 contatos' },
        { label: 'ROAS Médio', value: '4.90x', highlight: true },
        { label: 'Taxa de Presença', value: '88%' }
      ]
    }
  ];

  return (
    <section id="resultados" className="py-20 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="font-semibold text-emerald-400">Prova de Impacto</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Casos Reais em Saúde & Alta Renda</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Resultados auditados e comprovados no portal.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Veja como nossos clientes escalam a captação de pacientes particulares com custos previsíveis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#0D131F] border border-white/10 hover:border-emerald-500/25 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-sm font-bold text-white">{c.company}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{c.segment}</span>
                </div>

                <h3 className="text-base font-bold text-emerald-300 mt-4 leading-snug">
                  {c.headline}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  <strong className="text-slate-300">Gargalo:</strong> {c.challenge}
                </p>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  <strong className="text-white">Solução Upsell:</strong> {c.solution}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/10">
                  {c.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">{stat.label}</span>
                      <span
                        className={`text-sm font-mono font-bold mt-0.5 block tabular-nums ${
                          stat.highlight ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> Métricas auditadas no Looker
                </span>
                <span className="text-slate-400 font-mono">Dados reais</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
