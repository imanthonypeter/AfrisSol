import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Gerador de IBAN ─────────────────────────────────────────
// Gera um IBAN angolano único: AO06 0098 + 17 dígitos aleatórios
function generateIBAN(): string {
  const suffix = Array.from({ length: 17 }, () => Math.floor(Math.random() * 10)).join("");
  return `AO060098${suffix}`;
}

// Formatar IBAN para apresentação: AO06 0098 1234 5678 ...
export function formatIBAN(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

// ─── Gerador de número de telemóvel ──────────────────────────
// Gera um número angolano aleatório com prefixo +244
export function generatePhoneNumber(): string {
  const prefixes = ["923", "924", "925", "926", "912", "913", "914", "915", "931", "932"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const rest = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
  return `+244 ${prefix} ${rest.slice(0, 3)} ${rest.slice(3)}`;
}

// ─── Gestão de Utilizadores ──────────────────────────────────
export interface FirestoreUser {
  uid: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  hasVirtualCard?: boolean;
  createdAt: Timestamp | null;
}

// Criar utilizador no Firestore com contas padrão
export async function createUser(uid: string, data: { name: string; email: string; phone?: string }) {
  const phone = data.phone || generatePhoneNumber();
  const userRef = doc(db, "users", uid);
  const userData: FirestoreUser = {
    uid,
    name: data.name,
    email: data.email,
    phone,
    location: "Luanda, Angola",
    hasVirtualCard: false,
    createdAt: Timestamp.now(),
  };
  await setDoc(userRef, userData);

  // Criar conta principal com IBAN e saldo inicial
  const iban = generateIBAN();
  const mainAccountRef = await addDoc(collection(db, "accounts"), {
    userId: uid,
    accountName: "Conta principal",
    iban,
    balance: 856000,
    color: "#162456",
    createdAt: serverTimestamp(),
  });

  // Registar o depósito inicial
  await addDoc(collection(db, "transactions"), {
    senderAccountId: "system_deposit",
    receiverAccountId: mainAccountRef.id,
    senderUserId: "system",
    receiverUserId: uid,
    amount: 856000,
    type: "deposit",
    description: "Depósito inicial AfriSol",
    createdAt: serverTimestamp(),
  });

  // Criar conta poupança
  await addDoc(collection(db, "accounts"), {
    userId: uid,
    accountName: "Poupança",
    iban: generateIBAN(),
    balance: 0,
    color: "#F47C20",
    createdAt: serverTimestamp(),
  });

  return { ...userData, phone };
}

// Resgatar utilizador antigo que não tem contas criadas (adiciona saldo e 2 contas padrão)
export async function bootstrapOldUserAccounts(uid: string) {
  // Criar conta principal com IBAN e saldo inicial
  const iban = generateIBAN();
  const mainAccountRef = await addDoc(collection(db, "accounts"), {
    userId: uid,
    accountName: "Conta principal",
    iban,
    balance: 856000,
    color: "#162456",
    createdAt: serverTimestamp(),
  });

  // Registar o depósito inicial
  await addDoc(collection(db, "transactions"), {
    senderAccountId: "system_deposit",
    receiverAccountId: mainAccountRef.id,
    senderUserId: "system",
    receiverUserId: uid,
    amount: 856000,
    type: "deposit",
    description: "Depósito inicial AfriSol",
    createdAt: serverTimestamp(),
  });

  // Criar conta poupança
  await addDoc(collection(db, "accounts"), {
    userId: uid,
    accountName: "Poupança",
    iban: generateIBAN(),
    balance: 0,
    color: "#F47C20",
    createdAt: serverTimestamp(),
  });
}

// Obter dados de um utilizador pelo UID
export async function getUser(uid: string): Promise<FirestoreUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as FirestoreUser) : null;
}

// Procurar utilizador pelo email
export async function findUserByEmail(email: string): Promise<FirestoreUser | null> {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as FirestoreUser);
}

