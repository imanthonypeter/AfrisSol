import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Zap, MoreHorizontal,
  TrendingUp, TrendingDown, Smartphone, Wifi, ChevronRight
} from "lucide-react";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";

import { useAppStore } from "../../store/useAppStore";
function TxIcon({ icon }: { icon: string }) {
  const base = "w-10 h-10 rounded-full flex items-center justify-center";
  if (icon === "receive") return <div className={base} style={{ background: "#E8F5E9" }}><ArrowDownLeft size={18} color="#22c55e" /></div>;
  if (icon === "internet") return <div className={base} style={{ background: "#EEF2FF" }}><Wifi size={18} color="#6366f1" /></div>;
  if (icon === "send") return <div className={base} style={{ background: "#FFF3E0" }}><ArrowUpRight size={18} color="#F47C20" /></div>;
  if (icon === "electricity") return <div className={base} style={{ background: "#FFF3E0" }}><Zap size={18} color="#F47C20" /></div>;
  return <div className={base} style={{ background: "#F3F4F6" }}><MoreHorizontal size={18} color="#6B7280" /></div>;
}

export function HomeScreen() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const { user, wallet, transactions } = useAppStore();

  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-3 pb-8"
        style={{ background: "linear-gradient(160deg, #162456 0%, #1a2e6e 100%)", borderRadius: "0 0 28px 28px" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
              <img src={logoImg} alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white/70 text-xs">Olá, {user.name.split(' ')[0]} 👋</p>
              <p className="text-white text-sm" style={{ fontWeight: 600 }}>Bem-vindo à sua carteira</p>
            </div>
          </div>
          <button className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Bell size={18} color="white" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#F47C20" }} />
          </button>
        </div>

        {/* Balance Card */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/70 text-sm">Saldo disponível</span>
            <button onClick={() => setBalanceVisible(!balanceVisible)}>
              {balanceVisible
                ? <Eye size={18} color="rgba(255,255,255,0.7)" />
                : <EyeOff size={18} color="rgba(255,255,255,0.7)" />}
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            {balanceVisible ? (
              <>
                <span className="text-white text-3xl md:text-4xl" style={{ fontWeight: 700 }}>{wallet.balance}</span>
                <span className="text-white/70 text-base" style={{ fontWeight: 500 }}>{wallet.currency}</span>
              </>
            ) : (
              <span className="text-white text-3xl md:text-4xl" style={{ fontWeight: 700 }}>••••••</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} color="#4ade80" />
              <span className="text-xs" style={{ color: "#4ade80" }}>+12% este mês</span>
            </div>
            <div className="w-px h-3 bg-white/20" />
            <span className="text-white/50 text-xs">Actualizado agora</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 -mt-5 mb-4">
        <div
          className="rounded-2xl p-4 bg-white shadow-md"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
        >
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: <ArrowUpRight size={20} color="#F47C20" />, label: "Enviar", path: "/transferencias", bg: "#FFF3E0" },
              { icon: <ArrowDownLeft size={20} color="#22c55e" />, label: "Receber", path: "/transferencias", bg: "#E8F5E9" },
              { icon: <Zap size={20} color="#162456" />, label: "Pagar", path: "/pagamentos", bg: "#EEF2FF" },
              { icon: <MoreHorizontal size={20} color="#6366f1" />, label: "Mais", path: "/recargas", bg: "#F3F4F6" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: item.bg }}
                >
                  {item.icon}
                </div>
                <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Banner promo */}
      <div className="px-5 mb-4">
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #F47C20, #e06010)" }}
        >
          <div>
            <p className="text-white text-xs mb-0.5" style={{ fontWeight: 600 }}>💳 Cartão Virtual VISA</p>
            <p className="text-white/80 text-xs">Activo e pronto para usar</p>
          </div>
          <button
            onClick={() => navigate("/carteira")}
            className="px-3 py-1.5 rounded-lg text-xs bg-white"
            style={{ color: "#F47C20", fontWeight: 600 }}
          >
            Ver cartão
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-800" style={{ fontWeight: 600, fontSize: "15px" }}>Transações recentes</h3>
          <button
            onClick={() => navigate("/historico")}
            className="flex items-center gap-0.5 text-xs"
            style={{ color: "#F47C20", fontWeight: 500 }}
          >
            Ver todas <ChevronRight size={14} />
          </button>
        </div>

        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          {transactions.map((tx, i) => (
            <div key={tx.id}>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <TxIcon icon={tx.icon} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm truncate" style={{ fontWeight: 500 }}>{tx.label}</p>
                  <p className="text-gray-400 text-xs">{tx.sub}</p>
                </div>
                <span
                  className="text-sm"
                  style={{ color: tx.positive ? "#22c55e" : "#EF4444", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  {tx.amount}
                </span>
              </div>
              {i < transactions.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
