import { useEffect, useState, createContext, useContext, type ReactNode } from "react";
import { onAuthChange } from "../../services/auth";
import { getUser, getUserAccounts, getUserTransactions } from "../../services/firestore";
import { useAppStore } from "../../store/useAppStore";
import type { User as FirebaseUser } from "firebase/auth";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";

// ─── Contexto de autenticação ────────────────────────────────
interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ firebaseUser: null, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Ecrã de carregamento global ─────────────────────────────
function LoadingScreen() {
  return (
    <div
      className="h-full flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(160deg, #162456 0%, #0e1a3d 60%, #1a2e6e 100%)" }}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl">
          <img src={logoImg} alt="AfrisSol Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-baseline gap-0">
          <span className="text-white" style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>
            afris
          </span>
          <span style={{ fontSize: "24px", fontWeight: 700, color: "#F47C20", letterSpacing: "-0.5px" }}>
            sol
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div
            className="w-6 h-6 rounded-full border-3 border-white/20 border-t-[#F47C20] animate-spin"
            style={{ borderWidth: "3px" }}
          />
          <span className="text-white/60 text-sm">A verificar sessão...</span>
        </div>
      </div>
    </div>
  );
}

// ─── Provider principal ──────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { setAuthenticated, updateUser, setWalletCard } = useAppStore();

  useEffect(() => {
    // Escutar alterações de estado de autenticação do Firebase
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          // Carregar perfil do Firestore com retry para evitar race conditions no registo
          let profile = await getUser(user.uid);
          let retries = 5;
          while (!profile && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            profile = await getUser(user.uid);
            retries--;
          }

          if (profile) {
            updateUser({
              uid: profile.uid,
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              location: profile.location,
            });
            setWalletCard(profile.hasVirtualCard || false);

            // Carregar contas do Firestore e atualizar saldo total
            const accounts = await getUserAccounts(user.uid);
            const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
            const formattedAccounts = accounts.map((acc) => ({
              label: acc.accountName,
              num: acc.iban.replace(/(.{4})/g, "$1 ").trim(),
              balance: acc.balance,
              color: acc.color,
            }));

            // Carregar transações do Firestore
            const transactions = await getUserTransactions(user.uid);
            const formattedTransactions = transactions.map((tx) => ({
              id: tx.id ? Number(tx.id.slice(0, 8)) || Date.now() : Date.now(),
              icon: (tx.type === "transfer" ? (tx.senderUserId === user.uid ? "send" : "receive") : "other") as "receive" | "send" | "other",
              label: tx.description,
              sub: tx.createdAt ? new Date(tx.createdAt.toMillis()).toLocaleDateString("pt-AO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Sem data",
              amount: tx.amount,
              positive: tx.receiverUserId === user.uid,
              category: tx.type === "transfer" ? "Transferência" : tx.type === "internal_transfer" ? "Transferência" : "Outro",
            }));

            // Atualizar o store com dados reais
            useAppStore.setState({
              accounts: formattedAccounts,
              wallet: { balance: totalBalance, currency: "AOA", hasVirtualCard: profile.hasVirtualCard || false },
              transactions: formattedTransactions.length > 0 ? formattedTransactions : [],
            });
          }

          setAuthenticated(true);
        } catch (err) {
          console.error("Erro ao carregar dados do utilizador:", err);
          setAuthenticated(false);
        }
      } else {
        // Utilizador fez logout ou sessão expirou
        setAuthenticated(false);
        useAppStore.setState({
          user: { uid: "", name: "", phone: "", email: "", location: "", avatar: "" },
          accounts: [],
          transactions: [],
          wallet: { balance: 0, currency: "AOA", hasVirtualCard: false },
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Enquanto verifica sessão, mostrar loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
