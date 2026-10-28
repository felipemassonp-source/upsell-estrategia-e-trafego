'use client';

import React, { useState } from 'react';
import { X, Send, Calendar, CheckCircle2, MessageSquare, Shield, Clock } from 'lucide-react';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiagnosticModal({ isOpen, onClose }: DiagnosticModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    whatsapp: '',
    spendRange: 'R$ 5.000 a R$ 15.000/mês',
    mainChallenge: 'Leads desqualificados e CPL elevado'
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.whatsapp.trim() || !formData.company.trim()) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setFormError(null);
    setSubmitted(true);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá, equipe Upsell! Meu nome é ${formData.name}, da ${formData.company}.\n\n` +
      `Gostaria de agendar o Diagnóstico de Tráfego Pago.\n` +
      `Investimento mensal estimado: ${formData.spendRange}\n` +
      `Principal desafio atual: ${formData.mainChallenge}\n` +
      `WhatsApp para retorno: ${formData.whatsapp}`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511987654321&text=${text}`, '_blank');
  };

  const handleGoogleCalendar = () => {
    const title = encodeURIComponent(`Diagnóstico de Tráfego Pago — Upsell & ${formData.company}`);
    const details = encodeURIComponent(
      `Sessão estratégica de análise de funil, contas de anúncios (Meta & Google) e tracking de conversão com especialista sênior da Upsell.\nCliente: ${formData.name} (${formData.company})\nWhatsApp: ${formData.whatsapp}`
    );
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=Google+Meet`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative my-8">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Diagnóstico Estratégico Gratuito
            </span>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
              Análise de Funil e Oportunidades de Escala
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Dra. Juliana Santos"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nome da Clínica / Empresa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Clínica Santos Saúde"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Investimento Mensal Atual em Mídia
              </label>
              <select
                value={formData.spendRange}
                onChange={e => setFormData({ ...formData, spendRange: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-xs transition-colors"
              >
                <option value="Até R$ 5.000/mês">Até R$ 5.000/mês</option>
                <option value="R$ 5.000 a R$ 15.000/mês">R$ 5.000 a R$ 15.000/mês</option>
                <option value="R$ 15.000 a R$ 35.000/mês">R$ 15.000 a R$ 35.000/mês</option>
                <option value="Acima de R$ 35.000/mês">Acima de R$ 35.000/mês (Alta Escala)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Principal Gargalo de Performance Hoje
              </label>
              <select
                value={formData.mainChallenge}
                onChange={e => setFormData({ ...formData, mainChallenge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-xs transition-colors"
              >
                <option value="Leads desqualificados e CPL elevado">Leads desqualificados e CPL elevado no WhatsApp</option>
                <option value="Falta de transparência e relatórios da agência anterior">Falta de transparência e relatórios da agência anterior</option>
                <option value="Escala estagnada (aumento de verba não gera mais pacientes)">Escala estagnada (aumento de verba não gera mais consultas)</option>
                <option value="Problemas técnicos de rastreamento (Pixel, CAPI, GA4)">Problemas técnicos de rastreamento (Pixel, CAPI, GA4)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Solicitar Diagnóstico Personalizado</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" /> Dados 100% confidenciais
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> Resposta em até 2 horas
              </span>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Diagnóstico Solicitado com Sucesso!
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                Excelente, <span className="text-white font-medium">{formData.name}</span>! Nosso estrategista sênior já está alocado para analisar a conta da <span className="text-white font-medium">{formData.company}</span>.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-3 px-4 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Abrir Conversa Direta no WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleCalendar}
                className="w-full py-3 px-4 rounded-xl font-medium text-slate-200 bg-slate-900 border border-white/10 hover:bg-slate-800 transition-colors text-xs flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Adicionar ao Google Agenda</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Fechar janela
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
