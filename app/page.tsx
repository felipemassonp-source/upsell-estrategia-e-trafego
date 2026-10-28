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

  // If authenticated as Client (rendered safely after client-side hydration)
  if (isHydrated && userRole === 'client') {
    return (
      <SmoothScroll>
        <ClientPortal
          key={activeClient.id}
          client={activeClient}
          clientsList={clients}
          onSelectClient={selectClient}
          onLogout={() => setRole('guest')}
          onOpenAdmin={() => setRole('admin')}
          onUpdateClient={updateClientData}
        />
      </SmoothScroll>
    );
  }

  // If authenticated as Admin (rendered safely after client-side hydration)
  if (isHydrated && userRole === 'admin') {
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
          onLogout={() => setRole('guest')}
          onResetDefault={resetToDefault}
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
