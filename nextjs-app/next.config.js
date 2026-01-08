/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Allow reading from parent directory
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },

  // Image optimization
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
