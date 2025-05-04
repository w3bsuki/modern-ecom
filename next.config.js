/** @type {import('next').NextConfig} */
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

const CompressionPlugin = require('compression-webpack-plugin');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: false, // We register it manually in ClientInitScript
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
  typescript: {
    // !! WARN !!
    // Temporarily ignoring type errors to allow the build to complete
    // This should be removed once type issues are resolved
    ignoreBuildErrors: true,
  },
  // Enable server-side compression
  compress: true,
  // Configure HTTP response headers for better caching and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Enable experimental features that improve performance
  experimental: {
    // Optimize page loading
    optimizeCss: true,
    // Optimize for better performance on scroll
    scrollRestoration: true,
    // Updated to use the new property name
    serverExternalPackages: [],
    // Optimize runtime performance
    optimizeServerReact: true,
    // Enable optimized route prefetching
    optimisticClientCache: true,
  },
  // Add webpack configuration for further optimization
  webpack: (config, { dev, isServer }) => {
    // Only apply these optimizations in production
    if (!dev && !isServer) {
      // Enable compression for all assets
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );

      // Split chunks more efficiently with aggressive code-splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: Infinity, // Allow unlimited initial requests for better code-splitting
        maxAsyncRequests: Infinity, // Allow unlimited async requests
        minSize: 10000, // Reduced minimum size for creating a chunk
        maxSize: 250000, // Limit chunk size to 250KB for better caching
        cacheGroups: {
          // Framework and runtime
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next|@next)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 50,
            enforce: true, // Always create this chunk
          },
          
          // UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|@shadcn|class-variance-authority|clsx|tailwind-merge|lucide-react|@radix-ui)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 45,
          },
          
          // Animation and visual effects
          animations: {
            test: /[\\/]node_modules[\\/](framer-motion|embla-carousel|react-lazy-load-image-component)[\\/]/,
            name: 'animations',
            chunks: 'all',
            priority: 40,
          },
          
          // State management
          state: {
            test: /[\\/]node_modules[\\/](zustand)[\\/]/,
            name: 'state-management',
            chunks: 'all',
            priority: 35,
          },
          
          // Utilities
          utils: {
            test: /[\\/]node_modules[\\/](lodash|date-fns|next-themes|tw-animate-css|web-vitals)[\\/]/,
            name: 'utilities',
            chunks: 'all',
            priority: 30,
          },

          // Layout components (split by route/page)
          components: {
            test: /[\\/]components[\\/](layout|ui)[\\/]/,
            name: 'core-components',
            chunks: 'all',
            priority: 25,
          },
          
          // Common chunks used across multiple pages
          commons: {
            name: 'commons',
            minChunks: 2, // Minimum number of chunks that must share a module for it to be extracted
            priority: 20,
          },
          
          // Default vendor grouping for everything else from node_modules
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Safe handling of module.context
              if (!module.context) return 'vendors.unknown';
              
              // Get the name of the npm package
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              if (!match) return 'vendors.unknown';
              
              const packageName = match[1];
              // Group vendors by first letter to create smaller chunks
              const firstLetter = packageName.charAt(0);
              return `vendors.${firstLetter}`;
            },
            priority: 15,
          },
        },
      };
    }

    return config;
  },
};

module.exports = withPWA(withBundleAnalyzer(nextConfig)); 