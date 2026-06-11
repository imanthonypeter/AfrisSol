import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  title?: string;
}

export function PinModal({ isOpen, onClose, onConfirm, title = "Confirmar com PIN" }: PinModalProps) {
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (isOpen) setPin("");
  }, [isOpen]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          onConfirm(newPin);
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-full flex justify-end">
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-[#162456]">
              <Lock size={28} />
            </div>
            
            <h3 className="text-gray-800 font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Insira o seu PIN de 4 dígitos para autorizar esta operação.</p>
            
            {/* PIN Dots */}
            <div className="flex gap-4 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-colors duration-200 ${
                    pin.length > i ? "bg-[#F47C20]" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 w-full px-4 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num.toString())}
                  className="w-16 h-16 rounded-full text-2xl font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-center mx-auto transition-colors"
                >
                  {num}
                </button>
              ))}
              <div /> {/* Empty space */}
              <button
                onClick={() => handleKeyPress("0")}
                className="w-16 h-16 rounded-full text-2xl font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-center mx-auto transition-colors"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="w-16 h-16 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center mx-auto transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                  <line x1="18" y1="9" x2="12" y2="15"></line>
                  <line x1="12" y1="9" x2="18" y2="15"></line>
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
