// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  images: {
    domains: ["gateway.nifty.ink", "metadata.nifty.ink", "niftyink.bgipfs.com", "scontent-iad4-1.choicecdn.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ipfs.niftyink.bgipfs.com",
      },
    ],
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/leaderboard",
        destination: "/leaderboard/artists",
      },
      {
        source: "/",
        destination: "/create",
      },
    ];
  },
};

module.exports = nextConfig;
