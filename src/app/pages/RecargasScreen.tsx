import { useState } from "react";
import { Smartphone, Tv, Wifi, Car, ChevronRight, Loader2 } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { SuccessCheckmark } from "../../components/SuccessCheckmark";
import { PinModal } from "../components/PinModal";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { payService } from "../../services/firestore";

const operators = [
  { id: "unitel", label: "Unitel", color: "#F47C20", initials: "U", imgUrl: "https://www.aicep.com/wp-content/uploads/2021/09/unitel-mobile-money-1.png" },
  { id: "movicel", label: "Movicel", color: "#e53e3e", initials: "M" },
  { id: "africel", label: "Africel", color: "#162456", initials: "A", imgUrl: "https://play-lh.googleusercontent.com/RdcJFPZm-crIFYqDz9RZiKpch3GZBNcCf1_gOefvjCYezabqjAZGwP_bw_hRSzMMpA=w240-h480-rw" },
];

const amounts = ["50", "100", "200", "300", "500", "1000"];

const categories = [
  { id: "telemovel", icon: <Smartphone size={22} />, label: "Telemóvel", color: "#F47C20", bg: "#FFF3E0" },
  { id: "internet", icon: <Wifi size={22} />, label: "Dados / Internet", color: "#6366f1", bg: "#EEF2FF" },
  { id: "tv", icon: <Tv size={22} />, label: "TV por Assinatura", color: "#8b5cf6", bg: "#F5F3FF" },
  { id: "combustivel", icon: <Car size={22} />, label: "Combustível", color: "#162456", bg: "#EFF6FF" },
];

