/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allows production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allows production builds to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;