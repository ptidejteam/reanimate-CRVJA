/** @type {import('next').NextConfig} */
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
  webpack: (config) => {
    config.optimization.minimize = false;

    return config;
  },
};

export default nextConfig;
