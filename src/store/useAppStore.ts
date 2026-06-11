import { create } from "zustand";

export interface TransactionReceipt {
  type: string;
  amount: number;
  currency: string;
  date: number;
  reference: string;
  fromName?: string;
  fromAccount?: string;
  toName?: string;
  toAccount?: string;
}

export interface Transaction {
  id: number;
  icon: string;
  label: string;
  sub: string;
  amount: number;
  positive: boolean;
  category: string;
  receipt?: TransactionReceipt;
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
  uid: string;
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

export interface VirtualCardData {
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isFrozen?: boolean;
}

export interface AppState {
  user: User;
  settings: Settings;
  wallet: {
    balance: number;
    currency: string;
    hasVirtualCard: boolean;
  };
  virtualCard: VirtualCardData | null;
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
  updateBalance: (amount: number) => void;
  createVirtualCard: () => void;
  setWalletCard: (hasCard: boolean) => void;
  setVirtualCard: (card: VirtualCardData | null) => void;
  addAccount: (account: Account, initialTransfer: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    uid: "",
    name: "",
    phone: "",
    email: "",
    location: "",
    avatar: "",
  },
  settings: {
    biometrics: false,
    twoFactorAuth: false,
  },
  wallet: {
    balance: 0,
    currency: "AOA",
    hasVirtualCard: false,
  },
  virtualCard: null,
  transactions: [],
  accounts: [],
  contacts: [
    { id: 1, name: "Maria Santos", phone: "+244 923 123 456", initials: "MS", color: "#6366f1" },
    { id: 2, name: "Carlos Ndongo", phone: "+244 926 987 654", initials: "CN", color: "#F47C20" },
    { id: 3, name: "Fatima Kuzela", phone: "+244 912 555 012", initials: "FK", color: "#22c55e" },
    { id: 4, name: "Pedro Lukamba", phone: "+244 923 888 765", initials: "PL", color: "#ec4899" },
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
  updateBalance: (amount) => set((state) => ({ wallet: { ...state.wallet, balance: state.wallet.balance + amount } })),
  createVirtualCard: () => set((state) => ({ wallet: { ...state.wallet, hasVirtualCard: true } })),
  setWalletCard: (hasCard) => set((state) => ({ wallet: { ...state.wallet, hasVirtualCard: hasCard } })),
  setVirtualCard: (card) => set({ virtualCard: card }),
  addAccount: (account, initialTransfer) => set((state) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      icon: "send",
      label: `Transferência para ${account.label}`,
      sub: "Hoje, agora mesmo",
      amount: initialTransfer,
      positive: false,
      category: "Transferência",
    };
    return {
      accounts: [...state.accounts, account],
      wallet: { ...state.wallet },
      transactions: [newTransaction, ...state.transactions],
    };
  }),
}));
