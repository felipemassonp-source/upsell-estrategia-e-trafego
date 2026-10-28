'use client';

import React, { useState } from 'react';
import { UserRole } from '@/lib/types';
import { useUpsellStore } from '@/lib/store';
import { X, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, LogOut, Sparkles } from 'lucide-react';

interface EditorialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

const ADMIN_EMAIL = 'felipemassonp@gmail.com';

export function EditorialAuthModal({ isOpen, onClose, onLogin }: EditorialAuthModalProps) {
  const { clients, selectClient, loginGoogle, logoutAuth, authUser } = useUpsellStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateAndRouteEmail = (rawEmail: string) => {
    const userEmail = rawEmail.toLowerCase().trim();

    // 1. Verificação se é o Gestor Master (Admin)
    if (userEmail === ADMIN_EMAIL.toLowerCase()) {
      setAuthSuccess(`Identidade confirmada: Gestor Master (${userEmail})`);
      setTimeout(() => {
        onLogin('admin');
        onClose();
      }, 350);
      return true;
    }

    // 2. Verificação se é um Cliente com permissão no Firestore
    const matchedClient = clients.find(c => {
      const primaryEmail = c.email?.toLowerCase().trim();
      const allowed = c.allowedEmails?.map(e => e.toLowerCase().trim()) || [];
      return primaryEmail === userEmail || allowed.includes(userEmail);
    });

    if (matchedClient) {
      selectClient(matchedClient.id);
      setAuthSuccess(`Acesso liberado: ${matchedClient.companyName}`);
      setTimeout(() => {
        onLogin('client');
        onClose();
      }, 350);
      return true;
    }

    // 3. E-mail não autorizado
    setAuthError(
      `A conta Google "${userEmail}" ainda não está vinculada a nenhuma empresa ativa. Solicite ao gestor da UPSELL a inclusão do seu e-mail nas permissões do cliente.`
    );
    return false;
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setAuthError(null);
      setAuthSuccess(null);

      const user = await loginGoogle();
      if (!user || !user.email) {
        setAuthError('Não foi possível identificar seu e-mail da conta Google.');
        return;
      }

      validateAndRouteEmail(user.email);
    } catch (err: unknown) {
      console.error('Erro de autenticação:', err);
      const firebaseCode = (err as { code?: string })?.code || '';
      const firebaseMsg = (err as { message?: string })?.message || String(err);

      if (firebaseCode === 'auth/unauthorized-domain') {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'seu-dominio';
        setAuthError(
          `O domínio "${currentHost}" precisa ser autorizado no Firebase! Acesse: console.firebase.google.com > Projeto "app-upsell" > Authentication > Settings > Authorized domains > Add domain ("${currentHost}").`
        );
      } else if (firebaseCode === 'auth/popup-blocked') {
        setAuthError('O popup do Google foi bloqueado pelo seu navegador. Permita popups para este site e tente novamente.');
      } else if (firebaseCode === 'auth/popup-closed-by-user') {
        setAuthError('A janela de login do Google foi fechada antes de concluir a verificação.');
      } else {
        setAuthError(`Não foi possível autenticar: ${firebaseCode ? `[${firebaseCode}] ` : ''}${firebaseMsg}`);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141414]/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#f7f7f4] text-[#141414] border border-[#141414]/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.45)] relative my-8"
      >
        {/* Top Swiss Editorial Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141414] text-[#f7f7f4]">
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ed1c24]" />
            <span className="font-display tracking-[0.14em] text-sm uppercase">
              UPSELL
            </span>
            <span className="text-white/30 text-xs">/</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
              Portal do Cliente & Console
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-bold block">
              Acesso Exclusivo · Sem Senhas Manuais
            </span>
            <h3 className="font-display text-3xl sm:text-4xl text-[#141414] uppercase leading-[0.95] tracking-tight">
              Área de Acompanhamento & Performance
            </h3>
            <p className="text-xs sm:text-sm text-[#141414]/70 leading-relaxed pt-1">
              Entre com sua conta Google autorizada para consultar relatórios de investimento, evolução semanal, tarefas e arquivos da sua operação.
            </p>
          </div>

          {/* Didactic 3-Step Explanation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-xl bg-white border border-[#141414]/10 space-y-1">
              <span className="font-mono text-[10px] font-bold text-[#ed1c24] block">PASSO 01</span>
              <span className="text-xs font-bold text-[#141414] block">Login Google</span>
              <p className="text-[11px] text-[#141414]/65 leading-snug">
                Clique no botão abaixo e selecione seu Gmail corporativo ou pessoal.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#141414]/10 space-y-1">
              <span className="font-mono text-[10px] font-bold text-[#ed1c24] block">PASSO 02</span>
              <span className="text-xs font-bold text-[#141414] block">Validação Firebase</span>
              <p className="text-[11px] text-[#141414]/65 leading-snug">
                O sistema verifica se o seu e-mail está autorizado na conta da empresa.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#141414]/10 space-y-1">
              <span className="font-mono text-[10px] font-bold text-[#ed1c24] block">PASSO 03</span>
              <span className="text-xs font-bold text-[#141414] block">Acesso Direto</span>
              <p className="text-[11px] text-[#141414]/65 leading-snug">
                Clientes abrem o Portal da Empresa; o gestor abre o Console Master.
              </p>
            </div>
          </div>

          {/* Se já houver sessão Google ativa no navegador */}
          {authUser?.email && (
            <div className="p-4 rounded-xl bg-white border border-[#141414]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Sessão Google Conectada
                </span>
                <p className="text-xs font-bold text-[#141414] font-mono">{authUser.email}</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => validateAndRouteEmail(authUser.email!)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#ed1c24] text-white hover:bg-[#c8141b] transition-colors cursor-pointer"
                >
                  <span>Entrar Agora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => logoutAuth()}
                  className="p-2 rounded-lg text-xs text-[#141414]/60 hover:text-[#141414] hover:bg-[#141414]/5 transition-colors cursor-pointer"
                  title="Trocar de conta Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Feedback de Sucesso */}
          {authSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Feedback de Erro */}
          {authError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-2.5 text-xs text-rose-950">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#ed1c24]" />
              <div className="space-y-1 leading-relaxed">
                <span className="font-bold block text-[#ed1c24]">Atenção na verificação de acesso:</span>
                <span>{authError}</span>
              </div>
            </div>
          )}

          {/* Botão Oficial de Login com Google */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-4 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#141414] hover:bg-[#262626] transition-all flex items-center justify-center gap-3 disabled:opacity-60 shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>{isGoogleLoading ? 'Autenticando com Google...' : 'Autenticar com Conta Google'}</span>
            </button>
          </div>

          {/* Security Footer Info */}
          <div className="pt-3 border-t border-[#141414]/10 flex items-center justify-between gap-2 text-[11px] text-[#141414]/60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ed1c24] shrink-0" />
              <span>Protegido por Firebase Authentication & Firestore Rules</span>
            </div>
            <span className="font-mono text-[10px]">SSL / OAuth 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
