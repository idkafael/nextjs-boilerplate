import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            html {
              visibility: hidden;
            }
            html.loaded {
              visibility: visible;
            }
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script dangerouslySetInnerHTML={{
          __html: `
            document.documentElement.classList.add('loaded');
          `
        }} />
      </body>
    </Html>
  )
}

