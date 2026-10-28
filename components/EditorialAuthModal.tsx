'use client';

import React, { useState } from 'react';
import { UserRole, ClientProfile } from '@/lib/types';
import { useUpsellStore } from '@/lib/store';
import { X, ArrowRight, ShieldCheck, Lock, KeyRound, MessageCircle, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';

interface EditorialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

export function EditorialAuthModal({ isOpen, onClose, onLogin }: EditorialAuthModalProps) {
  const { clients, selectClient, loginGoogle, requestPinReset } = useUpsellStore();
  const [activeTab, setActiveTab] = useState<'client' | 'admin'>('client');
  const [email, setEmail] = useState('contato@clinicabemestar.com.br');
  const [password, setPassword] = useState('••••••••••••');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Estados do Fluxo de Recuperação de Senha/PIN
  const [isRecoveryView, setIsRecoveryView] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveredClient, setRecoveredClient] = useState<ClientProfile | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [isSubmittingRecovery, setIsSubmittingRecovery] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setAuthError(null);
      const user = await loginGoogle();
      if (user) {
        const isAdmin = user.email === 'felipemassonp@gmail.com' || user.email?.includes('upsell');
        if (!isAdmin && user.email) {
          const cleanEmail = user.email.toLowerCase().trim();
          const matched = clients.find(c => c.email?.toLowerCase().trim() === cleanEmail);
          if (matched) {
            selectClient(matched.id);
          }
        }
        onLogin(isAdmin ? 'admin' : 'client');
        onClose();
      }
    } catch (err: unknown) {
      console.error('Erro de autenticação:', err);
      setAuthError('Não foi possível autenticar com o Google. Tente novamente.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleRecoverPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setIsSubmittingRecovery(true);

    try {
      const target = await requestPinReset(recoveryEmail);
      if (target) {
        setRecoveredClient(target);
        setRecoverySuccess(true);
      } else {
        setRecoveryError(
          'Nenhuma empresa localizada com este e-mail institucional. Verifique o endereço digitado ou fale diretamente com seu gestor UpSell.'
        );
      }
    } catch {
      setRecoveryError('Erro ao registrar solicitação. Tente novamente.');
    } finally {
      setIsSubmittingRecovery(false);
    }
  };

  if (!isOpen) return null;

  const handleTabChange = (role: 'client' | 'admin') => {
    setActiveTab(role);
    if (role === 'client') {
      setEmail(clients[0]?.email || 'contato@empresa.com.br');
      setPassword('••••••••••••');
    } else {
      setEmail('gestor@upsell.com.br');
      setPassword('••••••••••••');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'client') {
      const cleanEmail = email.toLowerCase().trim();
      const matched = clients.find(
        c => c.email?.toLowerCase().trim() === cleanEmail ||
             c.companyName?.toLowerCase().trim() === cleanEmail ||
             c.id.toLowerCase().trim() === cleanEmail
      );
      if (matched) {
        selectClient(matched.id);
        if (password.trim() === matched.accessPin?.trim()) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(`upsell_unlocked_${matched.id}`, 'true');
          }
        }
      }
      onLogin('client');
    } else {
      onLogin('admin');
    }
    onClose();
  };

  const handleInstantDemo = (role: 'client' | 'admin') => {
    if (role === 'client' && clients.length > 0) {
      selectClient(clients[0].id);
    }
    onLogin(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#101217] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative my-8">
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between px-6 py-5 hairline-b">
          <div className="flex items-center gap-2.5">
            <span className="font-bold tracking-[0.2em] text-xs text-[#eae8e3] uppercase">
              UPSELL
            </span>
            <span className="text-[#8e8d96]/40 text-xs">/</span>
            <span className="text-xs text-[#8e8d96] font-light">Autenticação</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8e8d96] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-7 sm:p-8 space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#c8a97e] font-light block mb-1">
              Área Restrita
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#eae8e3] font-normal tracking-tight">
              Acesso ao Portal
            </h3>
            <p className="text-xs text-[#9d9ba7] font-light mt-1.5 leading-relaxed">
              Consulte contratos, status da quinzena e relatórios de mídia em tempo real.
            </p>
          </div>

          {/* Minimalist Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0d0e12] hairline-all">
            <button
              type="button"
              onClick={() => handleTabChange('client')}
              className={`py-2 text-xs rounded-lg transition-all ${
                activeTab === 'client'
                  ? 'bg-[#1b1c24] text-[#eae8e3] font-medium shadow-sm'
                  : 'text-[#8e8d96] hover:text-[#eae8e3]'
              }`}
            >
              Visão Cliente
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`py-2 text-xs rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-[#1b1c24] text-[#eae8e3] font-medium shadow-sm'
                  : 'text-[#8e8d96] hover:text-[#eae8e3]'
              }`}
            >
              Visão Gestor (Upsell)
            </button>
          </div>

          {isRecoveryView ? (
            /* VISÃO DE RECUPERAÇÃO DE CHAVE PIN */
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 hairline-b">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryView(false);
                    setRecoverySuccess(false);
                    setRecoveryError(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#8e8d96] hover:text-[#eae8e3] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar para o Login</span>
                </button>
                <span className="text-[10px] uppercase tracking-widest text-[#c8a97e]">
                  Suporte UpSell
                </span>
              </div>

              {!recoverySuccess ? (
                <form onSubmit={handleRecoverPin} className="space-y-4">
                  <div>
                    <h4 className="text-lg font-serif text-[#eae8e3] font-normal">
                      Recuperar Chave de Acesso
                    </h4>
                    <p className="text-xs text-[#9d9ba7] font-light mt-1 leading-relaxed">
                      Digite o e-mail institucional cadastrado da sua empresa. Localizaremos sua conta e notificaremos seu gestor UpSell para emissão de um novo PIN seguro.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8e8d96] mb-1 font-light">
                      E-mail Institucional Cadastrado
                    </label>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={e => setRecoveryEmail(e.target.value)}
                      placeholder="contato@empresa.com.br"
                      className="w-full py-2 bg-transparent border-b border-white/15 text-[#eae8e3] text-xs focus:outline-none focus:border-[#c8a97e] transition-colors"
                    />
                  </div>

                  {recoveryError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{recoveryError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingRecovery}
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-[#0d0e12] bg-[#eae8e3] hover:bg-[#c8a97e] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmittingRecovery ? 'Localizando conta...' : 'Solicitar Redefinição de PIN'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Solicitação Registrada com Sucesso!</span>
                    </div>
                    <p className="text-[#eae8e3] text-[11px] leading-relaxed">
                      A empresa <strong>{recoveredClient?.companyName}</strong> ({recoveredClient?.responsibleName}) foi identificada. Uma notificação prioritária já foi encaminhada ao console do seu gestor UpSell.
                    </p>
                  </div>

                  <a
                    href={`https://api.whatsapp.com/send?phone=5511987654321&text=${encodeURIComponent(
                      `Olá equipe UpSell! Sou ${recoveredClient?.responsibleName} da empresa ${recoveredClient?.companyName}. Esqueci meu PIN de acesso ao portal e solicitei a redefinição.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirmar Envio pelo WhatsApp UpSell</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryView(false);
                      setRecoverySuccess(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs text-[#8e8d96] hover:text-[#eae8e3] transition-colors text-center block"
                  >
                    Retornar à tela de login
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* FORMULÁRIO DE LOGIN NORMAL */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8e8d96] mb-1 font-light">
                  E-mail Institucional
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full py-2 bg-transparent border-b border-white/15 text-[#eae8e3] text-xs focus:outline-none focus:border-[#c8a97e] transition-colors"
                  placeholder="nome@empresa.com.br"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#8e8d96] font-light">
                    {activeTab === 'client' ? 'Chave de Acesso (PIN) ou Senha' : 'Senha'}
                  </label>
                  {activeTab === 'client' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecoveryView(true);
                        setRecoveryEmail(email);
                        setRecoverySuccess(false);
                        setRecoveryError(null);
                      }}
                      className="text-[11px] text-[#c8a97e] hover:underline flex items-center gap-1 font-light"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Esqueceu seu PIN?</span>
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={activeTab === 'client' ? 'PIN de 6 dígitos' : '••••••••••••'}
                  className="w-full py-2 bg-transparent border-b border-white/15 text-[#eae8e3] text-xs focus:outline-none focus:border-[#c8a97e] transition-colors font-mono"
                />
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-[#0d0e12] bg-[#eae8e3] hover:bg-[#c8a97e] transition-all flex items-center justify-center gap-2"
                >
                  <span>Acessar como {activeTab === 'client' ? 'Cliente' : 'Gestor'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Botão Oficial de Login com Google via Firebase Auth */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isGoogleLoading ? 'Autenticando...' : 'Entrar com Conta Google (Firebase)'}</span>
                </button>

                {authError && (
                  <p className="text-[11px] text-rose-400 text-center">{authError}</p>
                )}
              </div>
            </form>
          )}

          {/* Instant 1-Click Demo Buttons */}
          <div className="pt-4 hairline-t">
            <span className="text-[10px] uppercase tracking-widest text-[#8e8d96] block mb-2 font-light text-center">
              Acesso Rápido de Demonstração (1 Clique)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInstantDemo('client')}
                className="p-2.5 rounded-lg bg-[#0d0e12] hover:bg-[#191a22] hairline-all text-left transition-colors"
              >
                <span className="text-xs text-[#eae8e3] block font-medium">Demo Cliente</span>
                <span className="text-[10px] text-[#8e8d96] block">Clínica Bem Estar</span>
              </button>
              <button
                type="button"
                onClick={() => handleInstantDemo('admin')}
                className="p-2.5 rounded-lg bg-[#0d0e12] hover:bg-[#191a22] hairline-all text-left transition-colors"
              >
                <span className="text-xs text-[#dfc7a7] block font-medium">Demo Gestor</span>
                <span className="text-[10px] text-[#8e8d96] block">Console Upsell</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
