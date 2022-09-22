/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "jkhydvdsetfkjofgkvbm.supabase.co",
      "jkhydvdsetfkjofgkvbm.supabase.in",
      "localhost",
    ],
  },
};

module.exports = nextConfig;
