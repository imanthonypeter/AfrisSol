import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Navigation } from "./Navigation";
import { useAppStore, AppState } from "../../store/useAppStore";

const SHOW_NAV = ["/home", "/carteira", "/historico", "/perfil", "/pagamentos", "/recargas", "/transferencias"];

export function Root() {
  const location = useLocation();
  const showNav = SHOW_NAV.includes(location.pathname);
  const fetchExchangeRates = useAppStore((state: AppState) => state.fetchExchangeRates);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] font-sans text-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      {showNav && (
        <div className="hidden md:flex flex-col w-64 flex-shrink-0 h-screen bg-white z-10 border-r border-gray-100 shadow-sm relative">
          <Navigation isSidebar={true} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-dvh md:h-screen relative overflow-hidden">
        <div className="flex-1 overflow-hidden relative bg-white w-full md:max-w-md lg:max-w-2xl xl:max-w-4xl md:mx-auto md:my-8 md:rounded-[36px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] md:border border-gray-100 flex flex-col">
          <Outlet />
        </div>

        {/* Mobile Bottom Nav */}
        {showNav && (
          <div className="block md:hidden flex-shrink-0 relative z-20">
            <Navigation isSidebar={false} />
          </div>
        )}
      </div>
    </div>
  );
}
