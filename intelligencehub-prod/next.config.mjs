/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.microsoftonline.com' },
      { protocol: 'https', hostname: '**.microsoft.com' },
    ],
  },
}

export default nextConfig
