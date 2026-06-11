import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Phone, Fingerprint, ShieldCheck, Mail, User, Loader2 } from "lucide-react";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";
import { useAppStore } from "../../store/useAppStore";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { SuccessCheckmark } from "../../components/SuccessCheckmark";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser, loginUser, loginWithGoogle } from "../../services/auth";
import type { User as FirebaseUser } from "firebase/auth";
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
  const [bioPhase, setBioPhase] = useState<"idle" | "scanning" | "success">("idle");
  const [googlePhoneModal, setGooglePhoneModal] = useState(false);
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const { settings, setAuthenticated, updateUser, setWalletCard } = useAppStore();

  // Ao montar, verificar se há um email guardado no localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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
        const { profile } = await registerUser(name, email, password, phone || undefined);
        updateUser({
          uid: profile.uid,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        });
      } else {
        if (!email || !password) {
          setError("Introduza o email e a palavra-passe.");
          setLoading(false);
          return;
        }
        const { profile } = await loginUser(email, password, rememberMe);
        if (profile) {
          updateUser({
            uid: profile.uid,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
          });
          setWalletCard(profile.hasVirtualCard || false);
        }
      }

      // Guardar ou remover email conforme a opção "Lembrar-me"
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      setAuthenticated(true);
      navigate("/home");
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
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleAuth = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const { user: firebaseUser, profile, isNewUser } = await loginWithGoogle();
      if (isNewUser || !profile) {
        setGoogleUser(firebaseUser);
        setGooglePhoneModal(true);
        setLoading(false);
        return;
      }
      
      updateUser({
        uid: profile.uid,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });
      setWalletCard(profile.hasVirtualCard || false);
      setAuthenticated(true);
      navigate("/home");
    } catch (err: any) {
      setError(err?.message || "Erro ao autenticar com Google.");
      setLoading(false);
    }
  };

  const submitGooglePhone = async () => {
    if (!googleUser) return;
    if (!phone || phone.length < 9) {
      setError("Por favor, introduza um número de telemóvel válido.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { createUser } = await import("../../services/firestore");
      const profile = await createUser(googleUser.uid, {
        name: googleUser.displayName || "Utilizador AfriSol",
        email: googleUser.email || "",
        phone: phone
      });
      updateUser({
        uid: profile.uid,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });
      setGooglePhoneModal(false);
      setAuthenticated(true);
      navigate("/home");
    } catch(err: any) {
      setError(err?.message || "Erro ao registar conta.");
      setLoading(false);
    }
  };

  // Simular autenticação biométrica
  const handleBiometrics = () => {
    setBioPhase("scanning");
    setTimeout(() => {
      setBioPhase("success");
      setTimeout(() => {
        setAuthenticated(true);
        navigate("/home");
      }, 1500);
    }, 2000);
  };

  // Cancelar biometria
  const cancelBio = () => setBioPhase("idle");

  return (
    <AnimatedLayout>
      <div className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
        {/* Sobreposição de autenticação biométrica */}
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
                    {/* Animação de leitura biométrica */}
                    <div className="relative w-24 h-24 mb-6">
                      {/* Anel pulsante */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: "3px solid rgba(244,124,32,0.3)" }}
                        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {/* Anel rotativo */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: "3px solid #F47C20" }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#F47C20]" />
                      </motion.div>
                      {/* Ícone de impressão digital */}
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
                    {/* Barra de progresso */}
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
                    {/* Estado de sucesso */}
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

        {/* Modal de Telemóvel para Google */}
        <AnimatePresence>
          {googlePhoneModal && (
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
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
                  <Phone size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quase lá!</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Introduza o seu número de telemóvel para terminar o registo.
                </p>

                {error && (
                  <div className="w-full mb-4 px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600">
                    {error}
                  </div>
                )}

                <div className="w-full relative mb-6">
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

                <button
                  onClick={submitGooglePhone}
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white shadow-md transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : 'active:scale-95'}`}
                  style={{ background: "linear-gradient(135deg, #162456, #1a2e6e)", fontWeight: 600, fontSize: "15px" }}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Concluir Registo"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
            {tab === "login" && (
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-sm">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}

            {/* Botão biométrico (apenas se activado nas definições) */}
            {tab === "login" && settings.biometrics && (
              <button
                onClick={handleBiometrics}
                className="w-full py-4 rounded-xl border-2 text-sm transition-all active:scale-95 hover:bg-[#162456]/5 flex items-center justify-center gap-2.5 mb-2"
                style={{ borderColor: "#162456", color: "#162456", fontWeight: 600 }}
              >
                <Fingerprint size={20} />
                Entrar com biometria
              </button>
            )}

            {/* Divisor para botão Google */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Continuar com Google */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-4 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm transition-all hover:bg-gray-50 flex items-center justify-center gap-3 active:scale-95 shadow-sm"
              style={{ fontWeight: 600 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.3C21.39 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.3 20.34L15.73 17.57C14.73 18.24 13.48 18.66 12 18.66C9.13 18.66 6.71 16.72 5.84 14.13H2.15V16.99C3.96 20.59 7.69 23 12 23Z" fill="#34A853"/>
                <path d="M5.84 14.13C5.62 13.47 5.5 12.75 5.5 12C5.5 11.25 5.62 10.53 5.84 9.87V7.01H2.15C1.41 8.49 1 10.19 1 12C1 13.81 1.41 15.51 2.15 16.99L5.84 14.13Z" fill="#FBBC05"/>
                <path d="M12 5.34C13.62 5.34 15.06 5.89 16.2 6.98L19.38 3.8C17.46 2 14.97 1 12 1C7.69 1 3.96 3.41 2.15 7.01L5.84 9.87C6.71 7.28 9.13 5.34 12 5.34Z" fill="#EA4335"/>
              </svg>
              Continuar com Google
            </button>
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
