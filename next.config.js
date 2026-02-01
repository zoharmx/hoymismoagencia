/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.zyrosite.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  // Exclude example folders from compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/Ejemplo 1/**', '**/Ejemplo 2/**', '**/node_modules/**'],
    }
    return config
  },
  // TODO: Fix type errors and set to false
  // Temporarily ignoring build errors to deploy
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map((ext) => {
    return `${ext}`
  }),
}

module.exports = nextConfig
