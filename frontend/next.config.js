/** @type {import('next').NextConfig} */
const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "4000" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_ORIGIN}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;