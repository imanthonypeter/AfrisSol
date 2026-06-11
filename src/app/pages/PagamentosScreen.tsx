import { useState } from "react";
import { Wifi, Zap, Droplets, Phone, Car, GraduationCap, Heart, ChevronRight, CreditCard, Loader2, Eye, EyeOff, X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { SuccessCheckmark } from "../../components/SuccessCheckmark";
import { PinModal } from "../components/PinModal";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { payService } from "../../services/firestore";
import { VirtualCard } from "../components/VirtualCard";

const services = [
  { id: "visa", icon: <CreditCard size={22} />, label: "Cartão Visa", provider: "AfriSol", color: "#1a1f71", bg: "#E3E9F3" },
  { id: "unitelmoney", icon: <img src="https://www.aicep.com/wp-content/uploads/2021/09/unitel-mobile-money-1.png" alt="Unitel Money" className="w-8 h-8 rounded-full object-cover bg-white" />, label: "Unitel Money", provider: "Unitel", color: "#F47C20", bg: "#FFF3E0" },
  { id: "afrimoney", icon: <img src="https://play-lh.googleusercontent.com/RdcJFPZm-crIFYqDz9RZiKpch3GZBNcCf1_gOefvjCYezabqjAZGwP_bw_hRSzMMpA=w240-h480-rw" alt="Afrimoney" className="w-8 h-8 rounded-xl object-cover" />, label: "Afrimoney", provider: "Africell", color: "#E00075", bg: "#FCE4EC" },
  { id: "dstv", icon: <svg viewBox="0 0 100 100" className="w-8 h-8"><rect width="100" height="100" rx="50" fill="#00A5DF"/><path d="M25,35 h20 c15,0 20,10 20,15 c0,5 -5,15 -20,15 h-20 v-30" fill="none" stroke="white" strokeWidth="8"/></svg>, label: "DStv", provider: "Multichoice Angola", color: "#162456", bg: "#EFF6FF" },
  { id: "electricidade", icon: <Zap size={22} />, label: "Electricidade", provider: "ENDE", color: "#F47C20", bg: "#FFF3E0" },
  { id: "agua", icon: <Droplets size={22} />, label: "Água", provider: "EPAL", color: "#3b82f6", bg: "#EFF6FF" },
  { id: "internet", icon: <Wifi size={22} />, label: "Internet", provider: "Unitel, Angola Telecom", color: "#6366f1", bg: "#EEF2FF" },
  { id: "tv", icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS49lQrzJySNWgElAyAXHDWy721oXRSoOg12A&s" alt="TV Cabo" className="w-8 h-8 rounded-full object-cover" />, label: "TV Cabo", provider: "TV Cabo, ZAP", color: "#8b5cf6", bg: "#F5F3FF" },
  { id: "telefone", icon: <Phone size={22} />, label: "Telefone Fixo", provider: "Angola Telecom", color: "#22c55e", bg: "#E8F5E9" },
  { id: "seguro", icon: <Heart size={22} />, label: "Seguros", provider: "ENSA, AAA Seguros", color: "#ef4444", bg: "#FEF2F2" },
  { id: "educacao", icon: <GraduationCap size={22} />, label: "Educação", provider: "Propinas, Mensalidades", color: "#F47C20", bg: "#FFF3E0" },
  { id: "transporte", icon: <Car size={22} />, label: "Transporte", provider: "Portagens, Combustível", color: "#162456", bg: "#EFF6FF" },
];

export function PagamentosScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"list" | "form" | "confirm" | "success">("list");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [cvvVisible, setCvvVisible] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionRef, setTransactionRef] = useState<string>("");
  const { wallet, virtualCard, updateBalance, addTransaction, createVirtualCard, setVirtualCard, setWalletCard, user } = useAppStore();

  const selectedService = services.find((s) => s.id === selected);

  const handleBack = () => {
    if (step === "form") { setStep("list"); setSelected(null); }
    else if (step === "confirm") setStep("form");
    else if (step === "success") { setStep("list"); setAmount(""); setReference(""); setSelected(null); }
  };

  const handlePay = () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast.error("Por favor, insira um valor válido.");
      return;
    }
    if (numAmount > wallet.balance) {
      toast.error("Saldo insuficiente.");
      return;
    }
    setIsPinOpen(true);
  };

  const handlePinConfirm = async (_pin: string) => {
    setIsPinOpen(false);
    setIsProcessing(true);
    
    const numAmount = parseFloat(amount);
    
    try {
      if (!user.uid) {
        throw new Error("Usuário não autenticado.");
      }
      
      const result = await payService(user.uid, selectedService?.label || "Serviço", reference || "N/A", numAmount);
      
      if (result.success) {
        updateBalance(-numAmount);
        addTransaction({
          id: Date.now(),
          icon: selectedService?.id || "other",
          label: `Pagamento ${selectedService?.label}`,
          sub: `Ref: ${reference || 'N/A'}`,
          amount: numAmount,
          positive: false,
          category: "Pagamento"
        });
        setTransactionRef(result.transactionId || `PAG${Math.floor(Math.random() * 1000000)}`);
        setStep("success");
      } else {
        toast.error(result.message);
      }
    } catch (e: any) {
      toast.error(e.message || "Ocorreu um erro no pagamento.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatedLayout className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-3 pb-6"
        style={{ background: "linear-gradient(160deg, #162456 0%, #1a2e6e 100%)", borderRadius: "0 0 28px 28px" }}
      >
        <div className="flex items-center gap-3 mb-1">
          {step !== "list" && (
            <button onClick={handleBack} className="text-white/70">
              <ChevronRight size={20} className="rotate-180" />
            </button>
          )}
          <h1 className="text-white" style={{ fontSize: "18px", fontWeight: 700 }}>
            {step === "list" ? "Pagamentos" : step === "success" ? "Sucesso!" : selectedService?.label}
          </h1>
        </div>
        {step === "list" && <p className="text-white/60 text-xs">Pague serviços e contas facilmente</p>}
      </div>

      {step === "list" && (
        <div className="px-5 py-5">
          <motion.div 
            className="grid grid-cols-3 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {services.map((svc) => (
              <motion.button
                key={svc.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelected(svc.id); setStep("form"); }}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: svc.bg, color: svc.color }}
                >
                  {svc.icon}
                </div>
                <span className="text-gray-700 text-xs text-center leading-tight" style={{ fontWeight: 500 }}>
                  {svc.label}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Recent payments */}
          <h3 className="text-gray-700 mt-5 mb-3" style={{ fontWeight: 600, fontSize: "14px" }}>Pagamentos recentes</h3>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            {[
              { label: "Electricidade ENDE", ref: "Ref: 12345678", amount: `800,00 ${wallet.currency}`, color: "#F47C20", bg: "#FFF3E0", icon: <Zap size={16} color="#F47C20" /> },
              { label: "Internet Unitel", ref: "Ref: 87654321", amount: `500,00 ${wallet.currency}`, color: "#6366f1", bg: "#EEF2FF", icon: <Wifi size={16} color="#6366f1" /> },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: p.bg }}>
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm" style={{ fontWeight: 500 }}>{p.label}</p>
                    <p className="text-gray-400 text-xs">{p.ref}</p>
                  </div>
                  <span className="text-red-500 text-sm" style={{ fontWeight: 600 }}>-{p.amount}</span>
                </div>
                {i === 0 && <div className="h-px bg-gray-50 mx-4" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "form" && selectedService && selectedService.id !== "visa" && (
        <div className="px-5 py-5">
          <div
            className="flex items-center gap-3 p-4 rounded-2xl mb-4"
            style={{ background: selectedService.bg }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ color: selectedService.color }}
            >
              {selectedService.icon}
            </div>
            <div>
              <p className="text-gray-800" style={{ fontWeight: 600 }}>{selectedService.label}</p>
              <p className="text-gray-500 text-xs">{selectedService.provider}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <label className="text-gray-500 text-xs mb-2 block" style={{ fontWeight: 500 }}>REFERÊNCIA / NÚMERO DE CONTA</label>
              <input
                className={`w-full outline-none text-gray-800 text-lg bg-transparent border-b pb-2 ${reference && reference.length < 5 ? 'border-red-400' : 'border-gray-100'}`}
                placeholder="Ex: 12345678"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                style={{ fontWeight: 600 }}
              />
              {reference && reference.length < 5 && (
                <p className="text-red-500 text-xs mt-1">A referência deve ter pelo menos 5 caracteres.</p>
              )}
            </div>

            <div className={`bg-white rounded-2xl p-5 border-b-2 ${amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) ? 'border-red-400' : 'border-transparent'}`} style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <label className="text-gray-500 text-xs mb-2 block" style={{ fontWeight: 500 }}>VALOR A PAGAR ({wallet.currency})</label>
              <input
                type="number"
                className="w-full outline-none text-gray-800 bg-transparent"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ fontSize: "28px", fontWeight: 700 }}
              />
              {amount && parseFloat(amount) > wallet.balance && (
                <p className="text-red-500 text-xs mt-1">Saldo insuficiente. (Saldo actual: {wallet.balance} {wallet.currency})</p>
              )}
            </div>
          </div>

          <button
            onClick={() => { if (amount && reference) setStep("confirm"); }}
            disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || parseFloat(amount) > wallet.balance || !reference || reference.length < 5}
            className="w-full py-4 rounded-xl text-white mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600, fontSize: "16px" }}
          >
            Continuar
          </button>
        </div>
      )}

      {step === "form" && selectedService && selectedService.id === "visa" && (
        <div className="px-5 py-5 flex-1 flex flex-col items-center">
          {!wallet.hasVirtualCard ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 w-full">
              <div className="mb-6 w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "#E3E9F3", color: "#1a1f71" }}>
                <CreditCard size={40} />
              </div>
              <h2 className="text-gray-800 mb-4" style={{ fontWeight: 700, fontSize: "22px" }}>
                Cartão Visa AfriSol
              </h2>
              <p className="text-gray-600 mb-10" style={{ fontSize: "16px", lineHeight: 1.6 }}>
                Em parceiria com a Visa, temos o seu cartao visa afrissol aqui, <span style={{ fontWeight: 800, color: "#1a1f71", fontSize: "18px" }}>GRATUITO!!!!</span>
              </p>
              
              <button
                onClick={() => {
                  setIsCreatingCard(true);
                  setTimeout(async () => {
                    try {
                      const { auth } = await import("../../services/firebase");
                      const user = auth.currentUser;
                      if (user?.uid) {
                        const { createVirtualCardInFirestore } = await import("../../services/firestore");
                        const cardData = await createVirtualCardInFirestore(user.uid, user.displayName || "TITULAR");
                        setVirtualCard({
                          cardNumber: cardData.cardNumber,
                          cvv: cardData.cvv,
                          expiryMonth: cardData.expiryMonth,
                          expiryYear: cardData.expiryYear,
                          holderName: cardData.holderName,
                        });
                      }
                    } catch (err) {
                      console.error("Error creating virtual card:", err);
                    }
                    setIsCreatingCard(false);
                    createVirtualCard();
                  }, 2000);
                }}
                disabled={isCreatingCard}
                className={`w-full py-4 rounded-xl text-white mt-auto flex justify-center items-center gap-2 ${isCreatingCard ? 'opacity-70' : 'active:scale-95 transition-transform'}`}
                style={{ background: "linear-gradient(135deg, #1a1f71, #111450)", fontWeight: 600, fontSize: "16px" }}
              >
                {isCreatingCard ? <><Loader2 size={18} className="animate-spin" /> A Criar...</> : "Criar Cartão Visa"}
              </button>
            </div>
          ) : (
            <VirtualCard 
              onFreeze={() => {
                if (virtualCard) {
                  const { setVirtualCard } = useAppStore.getState();
                  setVirtualCard({ ...virtualCard, isFrozen: !virtualCard.isFrozen });
                  toast.success(virtualCard.isFrozen ? "Cartão descongelado." : "Cartão congelado temporariamente.");
                }
              }}
              onDelete={async () => {
                if (wallet.balance < 0) {
                  toast.error("Não pode apagar o cartão porque o seu saldo está negativo.");
                  return;
                }
                toast.warning("Tem certeza que deseja apagar o seu Cartão Virtual Visa?", {
                  action: {
                    label: 'Apagar',
                    onClick: async () => {
                      const { setWalletCard, setVirtualCard } = useAppStore.getState();
                      setWalletCard(false);
                      setVirtualCard(null);
                      try {
                        const { deleteVirtualCardFromFirestore } = await import("../../services/firestore");
                        const { user } = useAppStore.getState();
                        await deleteVirtualCardFromFirestore(user.uid);
                      } catch (e) { console.error("Erro ao apagar cartão do Firestore:", e); }
                      toast.success("Cartão apagado com sucesso.");
                    }
                  },
                  cancel: {
                    label: 'Cancelar',
                    onClick: () => {}
                  }
                });
              }}
            />
          )}
        </div>
      )}

      {step === "confirm" && selectedService && (
        <div className="px-5 py-5">
          <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Confirmar pagamento</h3>
            {[
              { label: "Serviço", value: selectedService.label },
              { label: "Referência", value: reference },
              { label: "Valor", value: `${amount} ${wallet.currency}` },
              { label: "Taxa", value: `0,00 ${wallet.currency}` },
              { label: "Total", value: `${amount} ${wallet.currency}` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-500 text-sm">{row.label}</span>
                <span className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
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
              onClick={handlePay}
              disabled={isProcessing}
              className={`flex-1 py-4 rounded-xl text-white text-sm ${isProcessing ? 'opacity-70' : ''}`}
              style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
            >
              {isProcessing ? "A processar..." : "Pagar"}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="mb-4">
            <SuccessCheckmark size={80} color="#22c55e" />
          </div>
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: "20px" }}>Pagamento efectuado!</h2>
          <p className="text-gray-500 text-sm text-center mb-2">{selectedService?.label} pago com sucesso</p>
          <p className="text-gray-400 text-xs mb-8">Referência: {transactionRef || `#PAG${Math.floor(Math.random() * 1000000)}`}</p>
          <button
            onClick={handleBack}
            className="w-full py-4 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
          >
            Novo pagamento
          </button>
        </div>
      )}
      
      <PinModal 
        isOpen={isPinOpen} 
        onClose={() => setIsPinOpen(false)} 
        onConfirm={handlePinConfirm} 
      />
    </AnimatedLayout>
  );
}
