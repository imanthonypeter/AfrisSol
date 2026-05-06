import { Outlet, useLocation } from "react-router";
import { BottomNav } from "./BottomNav";

const SHOW_NAV = ["/home", "/carteira", "/historico", "/perfil", "/pagamentos", "/recargas", "/transferencias"];

export function Root() {
  const location = useLocation();
  const showNav = SHOW_NAV.includes(location.pathname);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 md:bg-gradient-to-br md:from-slate-900 md:via-slate-800 md:to-indigo-950">
      <div
        className="relative bg-white overflow-hidden flex flex-col w-full h-dvh md:w-[430px] md:h-[860px] md:rounded-3xl md:shadow-2xl"
      >
        {/* Main content */}
        <div className="flex-1 overflow-hidden relative">
          <Outlet />
        </div>

        {/* Bottom Nav */}
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
