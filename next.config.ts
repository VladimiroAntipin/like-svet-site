import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
  remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: "https",
        hostname: "like-svet-admin.vercel.app",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ]
  }
};

export default nextConfig;
