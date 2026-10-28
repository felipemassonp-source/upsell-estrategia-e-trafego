'use client';

import React, { useState } from 'react';
import { useUpsellStore } from '@/lib/store';
import { SmoothScroll } from '@/components/SmoothScroll';
import { EditorialAuthModal } from '@/components/EditorialAuthModal';
import { ClientPortal } from '@/components/ClientPortal';
import { AdminPanel } from '@/components/AdminPanel';
import { HomeExperience } from '@/components/HomeExperience';

export default function HomePage() {
  const {
    clients,
    activeClient,
    activeClientId,
    userRole,
    authUser,
    isHydrated,
    selectClient,
    setRole,
    updateClientData,
    addOptimizationLog,
    addNewClient,
    deleteClient,
    resetToDefault
  } = useUpsellStore();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Escuta parâmetros de URL como ?cliente=slug para abrir direto o perfil do cliente
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramClient = params.get('cliente') || params.get('client') || params.get('c');
      if (paramClient) {
        selectClient(paramClient);
        setRole('client');
      }
    }
  }, [selectClient, setRole]);

  // Proteção: Somente carrega as visões de Client ou Admin se o usuário estiver autenticado via Firebase Auth
  const isUserAuthenticated = !!authUser;
  const isMasterAdmin = authUser?.email?.toLowerCase().trim() === 'felipemassonp@gmail.com';

  // Se autenticado como Admin Master (somente felipemassonp@gmail.com)
  if (isHydrated && userRole === 'admin') {
    if (!isUserAuthenticated || !isMasterAdmin) {
      // Bloqueio de segurança: força tela de login se tentar burlar papel de admin
      return (
        <>
          <HomeExperience onOpenAuth={() => setIsAuthModalOpen(true)} />
          <EditorialAuthModal
            isOpen={true}
            onClose={() => {
              setRole('guest');
              setIsAuthModalOpen(false);
            }}
            onLogin={(role) => setRole(role)}
          />
        </>
      );
    }

    return (
      <SmoothScroll>
        <AdminPanel
          clients={clients}
          selectedClientId={activeClientId}
          onSelectClient={selectClient}
          onUpdateClient={updateClientData}
          onAddOptimizationLog={addOptimizationLog}
          onAddNewClient={addNewClient}
          onDeleteClient={deleteClient}
          onViewAsClient={(id: string) => {
            selectClient(id);
            setRole('client');
          }}
          onLogout={() => {
            setRole('guest');
          }}
          onResetDefault={resetToDefault}
        />
      </SmoothScroll>
    );
  }

  // Se autenticado como Cliente com conta Google
  if (isHydrated && userRole === 'client') {
    // Se não tiver login do Google ativo ou for um visitante sem autenticação, solicita autenticação
    if (!isUserAuthenticated) {
      return (
        <>
          <HomeExperience onOpenAuth={() => setIsAuthModalOpen(true)} />
          <EditorialAuthModal
            isOpen={true}
            onClose={() => {
              setRole('guest');
              setIsAuthModalOpen(false);
            }}
            onLogin={(role) => setRole(role)}
          />
        </>
      );
    }

    return (
      <SmoothScroll>
        <ClientPortal
          key={activeClient.id}
          client={activeClient}
          clientsList={clients}
          onSelectClient={selectClient}
          onLogout={() => {
            setRole('guest');
          }}
          onOpenAdmin={() => {
            if (isMasterAdmin) setRole('admin');
          }}
          onUpdateClient={updateClientData}
        />
      </SmoothScroll>
    );
  }

  // Public site. The client portal and admin panel stay in their own authenticated views.
  return (
    <>
      <HomeExperience onOpenAuth={() => setIsAuthModalOpen(true)} />
        <EditorialAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={(role) => setRole(role)}
        />
    </>
  );
}
