'use client';

import React from 'react';
import { Eye, Shield, Cpu, TrendingUp, Check, ArrowUpRight } from 'lucide-react';

export function Diferenciais() {
  return (
    <section id="diferenciais" className="py-20 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="font-semibold text-emerald-400">Por Que Escolher a Upsell</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Diferenciais Estruturais</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            O fim da caixa preta no tráfego pago.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Desenvolvemos um modelo operacional baseado em transparência cirúrgica, tecnologia de ponta e prestação de contas contínua.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Portal Proprietário (Col span 2) */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-[#0D131F] border border-white/10 hover:border-emerald-500/30 transition-all relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Portal Proprietário Exclusivo do Cliente
              </h3>
              <p className="text-sm text-slate-300 mt-2.5 leading-relaxed max-w-xl">
                Você nunca mais precisará cobrar seu gestor por WhatsApp para saber o que está sendo feito. No seu portal exclusivo, você acompanha o foco da quinzena, contratos, links de auditoria e a linha do tempo com cada alteração técnica realizada nas contas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Histórico Vivo</span>
                <span className="text-slate-200 mt-0.5 block">Logs quinzenais com impacto mensurado</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Contrato Digital</span>
                <span className="text-slate-200 mt-0.5 block">Download do PDF assinado em 1 clique</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Central Única</span>
                <span className="text-slate-200 mt-0.5 block">Looker Studio, Planilha e Drive integrados</span>
              </div>
            </div>
          </div>

          {/* Card 2: Propriedade Total de Dados */}
          <div className="p-8 rounded-2xl bg-[#0D131F] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Transparência Radical & Ativos Seus
              </h3>
              <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                Todas as contas de anúncios, pixels e domínios pertencem à sua empresa. Nunca retemos dados nem criamos armadilhas de dependência tecnológica.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Zero retenção de dados ou pixels</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Acesso de administrador concedido</span>
              </div>
            </div>
          </div>

          {/* Card 3: Tracking & CAPI Server-Side */}
          <div className="p-8 rounded-2xl bg-[#0D131F] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Engenharia de Tracking Server-Side
              </h3>
              <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                Implementação de Conversions API (CAPI) e GA4 via servidor Cloudflare. Seus algoritmos aprendem mesmo com bloqueadores de anúncios e restrições do iOS.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs font-mono text-cyan-400">
              Score de qualidade Meta CAPI: 9.2/10
            </div>
          </div>

          {/* Card 4: Foco em ROI e Ticket Alto (Col span 2) */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-[#0D131F] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Obsessão por ROI, Faturamento e Comparecimento
              </h3>
              <p className="text-sm text-slate-300 mt-2.5 leading-relaxed max-w-xl">
                Não celebramos métricas de vaidade como curtidas ou cliques sem intenção. Nossos dashboards cruzam o custo por lead com a taxa de agendamento e o comparecimento final no seu consultório ou clínica.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Otimização pelo LTV e Margem Líquida</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-slate-300">Reuniões quinzenais de alinhamento comercial</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
