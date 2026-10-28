'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { User } from 'firebase/auth';
import { ClientProfile, OptimizationLog, OperationMessage, UserRole, VisualTheme } from './types';
import { INITIAL_CLIENTS } from './mockData';
import {
  subscribeToClients,
  seedInitialClientsIfEmpty,
  saveClient,
  updateClientFields,
  deleteClient as deleteClientFromFirestore,
  subscribeToAuth,
  loginWithGoogle,
  logoutUser
} from './firestoreService';

const STORAGE_KEY = 'upsell_clients_state_v2';
const ROLE_STORAGE_KEY = 'upsell_user_role_v2';
const ACTIVE_CLIENT_KEY = 'upsell_active_client_id_v2';
const THEME_STORAGE_KEY = 'upsell_visual_theme_v2';

export interface AuthUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface StoreState {
  clients: ClientProfile[];
  activeClientId: string;
  userRole: UserRole;
  theme: VisualTheme;
  authUser: AuthUserInfo | null;
  isFirestoreConnected: boolean;
  isFirestoreSyncing: boolean;
}

const defaultState: StoreState = {
  clients: INITIAL_CLIENTS,
  activeClientId: 'clinica-bem-estar',
  userRole: 'guest',
  theme: 'light',
  authUser: null,
  isFirestoreConnected: false,
  isFirestoreSyncing: true,
};

// Global in-memory cache
let currentState: StoreState = { ...defaultState };
let isInitialized = false;
let isFirestoreListenerSetup = false;

function loadFromLocalStorage(): StoreState {
  if (typeof window === 'undefined') return defaultState;
  try {
    let clients = defaultState.clients;
    let activeClientId = defaultState.activeClientId;
    let userRole = defaultState.userRole;

    const savedClients = localStorage.getItem(STORAGE_KEY);
    if (savedClients) {
      const parsed = JSON.parse(savedClients);
      if (Array.isArray(parsed) && parsed.length > 0) {
        clients = parsed;
      }
    }

    const savedClientId = localStorage.getItem(ACTIVE_CLIENT_KEY);
    if (savedClientId) {
      activeClientId = savedClientId;
    }

    const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
    if (savedRole === 'client' || savedRole === 'admin' || savedRole === 'guest') {
      userRole = savedRole as UserRole;
    }

    let theme = defaultState.theme;
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      theme = savedTheme as VisualTheme;
    }

    // Suporte a link direto de acesso do cliente via URL (?cliente=slug ou ?client=slug)
    if (typeof window !== 'undefined' && window.location.search) {
      const searchParams = new URLSearchParams(window.location.search);
      const urlClientId = searchParams.get('cliente') || searchParams.get('client') || searchParams.get('c');
      if (urlClientId) {
        activeClientId = urlClientId;
        userRole = 'client';
      }
    }

    return {
      clients,
      activeClientId,
      userRole,
      theme,
      authUser: null,
      isFirestoreConnected: false,
      isFirestoreSyncing: true
    };
  } catch {
    return defaultState;
  }
}

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (!isFirestoreListenerSetup && typeof window !== 'undefined') {
    initFirestoreSync();
  }
  return () => {
    listeners.delete(callback);
  };
}

