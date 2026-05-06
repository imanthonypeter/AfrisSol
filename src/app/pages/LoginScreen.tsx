import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Phone } from "lucide-react";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";

export function LoginScreen() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 flex flex-col items-center pt-8 pb-10 px-6"
        style={{ background: "linear-gradient(160deg, #162456 0%, #1a2e6e 100%)", borderRadius: "0 0 32px 32px" }}
      >
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-xl mb-4">
          <img src={logoImg} alt="AfrisSol" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-baseline gap-0">
          <span className="text-white" style={{ fontSize: "26px", fontWeight: 700 }}>afris</span>
          <span style={{ fontSize: "26px", fontWeight: 700, color: "#F47C20" }}>sol</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-px w-6" style={{ background: "#F47C20" }} />
          <span className="text-white/60 text-xs tracking-widest uppercase">A SUA CARTEIRA DIGITAL</span>
          <div className="h-px w-6" style={{ background: "#F47C20" }} />
        </div>
        <p className="text-white/70 text-sm mt-3">Seguro, rápido e feito para si.</p>
      </div>

      {/* Content wrapper for desktop centering */}
      <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
        {/* Tabs */}
        <div className="flex mx-6 mt-6 rounded-xl overflow-hidden border border-gray-200 bg-white">
          <button
            onClick={() => setTab("login")}
            className="flex-1 py-3 text-sm transition-all"
            style={{
              background: tab === "login" ? "#162456" : "white",
              color: tab === "login" ? "white" : "#6B7280",
              fontWeight: tab === "login" ? 600 : 400,
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => setTab("register")}
            className="flex-1 py-3 text-sm transition-all"
            style={{
              background: tab === "register" ? "#162456" : "white",
              color: tab === "register" ? "white" : "#6B7280",
              fontWeight: tab === "register" ? 600 : 400,
            }}
          >
            Criar conta
          </button>
        </div>

        {/* Form */}
        <div className="px-6 mt-6 flex flex-col gap-4">
          {tab === "register" && (
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>Nome completo</label>
              <input
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-blue-600 transition-colors"
                placeholder="João Macuácua"
                style={{ fontSize: "15px" }}
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>Número de telemóvel</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <Phone size={16} color="#9CA3AF" />
                <span className="text-gray-400 text-sm">+258</span>
                <div className="w-px h-4 bg-gray-200" />
              </div>
              <input
                className="w-full pl-20 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-blue-600 transition-colors"
                placeholder="84 XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ fontSize: "15px" }}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>PIN / Palavra-passe</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-blue-600 transition-colors pr-12"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontSize: "15px" }}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
              </button>
            </div>
          </div>

          {tab === "login" && (
            <div className="text-right">
              <button className="text-sm" style={{ color: "#F47C20", fontWeight: 500 }}>
                Esqueceu o PIN?
              </button>
            </div>
          )}

          <button
            onClick={() => navigate("/home")}
            className="w-full py-4 rounded-xl text-white shadow-lg mt-2 transition-transform active:scale-95"
            style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600, fontSize: "16px" }}
          >
            {tab === "login" ? "Entrar" : "Criar conta"}
          </button>

          {tab === "login" && (
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          )}

          {tab === "login" && (
            <button
              onClick={() => navigate("/home")}
              className="w-full py-4 rounded-xl border-2 text-sm transition-transform active:scale-95"
              style={{ borderColor: "#162456", color: "#162456", fontWeight: 600 }}
            >
              Entrar com biometria
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 mb-4">
          Ao continuar, aceita os nossos{" "}
          <span style={{ color: "#F47C20" }}>Termos de Uso</span> e{" "}
          <span style={{ color: "#F47C20" }}>Privacidade</span>
        </p>
      </div>
    </div>
  );
}
