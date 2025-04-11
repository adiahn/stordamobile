// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const os = require('os');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Calculate optimal number of workers based on system resources
// but don't go over 8 to avoid diminishing returns
const numCPUs = os.cpus().length;
const optimalWorkers = Math.max(2, Math.min(numCPUs - 1, 8));

// Performance optimizations
config.maxWorkers = optimalWorkers;
config.transformer.minifierConfig = {
  compress: {
    // Disable function inlining to preserve stack traces
    reduce_funcs: false,
    // Additional optimizations
    drop_console: process.env.NODE_ENV === 'production',
    drop_debugger: process.env.NODE_ENV === 'production',
    pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.debug', 'console.info'] : [],
  },
};

// Enable caching for faster rebuilds
config.cacheStores = [
  config.cacheStores[0],
  config.cacheStores[1],
  // Add file system cache with larger size
  {
    get: config.cacheStores[0].get,
    set: config.cacheStores[0].set,
    clear: config.cacheStores[0].clear,
    type: 'fileStore',
  },
];

// Speed up bundle startup by increasing the RAM size for bundle processing
config.maxRAMPercentage = 0.7; // Use up to 70% of available RAM

// Optimize file watching
config.watchFolders = [__dirname];
config.resolver.nodeModulesPaths = [
  // Add node_modules to search paths
  `${__dirname}/node_modules`,
];

// Optimize asset loading
config.transformer.assetPlugins = [
  ...(config.transformer.assetPlugins || []),
];

// Enable the experimental bundler - may need to be toggled based on stability
// config.transformer.experimentalImportSupport = true;

module.exports = config;