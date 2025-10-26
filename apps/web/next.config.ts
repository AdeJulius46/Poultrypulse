/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optional: also ignore TypeScript errors if needed
    // ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
