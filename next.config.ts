import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "http",
        hostname: "work.phpwebsites.in",
      },
      {
        protocol: "https",
        hostname: "work.phpwebsites.in",
      },
    ],
  },
};

export default nextConfig;
