import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Prevenir flash de conteúdo não estilizado
    if (typeof window !== 'undefined') {
      document.documentElement.style.visibility = 'visible';
    }
  }, []);

  return <Component {...pageProps} />
}

export default MyApp

