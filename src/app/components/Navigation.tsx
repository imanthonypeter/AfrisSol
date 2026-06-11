import { useNavigate, useLocation } from "react-router";
import { Home, CreditCard, Clock, User, Wallet } from "lucide-react";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";

interface NavigationProps {
  isSidebar?: boolean;
}

export function Navigation({ isSidebar = false }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (isSidebar) {
    return (
      <div className="flex flex-col h-full bg-white relative">
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
            <img src={logoImg} alt="AfriSol Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold" style={{ color: "#162456" }}>AfriSol</span>
        </div>

        {/* Links */}
        <div className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => navigate("/home")}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all"
            style={{
              background: isActive("/home") ? "#EEF2FF" : "transparent",
              color: isActive("/home") ? "#162456" : "#6B7280",
              fontWeight: isActive("/home") ? 600 : 500,
            }}
          >
            <Home size={20} strokeWidth={isActive("/home") ? 2.5 : 2} color={isActive("/home") ? "#6366f1" : "currentColor"} />
            Início
          </button>

          <button
            onClick={() => navigate("/carteira")}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all"
            style={{
              background: isActive("/carteira") ? "#EEF2FF" : "transparent",
              color: isActive("/carteira") ? "#162456" : "#6B7280",
              fontWeight: isActive("/carteira") ? 600 : 500,
            }}
          >
            <Wallet size={20} strokeWidth={isActive("/carteira") ? 2.5 : 2} color={isActive("/carteira") ? "#6366f1" : "currentColor"} />
            Carteira
          </button>

          <button
            onClick={() => navigate("/pagamentos")}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all"
            style={{
              background: isActive("/pagamentos") ? "linear-gradient(135deg, rgba(244,124,32,0.1), rgba(224,96,16,0.1))" : "transparent",
              color: isActive("/pagamentos") ? "#F47C20" : "#6B7280",
              fontWeight: isActive("/pagamentos") ? 600 : 500,
            }}
          >
            <CreditCard size={20} strokeWidth={isActive("/pagamentos") ? 2.5 : 2} color={isActive("/pagamentos") ? "#F47C20" : "currentColor"} />
            Pagamentos
          </button>

          <button
            onClick={() => navigate("/historico")}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all"
            style={{
              background: isActive("/historico") ? "#EEF2FF" : "transparent",
              color: isActive("/historico") ? "#162456" : "#6B7280",
              fontWeight: isActive("/historico") ? 600 : 500,
            }}
          >
            <Clock size={20} strokeWidth={isActive("/historico") ? 2.5 : 2} color={isActive("/historico") ? "#6366f1" : "currentColor"} />
            Histórico
          </button>

          <button
            onClick={() => navigate("/perfil")}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all"
            style={{
              background: isActive("/perfil") ? "#EEF2FF" : "transparent",
              color: isActive("/perfil") ? "#162456" : "#6B7280",
              fontWeight: isActive("/perfil") ? 600 : 500,
            }}
          >
            <User size={20} strokeWidth={isActive("/perfil") ? 2.5 : 2} color={isActive("/perfil") ? "#6366f1" : "currentColor"} />
            Perfil
          </button>
        </div>

        {/* Footer info area */}
        <div className="p-6">
          <div className="p-4 rounded-xl" style={{ background: "linear-gradient(160deg, #162456 0%, #1a2e6e 100%)" }}>
            <p className="text-white text-xs font-semibold mb-1">Ajuda & Suporte</p>
            <p className="text-white/70 text-xs mb-3">Precisa de assistência?</p>
            <button 
              onClick={() => navigate("/suporte")}
              className="w-full py-2 rounded-lg bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition-colors"
            >
              Falar Connosco
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-shrink-0 flex items-center justify-around bg-white border-t border-gray-100 pb-5 pt-2 px-4 relative"
      style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
    >
      {/* Início */}
      <button
        onClick={() => navigate("/home")}
        className="flex flex-col items-center gap-0.5 flex-1"
      >
        <Home
          size={22}
          strokeWidth={isActive("/home") ? 2.5 : 1.8}
          color={isActive("/home") ? "#162456" : "#9CA3AF"}
        />
        <span
          className="text-xs"
          style={{ color: isActive("/home") ? "#162456" : "#9CA3AF", fontWeight: isActive("/home") ? 600 : 400 }}
        >
          Início
        </span>
      </button>

      {/* Carteira */}
      <button
        onClick={() => navigate("/carteira")}
        className="flex flex-col items-center gap-0.5 flex-1"
      >
        <Wallet
          size={22}
          strokeWidth={isActive("/carteira") ? 2.5 : 1.8}
          color={isActive("/carteira") ? "#162456" : "#9CA3AF"}
        />
        <span
          className="text-xs"
          style={{ color: isActive("/carteira") ? "#162456" : "#9CA3AF", fontWeight: isActive("/carteira") ? 600 : 400 }}
        >
          Carteira
        </span>
      </button>

      {/* Pagar - center button */}
      <button
        onClick={() => navigate("/pagamentos")}
        className="flex flex-col items-center gap-0.5 flex-1 -mt-6"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg, #F47C20, #e06010)" }}
        >
          <CreditCard size={24} color="white" strokeWidth={2} />
        </div>
        <span className="text-xs mt-1" style={{ color: "#F47C20", fontWeight: 600 }}>
          Pagar
        </span>
      </button>

      {/* Histórico */}
      <button
        onClick={() => navigate("/historico")}
        className="flex flex-col items-center gap-0.5 flex-1"
      >
        <Clock
          size={22}
          strokeWidth={isActive("/historico") ? 2.5 : 1.8}
          color={isActive("/historico") ? "#162456" : "#9CA3AF"}
        />
        <span
          className="text-xs"
          style={{ color: isActive("/historico") ? "#162456" : "#9CA3AF", fontWeight: isActive("/historico") ? 600 : 400 }}
        >
          Histórico
        </span>
      </button>

      {/* Perfil */}
      <button
        onClick={() => navigate("/perfil")}
        className="flex flex-col items-center gap-0.5 flex-1"
      >
        <User
          size={22}
          strokeWidth={isActive("/perfil") ? 2.5 : 1.8}
          color={isActive("/perfil") ? "#162456" : "#9CA3AF"}
        />
        <span
          className="text-xs"
          style={{ color: isActive("/perfil") ? "#162456" : "#9CA3AF", fontWeight: isActive("/perfil") ? 600 : 400 }}
        >
          Perfil
        </span>
      </button>
    </div>
  );
}