function initFirestoreSync() {
  if (isFirestoreListenerSetup || typeof window === 'undefined') return;
  isFirestoreListenerSetup = true;

  // 1. Escuta alterações de Autenticação (Firebase Auth)
  subscribeToAuth((user: User | null) => {
    if (user) {
      const authInfo: AuthUserInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };

      // Se o e-mail for do gestor ou administrador, atribui role de admin
      const isAdminEmail = user.email === 'felipemassonp@gmail.com' || user.email?.includes('upsell');
      const newRole: UserRole = isAdminEmail ? 'admin' : 'client';
      let targetClientId = currentState.activeClientId;

      // Se for cliente, vincula automaticamente ao perfil correspondente pelo e-mail
      if (!isAdminEmail && user.email) {
        const cleanUserEmail = user.email.toLowerCase().trim();
        const matched = currentState.clients.find(
          c => c.email?.toLowerCase().trim() === cleanUserEmail
        );
        if (matched) {
          targetClientId = matched.id;
        }
      }

      currentState = {
        ...currentState,
        authUser: authInfo,
        userRole: newRole,
        activeClientId: targetClientId
      };
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, newRole);
        localStorage.setItem(ACTIVE_CLIENT_KEY, targetClientId);
      } catch {
        // ignore
      }
    } else {
      currentState = {
        ...currentState,
        authUser: null
      };
    }
    emitChange();
  });

  // 2. Escuta coleção de clientes do Firestore em tempo real
  subscribeToClients(
    (firestoreClients) => {
      if (firestoreClients.length > 0) {
        // Verifica se há cliente via URL
        let nextActiveId = currentState.activeClientId;
        if (typeof window !== 'undefined' && window.location.search) {
          const searchParams = new URLSearchParams(window.location.search);
          const urlClientId = searchParams.get('cliente') || searchParams.get('client') || searchParams.get('c');
          if (urlClientId && firestoreClients.some(c => c.id === urlClientId)) {
            nextActiveId = urlClientId;
          } else {
            const activeExists = firestoreClients.some(c => c.id === currentState.activeClientId);
            nextActiveId = activeExists ? currentState.activeClientId : firestoreClients[0].id;
          }
        } else {
          const activeExists = firestoreClients.some(c => c.id === currentState.activeClientId);
          nextActiveId = activeExists ? currentState.activeClientId : firestoreClients[0].id;
        }

        currentState = {
          ...currentState,
          clients: firestoreClients,
          activeClientId: nextActiveId,
          isFirestoreConnected: true,
          isFirestoreSyncing: false
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(firestoreClients));
          localStorage.setItem(ACTIVE_CLIENT_KEY, nextActiveId);
        } catch {
          // ignore
        }
        emitChange();
      } else {
        // Coleção vazia: semeia dados iniciais
        seedInitialClientsIfEmpty().then(() => {
          currentState = {
            ...currentState,
            isFirestoreConnected: true,
            isFirestoreSyncing: false
          };
          emitChange();
        }).catch(() => {
          currentState = {
            ...currentState,
            isFirestoreConnected: false,
            isFirestoreSyncing: false
          };
          emitChange();
        });
      }
    },
    (err) => {
      console.warn('Fallback para cache local do Firestore:', err.message);
      currentState = {
        ...currentState,
        isFirestoreConnected: false,
        isFirestoreSyncing: false
      };
      emitChange();
    }
  );
}

function getSnapshot(): StoreState {
  if (!isInitialized && typeof window !== 'undefined') {
    currentState = loadFromLocalStorage();
    isInitialized = true;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', currentState.theme === 'dark');
    }
  }
  return currentState;
}

function getServerSnapshot(): StoreState {
  return defaultState;
}

const emptySubscribe = () => () => {};

