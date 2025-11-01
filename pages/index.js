import Head from 'next/head';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import MediaGrid from '../components/MediaGrid';
import ModalPagamento from '../components/ModalPagamento';

export default function Home() {
  const [pixelId, setPixelId] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [currentValue, setCurrentValue] = useState(9.90);
  const [currentPlan, setCurrentPlan] = useState('1 Mês');
  
  useEffect(() => {
    setPixelId(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'SEU_PIXEL_ID_AQUI');
  }, []);



  const handlePayment = async (valor, plano) => {
    setCurrentValue(valor);
    setCurrentPlan(plano);
    setModalAberto(true);

    if (typeof window !== 'undefined' && window.PushinPayReal) {
      try {
        window.PushinPayReal.atualizarValorPlano(valor, plano);
        await window.PushinPayReal.criarPix();
      } catch (error) {
        console.error('Erro ao processar pagamento:', error);
      
      }
    } else {
      console.error('PushinPayReal não está disponível');
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    if (typeof window !== 'undefined' && window.PushinPayReal) {
      window.PushinPayReal.pararVerificacao();
    }
  };

  return (
    <>
      <Head>
        <title>Privacy | Marcelly Mar🌊</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      <style jsx global>{`
        body {
          font-family: "Inter", sans-serif;
          background-color: #f9f6f2 !important;
        }
        .payment-overlay {
          position: fixed;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background-color: white;
          z-index: 1000;
          transition: left 0.5s ease-in-out;
        }
        .payment-overlay.active {
          left: 0;
        }
        .media-blur {
          filter: blur(5px);
          transition: filter 0.3s ease;
        }
        .media-item:hover .media-blur {
          filter: blur(1px);
        }
        .media-overlay {
          background: linear-gradient(45deg, rgba(0,0,0,0.3), rgba(255,165,0,0.2));
        }
        .media-item {
          transition: transform 0.2s ease;
        }
        .media-item:hover {
          transform: scale(1.05);
        }
        .content-transition {
          transition: opacity 0.3s ease-in-out;
        }
        .subscription-gradient {
          background: linear-gradient(to right, #f69a53, #f6a261, #f9c59d, #f8b89b, #f7ab99);
        }
        .subscription-gradient:hover {
          background: linear-gradient(to right, #e88a43, #e69251, #e9b58d, #e8a88b, #e79b89);
        }
      `}</style>

      {/* Header */}
      <div style={{ backgroundColor: '#f9f6f2' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex justify-center items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">privacy</span>
              <div className="w-2 h-2 bg-orange-500 rounded-full ml-0.5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Linha separadora */}
      <div className="border-t border-gray-200"></div>

      {/* Main Card */}
      <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden bg-white shadow-lg mt-4">
        {/* Banner Image */}
        <img className="w-full h-64 object-cover" src="/images/banner.jpg" alt="Banner" />
        
        {/* Statistics - Top Right */}
        <div className="absolute top-52 right-4 z-50">
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="text-sm">159</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span className="text-sm">93</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span className="text-sm">364.6K</span>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="bg-white p-6 -mt-12 relative z-10">
          {/* Profile Picture */}
          <div className="flex justify-start -mt-16 mb-4">
            <img className="h-24 w-24 rounded-full border-4 border-white object-cover" src="/images/perfil.jpg" alt="Perfil" />
          </div>
          
          {/* Name with verification badge */}
          <div className="flex items-center mb-2 -mt-4">
            <h2 className="text-lg font-bold text-black">Marcelly Mar</h2> 
            <img className="h-5 w-5 ml-2" src="/images/badge-check.svg" alt="Verificado" />
          </div>
          
          {/* Username */}
          <p className="text-sm text-gray-600 mb-2 -mt-1">@marcellymar</p> 
          
          {/* Description */}
          <p className="text-gray-800 text-sm -mt-2">
            🔥Conteúdo totalmente EXPLÍCITO mostrando tudo 🔞 Vídeos solo e CENAS DE SEXO EM CASAL, com homens DOTADOS de todos os estilos 👌🏼😱 Cenas em lugares proibidos e também com alguns familires...
          </p>
          
          {/* Social Media Links */}
          <div className="flex space-x-2 mt-2">
            <a href="#" className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
              <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            <a href="#" className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
              <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            
            <a href="#" className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
              <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
          
          {/* Subscription Section */}
          <div className="mt-3">
            <h6 className="text-lg font-bold text-gray-800 mb-2">Assinaturas</h6>
            
            <button onClick={() => handlePayment(9.90, '1 Mês')} className="w-full subscription-gradient text-black py-4 px-6 rounded-2xl font-medium transition-all mb-2 flex justify-between items-center shadow-sm">
              <span>1 Mês</span>
              <span>R$ 9,90</span>
            </button>
          </div>
          
          {/* Promotions Section */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <h6 className="text-lg font-bold text-gray-800">Promoções</h6>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
            </div>
            
            <button onClick={() => handlePayment(50.00, '3 meses (16% off)')} className="w-full subscription-gradient text-black py-4 px-6 rounded-2xl font-medium transition-all mb-2 flex justify-between items-center shadow-sm">
              <span>3 meses (16% off)</span>
              <span>R$ 50,00</span>
            </button>
            
            <button onClick={() => handlePayment(100.00, 'Vitalício (50% off)')} className="w-full subscription-gradient text-black py-4 px-6 rounded-2xl font-medium transition-all flex justify-between items-center shadow-sm">
              <span>Vitalício (50% off)</span>
              <span>R$ 100,00</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section - Continuar na próxima parte por limitação de tamanho */}
      <div className="max-w-3xl mx-auto mt-4">
        <div className="bg-white rounded-3xl shadow-lg p-1">
          <div className="flex">
            <div 
              onClick={() => setActiveTab('posts')} 
              className={`flex-1 flex items-center justify-center py-4 px-6 cursor-pointer transition-all duration-300 ${
                activeTab === 'posts' 
                  ? 'bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 font-semibold rounded-2xl' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'posts' ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="font-medium">513 Postagens</span>
              </div>
            </div>
            
            <div 
              onClick={() => setActiveTab('medias')} 
              className={`flex-1 flex items-center justify-center py-4 px-6 cursor-pointer transition-all duration-300 ${
                activeTab === 'medias' 
                  ? 'bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 font-semibold rounded-2xl shadow-sm' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'medias' ? 'scale-110 animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <span className="font-medium">159 Mídias</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-3xl mx-auto mt-4 rounded-3xl overflow-hidden bg-white shadow-lg p-6">
        {/* Posts Content */}
        {activeTab === 'posts' && (
          <div className="content-transition">
            {/* Profile Section */}
            <div className="flex items-center mb-6">
              <img className="h-12 w-12 rounded-full object-cover mr-4" src="/images/perfil.jpg" alt="Profile" />
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-bold text-gray-900">Marcelly Mar🌊</h3>
                  <img className="h-5 w-5 ml-2" src="/images/badge-check.svg" alt="Verificado" />
                </div>
                <p className="text-sm text-gray-600">@marcellymar</p>
              </div>
              <button className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
              </button>
            </div>

            {/* Locked Content Area */}
            <div className="relative rounded-2xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
              <img 
                className="w-full h-full object-cover" 
                style={{ filter: 'blur(8px)' }} 
                src="https://i.imgur.com/wiNPdKN.jpg"
                alt="Conteúdo bloqueado"
                loading="eager"
              />
              
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="flex justify-center mb-6">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                
                <div className="flex justify-center space-x-8 text-white">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm">159</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span className="text-sm">364.6K</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-sm">21.7K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medias Content */}
        {activeTab === 'medias' && (
          <div className="content-transition">
            <div className="flex justify-between items-center mb-4">
              <h6 className="text-lg font-bold text-gray-800">Galeria de Mídias</h6>
            </div>

            <MediaGrid />

            <div className="text-center">
              <button onClick={() => handlePayment(9.90, '1 Mês')} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all">
                🔒 Desbloquear todas as mídias
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Pagamento */}
      <ModalPagamento 
        aberto={modalAberto} 
        fechar={fecharModal}
        valor={currentValue}
        plano={currentPlan}
      />
      
      {/* Facebook Pixel - Script externo para evitar erro appendChild */}
      {pixelId && pixelId !== 'SEU_PIXEL_ID_AQUI' && (
        <>
          <Script 
            src="https://connect.facebook.net/en_US/fbevents.js"
            strategy="afterInteractive"
            onError={(e) => {
              console.info('ℹ️ Facebook Pixel bloqueado por AdBlock');
            }}
          />
          <Script 
            id="fb-pixel-init" 
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof fbq === 'undefined') {
                  window.fbq = function() {};
                  window.fbq.queue = [];
                }
                try {
                  fbq('init', '${pixelId}');
                  fbq('track', 'PageView');
                } catch(e) {
                  console.info('FB Pixel bloqueado');
                }
              `
            }}
          />
        </>
      )}

      {/* Scripts do projeto */}
      <Script src="/js/database.js" strategy="afterInteractive" />
      <Script src="/js/lead-tracking.js" strategy="afterInteractive" />
      <Script src="/js/pushinpay-real.js" strategy="afterInteractive" />
    </>
  );
}

