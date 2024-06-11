
/** @type {import('next').NextConfig} */


const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    unoptimized: true,
    // domains: ["resources.nonimos.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "resources.nonimos.com",
    //   },
    // ],
  },
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@mui/lab",
      "date-fns",
    ],
    esmExternals: "loose", // for filerobot-image-editor
  },
  webpack: (config) => {
    // for filerobot-image-editor
    // ref: https://github.com/scaleflex/filerobot-image-editor/issues/390
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config ;
  },

};


const withNextIntl = require("next-intl/plugin")();

module.exports = withBundleAnalyzer(
  withNextIntl(nextConfig),
);
