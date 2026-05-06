import { useState } from "react";
import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownLeft, Copy, Check } from "lucide-react";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";
import { useAppStore } from "../../store/useAppStore";

export function CarteiraScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const { user, wallet, accounts } = useAppStore();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div
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
              <span className="text-white text-3xl md:text-4xl" style={{ fontWeight: 700 }}>{wallet.balance}</span>
              <span className="text-white/70 text-lg">{wallet.currency}</span>
            </div>
          ) : (
            <span className="text-white text-3xl md:text-4xl" style={{ fontWeight: 700 }}>••••••</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          {[
            { icon: <Plus size={18} color="white" />, label: "Depositar", bg: "#F47C20" },
            { icon: <ArrowUpRight size={18} color="#162456" />, label: "Enviar", bg: "white" },
            { icon: <ArrowDownLeft size={18} color="#162456" />, label: "Receber", bg: "white" },
          ].map((btn) => (
            <button
              key={btn.label}
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
            </button>
          ))}
        </div>
      </div>

      {/* Virtual VISA Card */}
      <div className="px-5 -mt-1 mb-5">
        <h3 className="text-gray-700 mb-3" style={{ fontWeight: 600, fontSize: "14px" }}>Cartão Virtual</h3>
        <div
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #162456 0%, #0e1835 50%, #1a3070 100%)",
            minHeight: "190px",
            boxShadow: "0 8px 32px rgba(22, 36, 86, 0.35)"
          }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 80% 20%, #F47C20 0%, transparent 50%), radial-gradient(circle at 20% 80%, #6366f1 0%, transparent 50%)"
            }}
          />
          <div className="absolute top-0 right-0 w-48 h-48 opacity-5">
            <svg viewBox="0 0 200 200" fill="none">
              <circle cx="150" cy="50" r="100" fill="white" />
            </svg>
          </div>

          {/* Card Logo */}
          <div className="relative flex items-start justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md overflow-hidden">
                <img src={logoImg} alt="AfrisSol" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-white text-sm" style={{ fontWeight: 700 }}>afris</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#F47C20" }}>sol</span>
              </div>
            </div>
            {/* NFC Icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="opacity-70">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M12 6v12M8 9l4-3 4 3M8 15l4 3 4-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Chip */}
          <div className="relative mb-4 flex items-center gap-3">
            <div
              className="w-10 h-7 rounded"
              style={{
                background: "linear-gradient(135deg, #d4a853, #f0c060, #b8912a)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)"
              }}
            />
          </div>

          {/* Card Number */}
          <div className="relative mb-4">
            <p className="text-white/60 text-xs mb-1">Número do cartão</p>
            <div className="flex items-center gap-3">
              <span className="text-white tracking-widest" style={{ fontWeight: 500, fontSize: "15px" }}>
                •••• •••• •••• 3456
              </span>
              <button onClick={handleCopy}>
                {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} color="rgba(255,255,255,0.5)" />}
              </button>
            </div>
          </div>

          {/* Card Footer */}
          <div className="relative flex items-end justify-between">
            <div>
              <p className="text-white/50 text-xs mb-0.5">Titular</p>
              <p className="text-white text-sm uppercase" style={{ fontWeight: 600, letterSpacing: "0.5px" }}>{user.name}</p>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-xs mb-0.5">Válido até</p>
              <p className="text-white text-sm" style={{ fontWeight: 600 }}>12/28</p>
            </div>
            {/* VISA Logo */}
            <div>
              <span
                className="text-white tracking-tight"
                style={{ fontSize: "22px", fontWeight: 800, fontStyle: "italic", letterSpacing: "-1px" }}
              >
                VISA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts */}
      <div className="px-5 mb-5">
        <h3 className="text-gray-700 mb-3" style={{ fontWeight: 600, fontSize: "14px" }}>As minhas contas</h3>
        <div className="flex flex-col gap-2">
          {accounts.map((acc) => (
            <div
              key={acc.label}
              className="bg-white rounded-xl p-4 flex items-center justify-between"
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
                <p className="text-gray-800 text-sm" style={{ fontWeight: 700 }}>{acc.balance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pb-4">
        <h3 className="text-gray-700 mb-3" style={{ fontWeight: 600, fontSize: "14px" }}>Resumo do mês</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Entradas", value: "8.500,00 MT", color: "#22c55e", bg: "#E8F5E9" },
            { label: "Saídas", value: "5.200,00 MT", color: "#EF4444", bg: "#FEF2F2" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{ background: stat.bg }}
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontWeight: 700, fontSize: "16px" }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
