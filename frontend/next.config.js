/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path((?!spouse-portrait$).*)',
        destination: 'http://localhost:5000/api/:path',
      },
    ];
  },
};

module.exports = nextConfig;


