import Head from 'next/head';
import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Home() {
  const [pixelId, setPixelId] = useState('');
  
  useEffect(() => {
    // Pegar Pixel ID das variáveis de ambiente (público, mas seguro)
    setPixelId(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'SEU_PIXEL_ID_AQUI');
  }, []);

  return (
    <>
      <Head>
        <title>Privacy | Marcelly Mar🌊</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="/css/style.css" />
      </Head>

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
        .blurred {
          filter: blur(4px);
        }
        .media-blur {
          filter: blur(3px);
          transition: filter 0.3s ease;
        }
        .media-blur:hover {
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
        #paymentModal::-webkit-scrollbar {
          width: 6px;
        }
        #paymentModal::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        #paymentModal::-webkit-scrollbar-thumb {
          background: rgba(255,165,0,0.5);
          border-radius: 3px;
        }
        #paymentModal::-webkit-scrollbar-thumb:hover {
          background: rgba(255,165,0,0.7);
        }
        .subscription-gradient {
          background: linear-gradient(to right, #f69a53, #f6a261, #f9c59d, #f8b89b, #f7ab99);
        }
        .subscription-gradient:hover {
          background: linear-gradient(to right, #e88a43, #e69251, #e9b58d, #e8a88b, #e79b89);
        }
      `}</style>

      {/* TODO: Migrar todo o HTML do index.html original para cá */}
      {/* Por enquanto, vou usar um placeholder */}
      <div dangerouslySetInnerHTML={{ __html: `
        <!-- Conteúdo será migrado do index.html original -->
        <!-- Por enquanto, carrega o HTML original -->
      `}} />

      {/* Scripts do Next.js */}
      <Script src="/js/database.js" strategy="afterInteractive" />
      <Script src="/js/lead-tracking.js" strategy="afterInteractive" />
      <Script src="/js/facebook-pixel.js" strategy="afterInteractive" />
      
      {/* Facebook Pixel com variável de ambiente */}
      <Script id="fb-pixel" strategy="afterInteractive">
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
      <noscript>
        <img height="1" width="1" style={{display:'none'}}
             src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}

