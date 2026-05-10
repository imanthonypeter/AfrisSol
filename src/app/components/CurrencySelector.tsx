import { X, Check } from "lucide-react";
import { CURRENCIES } from "../../utils/currency";
import { useAppStore } from "../../store/useAppStore";

interface CurrencySelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CurrencySelector({ isOpen, onClose }: CurrencySelectorProps) {
  const { wallet, setCurrency } = useAppStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full sm:w-[400px] max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl flex flex-col"
        style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.1)" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Moeda Principal</h2>
            <p className="text-xs text-gray-500 mt-0.5">Seleccione a moeda da sua carteira</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-3 overflow-y-auto">
          {CURRENCIES.map((currency) => (
            <button
              key={currency.code}
              onClick={() => {
                setCurrency(currency.code);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl transition-colors"
              style={{
                background: wallet.currency === currency.code ? "#EEF2FF" : "transparent"
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-2xl flex-shrink-0"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6" }}
                >
                  {currency.flag}
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{currency.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{currency.code} • {currency.symbol}</p>
                </div>
              </div>
              {wallet.currency === currency.code && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#6366f1" }}>
                  <Check size={14} color="white" strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
