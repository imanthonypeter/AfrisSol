import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Search, ChevronRight, Check, Plus, UserPlus, X } from "lucide-react";
import { useAppStore, Contact } from "../../store/useAppStore";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { SuccessCheckmark } from "../../components/SuccessCheckmark";
import { motion, AnimatePresence } from "framer-motion";
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
  const { wallet, contacts, addContact, updateBalance, addTransaction } = useAppStore();

  const handleAddContact = () => {
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
    addContact(newContact);
    setIsAddingContact(false);
    setNewName("");
    setNewPhone("");
    setSelectedContact(newContact);
  };

  const handleSend = () => {
    if (amount && (recipient || selectedContact)) setStep("confirm");
  };

  const handleConfirm = () => {
    setStep("success");
    const numAmount = parseFloat(amount);
    if (tab === "enviar" && !isNaN(numAmount) && numAmount > 0) {
      updateBalance(-numAmount);
      addTransaction({
        id: Date.now(),
        icon: "send",
        label: `Envio para ${selectedContact?.name || recipient || "Desconhecido"}`,
        sub: "Agora mesmo",
        amount: numAmount,
        positive: false,
        category: "Transferência"
      });
    }
  };
  const handleReset = () => { setStep("form"); setAmount(""); setRecipient(""); setSelectedContact(null); setNota(""); };

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
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="mb-4">
            <SuccessCheckmark size={80} color="#22c55e" />
          </div>
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: "20px" }}>
            {tab === "enviar" ? "Transferência enviada!" : "Pedido enviado!"}
          </h2>
          <p className="text-gray-500 text-sm text-center mb-2">
            {tab === "enviar"
              ? `${amount} ${wallet.currency} enviados com sucesso`
              : `Pedido de ${amount} ${wallet.currency} enviado`}
          </p>
          <p className="text-gray-400 text-xs mb-8">Referência: #TRF20240501</p>
          <button
            onClick={handleReset}
            className="w-full py-4 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
          >
            Nova transferência
          </button>
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
              className="flex-1 py-4 rounded-xl text-white text-sm"
              style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
            >
              Confirmar
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
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-700 outline-none border border-gray-100 focus:border-blue-300"
                    placeholder="Nome, telefone ou IBAN"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
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
                  { label: "Nome", value: "João Macuácua" },
                  { label: "Telemóvel", value: "+244 923 XXX XXX" },
                  { label: "IBAN", value: "AO 1234 5678 9012" },
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
                className="w-full py-4 rounded-xl text-white"
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
    </AnimatedLayout>
  );
}
