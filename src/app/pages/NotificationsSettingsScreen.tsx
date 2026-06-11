import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Bell, Smartphone, Mail, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";

export function NotificationsSettingsScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    sms: true,
    promotions: false,
    security: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    if (key === 'security') {
      toast.error("Notificações de segurança são obrigatórias.");
      return;
    }
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = () => {
    toast.success("Definições de notificações guardadas com sucesso!");
    navigate(-1);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-4 border-b flex items-center gap-4 bg-white sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-gray-800 font-bold text-lg">Notificações</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-500 mb-4 shadow-inner">
            <Bell size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Alertas e Avisos</h2>
          <p className="text-gray-500 text-sm text-center">
            Escolha como quer ser avisado sobre transferências, pagamentos e segurança.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Canais de Entrega</p>
          <div className="bg-gray-50 rounded-2xl p-2">
            {[
              { id: 'push', icon: <Bell size={18} />, label: "Notificações Push", desc: "No telemóvel" },
              { id: 'sms', icon: <Smartphone size={18} />, label: "Mensagens SMS", desc: "Custo grátis" },
              { id: 'email', icon: <Mail size={18} />, label: "Email", desc: "Recibos e relatórios" },
            ].map((item, i) => (
              <div key={item.id} className={`flex items-center justify-between p-3 ${i !== 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-600 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle(item.id as keyof typeof settings)}
                  className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${settings[item.id as keyof typeof settings] ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings[item.id as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Tipos de Avisos</p>
          <div className="bg-gray-50 rounded-2xl p-2">
            {[
              { id: 'security', icon: <AlertTriangle size={18} />, label: "Segurança", desc: "Logins e alterações" },
              { id: 'promotions', icon: <Info size={18} />, label: "Promoções", desc: "Ofertas AfriSol" },
            ].map((item, i) => (
              <div key={item.id} className={`flex items-center justify-between p-3 ${i !== 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-600 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle(item.id as keyof typeof settings)}
                  className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${settings[item.id as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'} ${item.id === 'security' ? 'opacity-70' : ''}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings[item.id as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t bg-gray-50/50 backdrop-blur-md">
        <button 
          onClick={saveSettings}
          className="w-full py-4 rounded-2xl text-white font-bold shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #162456, #1a2e6e)" }}
        >
          Guardar Definições
        </button>
      </div>
    </div>
  );
}
