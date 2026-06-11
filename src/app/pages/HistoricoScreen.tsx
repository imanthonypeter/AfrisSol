import { useState, useMemo } from "react";
import { ArrowUpRight, ArrowDownLeft, Zap, Wifi, Smartphone, Search, Filter } from "lucide-react";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

import { useAppStore } from "../../store/useAppStore";
import { formatCurrency, convertAmount } from "../../utils/currency";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { ReceiptModal, TransactionReceipt } from "../../components/ReceiptModal";

function TxIcon({ icon }: { icon: string }) {
  const base = "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0";
  if (icon === "receive") return <div className={base} style={{ background: "#E8F5E9" }}><ArrowDownLeft size={18} color="#22c55e" /></div>;
  if (icon === "internet") return <div className={base} style={{ background: "#EEF2FF" }}><Wifi size={18} color="#6366f1" /></div>;
  if (icon === "send") return <div className={base} style={{ background: "#FFF3E0" }}><ArrowUpRight size={18} color="#F47C20" /></div>;
  if (icon === "electricity") return <div className={base} style={{ background: "#FFF3E0" }}><Zap size={18} color="#F47C20" /></div>;
  if (icon === "recharge") return <div className={base} style={{ background: "#EEF2FF" }}><Smartphone size={18} color="#6366f1" /></div>;
  if (icon === "unitelmoney") return <div className={base} style={{ background: "#FFF3E0" }}><img src="https://www.aicep.com/wp-content/uploads/2021/09/unitel-mobile-money-1.png" alt="Unitel Money" className="w-8 h-8 rounded-full object-cover bg-white" /></div>;
  if (icon === "afrimoney") return <div className={base} style={{ background: "#FCE4EC" }}><img src="https://play-lh.googleusercontent.com/RdcJFPZm-crIFYqDz9RZiKpch3GZBNcCf1_gOefvjCYezabqjAZGwP_bw_hRSzMMpA=w240-h480-rw" alt="Afrimoney" className="w-8 h-8 rounded-xl object-cover" /></div>;
  if (icon === "dstv") return <div className={base} style={{ background: "#EFF6FF" }}><svg viewBox="0 0 100 100" className="w-8 h-8"><rect width="100" height="100" rx="50" fill="#00A5DF"/><path d="M25,35 h20 c15,0 20,10 20,15 c0,5 -5,15 -20,15 h-20 v-30" fill="none" stroke="white" strokeWidth="8"/></svg></div>;
  if (icon === "tv") return <div className={base} style={{ background: "#F5F3FF" }}><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS49lQrzJySNWgElAyAXHDWy721oXRSoOg12A&s" alt="TV Cabo" className="w-8 h-8 rounded-full object-cover" /></div>;
  return <div className={base} style={{ background: "#F3F4F6" }}><ArrowUpRight size={18} color="#6B7280" /></div>;
}

const filters = ["Todas", "Transferência", "Pagamento", "Recarga", "Depósito"];

export function HistoricoScreen() {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [currentReceipt, setCurrentReceipt] = useState<TransactionReceipt | null>(null);
  const { transactions, wallet } = useAppStore();

  const filtered = transactions.filter((tx) => {
    const matchFilter = activeFilter === "Todas" || tx.category === activeFilter;
    const matchSearch = tx.label.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalIn = transactions.filter((t) => t.positive).reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter((t) => !t.positive).reduce((acc, t) => acc + t.amount, 0);

  // Preparar dados para o gráfico (últimas despesas)
  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => !t.positive).slice(0, 10).reverse();
    return expenses.map(t => ({
      name: t.sub.split(" ")[0] || "Recente", // apenas o dia ou "Recente"
      valor: t.amount
    }));
  }, [transactions]);

  return (
    <AnimatedLayout className="h-full flex flex-col overflow-hidden" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-3 pb-5"
        style={{ background: "linear-gradient(160deg, #162456 0%, #1a2e6e 100%)", borderRadius: "0 0 28px 28px" }}
      >
        <h1 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: 700 }}>Histórico</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-white/60 text-xs mb-0.5">Total entradas</p>
            <p className="text-green-400 text-sm" style={{ fontWeight: 700 }}>+{formatCurrency(convertAmount(totalIn, "AOA", wallet.currency), wallet.currency)}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-white/60 text-xs mb-0.5">Total saídas</p>
            <p className="text-red-400 text-sm" style={{ fontWeight: 700 }}>-{formatCurrency(convertAmount(totalOut, "AOA", wallet.currency), wallet.currency)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} color="rgba(255,255,255,0.5)" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none placeholder:text-white/40"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
            placeholder="Pesquisar transacções..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Expense Chart */}
      {chartData.length > 0 && (
        <div className="px-5 mt-4 mb-2">
          <p className="text-gray-500 text-xs font-semibold mb-2">Evolução de Despesas</p>
          <div className="h-32 w-full bg-white rounded-xl p-2" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(convertAmount(value, "AOA", wallet.currency), wallet.currency)}
                  labelStyle={{ color: '#6B7280', fontSize: '12px' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="valor" stroke="#EF4444" fillOpacity={1} fill="url(#colorValor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all"
            style={{
              background: activeFilter === f ? "#162456" : "white",
              color: activeFilter === f ? "white" : "#6B7280",
              fontWeight: activeFilter === f ? 600 : 400,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            {f}
          </button>
        ))}
        <button className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs bg-white flex items-center gap-1"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)", color: "#6B7280" }}>
          <Filter size={12} />
          Filtrar
        </button>
      </div>

      {/* Transaction list */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              Nenhuma transacção encontrada
            </div>
          ) : (
            filtered.map((tx, i) => (
              <div key={tx.id}>
                <div 
                  className={`flex items-center gap-3 px-4 py-3.5 ${tx.receipt ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""}`}
                  onClick={() => tx.receipt && setCurrentReceipt(tx.receipt)}
                >
                  <TxIcon icon={tx.icon} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm truncate" style={{ fontWeight: 500 }}>{tx.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-400 text-xs">{tx.sub}</p>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: "#F3F4F6",
                          color: "#6B7280",
                          fontSize: "10px",
                        }}
                      >
                        {tx.category}
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-sm flex-shrink-0"
                    style={{ color: tx.positive ? "#22c55e" : "#EF4444", fontWeight: 600 }}
                  >
                    {tx.positive ? "+" : "-"}{formatCurrency(convertAmount(tx.amount, "AOA", wallet.currency), wallet.currency)}
                  </span>
                </div>
                {i < filtered.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
              </div>
            ))
          )}
        </div>
      </div>
      <ReceiptModal receipt={currentReceipt} onClose={() => setCurrentReceipt(null)} />
    </AnimatedLayout>
  );
}
