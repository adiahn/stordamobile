import { Platform, InteractionManager } from 'react-native';

/**
 * Performance utility functions
 * 
 * This file contains utility functions for performance optimization and monitoring
 */

/**
 * Run a heavy task after interactions and animations are complete
 * to avoid janky UI during navigation or animations
 */
export const runAfterInteractions = (task: () => any): Promise<void> => {
  return new Promise<void>((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      const result = task();
      resolve(result);
    });
  });
};

/**
 * Debounce a function to prevent excessive calls
 * Useful for search inputs, scroll handlers, etc.
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle a function to limit the rate at which it executes
 * Useful for scroll events, resize handlers, etc.
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Measure execution time of a function
 * Useful for performance testing and debugging
 */
export const measurePerformance = <T extends (...args: any[]) => any>(
  func: T,
  label: string
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    const start = Date.now();
    const result = func(...args);
    const end = Date.now();
    
    console.log(`[PERFORMANCE] ${label}: ${end - start}ms`);
    
    return result;
  };
};

/**
 * Memoize a function to cache results based on input arguments
 * Useful for expensive calculations that are called with the same inputs multiple times
 */
export const memoize = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  const cache = new Map();
  
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    return result;
  };
};

/**
 * Check if running on a low-end device to conditionally disable certain features
 * This is a simple heuristic and might need adjustment based on actual device testing
 */
export const isLowEndDevice = (): boolean => {
  // Simple heuristic based on platform and available memory
  // This should be refined based on actual device testing
  if (Platform.OS === 'android') {
    // On Android, Platform.Version is a number representing the API level
    return (Platform.Version as number) < 24; // Android 7.0 (API level 24)
  } else if (Platform.OS === 'ios') {
    // On iOS, Platform.Version is a string like "10.3"
    const version = parseFloat(String(Platform.Version));
    return version < 13; // iOS 13
  }
  
  return false;
};

/**
 * Performance configuration object to control various optimizations
 * throughout the app
 */
export const PerformanceConfig = {
  // Animation durations - reduce on low-end devices
  animationDuration: isLowEndDevice() ? 150 : 300,
  
  // Control whether to use expensive blur effects
  useBlurEffects: !isLowEndDevice(),
  
  // Control FlatList optimization settings
  flatListConfig: {
    initialNumToRender: isLowEndDevice() ? 5 : 8,
    maxToRenderPerBatch: isLowEndDevice() ? 5 : 10,
    windowSize: isLowEndDevice() ? 5 : 7,
    updateCellsBatchingPeriod: isLowEndDevice() ? 50 : 10,
    removeClippedSubviews: Platform.OS === 'android' || isLowEndDevice(),
  },
}; 