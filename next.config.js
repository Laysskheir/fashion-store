/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Enable static optimization
  staticPageGenerationTimeout: 60,
  // Improve client-side navigation
  reactStrictMode: true,
  // Enable compression
  compress: true,
  // Optimize production builds
  swcMinify: true,
};

module.exports = nextConfig;
