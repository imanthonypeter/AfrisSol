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
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { settings, setAuthenticated } = useAppStore();

  const handleBiometrics = () => {
    setIsAuthenticating(true);
    // Simulate biometric check
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthenticated(true);
      navigate("/home");
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
      {/* Biometric Simulation Overlay */}
      {isAuthenticating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#162456]/90 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-xs flex flex-col items-center text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping opacity-25" />
              <div className="text-blue-600 animate-pulse">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" />
                  <path d="M7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12Z" />
                  <path d="M11 12H13" />
                  <path d="M12 11V13" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Autenticando</h3>
            <p className="text-gray-500 text-sm mb-6">Utilizando Face ID / Impressão Digital para entrar na sua conta</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
            </div>
            <button 
              onClick={() => setIsAuthenticating(false)}
              className="mt-8 text-sm font-semibold text-gray-400"
            >
              Cancelar
            </button>
          </div>
          <style>{`
            @keyframes progress {
              0% { width: 0% }
              100% { width: 100% }
            }
          `}</style>
        </div>
      )}

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
            onClick={() => {
              setAuthenticated(true);
              navigate("/home");
            }}
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

          {tab === "login" && settings.biometrics && (
            <button
              onClick={handleBiometrics}
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
