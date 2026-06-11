import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Phone, Mail, HelpCircle, Search } from "lucide-react";
import { toast } from "sonner";

export function SupportScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const faqs = [
    { q: "Como cancelar uma transferência?", a: "Pode cancelar uma transferência nos primeiros 3 minutos após o envio, acedendo ao Histórico." },
    { q: "Quais são as taxas de levantamento?", a: "Levantamentos em multicaixa são grátis. Levantamentos sem cartão custam 1% do valor." },
    { q: "O que fazer se perder o telemóvel?", a: "A sua conta AfriSol está protegida por PIN e biometria. Se necessário, contacte o suporte para bloquear a conta temporariamente." },
    { q: "Como adicionar dinheiro à carteira?", a: "Use a opção 'Adicionar Dinheiro' na página inicial para ver o IBAN da sua conta AfriSol." }
  ];

  const filteredFaqs = faqs.filter(faq => faq.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-4 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-gray-800 font-bold text-lg">Ajuda e Suporte</h1>
      </div>

      {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {/* Quick Contacts */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div 
              onClick={() => toast("A ligar para o apoio...")}
              className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Phone size={20} />
              </div>
              <p className="text-sm font-bold text-blue-900">Ligar agora</p>
              <p className="text-[10px] text-blue-600/70 text-center">Linha grátis 24/7</p>
            </div>
            
            <div 
              onClick={() => toast("A abrir o cliente de email...")}
              className="bg-orange-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <Mail size={20} />
              </div>
              <p className="text-sm font-bold text-orange-900">Enviar E-mail</p>
              <p className="text-[10px] text-orange-600/70 text-center">Resposta em 2h</p>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Como podemos ajudar?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow"
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">Tópicos Frequentes</p>
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <HelpCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1">{faq.q}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Nenhum resultado encontrado.</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