// ─── Gestão de Cartão Virtual VISA ──────────────────────────

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  createdAt: Timestamp | null;
}

// Gerar número de cartão VISA aleatório com algoritmo de Luhn
function generateVisaCardNumber(): string {
  // VISA começa com 4
  const digits = [4];
  // Gerar 14 dígitos aleatórios (total 15 antes do check digit)
  for (let i = 0; i < 14; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }
  // Calcular dígito de verificação (Luhn)
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let d = digits[14 - i];
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  digits.push(checkDigit);
  return digits.join("");
}

// Formatar número de cartão para apresentação: 4532 9845 2314 3456
export function formatCardNumber(num: string): string {
  return num.replace(/(.{4})/g, "$1 ").trim();
}

// Gerar CVV aleatório de 3 dígitos
function generateCVV(): string {
  return String(Math.floor(100 + Math.random() * 900));
}

// Gerar data de validade (3 a 5 anos no futuro)
function generateExpiry(): { month: string; year: string } {
  const now = new Date();
  const yearsAhead = 3 + Math.floor(Math.random() * 3); // 3 a 5 anos
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  const year = String(now.getFullYear() + yearsAhead).slice(-2);
  return { month, year };
}

// Criar cartão virtual e guardar no Firestore
export async function createVirtualCardInFirestore(uid: string, holderName: string): Promise<VirtualCard> {
  const cardNumber = generateVisaCardNumber();
  const cvv = generateCVV();
  const expiry = generateExpiry();

  const cardData: VirtualCard = {
    cardNumber,
    cvv,
    expiryMonth: expiry.month,
    expiryYear: expiry.year,
    holderName: holderName.toUpperCase(),
    createdAt: Timestamp.now(),
  };

  // Guardar cartão na subcollection do utilizador
  await setDoc(doc(db, "users", uid, "virtualCard", "visa"), cardData);

  // Marcar que o utilizador tem cartão virtual
  await updateDoc(doc(db, "users", uid), { hasVirtualCard: true });

  return cardData;
}

// Obter dados do cartão virtual do utilizador
export async function getVirtualCard(uid: string): Promise<VirtualCard | null> {
  const snap = await getDoc(doc(db, "users", uid, "virtualCard", "visa"));
  return snap.exists() ? (snap.data() as VirtualCard) : null;
}

// ─── Gestão de Contas Bancárias ──────────────────────────────
export interface FirestoreAccount {
  id?: string;
  userId: string;
  accountName: string;
  iban: string;
  balance: number;
  color: string;
}

// Listar todas as contas de um utilizador
export async function getUserAccounts(uid: string): Promise<FirestoreAccount[]> {
  const q = query(collection(db, "accounts"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FirestoreAccount);
}

// Criar nova conta bancária com transferência inicial da conta principal
export async function createAccount(uid: string, accountName: string, initialTransfer: number, color: string) {
  const iban = generateIBAN();

  // Obter conta principal para deduzir o valor
  const accounts = await getUserAccounts(uid);
  const primary = accounts.find((a) => a.accountName === "Conta principal");

  if (primary && initialTransfer > 0) {
    if (primary.balance < initialTransfer) {
      throw new Error("Saldo insuficiente na conta principal.");
    }
    // Deduzir da conta principal
    await updateDoc(doc(db, "accounts", primary.id!), { balance: increment(-initialTransfer) });
  }

  // Criar nova conta
  const newAccountRef = await addDoc(collection(db, "accounts"), {
    userId: uid,
    accountName,
    iban,
    balance: initialTransfer,
    color,
    createdAt: serverTimestamp(),
  });

  // Registar a transacção de transferência interna
  if (initialTransfer > 0) {
    await addDoc(collection(db, "transactions"), {
      senderAccountId: primary?.id,
      receiverAccountId: newAccountRef.id,
      senderUserId: uid,
      receiverUserId: uid,
      amount: initialTransfer,
      type: "internal_transfer",
      description: `Transferência para ${accountName}`,
      createdAt: serverTimestamp(),
    });
  }

  return { id: newAccountRef.id, userId: uid, accountName, iban, balance: initialTransfer, color };
}

// Procurar conta pelo IBAN
export async function findAccountByIBAN(iban: string): Promise<(FirestoreAccount & { id: string }) | null> {
  const cleanIBAN = iban.replace(/\s/g, "");
  const q = query(collection(db, "accounts"), where("iban", "==", cleanIBAN));
  const snap = await getDocs(q);
  return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as FirestoreAccount & { id: string });
}

