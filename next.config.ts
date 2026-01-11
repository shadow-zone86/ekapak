import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.ekapak.ru',
      },
      {
        protocol: 'https',
        hostname: '**.ekapak.ru',
      },
      // Разрешаем все домены для изображений (если API возвращает разные домены)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
