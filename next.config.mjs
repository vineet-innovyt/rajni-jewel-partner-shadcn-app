/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "cof0storage0dev.blob.core.windows.net",
      "ezzy0commerce0prod.blob.core.windows.net",
    ],
  },
};

export default nextConfig;
