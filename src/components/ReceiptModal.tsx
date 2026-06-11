import { useRef } from "react";
import { Check, Share2, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

export interface TransactionReceipt {
  type: string;
  amount: number;
  currency: string;
  date: number;
  reference: string;
  fromName?: string;
  fromAccount?: string;
  toName?: string;
  toAccount?: string;
}

interface ReceiptModalProps {
  receipt: TransactionReceipt | null;
  onClose: () => void;
}

export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      a.download = `Comprovativo_${receipt?.reference}.png`;
      a.click();
    }
  };

  const handleShare = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, { scale: 2 });
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `Comprovativo_${receipt?.reference}.png`, { type: "image/png" });
            if (navigator.share) {
              await navigator.share({
                title: "Comprovativo AfriSol",
                files: [file],
              });
            } else {
              alert("A partilha não é suportada neste dispositivo.");
            }
          }
        });
      } catch (e) {
        console.error("Erro ao partilhar:", e);
      }
    }
  };

  if (!receipt) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      >
        <div className="w-full max-w-md flex flex-col h-full max-h-[90vh]">
          <div className="flex justify-end mb-2">
            <button onClick={onClose} className="p-2 bg-white/20 rounded-full text-white backdrop-blur-md">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto rounded-xl hide-scrollbar pb-4">
            <div ref={receiptRef} className="bg-white rounded-xl p-0 relative overflow-hidden shadow-sm flex flex-col" style={{ border: "1px solid #E5E7EB" }}>
              <div className="bg-[#162456] p-4 flex flex-col items-center justify-center text-white">
                 <h2 className="text-white text-sm font-bold tracking-widest mb-1">COMPROVATIVO</h2>
                 <p className="text-white/80 text-xs">AfriSol - O seu banco digital</p>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="flex flex-col items-center justify-center pb-5 border-b border-dashed border-gray-200">
                  <span className="text-gray-500 text-xs uppercase font-bold mb-1 tracking-wider">Valor Transferido</span>
                  <span className="text-gray-900 text-3xl font-extrabold">{receipt.amount} {receipt.currency}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-5 gap-x-2">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Data da Operação</span>
                    <span className="text-gray-800 text-sm font-semibold mt-1">
                      {new Date(receipt.date).toLocaleDateString('pt-BR')} às {new Date(receipt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Nº de Referência</span>
                    <span className="text-gray-800 text-sm font-semibold mt-1">{receipt.reference}</span>
                  </div>

                  {receipt.fromName && (
                    <div className="flex flex-col col-span-2">
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Conta Origem (Remetente)</span>
                      <span className="text-gray-800 text-sm font-bold mt-1">{receipt.fromName}</span>
                      <span className="text-gray-500 text-xs">{receipt.fromAccount}</span>
                    </div>
                  )}

                  {receipt.toName && (
                    <div className="flex flex-col col-span-2">
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Conta Destino (Destinatário)</span>
                      <span className="text-gray-800 text-sm font-bold mt-1">{receipt.toName}</span>
                      <span className="text-gray-500 text-xs">{receipt.toAccount}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 p-4 border-t border-green-100 flex items-center justify-center gap-2 text-green-700">
                <Check size={18} className="stroke-[3px]" />
                <span className="text-sm font-bold">Operação concluída com sucesso</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-[#162456] font-semibold text-sm shadow-lg active:scale-95 transition-all">
              <Share2 size={18} />
              Partilhar
            </button>
            <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-[#162456] font-semibold text-sm shadow-lg active:scale-95 transition-all">
              <Download size={18} />
              Guardar
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
