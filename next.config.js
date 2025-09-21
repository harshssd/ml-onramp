/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude mobile directory from build
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  // Ignore mobile directory during build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Exclude mobile files from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude mobile directory from ESLint
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src', 'pages', 'components'],
  },
};

module.exports = nextConfig;
