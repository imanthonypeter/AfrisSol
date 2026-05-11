import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Zap, MoreHorizontal,
  TrendingUp, Wifi, ChevronRight, X, Info
} from "lucide-react";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";

import { useAppStore } from "../../store/useAppStore";
import { formatCurrency, convertAmount } from "../../utils/currency";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, wallet, transactions } = useAppStore();

  return (
    <AnimatedLayout className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
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
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Bell size={18} color="white" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full border border-[#162456]" style={{ background: "#F47C20" }} />
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
                <span className="text-white text-3xl md:text-4xl" style={{ fontWeight: 700 }}>
                  {formatCurrency(convertAmount(wallet.balance, "AOA", wallet.currency), wallet.currency).split(" ")[0]}
                </span>
                <span className="text-white/70 text-base" style={{ fontWeight: 500 }}>
                  {formatCurrency(0, wallet.currency).split(" ")[1]}
                </span>
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
          <motion.div 
            className="grid grid-cols-4 gap-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
            }}
          >
            {[
              { icon: <ArrowUpRight size={20} color="#F47C20" />, label: "Enviar", path: "/transferencias", bg: "#FFF3E0" },
              { icon: <ArrowDownLeft size={20} color="#22c55e" />, label: "Receber", path: "/transferencias", bg: "#E8F5E9" },
              { icon: <Zap size={20} color="#162456" />, label: "Pagar", path: "/pagamentos", bg: "#EEF2FF" },
              { icon: <MoreHorizontal size={20} color="#6366f1" />, label: "Mais", path: "/recargas", bg: "#F3F4F6" },
            ].map((item) => (
              <motion.button
                key={item.label}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
                }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.93 }}
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
              </motion.button>
            ))}
          </motion.div>
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
                  {tx.positive ? "+" : "-"}{formatCurrency(convertAmount(tx.amount, "AOA", wallet.currency), wallet.currency)}
                </span>
              </div>
              {i < transactions.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Bell size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#162456]">Notificações</h3>
                    <p className="text-xs text-gray-500">2 novas mensagens</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-xl p-4 flex gap-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F47C20]" />
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <Zap size={18} className="text-[#F47C20]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">Pagamento da Luz (ENDE) aprovado!</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">O seu pagamento de 5.000 AOA para a ENDE foi processado com sucesso. O seu código de recarga é: 4567-8901-2345.</p>
                      <span className="text-[10px] text-gray-400 mt-2 block font-medium">Há 10 minutos</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-xl p-4 flex gap-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <ArrowDownLeft size={18} className="text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">Transferência Recebida</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">O João enviou 15.000 AOA para a sua conta via AfriSol. O seu novo saldo já está atualizado.</p>
                      <span className="text-[10px] text-gray-400 mt-2 block font-medium">Há 2 horas</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-100 rounded-xl p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shadow-sm flex-shrink-0">
                      <Info size={18} className="text-gray-400" />
                    </div>
                    <div className="opacity-70">
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">Dica de Segurança</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">Ative a autenticação biométrica nas Definições de Perfil para aprovar pagamentos mais rapidamente.</p>
                      <span className="text-[10px] text-gray-400 mt-2 block font-medium">Ontem, 14:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AnimatedLayout>
  );
}
