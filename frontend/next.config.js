/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com', 'ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.tos-cn-beijing.volces.com',
        pathname: '/**',
      },
    ],
  },
  // 使用 API 路由代替 rewrites，避免代理问题
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://127.0.0.1:3001/api/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;


