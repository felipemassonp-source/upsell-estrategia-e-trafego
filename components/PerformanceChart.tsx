'use client';

import React, { useState } from 'react';
import { WeeklyDataPoint } from '@/lib/types';
import { ArrowUpRight, DollarSign, Users, Info } from 'lucide-react';

interface PerformanceChartProps {
  data: WeeklyDataPoint[];
  isLight?: boolean;
}

export function PerformanceChart({ data, isLight = true }: PerformanceChartProps) {
  const [activeMetric, setActiveMetric] = useState<'financial' | 'leads'>('financial');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const safeData = data && data.length > 0 ? data : [
    { week: 'Sem 01', investment: 1200, revenue: 4800, leads: 32, cpl: 37.5 },
    { week: 'Sem 02', investment: 1350, revenue: 5900, leads: 38, cpl: 35.5 },
    { week: 'Sem 03', investment: 1400, revenue: 6400, leads: 44, cpl: 31.8 },
    { week: 'Sem 04', investment: 1500, revenue: 7200, leads: 50, cpl: 30.0 },
  ];

  // Maximum values for scaling
  const maxFinancial = Math.max(...safeData.map(d => Math.max(d.investment, d.revenue)), 1);
  const maxLeads = Math.max(...safeData.map(d => d.leads), 1);
  const maxCpl = Math.max(...safeData.map(d => d.cpl), 1);

  const selectedData = hoveredIndex !== null ? safeData[hoveredIndex] : safeData[safeData.length - 1];

  const totalInvestment = safeData.reduce((acc, curr) => acc + curr.investment, 0);
  const totalRevenue = safeData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalLeads = safeData.reduce((acc, curr) => acc + curr.leads, 0);
  const averageRoas = (totalRevenue / (totalInvestment || 1)).toFixed(2);
  const averageCpl = totalLeads > 0 ? (totalInvestment / totalLeads).toFixed(2) : '0.00';

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 relative overflow-hidden transition-colors ${
        isLight
          ? 'bg-white border-[#141414]/12 text-[#141414] shadow-[0_12px_32px_-16px_rgba(20,20,20,0.06)]'
          : 'bg-[#12141a] border-white/10 text-[#f7f7f4]'
      }`}
    >
      {/* Top Header & Metric View Selector */}
      <div
        className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b ${
          isLight ? 'border-[#141414]/10' : 'border-white/10'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ed1c24]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#ed1c24]">
              Evolução Semanal Auditada
            </span>
            <span className={isLight ? 'text-[#141414]/30' : 'text-white/30'}>·</span>
            <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${isLight ? 'text-[#141414]/60' : 'text-white/60'}`}>
              {safeData.length} Semanas Registradas
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight">
            Curva de Investimento vs. Resultado
          </h3>
          <p className={`text-xs ${isLight ? 'text-[#141414]/65' : 'text-white/60'}`}>
            Passe o mouse ou toque em cada semana para inspecionar os números exatos da operação.
          </p>
        </div>

        {/* View Toggle */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border ${
            isLight ? 'bg-[#f7f7f4] border-[#141414]/12' : 'bg-[#0c0d10] border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveMetric('financial')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMetric === 'financial'
                ? 'bg-[#141414] text-white dark:bg-[#ed1c24] dark:text-white shadow-xs'
                : isLight
                ? 'text-[#141414]/65 hover:text-[#141414]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Financeiro (Investimento × Retorno)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('leads')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMetric === 'leads'
                ? 'bg-[#141414] text-white dark:bg-[#ed1c24] dark:text-white shadow-xs'
                : isLight
                ? 'text-[#141414]/65 hover:text-[#141414]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Aquisição (Volume de Leads × CPL)</span>
          </button>
        </div>
      </div>

      {/* Didactic Summary Strip */}
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 gap-4 my-6 p-4 rounded-xl border ${
          isLight ? 'bg-[#f7f7f4] border-[#141414]/10' : 'bg-[#0c0d10] border-white/10'
        }`}
      >
        <div className="space-y-0.5">
          <span className={`font-mono text-[10px] uppercase tracking-[0.14em] block ${isLight ? 'text-[#141414]/55' : 'text-white/50'}`}>
            Soma Investida no Período
          </span>
          <span className="font-display text-xl sm:text-2xl tracking-tight block">
            R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </span>
          <span className={`text-[11px] block ${isLight ? 'text-[#141414]/60' : 'text-white/50'}`}>
            Mídia paga acumulada nas semanas
          </span>
        </div>

        <div className="space-y-0.5">
          <span className={`font-mono text-[10px] uppercase tracking-[0.14em] block ${isLight ? 'text-[#141414]/55' : 'text-white/50'}`}>
            Receita Rastreada no Período
          </span>
          <span className="font-display text-xl sm:text-2xl tracking-tight text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            <ArrowUpRight className="w-4 h-4" />
          </span>
          <span className={`text-[11px] block ${isLight ? 'text-[#141414]/60' : 'text-white/50'}`}>
            Faturamento atribuído às campanhas
          </span>
        </div>

        <div className="space-y-0.5">
          <span className={`font-mono text-[10px] uppercase tracking-[0.14em] block ${isLight ? 'text-[#141414]/55' : 'text-white/50'}`}>
            Multiplicador Médio (ROAS)
          </span>
          <span className="font-display text-xl sm:text-2xl tracking-tight text-[#ed1c24] block">
            {averageRoas}x
          </span>
          <span className={`text-[11px] block ${isLight ? 'text-[#141414]/60' : 'text-white/50'}`}>
            Cada R$ 1 investido gerou R$ {averageRoas}
          </span>
        </div>

        <div className="space-y-0.5">
          <span className={`font-mono text-[10px] uppercase tracking-[0.14em] block ${isLight ? 'text-[#141414]/55' : 'text-white/50'}`}>
            Total de Oportunidades (Leads)
          </span>
          <span className="font-display text-xl sm:text-2xl tracking-tight block">
            {totalLeads} contatos
          </span>
          <span className={`text-[11px] block ${isLight ? 'text-[#141414]/60' : 'text-white/50'}`}>
            Custo médio de R$ {averageCpl} por contato
          </span>
        </div>
      </div>

      {/* Chart Visualizer Area */}
      <div className="relative pt-2 pb-2">
        {/* Hover inspector tooltip */}
        {selectedData && (
          <div
            className={`mb-5 p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-4 text-xs ${
              isLight
                ? 'bg-white border-[#141414]/15 shadow-xs'
                : 'bg-[#161922] border-white/15'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-white px-2.5 py-1 rounded bg-[#141414] dark:bg-[#ed1c24] text-[11px]">
                {selectedData.week}
              </span>
              <span className={`font-medium ${isLight ? 'text-[#141414]/70' : 'text-white/70'}`}>
                {hoveredIndex !== null ? 'Inspecionando semana selecionada' : 'Exibindo última semana registrada'}
              </span>
            </div>

            {activeMetric === 'financial' ? (
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-xs ${isLight ? 'bg-[#141414]/35' : 'bg-white/40'}`} />
                  <span className={isLight ? 'text-[#141414]/65' : 'text-white/60'}>Investido:</span>
                  <span className="font-mono font-bold">
                    R$ {selectedData.investment.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#ed1c24]" />
                  <span className={isLight ? 'text-[#141414]/65' : 'text-white/60'}>Retorno:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    R$ {selectedData.revenue.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={isLight ? 'text-[#141414]/65' : 'text-white/60'}>ROAS da Semana:</span>
                  <span className="font-mono font-bold text-[#ed1c24]">
                    {(selectedData.revenue / (selectedData.investment || 1)).toFixed(1)}x
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#ed1c24]" />
                  <span className={isLight ? 'text-[#141414]/65' : 'text-white/60'}>Leads Gerados:</span>
                  <span className="font-mono font-bold">
                    {selectedData.leads} contatos
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-xs ${isLight ? 'bg-[#141414]/35' : 'bg-white/40'}`} />
                  <span className={isLight ? 'text-[#141414]/65' : 'text-white/60'}>Custo por Lead (CPL):</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    R$ {Number(selectedData.cpl).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Graphical Representation */}
        <div className="h-56 w-full flex items-end gap-3 sm:gap-6 px-2 sm:px-6 relative">
          {/* Background horizontal guide lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className={`border-b border-dashed w-full ${isLight ? 'border-[#141414]/10' : 'border-white/10'}`} />
            <div className={`border-b border-dashed w-full ${isLight ? 'border-[#141414]/10' : 'border-white/10'}`} />
            <div className={`border-b border-dashed w-full ${isLight ? 'border-[#141414]/10' : 'border-white/10'}`} />
            <div className={`border-b border-dashed w-full ${isLight ? 'border-[#141414]/10' : 'border-white/10'}`} />
          </div>

          {safeData.map((item, index) => {
            const isHovered = hoveredIndex === index || (hoveredIndex === null && index === safeData.length - 1);

            if (activeMetric === 'financial') {
              const investHeight = Math.max(14, (item.investment / maxFinancial) * 180);
              const revenueHeight = Math.max(18, (item.revenue / maxFinancial) * 180);

              return (
                <div
                  key={`${item.week}-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex-1 flex flex-col items-center justify-end h-full cursor-pointer transition-all ${
                    isHovered ? 'opacity-100 scale-[1.02]' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2.5 h-full pb-2">
                    {/* Investment Bar */}
                    <div className="flex flex-col items-center flex-1 max-w-[36px]">
                      <div
                        style={{ height: `${investHeight}px` }}
                        className={`w-full rounded-t-md transition-all ${
                          isLight
                            ? 'bg-[#141414]/25 hover:bg-[#141414]/40'
                            : 'bg-white/25 hover:bg-white/40'
                        }`}
                      />
                    </div>

                    {/* Revenue Bar */}
                    <div className="flex flex-col items-center flex-1 max-w-[36px]">
                      <div
                        style={{ height: `${revenueHeight}px` }}
                        className="w-full rounded-t-md bg-[#ed1c24] hover:bg-[#c8141b] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-mono mt-2 transition-colors ${
                      isHovered
                        ? 'text-[#ed1c24] font-bold'
                        : isLight
                        ? 'text-[#141414]/60'
                        : 'text-white/60'
                    }`}
                  >
                    {item.week}
                  </span>
                </div>
              );
            }

            // Leads & CPL Metric view
            const leadHeight = Math.max(16, (item.leads / maxLeads) * 180);
            const cplHeight = Math.max(16, (item.cpl / maxCpl) * 180);

            return (
              <div
                key={`${item.week}-${index}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex-1 flex flex-col items-center justify-end h-full cursor-pointer transition-all ${
                  isHovered ? 'opacity-100 scale-[1.02]' : 'opacity-75 hover:opacity-100'
                }`}
              >
                <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2.5 h-full pb-2">
                  {/* Leads Bar */}
                  <div className="flex flex-col items-center flex-1 max-w-[36px]">
                    <div
                      style={{ height: `${leadHeight}px` }}
                      className="w-full rounded-t-md bg-[#ed1c24] hover:bg-[#c8141b] transition-all shadow-sm"
                    />
                  </div>

                  {/* CPL Bar */}
                  <div className="flex flex-col items-center flex-1 max-w-[36px]">
                    <div
                      style={{ height: `${cplHeight}px` }}
                      className={`w-full rounded-t-md transition-all ${
                        isLight
                          ? 'bg-[#141414]/25 hover:bg-[#141414]/40'
                          : 'bg-white/25 hover:bg-white/40'
                      }`}
                    />
                  </div>
                </div>

                <span
                  className={`text-[11px] font-mono mt-2 transition-colors ${
                    isHovered
                      ? 'text-[#ed1c24] font-bold'
                      : isLight
                      ? 'text-[#141414]/60'
                      : 'text-white/60'
                  }`}
                >
                  {item.week}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Didactic Note */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5 pt-4 border-t text-xs ${
          isLight ? 'border-[#141414]/10 text-[#141414]/70' : 'border-white/10 text-white/60'
        }`}
      >
        <div className="flex flex-wrap items-center gap-6">
          {activeMetric === 'financial' ? (
            <>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-xs ${isLight ? 'bg-[#141414]/30' : 'bg-white/30'}`} />
                <span>Barra Cinza: Valor Investido em Anúncios (R$)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#ed1c24]" />
                <span className="font-semibold text-[#141414] dark:text-white">Barra Vermelha: Faturamento Gerado (R$)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#ed1c24]" />
                <span className="font-semibold text-[#141414] dark:text-white">Barra Vermelha: Quantidade de Leads / Contatos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-xs ${isLight ? 'bg-[#141414]/30' : 'bg-white/30'}`} />
                <span>Barra Cinza: Custo Médio por Lead — CPL (R$)</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <Info className="w-3.5 h-3.5 text-[#ed1c24] shrink-0" />
          <span>Quanto maior a barra vermelha em relação à cinza, mais eficiente está a operação.</span>
        </div>
      </div>
    </div>
  );
}
