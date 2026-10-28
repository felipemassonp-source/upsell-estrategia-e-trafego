'use client';

import React, { useState } from 'react';
import { UserRole } from '@/lib/types';
import { useUpsellStore } from '@/lib/store';
import { X, ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EditorialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

const ADMIN_EMAIL = 'felipemassonp@gmail.com';

export function EditorialAuthModal({ isOpen, onClose, onLogin }: EditorialAuthModalProps) {
  const { clients, selectClient, loginGoogle } = useUpsellStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

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

      const userEmail = user.email.toLowerCase().trim();

      // 1. Verificação se é o Gestor Master (Admin)
      if (userEmail === ADMIN_EMAIL.toLowerCase()) {
        setAuthSuccess(`Acesso concedido: Gestor Master (${userEmail})`);
        setTimeout(() => {
          onLogin('admin');
          onClose();
        }, 500);
        return;
      }

      // 2. Verificação se é um Cliente com permissão no Firestore
      const matchedClient = clients.find(c => {
        const primaryEmail = c.email?.toLowerCase().trim();
        const allowed = c.allowedEmails?.map(e => e.toLowerCase().trim()) || [];
        return primaryEmail === userEmail || allowed.includes(userEmail);
      });

      if (matchedClient) {
        selectClient(matchedClient.id);
        setAuthSuccess(`Acesso concedido: ${matchedClient.companyName}`);
        setTimeout(() => {
          onLogin('client');
          onClose();
        }, 500);
        return;
      }

      // 3. E-mail não autorizado
      setAuthError(
        `O e-mail Google "${userEmail}" não possui acesso vinculado a nenhuma empresa no sistema. Para liberar seu acesso, solicite à UPSELL o cadastro do seu e-mail.`
      );
    } catch (err: unknown) {
      console.error('Erro de autenticação:', err);
      const firebaseCode = (err as { code?: string })?.code || '';
      const firebaseMsg = (err as { message?: string })?.message || String(err);

      if (firebaseCode === 'auth/unauthorized-domain') {
        setAuthError(
          'Domínio não autorizado no Firebase Auth! Você precisa adicionar "localhost" ou o domínio da Vercel em: Firebase Console > Authentication > Settings > Authorized Domains.'
        );
      } else if (firebaseCode === 'auth/popup-blocked') {
        setAuthError('O popup do Google foi bloqueado pelo seu navegador. Por favor, permita popups para este site.');
      } else if (firebaseCode === 'auth/popup-closed-by-user') {
        setAuthError('A janela de login do Google foi fechada antes de concluir.');
      } else {
        setAuthError(`Erro ao autenticar: ${firebaseCode ? `[${firebaseCode}] ` : ''}${firebaseMsg}`);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#101217] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative my-8">
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="font-bold tracking-[0.2em] text-xs text-[#eae8e3] uppercase">
              UPSELL
            </span>
            <span className="text-[#8e8d96]/40 text-xs">/</span>
            <span className="text-xs text-[#8e8d96] font-light">Acesso Seguro</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8e8d96] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-7 sm:p-8 space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#ed1c24] font-semibold block mb-1">
              Área Restrita
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#eae8e3] font-normal tracking-tight">
              Acesso com Conta Google
            </h3>
            <p className="text-xs text-[#9d9ba7] font-light mt-1.5 leading-relaxed">
              Eliminamos senhas manuais. A validação de identidade é realizada diretamente pelo Google e confirmada pelo Firebase.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#ed1c24] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-semibold text-[#eae8e3] block">Validação Direta via Firebase Auth</span>
                <p className="text-[#8e8d96] text-[11px] leading-relaxed">
                  Somente o e-mail do gestor master e as contas Google autorizadas pela UPSELL conseguem carregar os relatórios e métricas.
                </p>
              </div>
            </div>
          </div>

          {/* Feedback de Sucesso */}
          {authSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Feedback de Erro */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{authError}</span>
            </div>
          )}

          {/* Botão Único Oficial de Login com Google */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-3 disabled:opacity-60 shadow-lg cursor-pointer"
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
              <span>{isGoogleLoading ? 'Autenticando com Google...' : 'Continuar com Conta Google'}</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[10px] text-[#8e8d96]/60 block">
              Gestor Master: {ADMIN_EMAIL} · Clientes via Gmail autorizado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