export function useUpsellStore() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const setRole = useCallback((role: UserRole) => {
    currentState = {
      ...currentState,
      userRole: role,
    };
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
      // ignore
    }
    emitChange();
  }, []);

  const selectClient = useCallback((id: string) => {
    currentState = {
      ...currentState,
      activeClientId: id,
    };
    try {
      localStorage.setItem(ACTIVE_CLIENT_KEY, id);
    } catch {
      // ignore
    }
    emitChange();
  }, []);

  const updateClientData = useCallback((
    clientId: string,
    updates: Partial<ClientProfile>
  ) => {
    // 1. Atualização Otimista local
    const updated = currentState.clients.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        ...updates,
        metrics: updates.metrics ? { ...c.metrics, ...updates.metrics } : c.metrics,
        links: updates.links ? { ...c.links, ...updates.links } : c.links,
      };
    });

    currentState = {
      ...currentState,
      clients: updated,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    emitChange();

    // 2. Persistência remota no Firestore
    updateClientFields(clientId, updates).catch(err => {
      console.error('Erro ao atualizar cliente no Firestore:', err);
    });
  }, []);

  const addOptimizationLog = useCallback((
    clientId: string,
    newLog: Omit<OptimizationLog, 'id'>
  ) => {
    const fullLog: OptimizationLog = {
      ...newLog,
      id: `opt-${Date.now()}`
    };

    const target = currentState.clients.find(c => c.id === clientId);
    const updatedLogs = target ? [fullLog, ...target.optimizationLogs] : [fullLog];

    const updated = currentState.clients.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        optimizationLogs: updatedLogs
      };
    });

    currentState = {
      ...currentState,
      clients: updated,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    emitChange();

    // Persistência remota no Firestore
    updateClientFields(clientId, { optimizationLogs: updatedLogs }).catch(err => {
      console.error('Erro ao sincronizar log no Firestore:', err);
    });
  }, []);

  const addOperationMessage = useCallback((clientId: string, message: Omit<OperationMessage, 'id'>) => {
    const newMessage: OperationMessage = {
      ...message,
      id: `msg-${Date.now()}`
    };

    const target = currentState.clients.find(c => c.id === clientId);
    const existing = target?.operationMessages || [];
    const updatedMessages = [...existing, newMessage];

    currentState = {
      ...currentState,
      clients: currentState.clients.map(c =>
        c.id === clientId ? { ...c, operationMessages: updatedMessages } : c
      )
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState.clients));
    } catch {
      // ignore
    }
    emitChange();

    updateClientFields(clientId, { operationMessages: updatedMessages }).catch(err => {
      console.error('Erro ao sincronizar mensagem de operação no Firestore:', err);
    });
  }, []);

  const setTheme = useCallback((theme: VisualTheme) => {
    currentState = {
      ...currentState,
      theme,
    };
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    } catch {
      // ignore
    }
    emitChange();
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: VisualTheme = currentState.theme === 'light' ? 'dark' : 'light';
    currentState = {
      ...currentState,
      theme: nextTheme,
    };
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      }
    } catch {
      // ignore
    }
    emitChange();
  }, []);

  const addNewClient = useCallback((newClient: ClientProfile) => {
    // 1. Atualização Otimista local
    currentState = {
      ...currentState,
      clients: [newClient, ...currentState.clients],
      activeClientId: newClient.id,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState.clients));
      localStorage.setItem(ACTIVE_CLIENT_KEY, newClient.id);
    } catch {
      // ignore
    }
    emitChange();

    // 2. Persistência remota no Firestore
    saveClient(newClient).catch(err => {
      console.error('Erro ao salvar novo cliente no Firestore:', err);
    });
  }, []);

  const deleteClient = useCallback((clientId: string) => {
    // 1. Exclusão remota no Firestore
    deleteClientFromFirestore(clientId).catch(err => {
      console.error('Erro ao excluir cliente no Firestore:', err);
    });

    const filtered = currentState.clients.filter(c => c.id !== clientId);

    let finalClients = filtered;
    let nextActiveId = '';

    if (finalClients.length === 0) {
      // Cria uma conta nova limpa para manter o painel sempre funcional
      const freshClient: ClientProfile = {
        id: `novo-cliente-${Date.now()}`,
        companyName: 'Nova Empresa Parceira',
        segment: 'Novo Projeto',
        responsibleName: 'Gestor Responsável',
        email: 'contato@empresa.com.br',
        contractStatus: 'Em Configuração',
        contractStart: new Date().toLocaleDateString('pt-BR'),
        contractRenewal: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        scope: ['Gestão de Tráfego Pago'],
        activeChannels: ['Meta Ads'],
        currentFocus: 'Definição de objetivos e setup inicial de contas.',
        nextSteps: 'Criar contas de anúncios, configurar pixel e validar criativos.',
        metrics: {
          investment: 0,
          leads: 0,
          cpl: 0,
          roas: 0,
          revenue: 0,
          growth: { investment: '0%', leads: '0%', cpl: '0%', roas: '0%' }
        },
        links: {
          lookerStudio: '',
          financialSheet: '',
          googleDrive: '',
          contractPdf: ''
        },
        actionItems: [
          {
            id: `task-init-1`,
            task: 'Liberação de acessos às contas de anúncio',
            detail: 'Conceder acesso de parceiro ao Business Manager e Google Ads.',
            status: 'pending',
            due: 'Primeira semana',
            assignee: 'client',
            priority: 'high',
            category: 'Onboarding'
          }
        ],
        activeTools: [],
        weeklyHistory: [],
        optimizationLogs: []
      };

      finalClients = [freshClient];
      nextActiveId = freshClient.id;

      // Salva no Firestore
      saveClient(freshClient).catch(err => {
        console.error('Erro ao salvar fallback inicial no Firestore:', err);
      });
    } else {
      nextActiveId = currentState.activeClientId === clientId ? finalClients[0].id : currentState.activeClientId;
    }

    currentState = {
      ...currentState,
      clients: finalClients,
      activeClientId: nextActiveId,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalClients));
      localStorage.setItem(ACTIVE_CLIENT_KEY, nextActiveId);
    } catch {
      // ignore
    }
    emitChange();

    return true;
  }, []);

  const resetToDefault = useCallback(() => {
    currentState = {
      ...defaultState,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState.clients));
      localStorage.setItem(ROLE_STORAGE_KEY, defaultState.userRole);
      localStorage.setItem(ACTIVE_CLIENT_KEY, defaultState.activeClientId);
      localStorage.setItem(THEME_STORAGE_KEY, defaultState.theme);
    } catch {
      // ignore
    }
    emitChange();

    // Ressemeia dados padrão no Firestore
    for (const client of INITIAL_CLIENTS) {
      saveClient(client).catch(() => {});
    }
  }, []);

  const loginGoogle = useCallback(async () => {
    try {
      const user = await loginWithGoogle();
      return user;
    } catch (err) {
      console.error('Falha no login Google:', err);
      throw err;
    }
  }, []);

  const resetClientPin = useCallback((clientId: string, customPin?: string): string => {
    const generatedPin = customPin?.trim() || Math.floor(100000 + Math.random() * 900000).toString();
    const nowStr = new Date().toLocaleString('pt-BR');

    currentState = {
      ...currentState,
      clients: currentState.clients.map(c =>
        c.id === clientId
          ? {
              ...c,
              accessPin: generatedPin,
              pinUpdatedAt: nowStr,
              pinResetRequested: false,
              pinResetRequestedAt: undefined
            }
          : c
      )
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState.clients));
    } catch {
      // ignore
    }
    emitChange();

    // Sincroniza com o Firestore
    updateClientFields(clientId, {
      accessPin: generatedPin,
      pinUpdatedAt: nowStr,
      pinResetRequested: false,
      pinResetRequestedAt: ''
    }).catch(err => {
      console.error('Erro ao salvar novo PIN no Firestore:', err);
    });

    return generatedPin;
  }, []);

  const requestPinReset = useCallback(async (identifier: string): Promise<ClientProfile | null> => {
    const clean = identifier.toLowerCase().trim();
    const target = currentState.clients.find(
      c =>
        c.email?.toLowerCase().trim() === clean ||
        c.companyName?.toLowerCase().trim() === clean ||
        c.id.toLowerCase().trim() === clean
    );

    if (!target) return null;

    const nowStr = new Date().toLocaleString('pt-BR');

    currentState = {
      ...currentState,
      clients: currentState.clients.map(c =>
        c.id === target.id
          ? {
              ...c,
              pinResetRequested: true,
              pinResetRequestedAt: nowStr
            }
          : c
      )
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState.clients));
    } catch {
      // ignore
    }
    emitChange();

    // Notifica no Firestore
    updateClientFields(target.id, {
      pinResetRequested: true,
      pinResetRequestedAt: nowStr
    }).catch(err => {
      console.error('Erro ao registrar solicitação de recuperação de PIN:', err);
    });

    return target;
  }, []);

  const dismissPinResetRequest = useCallback((clientId: string) => {
    currentState = {
      ...currentState,
      clients: currentState.clients.map(c =>
        c.id === clientId
          ? {
              ...c,
              pinResetRequested: false,
              pinResetRequestedAt: undefined
            }
          : c
      )
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState.clients));
    } catch {
      // ignore
    }
    emitChange();

    updateClientFields(clientId, {
      pinResetRequested: false,
      pinResetRequestedAt: ''
    }).catch(err => {
      console.error('Erro ao dispensar alerta de PIN no Firestore:', err);
    });
  }, []);

  const logoutAuth = useCallback(async () => {
    try {
      await logoutUser();
      currentState = {
        ...currentState,
        authUser: null,
        userRole: 'guest'
      };
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, 'guest');
      } catch {
        // ignore
      }
      emitChange();
    } catch (err) {
      console.error('Falha no logout:', err);
    }
  }, []);

  const activeClient = store.clients.find(c => c.id === store.activeClientId) || store.clients[0] || INITIAL_CLIENTS[0];

  return {
    clients: store.clients,
    activeClient,
    activeClientId: store.activeClientId,
    userRole: store.userRole,
    theme: store.theme,
    authUser: store.authUser,
    isFirestoreConnected: store.isFirestoreConnected,
    isFirestoreSyncing: store.isFirestoreSyncing,
    isHydrated,
    selectClient,
    setRole,
    setTheme,
    toggleTheme,
    updateClientData,
    addOptimizationLog,
    addOperationMessage,
    addNewClient,
    deleteClient,
    resetToDefault,
    loginGoogle,
    logoutAuth,
    resetClientPin,
    requestPinReset,
    dismissPinResetRequest
  };
}
