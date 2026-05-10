import { create } from "zustand";

export interface Transaction {
  id: number;
  icon: "receive" | "send" | "internet" | "electricity" | "recharge" | "other";
  label: string;
  sub: string;
  amount: number;
  positive: boolean;
  category: string;
}

export interface Account {
  label: string;
  num: string;
  balance: number;
  color: string;
}

export interface Contact {
  id: number;
  name: string;
  phone: string;
  initials: string;
  color: string;
}

export interface User {
  name: string;
  phone: string;
  email: string;
  location: string;
  avatar: string;
}

export interface Settings {
  biometrics: boolean;
  twoFactorAuth: boolean;
}

export interface AppState {
  user: User;
  settings: Settings;
  wallet: {
    balance: number;
    currency: string; // currency code like "AOA", "USD", etc.
  };
  transactions: Transaction[];
  accounts: Account[];
  contacts: Contact[];
  exchangeRates: Record<string, number> | null;
  isAuthenticated: boolean;

  // Actions
  updateUser: (data: Partial<User>) => void;
  updateSettings: (data: Partial<Settings>) => void;
  addTransaction: (tx: Transaction) => void;
  setCurrency: (code: string) => void;
  fetchExchangeRates: () => Promise<void>;
  setAuthenticated: (val: boolean) => void;
  addContact: (contact: Contact) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    name: "António Pedro",
    phone: "+244 9XX XXX XXX", 
    email: "anthony@exemplo.com",
    location: "Luanda, Angola",
    avatar: "", 
  },
  settings: {
    biometrics: false,
    twoFactorAuth: false,
  },
  wallet: {
    balance: 10000,
    currency: "AOA",
  },
  transactions: [
    { id: 1, icon: "receive", label: "Recebimento de Maria", sub: "Hoje, 10:45", amount: 2500, positive: true, category: "Transferência" },
    { id: 2, icon: "internet", label: "Pagamento de Internet", sub: "Hoje, 09:30", amount: 500, positive: false, category: "Pagamento" },
    { id: 3, icon: "send", label: "Envio para Carlos", sub: "Ontem, 18:15", amount: 1200, positive: false, category: "Transferência" },
    { id: 4, icon: "receive", label: "Recebimento de Fatima", sub: "Ontem, 14:00", amount: 3000, positive: true, category: "Transferência" },
    { id: 5, icon: "electricity", label: "Pagamento de Electricidade", sub: "2 dias atrás", amount: 800, positive: false, category: "Pagamento" },
    { id: 6, icon: "recharge", label: "Recarga Vodacom", sub: "2 dias atrás, 11:00", amount: 200, positive: false, category: "Recarga" },
    { id: 7, icon: "receive", label: "Recebimento de Pedro", sub: "3 dias atrás", amount: 1500, positive: true, category: "Transferência" },
    { id: 8, icon: "send", label: "Envio para João", sub: "3 dias atrás, 16:30", amount: 750, positive: false, category: "Transferência" },
    { id: 9, icon: "electricity", label: "Pagamento de Água", sub: "5 dias atrás", amount: 600, positive: false, category: "Pagamento" },
    { id: 10, icon: "internet", label: "Recarga de Dados", sub: "5 dias atrás, 09:00", amount: 300, positive: false, category: "Recarga" },
    { id: 11, icon: "receive", label: "Depósito na conta", sub: "1 semana atrás", amount: 5000, positive: true, category: "Depósito" },
    { id: 12, icon: "send", label: "Envio para Ana", sub: "1 semana atrás", amount: 900, positive: false, category: "Transferência" },
  ],
  accounts: [
    { label: "Conta principal", num: "AO 1234 5678 9012", balance: 10000, color: "#162456" },
    { label: "Poupança", num: "AO 9876 5432 1098", balance: 0, color: "#F47C20" },
  ],
  contacts: [
    { id: 1, name: "Maria Santos", phone: "+258 84 123 4567", initials: "MS", color: "#6366f1" },
    { id: 2, name: "Carlos Moçambique", phone: "+258 86 987 6543", initials: "CM", color: "#F47C20" },
    { id: 3, name: "Fatima Nhavene", phone: "+258 82 555 0123", initials: "FN", color: "#22c55e" },
    { id: 4, name: "Pedro Macuácua", phone: "+258 84 888 7654", initials: "PM", color: "#ec4899" },
  ],
  exchangeRates: null,
  isAuthenticated: false,

  updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
  updateSettings: (data) => set((state) => ({ settings: { ...state.settings, ...data } })),
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
  setCurrency: (code) => set((state) => ({ wallet: { ...state.wallet, currency: code } })),
  fetchExchangeRates: async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();
      if (data && data.rates) {
        set({ exchangeRates: data.rates });
      }
    } catch (error) {
      console.error("Failed to fetch exchange rates", error);
    }
  },
  setAuthenticated: (val) => set({ isAuthenticated: val }),
  addContact: (contact) => set((state) => ({ contacts: [contact, ...state.contacts] })),
}));
