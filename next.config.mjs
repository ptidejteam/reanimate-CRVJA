/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
  
    webpack: (config) => {
      config.optimization.minimize = false;
  
      return config;
    },
  };
  
  export default nextConfig;