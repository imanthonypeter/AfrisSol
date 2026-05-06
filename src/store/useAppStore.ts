import { create } from "zustand";

export interface Transaction {
  id: number;
  icon: "receive" | "send" | "internet" | "electricity" | "recharge" | "other";
  label: string;
  sub: string;
  amount: string;
  positive: boolean;
  category: string;
}

export interface Account {
  label: string;
  num: string;
  balance: string;
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
    balance: string;
    currency: string;
  };
  transactions: Transaction[];
  accounts: Account[];

  // Actions
  updateUser: (data: Partial<User>) => void;
  updateSettings: (data: Partial<Settings>) => void;
  addTransaction: (tx: Transaction) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    name: "António Pedro",
    phone: "+244 9XX XXX XXX", // Changed from +258 to +244 (Angola) based on KZ currency
    email: "anthony@exemplo.com",
    location: "Luanda, Angola",
    avatar: "", // Will fall back to default logo if empty
  },
  settings: {
    biometrics: false,
    twoFactorAuth: false,
  },
  wallet: {
    balance: "10.000,00",
    currency: "KZ",
  },
  transactions: [
    { id: 1, icon: "receive", label: "Recebimento de Maria", sub: "Hoje, 10:45", amount: "+2.500,00 KZ", positive: true, category: "Transferência" },
    { id: 2, icon: "internet", label: "Pagamento de Internet", sub: "Hoje, 09:30", amount: "-500,00 KZ", positive: false, category: "Pagamento" },
    { id: 3, icon: "send", label: "Envio para Carlos", sub: "Ontem, 18:15", amount: "-1.200,00 KZ", positive: false, category: "Transferência" },
    { id: 4, icon: "receive", label: "Recebimento de Fatima", sub: "Ontem, 14:00", amount: "+3.000,00 KZ", positive: true, category: "Transferência" },
    { id: 5, icon: "electricity", label: "Pagamento de Electricidade", sub: "2 dias atrás", amount: "-800,00 KZ", positive: false, category: "Pagamento" },
    { id: 6, icon: "recharge", label: "Recarga Vodacom", sub: "2 dias atrás, 11:00", amount: "-200,00 KZ", positive: false, category: "Recarga" },
    { id: 7, icon: "receive", label: "Recebimento de Pedro", sub: "3 dias atrás", amount: "+1.500,00 KZ", positive: true, category: "Transferência" },
    { id: 8, icon: "send", label: "Envio para João", sub: "3 dias atrás, 16:30", amount: "-750,00 KZ", positive: false, category: "Transferência" },
    { id: 9, icon: "electricity", label: "Pagamento de Água", sub: "5 dias atrás", amount: "-600,00 KZ", positive: false, category: "Pagamento" },
    { id: 10, icon: "internet", label: "Recarga de Dados", sub: "5 dias atrás, 09:00", amount: "-300,00 KZ", positive: false, category: "Recarga" },
    { id: 11, icon: "receive", label: "Depósito na conta", sub: "1 semana atrás", amount: "+5.000,00 KZ", positive: true, category: "Depósito" },
    { id: 12, icon: "send", label: "Envio para Ana", sub: "1 semana atrás", amount: "-900,00 KZ", positive: false, category: "Transferência" },
  ],
  accounts: [
    { label: "Conta principal", num: "AO 1234 5678 9012", balance: "10.000,00 KZ", color: "#162456" },
    { label: "Poupança", num: "AO 9876 5432 1098", balance: "0,00 KZ", color: "#F47C20" },
  ],

  updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
  updateSettings: (data) => set((state) => ({ settings: { ...state.settings, ...data } })),
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
}));
