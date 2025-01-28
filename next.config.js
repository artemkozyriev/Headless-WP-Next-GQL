/** @type {import('next').NextConfig} */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `https://api.createsend.com/api/v3.2/subscribers/${process.env.NEXT_PUBLIC_AUDIENCE_ID}.json`, // Replace with the correct API endpoint
      },
    ];
  },
  reactStrictMode: true,
  staticPageGenerationTimeout: 100000,
  // trailingSlash: true,
  skipTrailingSlashRedirect: true,
  env: {
    WP_API_URL: process.env.WP_API_URL,
    CAMPAIGN_MONITOR_API_KEY: process.env.CAMPAIGN_MONITOR_API_KEY,
    ASSEMBLY_URL: process.env.ASSEMBLY_URL,
    GTM_ID: process.env.GTM_ID,
  },
  experimental: {
    scrollRestoration: true,
    // nextScriptWorkers: true,
    // workerThreads: true,
    // cpus: 1
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'macleans.wpengine.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'qc125.com',
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'oncampus.macleans.ca',
      },
      {
        hostname: 'staging-cms.macleans.ca',
        protocol: 'https'
      },
      {
        hostname: 'rogers-newsandbus.akamaized.net',
        protocol: 'https'
      },
      {
        hostname: 'cms.macleans.ca',
        protocol: 'https'
      },
      {
        hostname: 'macleans.ca',
        protocol: 'https'
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/category/:slug*',
        destination: '/:slug*',
        permanent: false,
      },
    ]
  },
  // async rewrites() {
  //   return [
  //     // Rewrite rule to remove the category base
  //     {
  //       source: '/category/:slug*',
  //       destination: '/:slug*',
  //     },
  //   ];
  // },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack configuration goes here

    // Modify the config object as needed
    config.module.generator.asset.publicPath = "/_next/";

    // Add MiniCssExtractPlugin to the plugins array
    // config.plugins.push(
    //   new MiniCssExtractPlugin({
    //     experimentalUseImportModule: false
    //   })
    // );

    config.module.rules.push({
        test: /\.svg$/,
        issuer: /\.js$/,
        use: ["@svgr/webpack"]
    });
    
    // allows loading of SVGs in CSS
    config.module.rules.push({
        test: /\.svg$/,
        issuer: /\.css$/,
        type: 'asset'
    });

    return config;
  }
}

module.exports = nextConfig
