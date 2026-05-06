import { useState } from "react";
import { Smartphone, Tv, Wifi, Car, Check, ChevronRight } from "lucide-react";

const operators = [
  { id: "vodacom", label: "Vodacom", color: "#e53e3e", initials: "V" },
  { id: "movitel", label: "Movitel", color: "#F47C20", initials: "M" },
  { id: "tmcel", label: "TMcel", color: "#162456", initials: "T" },
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
  const [operator, setOperator] = useState("vodacom");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");

  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-3 pb-6"
        style={{ background: "linear-gradient(160deg, #162456 0%, #1a2e6e 100%)", borderRadius: "0 0 28px 28px" }}
      >
        <div className="flex items-center gap-3 mb-1">
          {step !== "form" && (
            <button
              onClick={() => setStep(step === "confirm" ? "form" : "form")}
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
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "#E8F5E9" }}>
            <Check size={36} color="#22c55e" strokeWidth={2.5} />
          </div>
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: "20px" }}>Recarga efectuada!</h2>
          <p className="text-gray-500 text-sm text-center mb-2">{amount} MT carregados em +258 {phone}</p>
          <p className="text-gray-400 text-xs mb-8">Referência: #REC20240501</p>
          <button
            onClick={() => { setStep("form"); setAmount(""); setPhone(""); }}
            className="w-full py-4 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
          >
            Nova recarga
          </button>
        </div>
      ) : step === "confirm" ? (
        <div className="px-5 py-5">
          <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Confirmar recarga</h3>
            {[
              { label: "Operadora", value: operators.find((o) => o.id === operator)?.label || "" },
              { label: "Número", value: `+258 ${phone}` },
              { label: "Valor", value: `${amount} MT` },
              { label: "Bónus", value: "0 MT" },
              { label: "Total", value: `${amount} MT` },
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
              onClick={() => setStep("success")}
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
          <div className="grid grid-cols-4 gap-2 mb-5">
            {categories.map((cat) => (
              <button
                key={cat.id}
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
              </button>
            ))}
          </div>

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
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: op.color }}
                      >
                        <span className="text-white text-xs" style={{ fontWeight: 700 }}>{op.initials}</span>
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
                  <span className="text-gray-400 text-sm">+258</span>
                  <div className="w-px h-5 bg-gray-200" />
                  <input
                    className="flex-1 outline-none text-gray-800 text-lg bg-transparent"
                    placeholder="84 XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ fontWeight: 600 }}
                  />
                </div>
              </div>
            </>
          )}

          {category === "internet" && (
            <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <p className="text-gray-500 text-xs mb-3" style={{ fontWeight: 500 }}>PACOTE DE DADOS</p>
              <div className="space-y-2">
                {[
                  { label: "1 GB — 7 dias", price: "100 MT" },
                  { label: "3 GB — 30 dias", price: "250 MT" },
                  { label: "5 GB — 30 dias", price: "400 MT" },
                  { label: "Ilimitado — 30 dias", price: "600 MT" },
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
                <p className="text-gray-500 text-xs mb-3" style={{ fontWeight: 500 }}>VALOR DA RECARGA (MT)</p>
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
                      {v} MT
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => { if (amount && (phone || category !== "telemovel")) setStep("confirm"); }}
            className="w-full py-4 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600, fontSize: "16px" }}
          >
            Recarregar
          </button>
        </div>
      )}
    </div>
  );
}
