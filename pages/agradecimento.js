import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Agradecimento() {
  const router = useRouter();
  const [pixelId, setPixelId] = useState('');

  useEffect(() => {
    setPixelId(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'SEU_PIXEL_ID_AQUI');
  }, []);

  return (
    <>
      <Head>
        <title>Pagamento Confirmado - Maria Fernanda</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      <style jsx global>{`
        body { font-family: "Inter", sans-serif; }
        .gradient-bg {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff1744 100%);
        }
        .pulse-animation {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .success-checkmark {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: block;
            stroke-width: 2;
            stroke: #4ade80;
            stroke-miterlimit: 10;
            margin: 0 auto;
            box-shadow: inset 0px 0px 0px #4ade80;
            animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
        }
        .success-checkmark circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke-miterlimit: 10;
            stroke: #4ade80;
            fill: none;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .success-checkmark path {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
            100% { stroke-dashoffset: 0; }
        }
        @keyframes scale {
            0%, 100% { transform: none; }
            50% { transform: scale3d(1.1, 1.1, 1); }
        }
        @keyframes fill {
            100% { box-shadow: inset 0px 0px 0px 30px #4ade80; }
        }
      `}</style>

      <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
          {/* Header de Sucesso */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
            <div className="success-checkmark">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="38" fill="none"/>
                <path d="M20 40l12 12 28-28" fill="none"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mt-4 mb-2">Pagamento Confirmado!</h1>
            <p className="text-green-100">Obrigado por assinar o conteúdo da Maria Fernanda</p>
          </div>
          
          {/* Conteúdo Principal */}
          <div className="p-8">
            {/* Detalhes do Pagamento */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4 text-center">Detalhes da Compra</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Produto:</span>
                  <span className="font-semibold">Acesso Vitalício</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-semibold text-green-600">R$ 19,90</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">✓ Pago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID da Transação:</span>
                  <span className="font-mono text-xs text-gray-500" id="transactionId">-</span>
                </div>
              </div>
            </div>
            
            {/* Formulário de Conteúdos */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                🎁 Receba seus conteúdos
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Preencha seus dados abaixo para receber o acesso ao conteúdo exclusivo
              </p>
              
              <form id="deliveryForm" className="space-y-4">
                {/* Nome */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input 
                    type="text" 
                    id="nome" 
                    name="nome"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
                
                {/* Telefone */}
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input 
                    type="tel" 
                    id="telefone" 
                    name="telefone"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                {/* Botão de Envio */}
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 pulse-animation"
                >
                  🚀 Receber Meus Conteúdos
                </button>
              </form>
            </div>
            
            {/* O que você receberá */}
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-orange-800 mb-3 text-center">O que você receberá:</h4>
              <ul className="space-y-2 text-sm text-orange-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Acesso completo ao conteúdo exclusivo
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Chat privado com Maria Fernanda
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Novos conteúdos em primeira mão
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Suporte prioritário
                </li>
              </ul>
            </div>
            
            {/* Status de Envio */}
            <div id="deliveryStatus" className="hidden text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="font-semibold">Dados enviados com sucesso!</span>
                </div>
                <p className="text-sm mt-1">Você receberá os conteúdos em até 5 minutos</p>
              </div>
            </div>
            
            {/* Indicação WhatsApp */}
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">💬</div>
                  <h4 className="font-bold text-green-800 mb-1">Precisa de ajuda?</h4>
                  <p className="text-sm text-green-700">
                    Ou para receber mais fácil, me chame no WhatsApp!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => router.push('/')} 
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Voltar ao Site
              </button>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const transactionId = new URLSearchParams(window.location.search).get('id') || 'N/A';
                    const mensagem = `Olá! Acabei de fazer o pagamento e gostaria de receber meus conteúdos.\\n\\nID da Transação: ${transactionId}`;
                    window.open(`https://wa.me/5547997118690?text=${encodeURIComponent(mensagem)}`, '_blank');
                  }
                }}
                className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-bold"
              >
                💬 Falar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Facebook Pixel */}
      {pixelId && pixelId !== 'SEU_PIXEL_ID_AQUI' && (
        <Script 
          id="fb-pixel-agradecimento" 
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Scripts do Formulário */}
      <Script src="/js/database.js" strategy="afterInteractive" />
      <Script src="/js/lead-tracking.js" strategy="afterInteractive" />
      
      <Script id="agradecimento-logic" strategy="afterInteractive">
        {`
          // Obter dados da URL
          const urlParams = new URLSearchParams(window.location.search);
          const transactionId = urlParams.get('id') || 'N/A';
          const valor = urlParams.get('valor') || '19,90';
          const status = urlParams.get('status') || 'paid';
          
          // Evento Facebook Pixel - Purchase
          if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
              value: 19.90,
              currency: 'BRL',
              content_name: 'Curso Privacy',
              content_category: 'Digital Product',
              transaction_id: transactionId
            });
          }
          
          // Exibir ID da transação
          if (document.getElementById('transactionId')) {
            document.getElementById('transactionId').textContent = transactionId;
          }
          
          // Máscara para telefone
          const telefoneInput = document.getElementById('telefone');
          if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
              let value = e.target.value.replace(/\\D/g, '');
              if (value.length >= 11) {
                value = value.replace(/(\\d{2})(\\d{5})(\\d{4})/, '($1) $2-$3');
              } else if (value.length >= 7) {
                value = value.replace(/(\\d{2})(\\d{4})(\\d{0,4})/, '($1) $2-$3');
              } else if (value.length >= 3) {
                value = value.replace(/(\\d{2})(\\d{0,5})/, '($1) $2');
              }
              e.target.value = value;
            });
          }
          
          // Envio do formulário
          const form = document.getElementById('deliveryForm');
          if (form) {
            form.addEventListener('submit', async function(e) {
              e.preventDefault();
              
              const formData = new FormData(this);
              
              // Pegar dados da transação temporária
              const transacaoTemp = JSON.parse(localStorage.getItem('transacao_temp') || '{}');
              
              // Pegar dados de rastreamento
              const trackingData = typeof LeadTracking !== 'undefined' 
                ? LeadTracking.getDadosRastreamento() 
                : JSON.parse(localStorage.getItem('lead_tracking') || '{}');
              
              // Combinar dados
              const dados = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                telefone: formData.get('telefone'),
                transactionId: transactionId || transacaoTemp.transactionId,
                valor: parseFloat((valor || transacaoTemp.valor || '19.90').replace(',', '.')),
                plano: transacaoTemp.plano || '1 mês',
                status: transacaoTemp.status || status || 'paid',
                origem: trackingData.origem || transacaoTemp.origem || 'site',
                source: trackingData.source || 'direct',
                medium: trackingData.medium || 'none',
                campaign: trackingData.campaign || 'organic',
                tags: ['convertido', 'pago', 'formulario_preenchido'],
                timestamp: new Date().toISOString()
              };
              
              console.log('📧 Enviando dados completos do cliente:', dados);
              
              try {
                const button = this.querySelector('button[type="submit"]');
                const originalText = button.innerHTML;
                button.innerHTML = '⏳ Enviando...';
                button.disabled = true;
                
                // Simular delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Salvar no Database
                if (typeof Database !== 'undefined') {
                  const clienteSalvo = Database.adicionarCliente(dados);
                  console.log('✅ Cliente salvo:', clienteSalvo);
                  
                  if (typeof LeadTracking !== 'undefined') {
                    LeadTracking.rastrearConversao('formulario_agradecimento_completo');
                  }
                  
                  localStorage.removeItem('transacao_temp');
                } else {
                  const entregaveis = JSON.parse(localStorage.getItem('entregaveis') || '[]');
                  entregaveis.push(dados);
                  localStorage.setItem('entregaveis', JSON.stringify(entregaveis));
                }
                
                // Enviar notificação WhatsApp
                const dataHora = new Date().toLocaleString('pt-BR');
                const mensagem = \`🚨 NOVA VENDA CONFIRMADA! 🚨

📅 Data/Hora: \${dataHora}
💰 Valor: R$ \${dados.valor}
🆔 ID Transação: \${dados.transactionId}

👤 DADOS DO CLIENTE:
• Nome: \${dados.nome}
• Email: \${dados.email}
• WhatsApp: \${dados.telefone}

✅ Status: Pago
📦 Produto: Acesso Vitalício

⚠️ AÇÃO NECESSÁRIA: Enviar conteúdos para o cliente!\`;

                const whatsappUrl = \`https://wa.me/5547997118690?text=\${encodeURIComponent(mensagem)}\`;
                window.open(whatsappUrl, '_blank');
                
                // Mostrar sucesso
                document.getElementById('deliveryForm').classList.add('hidden');
                document.getElementById('deliveryStatus').classList.remove('hidden');
                
                // Abrir Drive
                const DRIVE_DEEPLINK = 'https://drive.google.com/SEU_LINK_AQUI';
                setTimeout(() => {
                  window.open(DRIVE_DEEPLINK, '_blank');
                }, 1000);
                
              } catch (error) {
                console.error('❌ Erro:', error);
                alert('Erro ao enviar dados. Tente novamente.');
                button.innerHTML = originalText;
                button.disabled = false;
              }
            });
          }
          
          // Animação de entrada
          document.addEventListener('DOMContentLoaded', function() {
            const card = document.querySelector('.bg-white');
            if (card) {
              card.style.opacity = '0';
              card.style.transform = 'translateY(50px)';
              
              setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 100);
            }
          });
        `}
      </Script>
    </>
  );
}
