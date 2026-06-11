import { useState } from "react";
import { useNavigate } from "react-router";
import {
  User, DollarSign, Bell, FileText, HelpCircle, Shield, ChevronRight, LogOut, Edit3, Phone, Mail, MapPin, Lock
} from "lucide-react";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";
import { useAppStore } from "../../store/useAppStore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { toast } from "sonner";

import { CurrencySelector } from "../components/CurrencySelector";
import { AnimatedLayout } from "../../components/AnimatedLayout";
export function PerfilScreen() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const { user, wallet, updateUser } = useAppStore();

  const menuSections = [
    {
      title: "Conta",
      items: [
        { icon: <User size={18} />, label: "Dados pessoais", sub: "Nome, telefone, email", color: "#6366f1", bg: "#EEF2FF", onClick: () => setEditMode(true) },
        { icon: <DollarSign size={18} />, label: "Moeda Principal", sub: wallet.currency, color: "#10b981", bg: "#d1fae5", onClick: () => setShowCurrencySelector(true) },
        { icon: <Bell size={18} />, label: "Notificações", sub: "Gerir alertas e avisos", color: "#F47C20", bg: "#FFF3E0", onClick: () => navigate("/notificacoes") },
      ],
    },
    {
      title: "Segurança",
      items: [
        { icon: <Lock size={18} />, label: "Alterar PIN", sub: "Actualizar palavra-passe", color: "#162456", bg: "#EFF6FF", onClick: () => navigate("/alterar-pin") },
      ],
    },
    {
      title: "Suporte",
      items: [
        { icon: <HelpCircle size={18} />, label: "Ajuda e Suporte", sub: "Perguntas frequentes e contactos", color: "#6366f1", bg: "#EEF2FF", onClick: () => navigate("/suporte") },
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
            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white/30 shadow-lg bg-gray-200">
              <img src={user.avatar || logoImg} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <label
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: "#F47C20" }}
            >
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updateUser({ avatar: reader.result as string });
                      toast.success("Foto de perfil actualizada!");
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              <Edit3 size={11} color="white" />
            </label>
          </div>
          <div className="flex-1">
            {editMode ? (
              <input
                className="bg-white/10 text-white rounded-lg px-2 py-1 outline-none w-full mb-1"
                value={user.name || ""}
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
                  value={
                    info.field === "phone" ? user.phone || "" :
                    info.field === "email" ? user.email || "" :
                    user.location || ""
                  }
                  onChange={(e) => updateUser({ [info.field]: e.target.value })}
                  placeholder={info.label}
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
                if (user.uid === "demo") {
                  toast.success("Perfil actualizado localmente (Modo Demo).");
                  setEditMode(false);
                  return;
                }
                try {
                  const userRef = doc(db, "users", user.uid);
                  await updateDoc(userRef, {
                    name: user.name || "",
                    phone: user.phone || "",
                    email: user.email || "",
                    location: user.location || "Luanda, Angola",
                    avatar: user.avatar || "",
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
                  onClick={item.onClick}
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
                  <ChevronRight size={16} color="#D1D5DB" />
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


    </AnimatedLayout>
  );
}
