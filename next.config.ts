import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites() {
    return [{ source: "/pitch", destination: "/pitch.html" }];
  },
  turbopack: {
    rules: {
      // Keep CSS Modules on Next's native pipeline to preserve scoped exports.
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
