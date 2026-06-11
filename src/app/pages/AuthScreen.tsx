import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Phone, Mail, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";
import { useAppStore } from "../../store/useAppStore";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { registerUser, loginUser } from "../../services/auth";
import { useAuth } from "../components/AuthProvider";

// Chave para guardar o email no localStorage
const REMEMBER_KEY = "afrisol_remember_email";

export function AuthScreen() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [awaitingAuth, setAwaitingAuth] = useState(false);
  const { isAuthenticated } = useAppStore();
  const { error: authError } = useAuth();

  // Ao montar, verificar se há um email guardado no localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Navigate to /home once AuthProvider has loaded all Firestore data and set isAuthenticated=true
  useEffect(() => {
    if (awaitingAuth) {
      if (isAuthenticated) {
        setLoading(false);
        navigate("/home");
      } else if (authError) {
        setLoading(false);
        setError(authError);
        setAwaitingAuth(false);
      }
    }
  }, [awaitingAuth, isAuthenticated, authError, navigate]);

  const handleSubmit = async () => {
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      if (tab === "register") {
        if (!name || !email || !password) {
          setError("Preencha todos os campos obrigatórios.");
          setLoading(false);
          return;
        }
        await registerUser(name, email, password, phone || undefined);
      } else {
        if (!email || !password) {
          setError("Introduza o email e a palavra-passe.");
          setLoading(false);
          return;
        }
        await loginUser(email, password, rememberMe);
      }

      // Guardar ou remover email conforme a opção "Lembrar-me"
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      // Don't manually setAuthenticated or navigate here.
      // The AuthProvider's onAuthChange listener will:
      // 1. Load user profile, accounts, balance, and transactions from Firestore
      // 2. Set isAuthenticated=true AFTER all data is loaded
      // This ensures the balance is available when the user lands on /home.
      setAwaitingAuth(true);
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") {
        setError("Este email já está registado.");
      } else if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Email ou palavra-passe incorrectos.");
      } else if (code === "auth/weak-password") {
        setError("A palavra-passe deve ter pelo menos 6 caracteres.");
      } else if (code === "auth/invalid-email") {
        setError("O email introduzido é inválido.");
      } else {
        setError(err?.message || "Erro ao processar. Tente novamente.");
      }
      setLoading(false);
    }
  };

  return (
    <AnimatedLayout>
      <div className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>

        {/* Cabeçalho */}
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

        {/* Área de conteúdo centrada para desktop */}
        <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
          {/* Separadores */}
          <div className="flex mx-6 mt-6 rounded-xl overflow-hidden border border-gray-200 bg-white">
            <button
              onClick={() => { setTab("login"); setError(""); }}
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
              onClick={() => { setTab("register"); setError(""); }}
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

          {/* Mensagem de erro */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mx-6 mt-4 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "#FEE2E2", color: "#DC2626" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulário */}
          <div className="px-6 mt-6 flex flex-col gap-4">
            {/* Campo: Nome completo (apenas no registo) */}
            {tab === "register" && (
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>Nome completo</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <User size={16} color="#9CA3AF" />
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-blue-600 transition-colors"
                    placeholder="João Macuácua"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ fontSize: "15px" }}
                  />
                </div>
              </div>
            )}

            {/* Campo: Email */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>Email</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <Mail size={16} color="#9CA3AF" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-blue-600 transition-colors"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ fontSize: "15px" }}
                />
              </div>
            </div>

            {/* Campo: Telemóvel (apenas no registo, opcional) */}
            {tab === "register" && (
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>Telemóvel <span className="text-gray-400">(opcional)</span></label>
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
            )}

            {/* Campo: Palavra-passe com botão de mostrar/ocultar */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>Palavra-passe</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-blue-600 transition-colors pr-12"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  style={{ fontSize: "15px" }}
                />
                {/* Botão de alternar visibilidade da palavra-passe */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                >
                  {showPass ? <EyeOff size={18} color="#6B7280" /> : <Eye size={18} color="#9CA3AF" />}
                </button>
              </div>
            </div>

            {/* Linha: Lembrar-me + Esqueceu a palavra-passe (apenas no login) */}
            {tab === "login" && (
              <div className="flex items-center justify-between">
                {/* Botão Lembrar-me */}
                <button
                  type="button"
                  className="flex items-center gap-2 group"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <div
                    className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: rememberMe ? "#F47C20" : "#D1D5DB",
                      background: rememberMe ? "#F47C20" : "transparent",
                    }}
                  >
                    {rememberMe && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors" style={{ fontWeight: 500 }}>
                    Lembrar-me
                  </span>
                </button>

                <button className="text-sm" style={{ color: "#F47C20", fontWeight: 500 }}>
                  Esqueceu a palavra-passe?
                </button>
              </div>
            )}

            {/* Botão principal */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white shadow-lg mt-2 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : 'active:scale-95'}`}
              style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600, fontSize: "16px" }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  A processar...
                </>
              ) : (
                tab === "login" ? "Entrar" : "Criar conta"
              )}
            </button>

            {/* Divisor */}
          </div>

          {/* Rodapé legal */}
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
