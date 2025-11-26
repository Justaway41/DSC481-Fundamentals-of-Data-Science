import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/content/:path*",
        destination: "/api/content/:path*",
      },
    ];
  },
};

export default nextConfig;
