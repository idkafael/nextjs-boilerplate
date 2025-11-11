import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Adicionar classe 'loaded' após montagem para evitar flash de conteúdo não estilizado
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('loaded')
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp

