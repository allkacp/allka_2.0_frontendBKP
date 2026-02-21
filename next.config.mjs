/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint config removido (não suportado em Next.js 13+)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
