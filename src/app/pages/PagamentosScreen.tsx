import { useState } from "react";
import { Wifi, Zap, Droplets, Tv, Phone, ShoppingBag, Car, GraduationCap, Heart, ChevronRight, Check } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

const services = [
  { id: "internet", icon: <Wifi size={22} />, label: "Internet", provider: "Vodacom, Movitel, TMcel", color: "#6366f1", bg: "#EEF2FF" },
  { id: "electricidade", icon: <Zap size={22} />, label: "Electricidade", provider: "EDM", color: "#F47C20", bg: "#FFF3E0" },
  { id: "agua", icon: <Droplets size={22} />, label: "Água", provider: "FIPAG, CRA", color: "#3b82f6", bg: "#EFF6FF" },
  { id: "tv", icon: <Tv size={22} />, label: "TV por Assinatura", provider: "DStv, ZAP", color: "#8b5cf6", bg: "#F5F3FF" },
  { id: "telefone", icon: <Phone size={22} />, label: "Telefone Fixo", provider: "TDM, Vodacom", color: "#22c55e", bg: "#E8F5E9" },
  { id: "compras", icon: <ShoppingBag size={22} />, label: "Compras Online", provider: "Jumia, OLX", color: "#ec4899", bg: "#FDF2F8" },
  { id: "seguro", icon: <Heart size={22} />, label: "Seguros", provider: "Hollard, Mozambique Seguros", color: "#ef4444", bg: "#FEF2F2" },
  { id: "educacao", icon: <GraduationCap size={22} />, label: "Educação", provider: "Propinas, Mensalidades", color: "#F47C20", bg: "#FFF3E0" },
  { id: "transporte", icon: <Car size={22} />, label: "Transporte", provider: "Pedágios, Combustível", color: "#162456", bg: "#EFF6FF" },
];

export function PagamentosScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"list" | "form" | "confirm" | "success">("list");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const { wallet } = useAppStore();

  const selectedService = services.find((s) => s.id === selected);

  const handleBack = () => {
    if (step === "form") { setStep("list"); setSelected(null); }
    else if (step === "confirm") setStep("form");
    else if (step === "success") { setStep("list"); setAmount(""); setReference(""); setSelected(null); }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
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
          <div className="grid grid-cols-3 gap-3">
            {services.map((svc) => (
              <button
                key={svc.id}
                onClick={() => { setSelected(svc.id); setStep("form"); }}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl transition-transform active:scale-95"
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
              </button>
            ))}
          </div>

          {/* Recent payments */}
          <h3 className="text-gray-700 mt-5 mb-3" style={{ fontWeight: 600, fontSize: "14px" }}>Pagamentos recentes</h3>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            {[
              { label: "Electricidade EDM", ref: "Ref: 12345678", amount: `800,00 ${wallet.currency}`, color: "#F47C20", bg: "#FFF3E0", icon: <Zap size={16} color="#F47C20" /> },
              { label: "Internet Vodacom", ref: "Ref: 87654321", amount: `500,00 ${wallet.currency}`, color: "#6366f1", bg: "#EEF2FF", icon: <Wifi size={16} color="#6366f1" /> },
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

      {step === "form" && selectedService && (
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
                className="w-full outline-none text-gray-800 text-lg bg-transparent border-b border-gray-100 pb-2"
                placeholder="Ex: 12345678"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                style={{ fontWeight: 600 }}
              />
            </div>

            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <label className="text-gray-500 text-xs mb-2 block" style={{ fontWeight: 500 }}>VALOR A PAGAR ({wallet.currency})</label>
              <input
                type="number"
                className="w-full outline-none text-gray-800 bg-transparent"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ fontSize: "28px", fontWeight: 700 }}
              />
            </div>
          </div>

          <button
            onClick={() => { if (amount && reference) setStep("confirm"); }}
            className="w-full py-4 rounded-xl text-white mt-5"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600, fontSize: "16px" }}
          >
            Continuar
          </button>
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
              onClick={() => setStep("success")}
              className="flex-1 py-4 rounded-xl text-white text-sm"
              style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
            >
              Pagar
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "#E8F5E9" }}>
            <Check size={36} color="#22c55e" strokeWidth={2.5} />
          </div>
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: "20px" }}>Pagamento efectuado!</h2>
          <p className="text-gray-500 text-sm text-center mb-2">{selectedService?.label} pago com sucesso</p>
          <p className="text-gray-400 text-xs mb-8">Referência: #PAG20240501</p>
          <button
            onClick={handleBack}
            className="w-full py-4 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
          >
            Novo pagamento
          </button>
        </div>
      )}
    </div>
  );
}