// ─── Gestão de Contactos ─────────────────────────────────────
export interface FirestoreContact {
  id?: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  iban?: string;
  initials: string;
  color: string;
}

// Listar contactos de um utilizador
export async function getUserContacts(uid: string): Promise<FirestoreContact[]> {
  const q = query(collection(db, "users", uid, "contacts"), orderBy("name"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FirestoreContact);
}

// Adicionar novo contacto
export async function addContact(uid: string, contact: Omit<FirestoreContact, "userId" | "id">) {
  const ref = await addDoc(collection(db, "users", uid, "contacts"), {
    ...contact,
    userId: uid,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, userId: uid, ...contact };
}

// ─── Lógica de Transferências ────────────────────────────────
export interface TransferResult {
  success: boolean;
  message: string;
  transactionId?: string;
}

/**
 * Transferir dinheiro entre contas.
 * O destinatário pode ser encontrado por email ou IBAN.
 */
export async function transferMoney(
  senderUid: string,
  receiverIdentifier: string, // email ou IBAN
  amount: number,
  description?: string
): Promise<TransferResult> {
  if (amount <= 0) {
    return { success: false, message: "O valor deve ser maior que zero." };
  }

  // Obter conta principal do remetente
  const senderAccounts = await getUserAccounts(senderUid);
  const senderAccount = senderAccounts.find((a) => a.accountName === "Conta principal");

  if (!senderAccount) {
    return { success: false, message: "Conta do remetente não encontrada." };
  }

  if (senderAccount.balance < amount) {
    return { success: false, message: "Saldo insuficiente." };
  }

  // Procurar destinatário por email ou IBAN
  let receiverAccount: (FirestoreAccount & { id: string }) | null = null;
  let receiverUser: FirestoreUser | null = null;

  // Tentar IBAN primeiro (começa com AO)
  const cleanIdentifier = receiverIdentifier.replace(/\s/g, "");
  if (cleanIdentifier.startsWith("AO")) {
    receiverAccount = await findAccountByIBAN(cleanIdentifier);
    if (receiverAccount) {
      receiverUser = await getUser(receiverAccount.userId);
    }
  } else {
    // Tentar por email
    receiverUser = await findUserByEmail(receiverIdentifier);
    if (receiverUser) {
      const receiverAccounts = await getUserAccounts(receiverUser.uid);
      const primary = receiverAccounts.find((a) => a.accountName === "Conta principal");
      if (primary) {
        receiverAccount = primary as FirestoreAccount & { id: string };
      }
    }
  }

  if (!receiverAccount || !receiverUser) {
    return { success: false, message: "Destinatário não encontrado. Verifique o email ou IBAN." };
  }

  // Impedir transferência para a mesma conta
  if (senderAccount.id === receiverAccount.id) {
    return { success: false, message: "Não pode transferir para a mesma conta." };
  }

  // Executar a transferência atomicamente usando uma transacção Firestore
  try {
    const txRef = await runTransaction(db, async (transaction) => {
      const senderRef = doc(db, "accounts", senderAccount.id!);
      const receiverRef = doc(db, "accounts", receiverAccount!.id);

      const senderSnap = await transaction.get(senderRef);
      const currentBalance = senderSnap.data()?.balance || 0;

      if (currentBalance < amount) {
        throw new Error("Saldo insuficiente.");
      }

      // Deduzir do remetente
      transaction.update(senderRef, { balance: increment(-amount) });
      // Adicionar ao destinatário
      transaction.update(receiverRef, { balance: increment(amount) });

      // Criar registo da transacção
      const txDocRef = doc(collection(db, "transactions"));
      transaction.set(txDocRef, {
        senderAccountId: senderAccount.id,
        receiverAccountId: receiverAccount!.id,
        senderUserId: senderUid,
        receiverUserId: receiverUser!.uid,
        amount,
        type: "transfer",
        description: description || `Transferência para ${receiverUser!.name}`,
        createdAt: serverTimestamp(),
      });

      return txDocRef.id;
    });

    return { success: true, message: "Transferência realizada com sucesso!", transactionId: txRef };
  } catch (error: any) {
    return { success: false, message: error.message || "Erro ao processar a transferência." };
  }
}

// ─── Histórico de Transacções ────────────────────────────────
export interface FirestoreTransaction {
  id?: string;
  senderAccountId: string;
  receiverAccountId: string;
  senderUserId: string;
  receiverUserId: string;
  amount: number;
  type: string;
  description: string;
  createdAt: Timestamp | null;
}

// Obter transacções de um utilizador (enviadas e recebidas)
export async function getUserTransactions(uid: string): Promise<FirestoreTransaction[]> {
  // Obter transacções onde o utilizador é remetente OU destinatário
  const sentQ = query(collection(db, "transactions"), where("senderUserId", "==", uid), orderBy("createdAt", "desc"));
  const recvQ = query(collection(db, "transactions"), where("receiverUserId", "==", uid), orderBy("createdAt", "desc"));

  const [sentSnap, recvSnap] = await Promise.all([getDocs(sentQ), getDocs(recvQ)]);

  // Usar Map para evitar duplicados
  const allTx = new Map<string, FirestoreTransaction>();
  sentSnap.docs.forEach((d) => allTx.set(d.id, { id: d.id, ...d.data() } as FirestoreTransaction));
  recvSnap.docs.forEach((d) => allTx.set(d.id, { id: d.id, ...d.data() } as FirestoreTransaction));

  // Ordenar por data mais recente
  return Array.from(allTx.values()).sort((a, b) => {
    const aTime = a.createdAt?.toMillis() || 0;
    const bTime = b.createdAt?.toMillis() || 0;
    return bTime - aTime;
  });
}

// ─── Lógica de Pagamentos ────────────────────────────────────
export async function payService(
  uid: string,
  serviceName: string,
  reference: string,
  amount: number
): Promise<TransferResult> {
  if (amount <= 0) {
    return { success: false, message: "O valor deve ser maior que zero." };
  }

  const accounts = await getUserAccounts(uid);
  const primaryAccount = accounts.find((a) => a.accountName === "Conta principal");

  if (!primaryAccount) {
    return { success: false, message: "Conta não encontrada." };
  }

  if (primaryAccount.balance < amount) {
    return { success: false, message: "Saldo insuficiente." };
  }

  try {
    const txRef = await runTransaction(db, async (transaction) => {
      const senderRef = doc(db, "accounts", primaryAccount.id!);

      const senderSnap = await transaction.get(senderRef);
      const currentBalance = senderSnap.data()?.balance || 0;

      if (currentBalance < amount) {
        throw new Error("Saldo insuficiente.");
      }

      transaction.update(senderRef, { balance: increment(-amount) });

      const txDocRef = doc(collection(db, "transactions"));
      transaction.set(txDocRef, {
        senderAccountId: primaryAccount.id,
        receiverAccountId: "system_service",
        senderUserId: uid,
        receiverUserId: "system",
        amount,
        type: "payment",
        description: `Pagamento de ${serviceName} - Ref: ${reference}`,
        createdAt: serverTimestamp(),
      });

      return txDocRef.id;
    });

    return { success: true, message: "Pagamento realizado com sucesso!", transactionId: txRef };
  } catch (error: any) {
    return { success: false, message: error.message || "Erro ao processar o pagamento." };
  }
}
