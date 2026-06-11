import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Snowflake, Zap, Copy, Check, Trash2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import logoImg from "../../assets/AfrisSol_Logo.jpeg";
import { useAppStore } from "../../store/useAppStore";

interface VirtualCardProps {
  onFreeze?: () => void;
  onDelete?: () => void;
  balanceVisible?: boolean;
}

export function VirtualCard({ onFreeze, onDelete, balanceVisible = true }: VirtualCardProps) {
  const { wallet, virtualCard, user } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [cvvVisible, setCvvVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (virtualCard) {
      navigator.clipboard.writeText(virtualCard.cardNumber);
      setCopied(true);
      toast.success("Número do cartão copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!wallet.hasVirtualCard || !virtualCard) return null;

  return (
    <div className="w-full flex flex-col items-center" style={{ perspective: 1000 }}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className={`relative w-full max-w-[340px] transition-all duration-300 ${virtualCard.isFrozen ? 'grayscale opacity-90' : ''}`}
        style={{
          aspectRatio: "1.586",
          transformStyle: "preserve-3d",
        }}
      >
        {/* FRONT FACE */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl p-5 overflow-hidden shadow-[0_10px_30px_rgba(26,31,113,0.4)]"
          style={{
            background: "linear-gradient(135deg, #1A1F71 0%, #2B32B2 50%, #162456 100%)",
            backfaceVisibility: "hidden",
            border: "1px solid rgba(255,255,255,0.15)",
            pointerEvents: isFlipped ? "none" : "auto",
            zIndex: isFlipped ? 0 : 10,
          }}
        >
          {/* Frozen Overlay Front */}
          {virtualCard.isFrozen && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
              <Snowflake size={32} className="text-blue-300 mb-2" />
              <div className="text-white font-bold text-lg tracking-wider">CONGELADO</div>
            </div>
          )}

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F47C20] opacity-[0.15] rounded-full -ml-10 -mb-10 blur-xl pointer-events-none" />
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

          {/* Shine effect */}
          <div className="absolute -inset-x-1/2 top-0 h-full w-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent -rotate-45 transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none z-10" />

          <div className="relative z-20 flex flex-col h-full justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                  <img src={logoImg} alt="AfrisSol" className="w-6 h-6 object-cover rounded-md" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xs leading-none" style={{ fontWeight: 800, letterSpacing: "-0.5px" }}>AFRI<span style={{ color: "#F47C20" }}>SOL</span></span>
                  <span className="text-white/60 text-[8px] uppercase tracking-widest mt-0.5">Virtual</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Flip button on card */}
                <button onClick={() => setIsFlipped(true)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white/80 active:scale-95">
                  <RefreshCcw size={14} />
                </button>
                {/* Contactless Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-70">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" strokeWidth="1.5" fill="none" />
                  <path d="M12 6v12M8 9l4-3 4 3M8 15l4 3 4-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            
            {/* Card Number */}
            <div className="mt-auto mb-4">
              <p className="text-white/60 text-[9px] uppercase tracking-widest mb-1.5 ml-1">Número do Cartão</p>
              <div className="flex items-center justify-between">
                <span className="text-white tracking-widest font-mono drop-shadow-md" style={{ fontWeight: 500, fontSize: "20px" }}>
                  {balanceVisible
                    ? virtualCard.cardNumber.replace(/(.{4})/g, "$1 ").trim()
                    : `•••• •••• •••• ${virtualCard.cardNumber.slice(-4)}`
                  }
                </span>
                <button onClick={handleCopy} className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white/80 active:scale-95 z-30">
                  {copied ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex justify-between items-end border-t border-white/10 pt-3 mt-1">
              <div className="flex-1">
                <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Titular</p>
                <p className="text-white text-sm uppercase drop-shadow-sm truncate max-w-[130px]" style={{ fontWeight: 600, letterSpacing: "1px" }}>
                  {user.name || "TITULAR"}
                </p>
              </div>
              
              <div className="flex gap-6 items-end">
                <div>
                  <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Validade</p>
                  <p className="text-white text-sm font-mono drop-shadow-sm" style={{ fontWeight: 600, letterSpacing: "1px" }}>
                    {virtualCard.expiryMonth}/{virtualCard.expiryYear}
                  </p>
                </div>
              </div>
              
              {/* CLEAN VISA Logo */}
              <div className="ml-4">
                <div className="italic font-bold text-2xl text-white tracking-widest drop-shadow-md select-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                  VISA
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(26,31,113,0.4)]"
          style={{
            background: "linear-gradient(135deg, #1A1F71 0%, #162456 50%, #2B32B2 100%)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            border: "1px solid rgba(255,255,255,0.15)",
            pointerEvents: isFlipped ? "auto" : "none",
            zIndex: isFlipped ? 10 : 0,
          }}
        >
          {/* Frozen Overlay Back */}
          {virtualCard.isFrozen && (
            <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm pointer-events-none" />
          )}

          {/* Magnetic Stripe */}
          <div className="w-full h-11 bg-black/80 mt-6" />

          {/* CVV Area */}
          <div className="px-5 mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/50 text-[9px] uppercase tracking-widest pl-1">Assinatura Autorizada</span>
              <span className="text-white/80 text-[10px] font-bold mr-2">CVV</span>
            </div>
            
            <div className="w-full h-9 bg-white/90 rounded flex items-center justify-end px-3 relative">
              {/* Fake signature lines */}
              <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-evenly py-1 opacity-20 w-2/3 pointer-events-none">
                <div className="h-px w-full bg-blue-900" />
                <div className="h-px w-full bg-blue-900" />
                <div className="h-px w-full bg-blue-900" />
              </div>

              <div className="flex items-center gap-2 z-10">
                <span className="text-gray-800 text-sm font-mono tracking-widest font-bold" style={{ width: "24px", textAlign: "right" }}>
                  {cvvVisible ? virtualCard.cvv : "•••"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (cvvVisible) {
                      setCvvVisible(false);
                    } else {
                      setCvvVisible(true);
                      setTimeout(() => setCvvVisible(false), 8000);
                    }
                  }}
                  className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 active:scale-95 z-20 cursor-pointer"
                >
                  {cvvVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            
            <p className="text-white/40 text-[7px] mt-2.5 leading-tight text-justify">
              Este cartão é propriedade da AfriSol e deve ser devolvido se solicitado. O uso deste cartão é regido pelos termos e condições do acordo de emissão do cartão.
            </p>

            <div className="flex justify-between items-end mt-2">
              <div className="italic font-bold text-lg text-white/50 tracking-widest select-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                VISA
              </div>
              <button onClick={() => setIsFlipped(false)} className="p-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white/80 flex items-center gap-1.5 text-[10px] font-medium active:scale-95">
                <RefreshCcw size={12} /> Voltar
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs shadow-sm hover:bg-gray-200 transition-colors active:scale-95"
        >
          <RefreshCcw size={15} /> {isFlipped ? "Ver Frente" : "Ver Verso"}
        </button>
        <button 
          onClick={onFreeze}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors active:scale-95 ${virtualCard.isFrozen ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
        >
          {virtualCard.isFrozen ? <Zap size={15} /> : <Snowflake size={15} />}
          {virtualCard.isFrozen ? "Descongelar" : "Congelar"}
        </button>
        <button 
          onClick={onDelete}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-red-50 text-red-500 font-semibold text-xs shadow-sm hover:bg-red-100 transition-colors active:scale-95"
        >
          <Trash2 size={15} /> Apagar
        </button>
      </div>
    </div>
  );
}
