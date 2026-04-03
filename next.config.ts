import type { NextConfig } from "next";

const isStandalone = process.env.NEXT_STANDALONE === "true";

const nextConfig: NextConfig = {
  ...(isStandalone ? { output: "standalone" } : {}),
  images: {
    unoptimized: true, // Next.js 이미지 최적화 기능 비활성화 (전체 허용)
  },
};

export default nextConfig;
