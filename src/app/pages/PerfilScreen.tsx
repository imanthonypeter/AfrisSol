import { useState } from "react";
import { useNavigate } from "react-router";
import {
  User, Shield, HelpCircle, Bell, ChevronRight, LogOut,
  Edit3, Phone, Mail, MapPin, Lock, Fingerprint, Eye, MessageCircle, FileText, Star, DollarSign, X, CheckCircle2
} from "lucide-react";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";
import { useAppStore } from "../../store/useAppStore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { toast } from "sonner";

import { CurrencySelector } from "../components/CurrencySelector";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { motion, AnimatePresence } from "framer-motion";
export function PerfilScreen() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [activeFeature, setActiveFeature] = useState<{title: string, desc: string} | null>(null);
  const { user, settings, wallet, updateUser, updateSettings } = useAppStore();

  const handleToggleBiometrics = () => {
    updateSettings({ biometrics: !settings.biometrics });
  };

  const menuSections = [
    {
      title: "Conta",
      items: [
        { icon: <User size={18} />, label: "Dados pessoais", sub: "Nome, telefone, email", color: "#6366f1", bg: "#EEF2FF" },
        { icon: <DollarSign size={18} />, label: "Moeda Principal", sub: wallet.currency, color: "#10b981", bg: "#d1fae5", onClick: () => setShowCurrencySelector(true) },
        { icon: <Bell size={18} />, label: "Notificações", sub: "Gerir alertas e avisos", color: "#F47C20", bg: "#FFF3E0" },
        { icon: <Eye size={18} />, label: "Privacidade", sub: "Controle de dados", color: "#22c55e", bg: "#E8F5E9" },
      ],
    },
    {
      title: "Segurança",
      items: [
        { icon: <Lock size={18} />, label: "Alterar PIN", sub: "Actualizar palavra-passe", color: "#162456", bg: "#EFF6FF" },
        { icon: <Fingerprint size={18} />, label: "Biometria", sub: "Digital e reconhecimento facial", color: "#8b5cf6", bg: "#F5F3FF", onClick: handleToggleBiometrics },
        { icon: <Shield size={18} />, label: "Autenticação 2FA", sub: "Segurança adicional", color: "#ef4444", bg: "#FEF2F2" },
      ],
    },
    {
      title: "Suporte",
      items: [
        { icon: <MessageCircle size={18} />, label: "Chat de suporte", sub: "Falar com um agente", color: "#F47C20", bg: "#FFF3E0" },
        { icon: <HelpCircle size={18} />, label: "Centro de ajuda", sub: "Perguntas frequentes", color: "#6366f1", bg: "#EEF2FF" },
        { icon: <FileText size={18} />, label: "Termos e condições", sub: "Políticas de uso", color: "#6B7280", bg: "#F3F4F6" },
        { icon: <Star size={18} />, label: "Avaliar a app", sub: "Deixe a sua opinião", color: "#f59e0b", bg: "#FFFBEB" },
      ],
    },
  ];

  return (
    <AnimatedLayout className="h-full flex flex-col overflow-y-auto" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-3 pb-8"
        style={{ background: "linear-gradient(160deg, #162456 0%, #1a2e6e 100%)", borderRadius: "0 0 28px 28px" }}
      >
        <h1 className="text-white mb-5" style={{ fontSize: "18px", fontWeight: 700 }}>Perfil</h1>

        {/* Avatar & Name */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white/30 shadow-lg">
              <img src={logoImg} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "#F47C20" }}
            >
              <Edit3 size={11} color="white" />
            </button>
          </div>
          <div className="flex-1">
            {editMode ? (
              <input
                className="bg-white/10 text-white rounded-lg px-2 py-1 outline-none w-full mb-1"
                value={user.name}
                onChange={(e) => updateUser({ name: e.target.value })}
                style={{ fontWeight: 600, fontSize: "16px" }}
              />
            ) : (
              <p className="text-white" style={{ fontWeight: 700, fontSize: "17px" }}>{user.name || "Sem Nome"}</p>
            )}
            <p className="text-white/60 text-xs">Conta verificada ✓</p>
            <div
              className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full"
              style={{ background: "rgba(244,124,32,0.25)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#F47C20" }} />
              <span className="text-xs" style={{ color: "#F47C20", fontWeight: 600 }}>Premium</span>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Edit3 size={15} color="white" />
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <div className="px-5 -mt-4 mb-4">
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <p className="text-gray-500 text-xs mb-3" style={{ fontWeight: 500 }}>INFORMAÇÕES PESSOAIS</p>
          {[
            { icon: <Phone size={15} color="#6366f1" />, label: user.phone || "+244 9XX XXX XXX", field: "phone" as const },
            { icon: <Mail size={15} color="#F47C20" />, label: user.email || "Sem e-mail", field: "email" as const },
            { icon: <MapPin size={15} color="#22c55e" />, label: user.location || "Luanda, Angola", field: "location" as const },
          ].map((info, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                {info.icon}
              </div>
              {editMode ? (
                <input
                  className="flex-1 text-gray-700 text-sm outline-none border-b border-gray-200 pb-0.5 bg-transparent"
                  value={info.label}
                  onChange={(e) => updateUser({ [info.field]: e.target.value })}
                />
              ) : (
                <span className="flex-1 text-gray-700 text-sm">{info.label}</span>
              )}
              {!editMode && <ChevronRight size={16} color="#D1D5DB" />}
            </div>
          ))}
          {editMode && (
            <button
              onClick={async () => {
                if (!user.uid) {
                  toast.error("Utilizador não encontrado.");
                  return;
                }
                try {
                  const userRef = doc(db, "users", user.uid);
                  await updateDoc(userRef, {
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    location: user.location,
                  });
                  setEditMode(false);
                  toast.success("Perfil actualizado com sucesso!");
                } catch (error) {
                  toast.error("Erro ao actualizar perfil.");
                }
              }}
              className="w-full mt-3 py-2.5 rounded-xl text-white text-sm"
              style={{ background: "linear-gradient(135deg, #F47C20, #e06010)", fontWeight: 600 }}
            >
              Guardar alterações
            </button>
          )}
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="px-5 mb-4">
          <p className="text-gray-400 text-xs mb-2 px-1" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {section.title}
          </p>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            {section.items.map((item, i) => (
              <div key={i}>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                  onClick={item.onClick || (() => setActiveFeature({ title: item.label, desc: item.sub }))}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: item.bg, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm" style={{ fontWeight: 500 }}>{item.label}</p>
                    <p className="text-gray-400 text-xs">{item.sub}</p>
                  </div>
                  
                  {item.label === "Biometria" ? (
                    <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${settings.biometrics ? 'bg-green-500' : 'bg-gray-200'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.biometrics ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  ) : (
                    <ChevronRight size={16} color="#D1D5DB" />
                  )}
                </button>
                {i < section.items.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Legal Section */}
      <div className="px-5 mb-8">
        <p className="text-gray-400 text-xs font-semibold mb-3 tracking-wider">INFORMAÇÃO LEGAL</p>
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {[
            { label: "Termos de Uso", path: "/termos", icon: <FileText size={18} /> },
            { label: "Política de Privacidade", path: "/privacidade", icon: <Shield size={18} /> },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                {item.icon}
              </div>
              <span className="flex-1 text-left text-sm text-gray-700 font-medium">{item.label}</span>
              <ChevronRight size={16} color="#D1D5DB" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 mb-6">
        <button
          onClick={async () => {
            const { logoutUser } = await import("../../services/auth");
            await logoutUser();
            useAppStore.getState().setAuthenticated(false);
            navigate("/auth");
          }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2"
          style={{ borderColor: "#FEF2F2", background: "#FEF2F2", color: "#ef4444" }}
        >
          <LogOut size={18} />
          <span style={{ fontWeight: 600, fontSize: "15px" }}>Terminar sessão</span>
        </button>
      </div>

      {/* Version */}
      <p className="text-center text-gray-300 text-xs pb-4">AfrisSol v1.0.0 — A Sua Carteira Digital</p>

      <CurrencySelector 
        isOpen={showCurrencySelector} 
        onClose={() => setShowCurrencySelector(false)} 
      />

      {/* Generic Mock Feature Modal */}
      <AnimatePresence>
        {activeFeature && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFeature(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 flex flex-col"
              style={{ height: "85vh" }}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-[#162456]">{activeFeature.title}</h3>
                  <p className="text-xs text-gray-500">{activeFeature.desc}</p>
                </div>
                <button 
                  onClick={() => setActiveFeature(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-[#F47C20]" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Tudo Configurado!</h4>
                <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
                  Esta secção de <strong>{activeFeature.title}</strong> está temporariamente bloqueada para demonstração no seu ambiente atual, mas o seu Perfil já se encontra atualizado e seguro com os padrões da AfriSol.
                </p>
                
                <div className="w-full max-w-sm space-y-3">
                  <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                    <Shield size={20} className="text-green-500" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">Proteção Ativa</p>
                      <p className="text-xs text-gray-500">A sua conta está segura</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveFeature(null)}
                    className="w-full py-3.5 rounded-xl text-white font-semibold shadow-md transition-transform active:scale-95"
                    style={{ background: "linear-gradient(135deg, #162456, #2a4090)" }}
                  >
                    Entendi, voltar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AnimatedLayout>
  );
}
