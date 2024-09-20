/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "qrzydisuveouqbcqvtak.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "https://fictional-winner-vjrx75595vrhp4r4-3000.app.github.dev",
      ],
    },
  },
};

module.exports = nextConfig;
