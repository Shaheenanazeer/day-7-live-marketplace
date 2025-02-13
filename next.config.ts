  // /** @type {import('next').NextConfig} */
  // const nextConfig = {};

//  import type { NextConfig } from "next";

//  const nextConfig: NextConfig = {
//   images : {
//     domains : [`cdn.sanity.io`],
  //},
//   // images: {
//   //   unoptimized: true,
//   // },
//   // eslint: {
//   //   ignoreDuringBuilds: true, // Disable ESLint during builds
//   // },
//   // typescript: {
//   //   ignoreBuildErrors: true, // Ignore TypeScript errors during builds
//   // },
// };


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"], // Sanity images ke liye domain allow karein
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint warnings/errors during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during builds
  },
};

module.exports = nextConfig; // Next.js configuration export karein
