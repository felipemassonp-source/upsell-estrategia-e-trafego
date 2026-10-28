'use client';

import React, { useState } from 'react';
import { WeeklyDataPoint } from '@/lib/types';
import { TrendingUp, ArrowUpRight, DollarSign, Users } from 'lucide-react';

interface PerformanceChartProps {
  data: WeeklyDataPoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [activeMetric, setActiveMetric] = useState<'financial' | 'leads'>('financial');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Maximum values for scaling
  const maxFinancial = Math.max(...data.map(d => Math.max(d.investment, d.revenue)), 1);
  const maxLeads = Math.max(...data.map(d => d.leads), 1);
  const maxCpl = Math.max(...data.map(d => d.cpl), 1);

  const selectedData = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];

  const totalInvestment = data.reduce((acc, curr) => acc + curr.investment, 0);
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalLeads = data.reduce((acc, curr) => acc + curr.leads, 0);
  const averageRoas = (totalRevenue / (totalInvestment || 1)).toFixed(2);

  return (
    <div className="bg-[#0D131F] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      {/* Top Header & Metric View Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Evolução Semanal
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Últimos 30 Dias</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-1">
            Performance Consolidada de Tráfego
          </h3>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveMetric('financial')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeMetric === 'financial'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Investimento vs. Retorno</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('leads')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeMetric === 'leads'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Volume & CPL</span>
          </button>
        </div>
      </div>

      {/* Floating Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 py-3 px-4 rounded-xl bg-slate-900/50 border border-white/5">
        <div>
          <span className="text-xs text-slate-400 block">Total Investido</span>
          <span className="text-base font-bold text-white font-mono tabular-nums">
            R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Faturamento Gerado</span>
          <span className="text-base font-bold text-emerald-400 font-mono tabular-nums flex items-center gap-1">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">ROAS Acumulado</span>
          <span className="text-base font-bold text-cyan-400 font-mono tabular-nums">
            {averageRoas}x
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Leads / Consultas</span>
          <span className="text-base font-bold text-slate-200 font-mono tabular-nums">
            {totalLeads} contatos
          </span>
        </div>
      </div>

      {/* Chart Visualizer Area */}
      <div className="relative pt-6 pb-2">
        {/* Hover inspector tooltip */}
        {selectedData && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white px-2 py-0.5 rounded bg-white/10 font-mono">
                {selectedData.week}
              </span>
              <span className="text-slate-400">
                {hoveredIndex !== null ? 'Semana selecionada' : 'Última semana fechada'}
              </span>
            </div>

            {activeMetric === 'financial' ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-slate-400">Investimento:</span>
                  <span className="font-mono font-bold text-white">
                    R$ {selectedData.investment.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-400">Retorno:</span>
                  <span className="font-mono font-bold text-emerald-300">
                    R$ {selectedData.revenue.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Multiplicador:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {(selectedData.revenue / (selectedData.investment || 1)).toFixed(1)}x
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-slate-400">Leads:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {selectedData.leads}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-400">CPL Médio:</span>
                  <span className="font-mono font-bold text-emerald-300">
                    R$ {selectedData.cpl.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Graphical Representation */}
        <div className="h-56 w-full flex items-end gap-3 sm:gap-6 px-2 sm:px-6 relative">
          {/* Background horizontal guide lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-dashed border-white/20 w-full" />
            <div className="border-b border-dashed border-white/20 w-full" />
            <div className="border-b border-dashed border-white/20 w-full" />
            <div className="border-b border-dashed border-white/20 w-full" />
          </div>

          {data.map((item, index) => {
            const isHovered = hoveredIndex === index;

            if (activeMetric === 'financial') {
              const investHeight = Math.max(12, (item.investment / maxFinancial) * 180);
              const revenueHeight = Math.max(16, (item.revenue / maxFinancial) * 180);

              return (
                <div
                  key={item.week}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex-1 flex flex-col items-center justify-end h-full cursor-pointer transition-all ${
                    isHovered ? 'scale-[1.02]' : 'opacity-90'
                  }`}
                >
                  <div className="w-full flex items-end justify-center gap-1.5 sm:gap-3 h-full pb-2">
                    {/* Investment Bar */}
                    <div className="flex flex-col items-center flex-1 max-w-[36px]">
                      <div
                        style={{ height: `${investHeight}px` }}
                        className="w-full rounded-t-lg bg-slate-600/70 hover:bg-slate-500 transition-all border-t border-slate-400/40 relative group"
                      />
                    </div>

                    {/* Revenue Bar */}
                    <div className="flex flex-col items-center flex-1 max-w-[36px]">
                      <div
                        style={{ height: `${revenueHeight}px` }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600/70 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 transition-all border-t border-emerald-300/50 shadow-lg shadow-emerald-500/10"
                      />
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-medium transition-colors font-mono mt-2 ${
                      isHovered ? 'text-emerald-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {item.week}
                  </span>
                </div>
              );
            }

            // Leads & CPL Metric view
            const leadHeight = Math.max(14, (item.leads / maxLeads) * 180);
            const cplHeight = Math.max(14, (item.cpl / maxCpl) * 180);

            return (
              <div
                key={item.week}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex-1 flex flex-col items-center justify-end h-full cursor-pointer transition-all ${
                  isHovered ? 'scale-[1.02]' : 'opacity-90'
                }`}
              >
                <div className="w-full flex items-end justify-center gap-1.5 sm:gap-3 h-full pb-2">
                  {/* Leads Bar */}
                  <div className="flex flex-col items-center flex-1 max-w-[36px]">
                    <div
                      style={{ height: `${leadHeight}px` }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600/70 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 transition-all border-t border-cyan-300/50 shadow-lg shadow-cyan-500/10"
                    />
                  </div>

                  {/* CPL Bar */}
                  <div className="flex flex-col items-center flex-1 max-w-[36px]">
                    <div
                      style={{ height: `${cplHeight}px` }}
                      className="w-full rounded-t-lg bg-slate-600/60 hover:bg-slate-500 transition-all border-t border-slate-400/40"
                    />
                  </div>
                </div>

                <span
                  className={`text-[11px] font-medium transition-colors font-mono mt-2 ${
                    isHovered ? 'text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  {item.week}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-white/5 text-xs text-slate-400">
        {activeMetric === 'financial' ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-500" />
              <span>Investimento em Anúncios (R$)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-emerald-300 font-medium">Faturamento Estimado / Retorno (R$)</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-500" />
              <span className="text-cyan-300 font-medium">Contatos & Leads Qualificados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-500" />
              <span>Custo Médio por Lead (CPL)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
