import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Lock, KeyRound, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ChangePinScreen() {
  const navigate = useNavigate();
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1) {
      if (currentPin.length !== 4) {
        toast.error("O PIN actual deve ter 4 dígitos.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (newPin.length !== 4) {
        toast.error("O novo PIN deve ter 4 dígitos.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (newPin !== confirmPin) {
        toast.error("Os PINs não coincidem. Tente novamente.");
        setConfirmPin("");
        return;
      }
      // Sucesso
      toast.success("PIN alterado com sucesso!");
      navigate(-1);
    }
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
        <h1 className="text-gray-800 font-bold text-lg">Alterar PIN</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6 shadow-inner relative">
          <Lock size={48} />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
            <KeyRound size={20} className="text-gray-800" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {step === 1 && "Insira o PIN actual"}
          {step === 2 && "Escolha um novo PIN"}
          {step === 3 && "Confirme o novo PIN"}
        </h2>
        
        <p className="text-gray-500 text-sm text-center mb-10 max-w-[250px]">
          {step === 1 && "Por motivos de segurança, precisamos confirmar a sua identidade."}
          {step === 2 && "O novo PIN será usado para entrar na aplicação e aprovar transacções."}
          {step === 3 && "Por favor, digite novamente o seu novo PIN de 4 dígitos."}
        </p>

        {/* PIN Input Dots */}
        <div className="flex items-center gap-4 mb-12">
          {[0, 1, 2, 3].map((index) => {
            const pinValue = step === 1 ? currentPin : step === 2 ? newPin : confirmPin;
            const isFilled = pinValue.length > index;
            return (
              <div 
                key={index} 
                className={`w-5 h-5 rounded-full transition-all duration-300 ${
                  isFilled ? 'bg-blue-600 scale-110' : 'bg-gray-200'
                }`}
              />
            );
          })}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'empty', 0, 'del'].map((num, i) => {
            if (num === 'empty') return <div key={i} />;
            
            if (num === 'del') return (
              <button
                key={i}
                onClick={() => {
                  const setFn = step === 1 ? setCurrentPin : step === 2 ? setNewPin : setConfirmPin;
                  setFn(prev => prev.slice(0, -1));
                }}
                className="h-16 rounded-2xl flex items-center justify-center text-gray-400 active:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
            );

            return (
              <button
                key={i}
                onClick={() => {
                  const setFn = step === 1 ? setCurrentPin : step === 2 ? setNewPin : setConfirmPin;
                  setFn(prev => {
                    if (prev.length < 4) {
                      const newValue = prev + num.toString();
                      if (newValue.length === 4) {
                        setTimeout(() => handleNext(), 150);
                      }
                      return newValue;
                    }
                    return prev;
                  });
                }}
                className="h-16 rounded-2xl flex items-center justify-center text-2xl font-semibold text-gray-800 active:bg-blue-50 active:text-blue-600 transition-colors shadow-sm border border-gray-100"
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
