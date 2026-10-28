'use client';

import React from 'react';
import { Layers, Search, Database, CheckCircle2, ArrowRight } from 'lucide-react';

interface ServicosProps {
  onOpenDiagnostic: () => void;
}

export function Servicos({ onOpenDiagnostic }: ServicosProps) {
  return (
    <section id="servicos" className="py-20 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="font-semibold text-emerald-400">Escopo Especializado</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Pilares de Entrega</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Engenharia de tráfego focada em aquisição de alto valor.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Unimos criação de anúncios persuasivos, inteligência de palavras-chave com alta intenção de compra e infraestrutura técnica de dados.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service 1: Meta Ads */}
          <div className="p-8 rounded-2xl bg-[#0D131F] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 group-hover:text-emerald-400 transition-colors">
                  01. META ADS
                </span>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight">
                Meta Ads para Escala & Desejo
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                Campanhas no Instagram e Facebook com foco na atração de pacientes e clientes de alto padrão. Roteirização estratégica de vídeos, carrosséis educativos e segmentação cirúrgica.
              </p>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Roteirização de vídeos verticais (Reels) e carrosséis</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Públicos semelhantes (Lookalike) baseados em compradores reais</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Funis diretos para WhatsApp com pré-qualificação de mensagens</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Testes A/B sistemáticos de ganchos, públicos e chamadas</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5">
              <span className="text-[11px] font-mono text-emerald-400 block">
                Foco: Redução contínua do CPL e aumento da taxa de resposta
              </span>
            </div>
          </div>

          {/* Service 2: Google Ads */}
          <div className="p-8 rounded-2xl bg-[#0D131F] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 group-hover:text-cyan-400 transition-colors">
                  02. GOOGLE ADS
                </span>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight">
                Google Ads & Fundo de Funil
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                Captura de demanda ativa de pessoas que já estão procurando pelo seu serviço ou tratamento médico agora. Termos de alta intenção e rigorosa negativação de palavras para zero desperdício.
              </p>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Rede de Pesquisa com termos de alta intenção comercial</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Negativação minuciosa para blindagem de orçamento</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Campanhas Performance Max (PMax) configuradas com dados de CRM</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Extensões avançadas de local, chamada e sitelinks</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5">
              <span className="text-[11px] font-mono text-cyan-400 block">
                Foco: Alta taxa de conversão em buscas no raio de atendimento
              </span>
            </div>
          </div>

          {/* Service 3: BI & Tracking */}
          <div className="p-8 rounded-2xl bg-[#0D131F] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 group-hover:text-emerald-400 transition-colors">
                  03. TRACKING & BI
                </span>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight">
                Business Intelligence & CAPI
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                Infraestrutura completa de rastreamento server-side. Seus algoritmos recebem dados limpos e você enxerga no Looker Studio exatamente qual campanha gerou cada faturamento.
              </p>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Setup de Meta Conversions API (CAPI) via servidor próprio</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Google Analytics 4 (GA4) com mensuração de eventos chave</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dashboard automatizado em tempo real no Looker Studio</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Atribuição multi-toque e integração com CRM médico</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5">
              <span className="text-[11px] font-mono text-emerald-400 block">
                Foco: Blindagem de dados e decisões guiadas por faturamento real
              </span>
            </div>
          </div>
        </div>

        {/* Section Action */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white tracking-tight">
              Precisa de uma estrutura completa para sua clínica ou negócio?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Solicite uma análise preliminar sem compromisso e receba nosso parecer técnico.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenDiagnostic}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors whitespace-nowrap"
          >
            Agendar Diagnóstico Gratuito
          </button>
        </div>
      </div>
    </section>
  );
}
