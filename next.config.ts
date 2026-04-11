import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // এখানে ১ মেগাবাইট থেকে বাড়িয়ে ১০ মেগাবাইট করা হলো
    },
  },
};

export default nextConfig;
