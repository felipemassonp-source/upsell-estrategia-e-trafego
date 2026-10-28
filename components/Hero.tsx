'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, BarChart, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenDiagnostic: () => void;
  onOpenAuth: () => void;
}

export function Hero({ onOpenDiagnostic, onOpenAuth }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/5">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Anti-slop Trust Marker */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <span className="font-semibold text-emerald-400">Alta Performance em Meta Ads & Google Ads</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-300">Portal de Transparência Exclusivo para Clientes</span>
        </div>

        {/* Headline & Value Proposition */}
        <div className="max-w-4xl space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] [text-wrap:balance]">
            Escala previsível com decisões baseadas em dados.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl font-normal">
            Gestão cirúrgica de tráfego pago em <strong className="text-white font-semibold">Meta Ads</strong> e <strong className="text-white font-semibold">Google Ads</strong> para clínicas e empresas de alto padrão. Chega de caixas pretas: acompanhe contratos, sprints quinzenais e métricas financeiras em tempo real no seu próprio portal proprietário.
          </p>
        </div>

        {/* CTA Decision Block */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
          <button
            type="button"
            onClick={onOpenDiagnostic}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all text-sm shadow-xl shadow-emerald-500/20 whitespace-nowrap"
          >
            <span>Agendar Diagnóstico Gratuito</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-white/20 transition-all text-sm whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Explorar Demonstração do Portal</span>
          </button>
        </div>

        {/* Feature Checkpoints */}
        <div className="flex flex-wrap items-center gap-6 mt-8 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Contas e dados 100% de propriedade do cliente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Sprints quinzenais com registro transparente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tracking avançado Server-Side CAPI + GA4</span>
          </div>
        </div>

        {/* Quantitative Performance Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/10">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums block">
              +R$ 14.8M
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Gerenciados em Meta & Google
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums block">
              5.4x
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              ROAS Médio Consolidado
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tabular-nums block">
              +32.000
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Leads e Consultas Agendadas
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-200 font-mono tabular-nums block">
              99.4%
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Confiabilidade de Atribuição CAPI
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
