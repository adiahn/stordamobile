const appJson = require('./app.json');

module.exports = {
  ...appJson.expo,
  // Performance optimizations
  jsEngine: 'hermes', // Keep this globally if needed, but remove from individual platform sections
  // Memory optimization for Expo
  extra: {
    eas: {
      projectId: 'storda',
    },
    performanceMode: 'auto', // 'auto', 'low', 'high'
  },
  // Web optimization
  web: {
    bundler: 'metro',
    output: 'static',
  },
  // Optimize build
  updates: {
    fallbackToCacheTimeout: 0,
    checkAutomatically: 'ON_LOAD',
  },
  assetBundlePatterns: ['**/*'],
  orientation: 'portrait',
  // Enable minification
  packagerOpts: {
    minify: true,
    sourceExts: ['js', 'jsx', 'ts', 'tsx'],
  },
};
