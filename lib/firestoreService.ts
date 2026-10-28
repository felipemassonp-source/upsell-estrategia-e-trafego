import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { ClientProfile } from './types';
import { INITIAL_CLIENTS } from './mockData';

const CLIENTS_COLLECTION = 'clients';

/**
 * Sincroniza e inicializa os clientes padrão no Firestore caso a coleção esteja vazia.
 */
export async function seedInitialClientsIfEmpty(): Promise<boolean> {
  try {
    const clientsRef = collection(db, CLIENTS_COLLECTION);
    const snapshot = await getDocs(clientsRef);

    if (snapshot.empty) {
      console.log('Coleção clients vazia no Firestore. Semeando dados iniciais...');
      const batch = writeBatch(db);

      for (const client of INITIAL_CLIENTS) {
        const clientDocRef = doc(db, CLIENTS_COLLECTION, client.id);
        batch.set(clientDocRef, client);
      }

      await batch.commit();
      console.log('Clientes iniciais semeados com sucesso no Firestore!');
      return true;
    }
    return false;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, CLIENTS_COLLECTION);
  }
}

/**
 * Escuta em tempo real todas as alterações na coleção de clientes.
 */
export function subscribeToClients(
  onUpdate: (clients: ClientProfile[]) => void,
  onError?: (error: Error) => void
): () => void {
  const clientsRef = collection(db, CLIENTS_COLLECTION);

  const unsubscribe = onSnapshot(
    clientsRef,
    (snapshot) => {
      const list: ClientProfile[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ClientProfile;
        list.push({
          ...data,
          id: docSnap.id || data.id
        });
      });
      onUpdate(list);
    },
    (error) => {
      console.warn('Erro na sincronização da coleção clients no Firestore (fallback para dados locais):', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  );

  return unsubscribe;
}

/**
 * Salva ou atualiza um perfil de cliente completo no Firestore.
 */
export async function saveClient(client: ClientProfile): Promise<void> {
  const path = `${CLIENTS_COLLECTION}/${client.id}`;
  try {
    const clientRef = doc(db, CLIENTS_COLLECTION, client.id);
    await setDoc(clientRef, client, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Atualiza campos parciais de um cliente no Firestore.
 */
export async function updateClientFields(
  clientId: string,
  updates: Partial<ClientProfile>
): Promise<void> {
  const path = `${CLIENTS_COLLECTION}/${clientId}`;
  try {
    const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
    await setDoc(clientRef, updates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Exclui um cliente do Firestore.
 */
export async function deleteClient(clientId: string): Promise<void> {
  const path = `${CLIENTS_COLLECTION}/${clientId}`;
  try {
    const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
    await deleteDoc(clientRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Autenticação via Google Popup.
 */
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error);
    throw error;
  }
}

/**
 * Logout do Firebase Auth.
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}

/**
 * Observa mudanças no estado de autenticação do usuário.
 */
export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
