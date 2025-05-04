module.exports = {
  ci: {
    collect: {
      // Configure the URLs to test
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/collections',
        'http://localhost:3000/product/premium-fedora',
        'http://localhost:3000/cart',
        'http://localhost:3000/wishlist',
      ],
      // Set number of samples per page for more stable results
      numberOfRuns: 3,
      // Use desktop configuration for testing
      settings: {
        preset: 'desktop',
        // Throttling settings to simulate real-world conditions
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        throttling: {
          cpuSlowdownMultiplier: 2,
          downloadThroughputKbps: 5000,
          uploadThroughputKbps: 1500,
          rttMs: 40,
        },
      },
    },
    upload: {
      // Upload reports to temporary storage
      target: 'temporary-public-storage',
    },
    assert: {
      // Define performance budgets and thresholds
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'max-potential-fid': ['warn', { maxNumericValue: 130 }],
        'interactive': ['warn', { maxNumericValue: 3500 }],
        'server-response-time': ['warn', { maxNumericValue: 400 }],
        'modern-image-formats': 'off',
        'uses-responsive-images': 'off',
        'unused-javascript': ['warn', { maxLength: 1 }],
        'uses-rel-preconnect': 'off',
        'uses-text-compression': 'error',
      },
    },
  },
}; 