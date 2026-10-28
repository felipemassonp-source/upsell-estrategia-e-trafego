'use client';

import React from 'react';
import { UserRole } from '@/lib/types';
import { Lock, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenDiagnostic: () => void;
  userRole: UserRole;
  onGoToPortal: () => void;
}

export function Navbar({ onOpenAuth, onOpenDiagnostic, userRole, onGoToPortal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080C14]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-4">
        {/* Zone 1: Single text wordmark */}
        <a href="#" className="flex items-center gap-1.5 whitespace-nowrap shrink-0 group">
          <span className="text-xl font-extrabold tracking-tight text-white font-mono">
            UPS<span className="text-emerald-400">ELL</span>
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 group-hover:text-emerald-300 transition-colors">
            · PERFORMANCE
          </span>
        </a>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
          <a href="#diferenciais" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Diferenciais
          </a>
          <a href="#servicos" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Serviços
          </a>
          <a href="#metodologia" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Metodologia
          </a>
          <a href="#resultados" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Casos de Sucesso
          </a>
          <a href="#transparencia" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Portal do Cliente
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenDiagnostic}
            className="hidden sm:inline-flex text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap shrink-0"
          >
            Agendar Diagnóstico
          </button>

          {userRole !== 'guest' ? (
            <button
              type="button"
              onClick={onGoToPortal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Acessar {userRole === 'admin' ? 'Painel Admin' : 'Portal'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 rounded-xl transition-all shadow-sm whitespace-nowrap shrink-0"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Área do Cliente</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
