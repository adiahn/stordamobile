const appJson = require('./app.json');

module.exports = {
  ...appJson.expo,
  // Performance optimizations
  jsEngine: 'hermes',
  android: {
    ...appJson.expo.android,
    enableProguardInReleaseBuilds: true,
    enableSeparateBuildPerCPUArchitecture: true,
    hermes: {
      enableGlobalGC: true,
    },
  },
  ios: {
    ...appJson.expo.ios,
    enableInAppViewScaling: false, // Improves scrolling performance
    jsEngine: 'hermes',
  },
  // Memory optimization for Expo
  extra: {
    eas: {
      projectId: 'storda',
    },
    // Disabled animations on low-end devices
    performanceMode: 'auto', // 'auto', 'low', 'high'
  },
  // Web optimization
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  // Configure Hermes engine
  hooks: {
    postPublish: [
      {
        file: './app/utils/performance.js',
        config: {
          enablePerformanceTracking: process.env.NODE_ENV === 'production',
        },
      },
    ],
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