export function RecargasScreen() {
  const [category, setCategory] = useState("telemovel");
  const [operator, setOperator] = useState("unitel");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "processing" | "success">("form");
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const { wallet, updateBalance, addTransaction, user } = useAppStore();

  const numAmount = parseFloat(amount);
  const isAmountValid = !isNaN(numAmount) && numAmount > 0;
  const isPhoneValid = phone.replace(/\s/g, "").length >= 9;
  const hasSufficientBalance = isAmountValid && numAmount <= wallet.balance;

  const handleConfirmStep = () => {
    if (!isAmountValid) {
      toast.error("Por favor, selecione um valor válido.");
      return;
    }
    if (category === "telemovel" && !isPhoneValid) {
      toast.error("Insira um número de telemóvel válido (9 dígitos).");
      return;
    }
    if (!hasSufficientBalance) {
      toast.error("Saldo insuficiente para esta recarga.");
      return;
    }
    setStep("confirm");
  };

  const handlePay = () => {
    setIsPinOpen(true);
  };

  const handlePinConfirm = async (_pin: string) => {
    setIsPinOpen(false);
    setStep("processing");

    try {
      if (!user.uid) {
        throw new Error("Utilizador não autenticado.");
      }

      const operatorLabel = operators.find((o) => o.id === operator)?.label || "Operadora";
      const description = category === "telemovel"
        ? `Recarga ${operatorLabel}`
        : `Recarga ${categories.find(c => c.id === category)?.label || "Serviço"}`;

      const result = await payService(user.uid, description, phone || "N/A", numAmount);

      if (result.success) {
        updateBalance(-numAmount);
        addTransaction({
          id: Date.now(),
          icon: "recharge",
          label: description,
          sub: category === "telemovel" ? `+244 ${phone}` : "Agora mesmo",
          amount: numAmount,
          positive: false,
          category: "Recarga",
        });
        setTransactionRef(result.transactionId || `REC${Math.floor(Math.random() * 1000000)}`);
        setStep("success");
      } else {
        toast.error(result.message);
        setStep("confirm");
      }
    } catch (e: any) {
      toast.error(e.message || "Ocorreu um erro na recarga.");
      setStep("confirm");
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
          {step !== "form" && (
            <button
              onClick={() => setStep(step === "confirm" || step === "processing" ? "form" : "form")}
              className="text-white/70"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
          )}
          <h1 className="text-white" style={{ fontSize: "18px", fontWeight: 700 }}>Recargas</h1>
        </div>
        <p className="text-white/60 text-xs">Recarregue o seu telemóvel e mais</p>
      </div>

      {step === "success" ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="mb-4">
            <SuccessCheckmark size={80} color="#22c55e" />
          </div>
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: "20px" }}>Recarga efectuada!</h2>
          <p className="text-gray-500 text-sm text-center mb-2">{amount} {wallet.currency} carregados{category === "telemovel" ? ` em +244 ${phone}` : ""}</p>
          <p className="text-gray-400 text-xs mb-8">Referência: {transactionRef}</p>
          <button
            onClick={() => { setStep("form"); setAmount(""); setPhone(""); }}
            className="w-full py-4 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
          >
            Nova recarga
          </button>
        </div>
      ) : step === "processing" ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Loader2 size={48} className="animate-spin text-[#F47C20] mb-4" />
          <p className="text-gray-600 font-semibold">A processar recarga...</p>
          <p className="text-gray-400 text-xs mt-1">Aguarde um momento</p>
        </div>
      ) : step === "confirm" ? (
        <div className="px-5 py-5">
          <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Confirmar recarga</h3>
            {[
              { label: "Operadora", value: operators.find((o) => o.id === operator)?.label || "" },
              ...(category === "telemovel" ? [{ label: "Número", value: `+244 ${phone}` }] : []),
              { label: "Categoria", value: categories.find(c => c.id === category)?.label || "" },
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
              className="flex-1 py-4 rounded-xl text-white text-sm"
              style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
            >
              Recarregar
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 py-5">
          {/* Categories */}
          <motion.div 
            className="grid grid-cols-4 gap-2 mb-5"
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
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.id)}
                className="flex flex-col items-center gap-2 p-2.5 rounded-xl transition-all"
                style={{
                  background: category === cat.id ? cat.bg : "white",
                  border: `2px solid ${category === cat.id ? cat.color : "transparent"}`,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ color: cat.color }}>{cat.icon}</div>
                <span className="text-gray-600 text-xs text-center leading-tight" style={{ fontWeight: 500 }}>
                  {cat.label}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {category === "telemovel" && (
            <>
              {/* Operator */}
              <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <p className="text-gray-500 text-xs mb-3" style={{ fontWeight: 500 }}>OPERADORA</p>
                <div className="flex gap-2">
                  {operators.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setOperator(op.id)}
                      className="flex-1 flex items-center gap-2 p-3 rounded-xl border-2 transition-all"
                      style={{
                        borderColor: operator === op.id ? op.color : "#E5E7EB",
                        background: operator === op.id ? `${op.color}10` : "white",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{ background: op.color }}
                      >
                        {op.imgUrl ? (
                          <img src={op.imgUrl} alt={op.label} className="w-full h-full object-cover bg-white" />
                        ) : (
                          <span className="text-white text-xs" style={{ fontWeight: 700 }}>{op.initials}</span>
                        )}
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: operator === op.id ? op.color : "#6B7280", fontWeight: operator === op.id ? 600 : 400 }}
                      >
                        {op.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone number */}
              <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <p className="text-gray-500 text-xs mb-2" style={{ fontWeight: 500 }}>NÚMERO DE TELEMÓVEL</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">+244</span>
                  <div className="w-px h-5 bg-gray-200" />
                  <input
                    className={`flex-1 outline-none text-gray-800 text-lg bg-transparent border-b pb-1 ${phone && !isPhoneValid ? 'border-red-400' : 'border-transparent'}`}
                    placeholder="923 XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ fontWeight: 600 }}
                  />
                </div>
                {phone && !isPhoneValid && (
                  <p className="text-red-500 text-xs mt-1">Número inválido (mínimo 9 dígitos).</p>
                )}
              </div>
            </>
          )}

          {category === "internet" && (
            <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <p className="text-gray-500 text-xs mb-3" style={{ fontWeight: 500 }}>PACOTE DE DADOS</p>
              <div className="space-y-2">
                {[
                  { label: "1 GB — 7 dias", price: `100 ${wallet.currency}` },
                  { label: "3 GB — 30 dias", price: `250 ${wallet.currency}` },
                  { label: "5 GB — 30 dias", price: `400 ${wallet.currency}` },
                  { label: "Ilimitado — 30 dias", price: `600 ${wallet.currency}` },
                ].map((pkg, i) => (
                  <button
                    key={i}
                    onClick={() => setAmount(pkg.price.split(" ")[0])}
                    className="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                    style={{
                      borderColor: amount === pkg.price.split(" ")[0] ? "#F47C20" : "#E5E7EB",
                      background: amount === pkg.price.split(" ")[0] ? "#FFF3E0" : "white",
                    }}
                  >
                    <span className="text-gray-700 text-sm" style={{ fontWeight: 500 }}>{pkg.label}</span>
                    <span className="text-sm" style={{ color: "#F47C20", fontWeight: 600 }}>{pkg.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(category === "telemovel") && (
            <>
              {/* Amount */}
              <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <p className="text-gray-500 text-xs mb-3" style={{ fontWeight: 500 }}>VALOR DA RECARGA ({wallet.currency})</p>
                <div className="grid grid-cols-3 gap-2">
                  {amounts.map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(v)}
                      className="py-3 rounded-xl text-sm border-2 transition-all"
                      style={{
                        borderColor: amount === v ? "#F47C20" : "#E5E7EB",
                        background: amount === v ? "#FFF3E0" : "white",
                        color: amount === v ? "#F47C20" : "#374151",
                        fontWeight: amount === v ? 700 : 500,
                      }}
                    >
                      {v} {wallet.currency}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Inline balance warning */}
          {isAmountValid && !hasSufficientBalance && (
            <p className="text-red-500 text-xs mb-3 px-1">
              Saldo insuficiente. (Saldo actual: {wallet.balance.toLocaleString("pt-AO")} {wallet.currency})
            </p>
          )}

          <button
            onClick={handleConfirmStep}
            disabled={!isAmountValid || !hasSufficientBalance || (category === "telemovel" && !isPhoneValid)}
            className="w-full py-4 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600, fontSize: "16px" }}
          >
            Recarregar
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
