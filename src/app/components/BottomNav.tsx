import { useNavigate, useLocation } from "react-router";
import { Home, CreditCard, Clock, User, Wallet } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
