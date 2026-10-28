'use client';

import React from 'react';
import { ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onOpenAuth: () => void;
  onOpenDiagnostic: () => void;
}

export function Footer({ onOpenAuth, onOpenDiagnostic }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#060910] text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white font-mono">
                UPS<span className="text-emerald-400">ELL</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Estratégia e Tráfego Pago de Alta Performance para Meta Ads & Google Ads. Engenharia de conversão e transparência radical com portal próprio do cliente.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Conformidade com LGPD & Diretrizes CFM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
              Navegação
            </span>
            <div><a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais da Upsell</a></div>
            <div><a href="#servicos" className="hover:text-white transition-colors">Meta Ads & Google Ads</a></div>
            <div><a href="#metodologia" className="hover:text-white transition-colors">Sprints Quinzenais</a></div>
            <div><a href="#resultados" className="hover:text-white transition-colors">Casos em Clínicas</a></div>
          </div>

          {/* Client & Platform */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
              Plataforma
            </span>
            <div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="hover:text-emerald-300 transition-colors text-left"
              >
                Área do Cliente (Portal de Transparência)
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="hover:text-cyan-300 transition-colors text-left"
              >
                Painel do Gestor (Upsell Admin)
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={onOpenDiagnostic}
                className="hover:text-white transition-colors text-left"
              >
                Solicitar Diagnóstico Preliminar
              </button>
            </div>
          </div>

          {/* Contact / Office */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
              Sede & Contato
            </span>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Av. Paulista, 1106 - Bela Vista, São Paulo - SP</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>contato@upsell.com.br</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>+55 (11) 98765-4321</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>
            © {new Date().getFullYear()} Upsell Estratégia e Tráfego Pago Ltda. CNPJ: 48.912.304/0001-82. Todos os direitos reservados.
          </span>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Termos de Uso</span>
            <span className="hover:text-slate-400 cursor-pointer">Política de Privacidade</span>
            <span className="hover:text-slate-400 cursor-pointer">Segurança da Informação</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
