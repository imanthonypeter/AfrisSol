import { useEffect } from "react";
import { useNavigate } from "react-router";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="h-full flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(160deg, #162456 0%, #0e1a3d 60%, #1a2e6e 100%)" }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-5 animate-pulse">
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden shadow-2xl">
          <img src={logoImg} alt="AfrisSol Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-baseline gap-0">
            <span className="text-white" style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.5px" }}>
              afris
            </span>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#F47C20", letterSpacing: "-0.5px" }}>
              sol
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px w-8" style={{ background: "#F47C20" }} />
            <span className="text-white/60 text-xs tracking-widest uppercase">
              A SUA CARTEIRA DIGITAL
            </span>
            <div className="h-px w-8" style={{ background: "#F47C20" }} />
          </div>
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2">
        <div
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ background: "#F47C20", animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ background: "#F47C20", animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ background: "#F47C20", animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
