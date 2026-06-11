import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownLeft, Copy, Check, X, Wallet, Briefcase, PiggyBank, Sparkles, Loader2, Lock, Unlock } from "lucide-react";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency, convertAmount } from "../../utils/currency";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { SuccessCheckmark } from "../../components/SuccessCheckmark";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function CarteiraScreen() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositStep, setDepositStep] = useState<"form" | "processing" | "success">("form");
  const [accountTemplate, setAccountTemplate] = useState<"Salário" | "Despesas" | "Poupança" | "Personalizada">("Salário");
  const [customAccountName, setCustomAccountName] = useState("");
  const [initialTransfer, setInitialTransfer] = useState("");
  const [cvvVisible, setCvvVisible] = useState(false);
  const { user, wallet, virtualCard, accounts, transactions, setVirtualCard, setWalletCard, addAccount, updateBalance, addTransaction } = useAppStore();

  const totalEntradas = transactions.filter(t => t.positive).reduce((sum, t) => sum + t.amount, 0);
  const totalSaidas = transactions.filter(t => !t.positive).reduce((sum, t) => sum + t.amount, 0);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAccount = () => {
    const amount = Number(initialTransfer);
    if (isNaN(amount) || amount < 0 || amount > wallet.balance) return;

    const name = accountTemplate === "Personalizada" ? (customAccountName || "Minha Conta") : accountTemplate;
    const colors = {
      "Salário": "#22c55e",
      "Despesas": "#ef4444",
      "Poupança": "#6366f1",
      "Personalizada": "#F47C20"
    };

    addAccount(
      {
        label: name,
        num: `AO ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        balance: amount,
        color: colors[accountTemplate] || "#F47C20"
      },
      amount
    );

    setIsAddAccountOpen(false);
    setAccountTemplate("Salário");
    setCustomAccountName("");
    setInitialTransfer("");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <AnimatedLayout>
      <motion.div 
        className="h-full flex flex-col overflow-y-auto" 
        style={{ background: "#F5F7FA" }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex-shrink-0 px-5 pt-3 pb-6"
          style={{ background: "linear-gradient(160deg, #162456 0%, #1a2e6e 100%)" }}
        >
          <h1 className="text-white mb-5" style={{ fontSize: "18px", fontWeight: 700 }}>Carteira</h1>

          {/* Balance */}
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-white/70 text-sm">Saldo total</span>
              <button onClick={() => setBalanceVisible(!balanceVisible)}>
                {balanceVisible
                  ? <Eye size={16} color="rgba(255,255,255,0.7)" />
                  : <EyeOff size={16} color="rgba(255,255,255,0.7)" />}
              </button>
            </div>
            {balanceVisible ? (
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-white text-3xl md:text-4xl" style={{ fontWeight: 700 }}>
                  {formatCurrency(convertAmount(wallet.balance, "AOA", wallet.currency), wallet.currency).split(" ")[0]}
                </span>
                <span className="text-white/70 text-lg">
                  {formatCurrency(0, wallet.currency).split(" ")[1]}
                </span>
              </div>
            ) : (
              <span className="text-white text-3xl md:text-4xl" style={{ fontWeight: 700 }}>••••••</span>
            )}
          </div>

          {/* Botões de acção */}
          <div className="flex gap-3 mt-5">
            {[
              { icon: <Plus size={18} color="white" />, label: "Depositar", bg: "#F47C20", action: () => setIsDepositOpen(true) },
              { icon: <ArrowUpRight size={18} color="#162456" />, label: "Enviar", bg: "white", action: () => navigate("/transferencias") },
              { icon: <ArrowDownLeft size={18} color="#162456" />, label: "Receber", bg: "white", action: () => navigate("/transferencias") },
            ].map((btn) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={btn.label}
                onClick={btn.action}
                className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl"
                style={{ background: btn.bg, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: btn.bg === "white" ? "#F5F7FA" : "rgba(255,255,255,0.2)" }}
                >
                  {btn.icon}
                </div>
                <span
                  className="text-xs"
                  style={{ color: btn.bg === "white" ? "#162456" : "white", fontWeight: 600 }}
                >
                  {btn.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Virtual VISA Card */}
        <motion.div variants={itemVariants} className="px-5 -mt-1 mb-5">
          <h3 className="text-gray-700 mb-3" style={{ fontWeight: 600, fontSize: "14px" }}>Cartão Virtual</h3>
          {!wallet.hasVirtualCard ? (
            <motion.div
              whileHover={{ y: -2 }}
              className="relative rounded-2xl p-6 overflow-hidden flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300 transition-all"
              style={{ background: "#f8fafc", minHeight: "190px" }}
            >
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3 text-indigo-500">
                    <Plus size={24} />
                  </div>
                  <h4 className="text-gray-800 text-sm font-semibold mb-1">Criar Cartão Virtual</h4>
                  <p className="text-gray-500 text-xs mb-4 max-w-[220px]">
                    Compre online de forma segura com um cartão VISA virtual.
                  </p>
                  <button
                    onClick={() => navigate("/pagamentos")}
                    className="px-6 py-2.5 rounded-full text-white text-xs font-semibold active:scale-95 transition-transform"
                    style={{ background: "linear-gradient(135deg, #F47C20, #ff9543)", boxShadow: "0 4px 12px rgba(244,124,32,0.3)" }}
                  >
                    Criar Agora
                  </button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(22, 36, 86, 0.45)" }}
              className="relative rounded-2xl p-5 overflow-hidden transition-shadow"
              style={{
                background: "linear-gradient(135deg, #162456 0%, #0e1835 50%, #1a3070 100%)",
                minHeight: "190px",
                boxShadow: "0 8px 32px rgba(22, 36, 86, 0.35)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              {/* Refined Background pattern */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDEiLz4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA0IiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')",
                  backgroundSize: "24px 24px"
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage: "radial-gradient(circle at 100% 0%, #F47C20 0%, transparent 45%), radial-gradient(circle at 0% 100%, #6366f1 0%, transparent 45%)"
                }}
              />
              
              <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <svg viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="100" fill="white" />
                  <circle cx="100" cy="100" r="75" fill="none" stroke="white" strokeWidth="2" />
                  <circle cx="100" cy="100" r="50" fill="none" stroke="white" strokeWidth="2" />
                </svg>
              </div>

              {/* Card Header */}
              <div className="relative flex items-start justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <img src={logoImg} alt="AfrisSol" className="w-5 h-5 object-contain rounded-sm" />
                  </div>
                  <div>
                    <span className="text-white text-sm" style={{ fontWeight: 700, letterSpacing: "-0.5px" }}>afris</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#F47C20", letterSpacing: "-0.5px" }}>sol</span>
                  </div>
                </div>
                {/* NFC Icon */}
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-[10px] font-medium uppercase tracking-widest mr-1">Virtual</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-70">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" strokeWidth="1.5" fill="none" />
                    <path d="M12 6v12M8 9l4-3 4 3M8 15l4 3 4-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Card Details */}
              <div className="relative mb-5">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Número do Cartão</p>
                    <div className="flex items-center gap-3">
                      <span className="text-white tracking-widest font-mono shadow-sm" style={{ fontWeight: 500, fontSize: "16px", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                        {balanceVisible && virtualCard
                          ? virtualCard.cardNumber.replace(/(.{4})/g, "$1 ").trim()
                          : `•••• •••• •••• ${virtualCard ? virtualCard.cardNumber.slice(-4) : "0000"}`
                        }
                      </span>
                      <button onClick={handleCopy} className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} color="rgba(255,255,255,0.7)" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative flex items-end justify-between pt-2 border-t border-white/10">
                <div className="flex gap-6">
                  <div>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Titular</p>
                    <p className="text-white text-xs uppercase shadow-sm" style={{ fontWeight: 600, letterSpacing: "1px" }}>{virtualCard?.holderName || user.name}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Validade</p>
                    <p className="text-white text-xs font-mono shadow-sm" style={{ fontWeight: 600, letterSpacing: "1px" }}>{virtualCard ? `${virtualCard.expiryMonth}/${virtualCard.expiryYear}` : "--/--"}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">CVV</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-white text-xs font-mono shadow-sm" style={{ fontWeight: 600, letterSpacing: "1px" }}>
                        {cvvVisible ? (virtualCard?.cvv || "---") : "***"}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (cvvVisible) {
                            setCvvVisible(false);
                          } else {
                            setCvvVisible(true);
                            toast.info("CVV revelado. Será ocultado em 10 segundos.");
                            setTimeout(() => setCvvVisible(false), 10000);
                          }
                        }}
                        className="p-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        {cvvVisible ? <Unlock size={10} color="#4ade80" /> : <Lock size={10} color="rgba(255,255,255,0.5)" />}
                      </button>
                    </div>
                  </div>
                </div>
                {/* VISA Logo Refined */}
                <div className="pb-1">
                  <span
                    className="text-white tracking-tight"
                    style={{ fontSize: "24px", fontWeight: 900, fontStyle: "italic", letterSpacing: "-1px", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
                  >
                    VISA
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          {wallet.hasVirtualCard && (
            <div className="flex justify-center mt-3">
              <button 
                onClick={() => {
                  if (wallet.balance < 0) {
                    toast.error("Não pode apagar o cartão porque o seu saldo está negativo.");
                    return;
                  }
                  toast.warning("Tem certeza que deseja apagar o seu Cartão Virtual Visa?", {
                    action: {
                      label: 'Apagar',
                      onClick: () => {
                        setWalletCard(false);
                        setVirtualCard(null);
                        toast.success("Cartão apagado com sucesso.");
                      }
                    },
                    cancel: {
                      label: 'Cancelar',
                      onClick: () => {}
                    }
                  });
                }}
                className="text-xs text-red-500 font-semibold flex items-center gap-1 hover:underline px-3 py-1.5"
              >
                <X size={14} /> Apagar Cartão
              </button>
            </div>
          )}
        </motion.div>

        {/* Accounts */}
        <motion.div variants={itemVariants} className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-700" style={{ fontWeight: 600, fontSize: "14px" }}>As minhas contas</h3>
            <button 
              onClick={() => setIsAddAccountOpen(true)}
              className="text-xs flex items-center gap-1 font-semibold text-[#F47C20] hover:text-orange-600 transition-colors bg-orange-50 px-2 py-1 rounded-full"
            >
              <Plus size={14} /> Adicionar
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {accounts.map((acc, index) => (
              <motion.div
                key={acc.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-4 flex items-center justify-between cursor-pointer"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: acc.color }}
                  >
                    <span className="text-white text-xs" style={{ fontWeight: 700 }}>{acc.label.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{acc.label}</p>
                    <p className="text-gray-400 text-xs">{acc.num}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 text-sm" style={{ fontWeight: 700 }}>
                    {formatCurrency(convertAmount(acc.balance, "AOA", wallet.currency), wallet.currency)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="px-5 pb-4">
          <h3 className="text-gray-700 mb-3" style={{ fontWeight: 600, fontSize: "14px" }}>Resumo do mês</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Entradas", value: formatCurrency(convertAmount(totalEntradas, "AOA", wallet.currency), wallet.currency), color: "#22c55e", bg: "#E8F5E9" },
              { label: "Saídas", value: formatCurrency(convertAmount(totalSaidas, "AOA", wallet.currency), wallet.currency), color: "#EF4444", bg: "#FEF2F2" },
            ].map((stat) => (
              <motion.div
                whileHover={{ scale: 1.03 }}
                key={stat.label}
                className="rounded-xl p-4"
                style={{ background: stat.bg }}
              >
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p style={{ color: stat.color, fontWeight: 700, fontSize: "16px" }}>{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Add Account Modal */}
      <AnimatePresence>
        {isAddAccountOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddAccountOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <Wallet size={20} className="text-[#F47C20]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#162456]">Nova Conta</h3>
                    <p className="text-xs text-gray-500">Adicionar carteira/cofre</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddAccountOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-5">
                  {/* Templates */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Tipo de Conta</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "Salário", icon: <Briefcase size={16} /> },
                        { id: "Despesas", icon: <Wallet size={16} /> },
                        { id: "Poupança", icon: <PiggyBank size={16} /> },
                        { id: "Personalizada", icon: <Sparkles size={16} /> }
                      ].map(tpl => (
                        <button
                          key={tpl.id}
                          onClick={() => setAccountTemplate(tpl.id as any)}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                            accountTemplate === tpl.id 
                              ? "border-[#F47C20] bg-orange-50 text-[#F47C20]" 
                              : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                          }`}
                        >
                          {tpl.icon}
                          <span className="text-sm font-medium">{tpl.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Name (if applicable) */}
                  {accountTemplate === "Personalizada" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Nome da Conta</label>
                      <input 
                        type="text" 
                        value={customAccountName}
                        onChange={(e) => setCustomAccountName(e.target.value)}
                        placeholder="Ex: Fundo de Emergência"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F47C20] focus:ring-1 focus:ring-[#F47C20] transition-shadow"
                      />
                    </motion.div>
                  )}

                  {/* Initial Transfer */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-700">Transferência Inicial</label>
                      <span className="text-xs text-gray-500">Saldo atual: {formatCurrency(wallet.balance, wallet.currency)}</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={initialTransfer}
                        onChange={(e) => setInitialTransfer(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-12 text-lg font-semibold focus:outline-none focus:border-[#F47C20] focus:ring-1 focus:ring-[#F47C20] transition-shadow"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        {wallet.currency}
                      </span>
                    </div>
                    {Number(initialTransfer) > wallet.balance && (
                      <p className="text-red-500 text-xs mt-1">Saldo insuficiente</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleCreateAccount}
                    disabled={Number(initialTransfer) > wallet.balance || Number(initialTransfer) < 0 || (accountTemplate === "Personalizada" && !customAccountName.trim())}
                    className="w-full mt-4 py-3.5 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #162456 0%, #1a2e6e 100%)", boxShadow: "0 4px 12px rgba(22,36,86,0.2)" }}
                  >
                    Adicionar Conta
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de Depósito */}
      <AnimatePresence>
        {isDepositOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (depositStep === "form") { setIsDepositOpen(false); setDepositAmount(""); } }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 flex flex-col max-h-[80vh]"
            >
              {depositStep === "success" ? (
                <div className="flex flex-col items-center justify-center py-10 px-6">
                  <SuccessCheckmark size={72} color="#22c55e" />
                  <h3 className="text-xl font-bold text-gray-800 mt-4 mb-1">Depósito realizado!</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {formatCurrency(Number(depositAmount), wallet.currency)} adicionados à sua conta.
                  </p>
                  <button
                    onClick={() => { setIsDepositOpen(false); setDepositAmount(""); setDepositStep("form"); }}
                    className="w-full py-3.5 rounded-xl text-white font-bold"
                    style={{ background: "linear-gradient(135deg, #F47C20, #e06010)" }}
                  >
                    Concluído
                  </button>
                </div>
              ) : depositStep === "processing" ? (
                <div className="flex flex-col items-center justify-center py-14">
                  <Loader2 size={48} className="animate-spin text-[#F47C20] mb-4" />
                  <p className="text-gray-600 font-semibold">A processar depósito...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                        <Plus size={20} className="text-[#F47C20]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#162456]">Depositar</h3>
                        <p className="text-xs text-gray-500">Adicionar fundos à conta principal</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setIsDepositOpen(false); setDepositAmount(""); }}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="p-5 space-y-5">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Valor a depositar</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-12 text-lg font-semibold focus:outline-none focus:border-[#F47C20] focus:ring-1 focus:ring-[#F47C20] transition-shadow"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                          {wallet.currency}
                        </span>
                      </div>
                    </div>
                    {/* Valores rápidos */}
                    <div className="grid grid-cols-4 gap-2">
                      {["1000", "5000", "10000", "25000"].map((v) => (
                        <button
                          key={v}
                          onClick={() => setDepositAmount(v)}
                          className="py-2.5 rounded-xl text-sm border-2 transition-all"
                          style={{
                            borderColor: depositAmount === v ? "#F47C20" : "#E5E7EB",
                            background: depositAmount === v ? "#FFF3E0" : "white",
                            color: depositAmount === v ? "#F47C20" : "#374151",
                            fontWeight: depositAmount === v ? 700 : 500,
                          }}
                        >
                          {Number(v).toLocaleString("pt-AO")}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const num = Number(depositAmount);
                        if (isNaN(num) || num <= 0) return;
                        setDepositStep("processing");
                        setTimeout(() => {
                          updateBalance(num);
                          addTransaction({
                            id: Date.now(),
                            icon: "receive",
                            label: "Depósito",
                            sub: "Agora mesmo",
                            amount: num,
                            positive: true,
                            category: "Depósito",
                          });
                          setDepositStep("success");
                        }, 1500);
                      }}
                      disabled={!depositAmount || Number(depositAmount) <= 0}
                      className="w-full py-3.5 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, #162456 0%, #1a2e6e 100%)", boxShadow: "0 4px 12px rgba(22,36,86,0.2)" }}
                    >
                      Confirmar depósito
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AnimatedLayout>
  );
}
