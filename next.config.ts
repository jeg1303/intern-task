import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.cloudinary.com" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://api.razorpay.com",
              "frame-src 'self' https://internhub.zapier.app https://checkout.razorpay.com https://api.razorpay.com",
              "connect-src 'self' https://internhub.zapier.app https://api.razorpay.com wss: ws:",
              "img-src 'self' data: blob: https://*.cloudinary.com https://res.cloudinary.com",
              "media-src 'self' blob: data: https://*.cloudinary.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
