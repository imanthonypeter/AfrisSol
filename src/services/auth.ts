import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUser, getUser, type FirestoreUser } from "./firestore";

// ─── Registar novo utilizador ────────────────────────────────
export async function registerUser(
  name: string,
  email: string,
  password: string,
  phone?: string
): Promise<{ user: User; profile: FirestoreUser }> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const profile = await createUser(credential.user.uid, { name, email, phone });
  return { user: credential.user, profile: profile as FirestoreUser };
}

// ─── Iniciar sessão ──────────────────────────────────────────
export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean = true
): Promise<{ user: User; profile: FirestoreUser | null }> {
  const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistenceType);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUser(credential.user.uid);
  return { user: credential.user, profile };
}

// ─── Terminar sessão ─────────────────────────────────────────
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// ─── Observador de estado de autenticação ────────────────────
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// ─── Iniciar sessão com Google ───────────────────────────────
export async function loginWithGoogle(): Promise<{ user: User; profile: FirestoreUser | null; isNewUser: boolean }> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const profile = await getUser(result.user.uid);
  
  // Se não existir perfil, é um novo utilizador
  return { 
    user: result.user, 
    profile, 
    isNewUser: !profile 
  };
}
