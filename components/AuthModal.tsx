'use client';

import React, { useState } from 'react';
import { UserRole } from '@/lib/types';
import { X, Lock, Mail, ShieldAlert, ArrowRight, Building, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [selectedRole, setSelectedRole] = useState<'client' | 'admin'>('client');
  const [email, setEmail] = useState('contato@clinicabemestar.com.br');
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleRoleToggle = (role: 'client' | 'admin') => {
    setSelectedRole(role);
    if (role === 'client') {
      setEmail('contato@clinicabemestar.com.br');
      setPassword('••••••••••••');
    } else {
      setEmail('gestor@upsell.com.br');
      setPassword('••••••••••••');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
    onClose();
  };

  const handleInstantDemoLogin = (role: 'client' | 'admin') => {
    onLogin(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white font-mono">
              UPS<span className="text-emerald-400">ELL</span>
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Portal de Acesso</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Acessar Plataforma
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Visualize seus relatórios em tempo real ou gerencie a carteira de tráfego.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="p-1 rounded-xl bg-slate-900/80 border border-white/10 flex items-center">
            <button
              type="button"
              onClick={() => handleRoleToggle('client')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'client'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Visão Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('admin')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'admin'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Visão Administrador (Upsell)</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-xs transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-slate-950 transition-all text-xs flex items-center justify-center gap-2 shadow-lg ${
                selectedRole === 'client'
                  ? 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
                  : 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/20'
              }`}
            >
              <span>Entrar como {selectedRole === 'client' ? 'Cliente' : 'Administrador'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* 1-Click Instant Demo Credentials */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-2 font-semibold text-center">
              Acesso Instantâneo de Demonstração (1 Clique)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInstantDemoLogin('client')}
                className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs transition-colors text-center"
              >
                <span className="block font-medium text-emerald-400">Demo Cliente</span>
                <span className="text-[10px] text-slate-400">Clínica Bem Estar</span>
              </button>
              <button
                type="button"
                onClick={() => handleInstantDemoLogin('admin')}
                className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs transition-colors text-center"
              >
                <span className="block font-medium text-cyan-400">Demo Gestor</span>
                <span className="text-[10px] text-slate-400">Painel Upsell Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
