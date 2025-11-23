/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {},
  serverExternalPackages: ['firebase-admin'],
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  }
};

export default nextConfig;
