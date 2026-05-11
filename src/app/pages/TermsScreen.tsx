import { useNavigate } from "react-router";
import { ChevronLeft, FileText, Scale, AlertCircle, Ban, HelpCircle } from "lucide-react";

export function TermsScreen() {
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
        <h1 className="text-gray-800 font-bold text-lg">Termos de Uso</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#162456] mb-4 shadow-inner">
            <FileText size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Termos e Condições</h2>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Última atualização: 11 de Maio de 2026</p>
        </div>

        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#162456] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-900/20">
                01
              </div>
              <h2 className="text-gray-800 font-bold text-base">Aceitação do Serviço</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ao aceder e utilizar a aplicação AfriSol, o utilizador declara ter lido, compreendido e aceite todos os termos aqui descritos. Este é um contrato vinculativo entre o utilizador e a <span className="font-semibold text-[#162456]">AfriSol Tech Group Lda</span>.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#162456] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-900/20">
                02
              </div>
              <h2 className="text-gray-800 font-bold text-base">Elegibilidade e Cadastro</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Para abrir uma conta, deve ser residente em território nacional, ter pelo menos 18 anos e possuir um documento de identificação válido. Todas as informações fornecidas devem ser verídicas e atualizadas regularmente.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#162456] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-900/20">
                03
              </div>
              <h2 className="text-gray-800 font-bold text-base">Segurança e PIN</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              O utilizador é o único responsável pela guarda do seu PIN e acesso biométrico. A AfriSol nunca solicitará o seu código PIN por telefone, e-mail ou SMS. <span className="font-bold text-red-500">Nunca partilhe os seus dados de acesso.</span>
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#162456] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-900/20">
                04
              </div>
              <h2 className="text-gray-800 font-bold text-base">Limites e Taxas</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              As transações estão sujeitas a limites diários e mensais de acordo com o nível de verificação da conta. Taxas de serviço podem ser aplicadas em transferências, levantamentos e pagamentos, sendo sempre apresentadas antes da conclusão da operação.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#162456] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-900/20">
                05
              </div>
              <h2 className="text-gray-800 font-bold text-base">Uso Indevido</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              É estritamente proibido o uso da plataforma para lavagem de dinheiro, financiamento ao terrorismo ou qualquer atividade ilícita. Contas suspeitas serão bloqueadas preventivamente para investigação.
            </p>
          </section>

          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 space-y-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle size={20} />
              <h3 className="font-bold text-sm">Avisos Importantes</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Ban size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  A AfriSol não se responsabiliza por erros de digitação de números de destino cometidos pelo utilizador.
                </p>
              </div>
              <div className="flex gap-3">
                <Scale size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Estes termos são regidos pelas leis da República de Angola e qualquer litígio será resolvido na comarca de Luanda.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 mb-6 flex flex-col items-center gap-2">
          <HelpCircle size={24} className="text-gray-300" />
          <p className="text-xs text-gray-400 text-center px-6">
            Para mais esclarecimentos, consulte o nosso Centro de Ajuda ou contacte o suporte técnico.
          </p>
        </div>
      </div>
      
      <div className="p-6 border-t bg-gray-50/50 backdrop-blur-md">
        <button 
          onClick={() => navigate(-1)}
          className="w-full py-4 rounded-2xl text-white font-bold shadow-xl active:scale-[0.98] transition-all"
          style={{ background: "linear-gradient(135deg, #F47C20, #e06010)" }}
        >
          Li e Concordo
        </button>
      </div>
    </div>
  );
}

