import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Zap, Wifi, Smartphone, Search, Filter } from "lucide-react";

import { useAppStore } from "../../store/useAppStore";

function TxIcon({ icon }: { icon: string }) {
  const base = "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0";
  if (icon === "receive") return <div className={base} style={{ background: "#E8F5E9" }}><ArrowDownLeft size={18} color="#22c55e" /></div>;
  if (icon === "internet") return <div className={base} style={{ background: "#EEF2FF" }}><Wifi size={18} color="#6366f1" /></div>;
  if (icon === "send") return <div className={base} style={{ background: "#FFF3E0" }}><ArrowUpRight size={18} color="#F47C20" /></div>;
  if (icon === "electricity") return <div className={base} style={{ background: "#FFF3E0" }}><Zap size={18} color="#F47C20" /></div>;
  if (icon === "recharge") return <div className={base} style={{ background: "#EEF2FF" }}><Smartphone size={18} color="#6366f1" /></div>;
  return <div className={base} style={{ background: "#F3F4F6" }}><ArrowUpRight size={18} color="#6B7280" /></div>;
}

const filters = ["Todas", "Transferência", "Pagamento", "Recarga", "Depósito"];

export function HistoricoScreen() {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const { transactions } = useAppStore();

  const filtered = transactions.filter((tx) => {
    const matchFilter = activeFilter === "Todas" || tx.category === activeFilter;
    const matchSearch = tx.label.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalIn = transactions.filter((t) => t.positive).reduce((acc, t) => acc + parseFloat(t.amount.replace("+", "").replace(".", "").replace(",", ".").replace(" KZ", "").replace(" MT", "")), 0);
  const totalOut = transactions.filter((t) => !t.positive).reduce((acc, t) => acc + parseFloat(t.amount.replace("-", "").replace(".", "").replace(",", ".").replace(" KZ", "").replace(" MT", "")), 0);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "#F5F7FA" }}>
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
            <p className="text-green-400 text-sm" style={{ fontWeight: 700 }}>+{(totalIn / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} KZ</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-white/60 text-xs mb-0.5">Total saídas</p>
            <p className="text-red-400 text-sm" style={{ fontWeight: 700 }}>-{(totalOut / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} KZ</p>
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
                <div className="flex items-center gap-3 px-4 py-3.5">
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
                    {tx.amount}
                  </span>
                </div>
                {i < filtered.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
