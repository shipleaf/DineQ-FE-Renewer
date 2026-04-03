import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  images: {
    unoptimized: true, // Next.js 이미지 최적화 기능 비활성화 (전체 허용)
  },
};

export default nextConfig;
