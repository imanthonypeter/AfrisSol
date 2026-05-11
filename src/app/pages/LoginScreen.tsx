import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Phone, Fingerprint, ShieldCheck } from "lucide-react";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";
import { useAppStore } from "../../store/useAppStore";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { SuccessCheckmark } from "../../components/SuccessCheckmark";
import { motion, AnimatePresence } from "framer-motion";

export function LoginScreen() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [bioPhase, setBioPhase] = useState<"idle" | "scanning" | "success">("idle");
  const { settings, setAuthenticated } = useAppStore();

  const handleBiometrics = () => {
    setBioPhase("scanning");
    // Phase 1: scanning (2s) → Phase 2: success (1.5s) → navigate
    setTimeout(() => {
      setBioPhase("success");
      setTimeout(() => {
        setAuthenticated(true);
        navigate("/home");
      }, 1500);
    }, 2000);
  };

  // Cancel biometrics
  const cancelBio = () => setBioPhase("idle");

  return (
    <AnimatedLayout>
      <div className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
        {/* Biometric Authentication Overlay */}
        <AnimatePresence>
          {bioPhase !== "idle" && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ backgroundColor: "rgba(22,36,86,0.92)", backdropFilter: "blur(12px)" }}
            >
              <motion.div
                className="bg-white rounded-[32px] p-8 w-full max-w-xs flex flex-col items-center text-center"
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 15 }}
                transition={{ type: "spring" as const, stiffness: 280, damping: 24 }}
              >
                {bioPhase === "scanning" ? (
                  <>
                    {/* Fingerprint scanning animation */}
                    <div className="relative w-24 h-24 mb-6">
                      {/* Pulsing ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: "3px solid rgba(244,124,32,0.3)" }}
                        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {/* Scanning ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: "3px solid #F47C20" }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#F47C20]" />
                      </motion.div>
                      {/* Fingerprint icon */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Fingerprint size={40} color="#F47C20" strokeWidth={1.5} />
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">A verificar identidade</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Toque no sensor de impressão digital ou olhe para a câmara
                    </p>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #F47C20, #e06010)" }}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </div>
                    <button
                      onClick={cancelBio}
                      className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    {/* Success state */}
                    <motion.div
                      className="mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" as const, stiffness: 200, damping: 15 }}
                    >
                      <SuccessCheckmark size={80} color="#22c55e" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <ShieldCheck size={18} color="#22c55e" />
                        <h3 className="text-xl font-bold text-gray-800">Identidade confirmada</h3>
                      </div>
                      <p className="text-gray-500 text-sm">A entrar na sua conta...</p>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                </div>
                <input
                  type="tel"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-blue-600 transition-colors"
                  placeholder="Ex: 923 000 000"
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
                if (!phone || !password) return;
                setAuthenticated(true);
                navigate("/home");
              }}
              disabled={!phone || !password}
              className={`w-full py-4 rounded-xl text-white shadow-lg mt-2 transition-transform ${(!phone || !password) ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
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
                className="w-full py-4 rounded-xl border-2 text-sm transition-all active:scale-95 hover:bg-[#162456]/5 flex items-center justify-center gap-2.5"
                style={{ borderColor: "#162456", color: "#162456", fontWeight: 600 }}
              >
                <Fingerprint size={20} />
                Entrar com biometria
              </button>
            )}
          </div>

          <div className="text-center text-xs text-gray-500 mt-8 mb-8 px-6 leading-relaxed">
            Ao {tab === "login" ? "continuar" : "criar uma conta"}, aceita os nossos{" "}
            <span onClick={() => navigate("/termos")} className="text-[#F47C20] font-semibold hover:underline cursor-pointer">Termos de Uso</span> e{" "}
            <span onClick={() => navigate("/privacidade")} className="text-[#F47C20] font-semibold hover:underline cursor-pointer">Política de Privacidade</span>.
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
