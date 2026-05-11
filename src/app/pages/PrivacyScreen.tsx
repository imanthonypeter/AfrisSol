import { useNavigate } from "react-router";
import { ChevronLeft, Shield, Lock, Eye, Server, Globe, Trash2, Smartphone } from "lucide-react";

export function PrivacyScreen() {
  const navigate = useNavigate();

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
        <h1 className="text-gray-800 font-bold text-lg">Política de Privacidade</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-green-600 mb-4 shadow-inner">
            <Shield size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Privacidade AfriSol</h2>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Última atualização: 11 de Maio de 2026</p>
        </div>

        <div className="space-y-10">
          <section className="relative pl-4 border-l-2 border-blue-500/20">
            <div className="flex items-center gap-3 mb-4 -ml-[1.1rem]">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Eye size={18} />
              </div>
              <h2 className="text-gray-800 font-bold text-base">1. Dados que Coletamos</h2>
            </div>
            <div className="text-gray-600 text-sm leading-relaxed space-y-3">
              <p>
                Para fornecer uma experiência segura e eficiente, a AfriSol coleta as seguintes categorias de informações:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-500">
                <li><span className="font-semibold text-gray-700">Identificação:</span> Nome completo, data de nascimento e BI/NIF.</li>
                <li><span className="font-semibold text-gray-700">Contacto:</span> Número de telefone, e-mail e endereço residencial.</li>
                <li><span className="font-semibold text-gray-700">Financeiros:</span> Histórico de transações, saldos e detalhes de cartões vinculados.</li>
                <li><span className="font-semibold text-gray-700">Técnicos:</span> Endereço IP, tipo de dispositivo e identificadores únicos.</li>
              </ul>
            </div>
          </section>

          <section className="relative pl-4 border-l-2 border-purple-500/20">
            <div className="flex items-center gap-3 mb-4 -ml-[1.1rem]">
              <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-200">
                <Lock size={18} />
              </div>
              <h2 className="text-gray-800 font-bold text-base">2. Uso de Biometria</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              A AfriSol utiliza tecnologia biométrica do dispositivo para autenticação rápida. Importante: <span className="font-bold text-gray-800 underline decoration-purple-200">não armazenamos seus dados biométricos</span> em nossos servidores. Eles permanecem encriptados no Secure Enclave do seu smartphone.
            </p>
          </section>

          <section className="relative pl-4 border-l-2 border-orange-500/20">
            <div className="flex items-center gap-3 mb-4 -ml-[1.1rem]">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <Server size={18} />
              </div>
              <h2 className="text-gray-800 font-bold text-base">3. Segurança dos Dados</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Empregamos protocolos de segurança de nível bancário (AES-256) para proteger todas as comunicações. Seus dados são armazenados em servidores redundantes com monitorização 24/7 contra acessos não autorizados.
            </p>
          </section>

          <section className="relative pl-4 border-l-2 border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4 -ml-[1.1rem]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Globe size={18} />
              </div>
              <h2 className="text-gray-800 font-bold text-base">4. Partilha com Terceiros</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Apenas partilhamos os dados estritamente necessários com parceiros de processamento de pagamentos e autoridades reguladoras quando legalmente exigido. <span className="font-semibold text-gray-800">Nunca vendemos seus dados para fins publicitários.</span>
            </p>
          </section>

          <section className="relative pl-4 border-l-2 border-red-500/20">
            <div className="flex items-center gap-3 mb-4 -ml-[1.1rem]">
              <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-200">
                <Trash2 size={18} />
              </div>
              <h2 className="text-gray-800 font-bold text-base">5. Eliminação de Dados</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Você pode solicitar a eliminação definitiva da sua conta e de todos os dados associados a qualquer momento através do suporte. Alguns dados financeiros podem ser retidos por períodos legais obrigatórios.
            </p>
          </section>

          <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-800">
              <Smartphone size={18} className="text-blue-600" />
              <h3 className="font-bold text-sm">Seus Direitos Legais</h3>
            </div>
            <ul className="grid grid-cols-1 gap-3">
              {[
                "Acesso e consulta aos dados",
                "Retificação de informações",
                "Portabilidade dos dados",
                "Oposição ao tratamento",
                "Revogação de consentimento"
              ].map((right, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {right}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 mb-6 text-center">
          <p className="text-xs text-gray-400">
            Dúvidas sobre a sua privacidade? Contacte-nos em <br />
            <span className="text-blue-600 font-semibold">privacidade@afrisol.ao</span>
          </p>
        </div>
      </div>
      
      <div className="p-6 border-t bg-gray-50/50 backdrop-blur-md">
        <button 
          onClick={() => navigate(-1)}
          className="w-full py-4 rounded-2xl text-white font-bold shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #162456, #1a2e6e)" }}
        >
          Aceitar e Continuar
        </button>
      </div>
    </div>
  );
}

