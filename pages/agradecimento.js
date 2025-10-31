import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Agradecimento() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Remover confetti após 5 segundos
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Pagamento Confirmado! 🎉 | Privacy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
      </Head>

      <style jsx global>{`
        body {
          font-family: "Inter", sans-serif;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff1744 100%);
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        
        @keyframes confetti-slow {
          0% { transform: translate3d(0, 0, 0) rotateX(0) rotateY(0); }
          100% { transform: translate3d(25px, 105vh, 0) rotateX(360deg) rotateY(180deg); }
        }
        
        @keyframes confetti-medium {
          0% { transform: translate3d(0, 0, 0) rotateX(0) rotateY(0); }
          100% { transform: translate3d(100px, 105vh, 0) rotateX(100deg) rotateY(360deg); }
        }
        
        @keyframes confetti-fast {
          0% { transform: translate3d(0, 0, 0) rotateX(0) rotateY(0); }
          100% { transform: translate3d(-50px, 105vh, 0) rotateX(10deg) rotateY(250deg); }
        }
        
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #ffffff;
          top: -10px;
          border-radius: 50%;
        }
        
        .confetti:nth-child(1) { left: 10%; animation: confetti-slow 2.5s linear infinite; background: #ff6b35; }
        .confetti:nth-child(2) { left: 20%; animation: confetti-medium 2s linear infinite; background: #4ade80; }
        .confetti:nth-child(3) { left: 30%; animation: confetti-fast 1.8s linear infinite; background: #fbbf24; }
        .confetti:nth-child(4) { left: 40%; animation: confetti-slow 2.2s linear infinite; background: #60a5fa; }
        .confetti:nth-child(5) { left: 50%; animation: confetti-medium 2.3s linear infinite; background: #f87171; }
        .confetti:nth-child(6) { left: 60%; animation: confetti-fast 2s linear infinite; background: #c084fc; }
        .confetti:nth-child(7) { left: 70%; animation: confetti-slow 2.4s linear infinite; background: #34d399; }
        .confetti:nth-child(8) { left: 80%; animation: confetti-medium 2.1s linear infinite; background: #fbbf24; }
        .confetti:nth-child(9) { left: 90%; animation: confetti-fast 2.2s linear infinite; background: #ff6b35; }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .checkmark-path {
          stroke-dasharray: 100;
          animation: checkmark 0.8s ease-in-out forwards;
        }
      `}</style>

      {showConfetti && (
        <div id="confetti-container">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="confetti"></div>
          ))}
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 fade-in-up">
          {/* Checkmark de Sucesso */}
          <div className="mb-8 flex justify-center">
            <svg className="w-24 h-24" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" stroke="#4ade80" strokeWidth="2"/>
              <path className="checkmark-path" fill="none" stroke="#4ade80" strokeWidth="3" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            🎉 Pagamento Confirmado!
          </h1>

          {/* Mensagem */}
          <p className="text-xl text-center text-gray-600 mb-8">
            Obrigada pela confiança! Seu acesso foi liberado com sucesso.
          </p>

          {/* Card de Informação */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Como acessar o conteúdo</h3>
                <p className="text-gray-700">
                  Clique no botão abaixo para acessar todo o conteúdo exclusivo no Google Drive. 
                  Salve o link para acessar sempre que quiser!
                </p>
              </div>
            </div>
          </div>

          {/* Botão Principal - LINK DO DRIVE */}
          <a 
            href="https://drive.google.com/drive/folders/SEU_ID_DA_PASTA_AQUI" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-5 px-8 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg mb-4"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 12c-2.67 0-5.33-1.33-7-3.5.67-2.33 4-3.5 7-3.5s6.33 1.17 7 3.5c-1.67 2.17-4.33 3.5-7 3.5z"/>
              </svg>
              <span>🔓 ACESSAR CONTEÚDO EXCLUSIVO</span>
            </div>
          </a>

          {/* Botão Secundário - Voltar ao Site */}
          <a 
            href="/"
            className="block w-full bg-gray-100 text-gray-700 text-center py-4 px-8 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
          >
            ← Voltar para o site
          </a>

          {/* Informações Adicionais */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900">Acesso Vitalício</h4>
                  <p className="text-sm text-gray-600">Sem mensalidades ou renovações</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900">Conteúdo Completo</h4>
                  <p className="text-sm text-gray-600">Todos os vídeos e fotos liberados</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900">Atualizações Grátis</h4>
                  <p className="text-sm text-gray-600">Novos conteúdos sem custo extra</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900">Suporte Total</h4>
                  <p className="text-sm text-gray-600">Dúvidas? Entre em contato</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nota Final */}
          <div className="mt-8 bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> Salve o link do Drive nos seus favoritos para acessar sempre que quiser!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

