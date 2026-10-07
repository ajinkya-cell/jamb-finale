import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Sanity Live revalidates cached reads on publish, so they can be kept indefinitely.
  cacheLife: { default: sanity },
  partialPrefetching: true,
  images: {
    // Sanity's image CDN does the resizing; see src/sanity/image-loader.ts.
    loader: "custom",
    loaderFile: "./src/sanity/image-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
