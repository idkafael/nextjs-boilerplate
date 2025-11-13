import { useRouter } from 'next/router';

function Error({ statusCode }) {
  const router = useRouter();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>
        {statusCode
          ? `Erro ${statusCode} no servidor`
          : 'Erro no cliente'}
      </h1>
      <p>
        {statusCode
          ? 'Ocorreu um erro ao processar sua requisição.'
          : 'Ocorreu um erro no navegador.'}
      </p>
      <button 
        onClick={() => router.push('/')}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#f97316', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Voltar para a página inicial
      </button>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;








