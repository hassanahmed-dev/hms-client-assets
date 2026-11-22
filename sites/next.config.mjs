/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Stock photos are fetched by Vercel once, compressed and served from this site's own domain,
    // so visitors never have to reach images.unsplash.com themselves.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    deviceSizes: [160, 600, 640, 700, 820, 900, 1200, 1400, 1600],
    imageSizes: [40],
    qualities: [30, 60],
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
  },
};
export default nextConfig;
