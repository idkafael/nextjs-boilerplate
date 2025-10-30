/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir servir arquivos estáticos da pasta public
  images: {
    domains: [],
  },
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

