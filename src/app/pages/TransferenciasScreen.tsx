import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Search, ChevronRight, Check } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

const contacts = [
  { id: 1, name: "Maria Santos", phone: "+258 84 123 4567", initials: "MS", color: "#6366f1" },
  { id: 2, name: "Carlos Moçambique", phone: "+258 86 987 6543", initials: "CM", color: "#F47C20" },
  { id: 3, name: "Fatima Nhavene", phone: "+258 82 555 0123", initials: "FN", color: "#22c55e" },
  { id: 4, name: "Pedro Macuácua", phone: "+258 84 888 7654", initials: "PM", color: "#ec4899" },
];

export function TransferenciasScreen() {
  const [tab, setTab] = useState<"enviar" | "receber">("enviar");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);
  const { wallet } = useAppStore();

  const handleSend = () => {
    if (amount && (recipient || selectedContact)) setStep("confirm");
  };

  const handleConfirm = () => setStep("success");
  const handleReset = () => { setStep("form"); setAmount(""); setRecipient(""); setSelectedContact(null); };

  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-3 pb-6"
        style={{ background: "linear-gradient(160deg, #162456 0%, #1a2e6e 100%)", borderRadius: "0 0 28px 28px" }}
      >
        <h1 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: 700 }}>Transferências</h1>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {(["enviar", "receber"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setStep("form"); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: tab === t ? "white" : "transparent",
                color: tab === t ? "#162456" : "rgba(255,255,255,0.7)",
                fontWeight: tab === t ? 600 : 400,
              }}
            >
              {t === "enviar" ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
              {t === "enviar" ? "Enviar" : "Receber"}
            </button>
          ))}
        </div>
      </div>

      {step === "success" ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#E8F5E9" }}
          >
            <Check size={36} color="#22c55e" strokeWidth={2.5} />
          </div>
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: "20px" }}>
            {tab === "enviar" ? "Transferência enviada!" : "Pedido enviado!"}
          </h2>
          <p className="text-gray-500 text-sm text-center mb-2">
            {tab === "enviar"
              ? `${amount} ${wallet.currency} enviados com sucesso`
              : `Pedido de ${amount} ${wallet.currency} enviado`}
          </p>
          <p className="text-gray-400 text-xs mb-8">Referência: #TRF20240501</p>
          <button
            onClick={handleReset}
            className="w-full py-4 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
          >
            Nova transferência
          </button>
        </div>
      ) : step === "confirm" ? (
        <div className="px-5 py-5">
          <div
            className="bg-white rounded-2xl p-5 mb-4"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600, fontSize: "15px" }}>Confirmar transferência</h3>
            <div className="space-y-3">
              {[
                { label: tab === "enviar" ? "Destinatário" : "De", value: selectedContact?.name || recipient },
                { label: "Valor", value: `${amount} ${wallet.currency}` },
                { label: "Taxa", value: `0,00 ${wallet.currency}` },
                { label: "Total", value: `${amount} ${wallet.currency}` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">{row.label}</span>
                  <span className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>
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
              onClick={handleConfirm}
              className="flex-1 py-4 rounded-xl text-white text-sm"
              style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
            >
              Confirmar
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 py-5">
          {tab === "enviar" ? (
            <>
              {/* Amount */}
              <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <label className="text-gray-500 text-xs mb-2 block" style={{ fontWeight: 500 }}>VALOR A ENVIAR</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="flex-1 outline-none text-gray-800 bg-transparent"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ fontSize: "28px", fontWeight: 700 }}
                  />
                  <span className="text-gray-400 text-lg" style={{ fontWeight: 500 }}>{wallet.currency}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {["500", "1.000", "2.500", "5.000"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(v.replace(".", ""))}
                      className="flex-1 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient */}
              <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <label className="text-gray-500 text-xs mb-3 block" style={{ fontWeight: 500 }}>DESTINATÁRIO</label>
                <div className="relative mb-4">
                  <Search size={16} color="#9CA3AF" className="absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-700 outline-none border border-gray-100 focus:border-blue-300"
                    placeholder="Nome, telefone ou IBAN"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
                <p className="text-gray-400 text-xs mb-2">Contactos recentes</p>
                <div className="space-y-2">
                  {contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedContact(c)}
                      className="w-full flex items-center gap-3 py-2 px-3 rounded-xl transition-colors"
                      style={{
                        background: selectedContact?.id === c.id ? "#EEF2FF" : "transparent",
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: c.color }}
                      >
                        <span className="text-white text-xs" style={{ fontWeight: 700 }}>{c.initials}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-gray-800 text-sm" style={{ fontWeight: 500 }}>{c.name}</p>
                        <p className="text-gray-400 text-xs">{c.phone}</p>
                      </div>
                      {selectedContact?.id === c.id && <Check size={16} color="#6366f1" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="bg-white rounded-2xl p-5 mb-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <label className="text-gray-500 text-xs mb-2 block" style={{ fontWeight: 500 }}>NOTA (OPCIONAL)</label>
                <input
                  className="w-full outline-none text-gray-700 bg-transparent text-sm"
                  placeholder="Adicionar uma nota..."
                />
              </div>

              <button
                onClick={handleSend}
                className="w-full py-4 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600, fontSize: "16px" }}
              >
                Enviar dinheiro
              </button>
            </>
          ) : (
            <>
              {/* Receive */}
              <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <label className="text-gray-500 text-xs mb-2 block" style={{ fontWeight: 500 }}>VALOR A RECEBER</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="flex-1 outline-none text-gray-800 bg-transparent"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ fontSize: "28px", fontWeight: 700 }}
                  />
                  <span className="text-gray-400 text-lg" style={{ fontWeight: 500 }}>{wallet.currency}</span>
                </div>
              </div>

              {/* My details */}
              <div
                className="bg-white rounded-2xl p-5 mb-4"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              >
                <p className="text-gray-500 text-xs mb-4" style={{ fontWeight: 500 }}>OS MEUS DADOS</p>
                {[
                  { label: "Nome", value: "João Macuácua" },
                  { label: "Telemóvel", value: "+258 84 XXX XXXX" },
                  { label: "IBAN", value: "MZ 1234 5678 9012" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 text-sm">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{row.value}</span>
                      <ChevronRight size={14} color="#D1D5DB" />
                    </div>
                  </div>
                ))}
              </div>

              {/* QR Code placeholder */}
              <div
                className="bg-white rounded-2xl p-5 mb-5 flex flex-col items-center"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              >
                <p className="text-gray-500 text-sm mb-3">QR Code para receber</p>
                <div
                  className="w-36 h-36 rounded-xl flex items-center justify-center"
                  style={{ background: "#F5F7FA", border: "2px dashed #D1D5DB" }}
                >
                  <div className="grid grid-cols-5 gap-0.5 opacity-30">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-sm"
                        style={{ background: Math.random() > 0.5 ? "#162456" : "transparent" }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-2">Mostre este QR ao pagador</p>
              </div>

              <button
                onClick={handleSend}
                className="w-full py-4 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600, fontSize: "16px" }}
              >
                Solicitar pagamento
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
