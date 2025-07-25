import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '63.178.242.103',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
