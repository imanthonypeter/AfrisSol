import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Search, ChevronRight, Check, Plus, UserPlus, X } from "lucide-react";
import { useAppStore, Contact } from "../../store/useAppStore";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { SuccessCheckmark } from "../../components/SuccessCheckmark";
import { PinModal } from "../components/PinModal";
import { motion, AnimatePresence } from "framer-motion";
import { ReceiptModal, TransactionReceipt } from "../../components/ReceiptModal";
import { toast } from "sonner";
import { transferMoney, addContact as addContactToFirestore } from "../../services/firestore";
export function TransferenciasScreen() {
  const [tab, setTab] = useState<"enviar" | "receber">("enviar");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [nota, setNota] = useState("");
  const [currentReceipt, setCurrentReceipt] = useState<TransactionReceipt | null>(null);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const { wallet, contacts, addContact, updateBalance, addTransaction, user, accounts } = useAppStore();

  const handleAddContact = async () => {
    if (!newName || !newPhone) return;
    const initials = newName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const colors = ["#6366f1", "#F47C20", "#22c55e", "#ec4899", "#8b5cf6", "#f59e0b"];
    const newContact: Contact = {
      id: Date.now(),
      name: newName,
      phone: newPhone,
      initials,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    // Optimistic UI update
    addContact(newContact);
    setIsAddingContact(false);
    setSelectedContact(newContact);
    
    // Save to Firestore
    try {
      if (user.uid) {
        await addContactToFirestore(user.uid, {
          name: newContact.name,
          phone: newContact.phone,
          initials: newContact.initials,
          color: newContact.color
        });
      }
    } catch (e) {
      console.error("Erro ao guardar contacto", e);
    }
    
    setNewName("");
    setNewPhone("");
  };

  const handleSend = () => {
    if (!amount) {
      toast.error("Por favor, insira um valor.");
      return;
    }
    if (tab === "enviar" && !recipient && !selectedContact) {
      toast.error("Por favor, selecione ou digite um destinatário.");
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    
    if (tab === "enviar") {
      if (isNaN(numAmount) || numAmount <= 0) {
        toast.error("Valor inválido.");
        setStep("form");
        return;
      }
      if (numAmount > wallet.balance) {
        toast.error("Saldo insuficiente.");
        setStep("form");
        return;
      }

      setIsPinOpen(true);
    } else {
      if (isNaN(numAmount) || numAmount <= 0) {
        toast.error("Valor inválido.");
        setStep("form");
        return;
      }
      setStep("success");
    }
  };

  const handlePinConfirm = async (_pin: string) => {
    setIsPinOpen(false);
    setIsTransferring(true);
    const numAmount = parseFloat(amount);
    
    try {
      const targetIdentifier = selectedContact?.phone || recipient;
      const result = await transferMoney(user.uid, targetIdentifier, numAmount, nota);
      
      if (result.success) {
        updateBalance(-numAmount);
        
        const receipt: TransactionReceipt = {
          type: "Transferência",
          amount: numAmount,
          currency: wallet.currency,
          date: Date.now(),
          reference: result.transactionId || `TRF${Math.floor(Math.random() * 100000000)}`,
          fromName: user.name || "Utilizador AfriSol",
          fromAccount: accounts.length > 0 ? accounts[0].label : "Banco AfriSol",
          toName: selectedContact?.name || recipient || "Desconhecido",
          toAccount: `${targetIdentifier.startsWith("AO") ? "IBAN" : "Contacto"}: ${targetIdentifier}`,
        };

        setCurrentReceipt(receipt);

        addTransaction({
          id: receipt.date,
          icon: "send",
          label: `Envio para ${receipt.toName}`,
          sub: "Agora mesmo",
          amount: numAmount,
          positive: false,
          category: "Transferência",
          receipt: receipt
        });
        
        setStep("success");
      } else {
        toast.error(result.message);
        setStep("form");
      }
    } catch (e: any) {
      toast.error(e.message || "Ocorreu um erro na transferência.");
      setStep("form");
    } finally {
      setIsTransferring(false);
    }
  };
  const handleReset = () => { setStep("form"); setAmount(""); setRecipient(""); setSelectedContact(null); setNota(""); setCurrentReceipt(null); };

  return (
    <AnimatedLayout className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-3 pb-6"
        style={{ background: "linear-gradient(160deg, #162456 0%, #1a2e6e 100%)", borderRadius: "0 0 28px 28px" }}
      >
        <h1 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: 700 }}>Transferências</h1>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {(["enviar", "receber"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setStep("form"); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: tab === t ? "white" : "transparent",
                color: tab === t ? "#162456" : "rgba(255,255,255,0.7)",
                fontWeight: tab === t ? 600 : 400,
              }}
            >
              {t === "enviar" ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
              {t === "enviar" ? "Enviar" : "Receber"}
            </button>
          ))}
        </div>
      </div>

      {step === "success" ? (
        <div className="flex-1 flex flex-col px-5 py-6 overflow-y-auto">
          {tab === "enviar" ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="mb-4">
                <SuccessCheckmark size={80} color="#22c55e" />
              </div>
              <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: "20px" }}>Transferência enviada!</h2>
              <p className="text-gray-500 text-sm text-center mb-6">A sua transferência foi processada com sucesso.</p>
              
              <button
                onClick={() => setCurrentReceipt(currentReceipt)} // Just open modal
                className="w-full py-4 rounded-xl text-[#162456] border border-[#162456] mb-4"
                style={{ fontWeight: 600 }}
              >
                Ver Comprovativo
              </button>

              <button
                onClick={handleReset}
                className="w-full py-4 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
              >
                Nova transferência
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="mb-4">
                <SuccessCheckmark size={80} color="#22c55e" />
              </div>
              <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: "20px" }}>Pedido enviado!</h2>
              <p className="text-gray-500 text-sm text-center mb-2">Pedido de {amount} {wallet.currency} enviado</p>
              <button
                onClick={() => setStep("confirm")}
                disabled={
                  !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || parseFloat(amount) > wallet.balance ||
                  !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0
                }
                className="w-full py-4 rounded-xl text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
              >
                Continuar
              </button>
            </div>
          )}
        </div>
      ) : step === "confirm" ? (
        <div className="px-5 py-5">
          <div
            className="bg-white rounded-2xl p-5 mb-4"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600, fontSize: "15px" }}>Confirmar transferência</h3>
            <div className="space-y-3">
              {[
                { label: tab === "enviar" ? "Destinatário" : "De", value: selectedContact?.name || recipient },
                { label: "Valor", value: `${amount} ${wallet.currency}` },
                { label: "Taxa", value: `0,00 ${wallet.currency}` },
                { label: "Total", value: `${amount} ${wallet.currency}` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">{row.label}</span>
                  <span className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep("form")}
              className="flex-1 py-4 rounded-xl border-2 text-sm"
              style={{ borderColor: "#162456", color: "#162456", fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isTransferring}
              className={`flex-1 py-4 rounded-xl text-white text-sm ${isTransferring ? 'opacity-70' : ''}`}
              style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
            >
              {isTransferring ? "A processar..." : "Confirmar"}
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 py-5">
          {tab === "enviar" ? (
            <>
              {/* Amount */}
              <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <label className="text-gray-500 text-xs mb-2 block" style={{ fontWeight: 500 }}>VALOR A ENVIAR</label>
                <div className={`flex items-center gap-2 border-b-2 pb-1 ${amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) ? 'border-red-400' : 'border-transparent'}`}>
                  <input
                    type="number"
                    className="flex-1 outline-none text-gray-800 bg-transparent"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ fontSize: "28px", fontWeight: 700 }}
                  />
                  <span className="text-gray-400 text-lg" style={{ fontWeight: 500 }}>{wallet.currency}</span>
                </div>
                {amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) && (
                  <p className="text-red-500 text-xs mt-1">Insira um valor válido e maior que zero.</p>
                )}
                {amount && parseFloat(amount) > wallet.balance && (
                  <p className="text-red-500 text-xs mt-1">Saldo insuficiente. (Saldo actual: {wallet.balance} {wallet.currency})</p>
                )}
                <div className="flex gap-2 mt-3">
                  {["500", "1.000", "2.500", "5.000"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(v.replace(".", ""))}
                      className="flex-1 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient */}
              <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <label className="text-gray-500 text-xs mb-3 block" style={{ fontWeight: 500 }}>DESTINATÁRIO</label>
                <div className="relative mb-4">
                  <Search size={16} color="#9CA3AF" className="absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className={`w-full pl-9 pr-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-700 outline-none border ${recipient && recipient.length < 3 ? 'border-red-300' : 'border-gray-100'} focus:border-blue-300`}
                    placeholder="Nome, telefone ou IBAN"
                    value={recipient}
                    onChange={(e) => {
                      setRecipient(e.target.value);
                      setSelectedContact(null); // Clear selection if typing manually
                    }}
                  />
                </div>
                {recipient && recipient.length < 3 && !selectedContact && (
                  <p className="text-red-500 text-xs -mt-2 mb-3">O destinatário deve ter pelo menos 3 caracteres.</p>
                )} 
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-xs">Contactos recentes</p>
                  <button 
                    onClick={() => setIsAddingContact(true)}
                    className="flex items-center gap-1 text-[#F47C20] text-xs font-semibold hover:opacity-80"
                  >
                    <Plus size={14} />
                    <span>Adicionar novo</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedContact(c)}
                      className="w-full flex items-center gap-3 py-2 px-3 rounded-xl transition-colors"
                      style={{
                        background: selectedContact?.id === c.id ? "#EEF2FF" : "transparent",
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: c.color }}
                      >
                        <span className="text-white text-xs" style={{ fontWeight: 700 }}>{c.initials}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-gray-800 text-sm" style={{ fontWeight: 500 }}>{c.name}</p>
                        <p className="text-gray-400 text-xs">{c.phone}</p>
                      </div>
                      {selectedContact?.id === c.id && <Check size={16} color="#6366f1" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="bg-white rounded-2xl p-5 mb-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <label className="text-gray-500 text-xs mb-2 block" style={{ fontWeight: 500 }}>NOTA (OPCIONAL)</label>
                <input
                  className="w-full outline-none text-gray-700 bg-transparent text-sm"
                  placeholder="Adicionar uma nota..."
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                />
              </div>

              <button
                onClick={handleSend}
                className="w-full py-4 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600, fontSize: "16px" }}
              >
                Enviar dinheiro
              </button>
            </>
          ) : (
            <>
              {/* Receive */}
              <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <label className="text-gray-500 text-xs mb-2 block" style={{ fontWeight: 500 }}>VALOR A RECEBER</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="flex-1 outline-none text-gray-800 bg-transparent"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ fontSize: "28px", fontWeight: 700 }}
                  />
                  <span className="text-gray-400 text-lg" style={{ fontWeight: 500 }}>{wallet.currency}</span>
                </div>
              </div>

              {/* My details */}
              <div
                className="bg-white rounded-2xl p-5 mb-4"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              >
                <p className="text-gray-500 text-xs mb-4" style={{ fontWeight: 500 }}>OS MEUS DADOS</p>
                {[
                  { label: "Nome", value: user.name || "Utilizador AfriSol" },
                  { label: "Telemóvel", value: user.phone || "N/A" },
                  { label: "IBAN", value: accounts.length > 0 ? accounts[0].num : "N/A" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 text-sm">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{row.value}</span>
                      <ChevronRight size={14} color="#D1D5DB" />
                    </div>
                  </div>
                ))}
              </div>

              {/* QR Code placeholder */}
              <div
                className="bg-white rounded-2xl p-5 mb-5 flex flex-col items-center"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              >
                <p className="text-gray-500 text-sm mb-3">QR Code para receber</p>
                <div
                  className="w-36 h-36 rounded-xl flex items-center justify-center"
                  style={{ background: "#F5F7FA", border: "2px dashed #D1D5DB" }}
                >
                  <div className="grid grid-cols-5 gap-0.5 opacity-30">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-sm"
                        style={{ background: Math.random() > 0.5 ? "#162456" : "transparent" }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-2">Mostre este QR ao pagador</p>
              </div>

              <button
                onClick={handleSend}
                disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
                className="w-full py-4 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600, fontSize: "16px" }}
              >
                Solicitar pagamento
              </button>
            </>
          )}
        </div>
      )}
      {/* Add Contact Modal */}
      <AnimatePresence>
        {isAddingContact && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-800 font-bold text-lg">Novo Destinatário</h3>
              <button onClick={() => setIsAddingContact(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-gray-500 text-xs font-semibold mb-1.5 block">NOME COMPLETO</label>
                <div className="relative">
                  <UserPlus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-[#F47C20] text-gray-700 text-sm"
                    placeholder="Ex: Manuel dos Santos"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-gray-500 text-xs font-semibold mb-1.5 block">TELEFONE OU IBAN</label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-[#F47C20] text-gray-700 text-sm"
                  placeholder="+244 9XX XXX XXX"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleAddContact}
              disabled={!newName || !newPhone}
              className="w-full py-4 rounded-xl text-white shadow-lg disabled:opacity-50 transition-all active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
            >
              Salvar Destinatário
            </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <PinModal 
        isOpen={isPinOpen} 
        onClose={() => setIsPinOpen(false)} 
        onConfirm={handlePinConfirm} 
      />
      <ReceiptModal receipt={currentReceipt} onClose={() => setCurrentReceipt(null)} />
    </AnimatedLayout>
  );
}
