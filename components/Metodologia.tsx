'use client';

import React from 'react';
import { RefreshCw, SearchCheck, Rocket, LineChart } from 'lucide-react';

export function Metodologia() {
  const steps = [
    {
      num: '01',
      title: 'Diagnóstico & Engenharia de Atribuição',
      description: 'Auditoria de histórico de contas, configuração da Conversions API (CAPI) e alinhamento do ticket médio e persona ideal com a sua recepção.',
      icon: SearchCheck
    },
    {
      num: '02',
      title: 'Estruturação de Campanhas & Roteiros',
      description: 'Criação de novos anúncios em vídeo e carrossel, funis de qualificação para WhatsApp e ativação de palavras-chave de fundo de funil no Google Search.',
      icon: Rocket
    },
    {
      num: '03',
      title: 'Sprints Quinzenais de Otimização',
      description: 'Ciclos de 15 dias de testes contínuos de criativos, negativação de termos, ajuste de lances e escala de conjuntos validados com ROI positivo.',
      icon: RefreshCw
    },
    {
      num: '04',
      title: 'Transparência & Prestação de Contas no Portal',
      description: 'Cada ação técnica é documentada no Portal do Cliente com o impacto esperado, mantendo você sempre informado em menos de 5 minutos de leitura.',
      icon: LineChart
    }
  ];

  return (
    <section id="metodologia" className="py-20 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="font-semibold text-cyan-400">Metodologia Ágil</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Fluxo Operacional</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Ciclos de 15 dias orientados a resultado e transparência.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Nossa metodologia elimina a estagnação comum de agências tradicionais através de sprints previsíveis e documentadas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D131F] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      FASE {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-slate-500">
                  Sprint iterativa com log ativo
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
