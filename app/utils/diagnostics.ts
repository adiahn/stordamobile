/**
 * Storda App Diagnostics
 * 
 * This utility helps identify and report performance issues, memory leaks, 
 * and UI problems in the application. It can be run in development mode
 * to generate reports on potential issues.
 */
import { InteractionManager, Platform, Dimensions, PixelRatio } from 'react-native';
import { PerformanceConfig, isLowEndDevice } from './performance';
import { isSecureEnvironment, logSecurityEvent } from './security';

// Track component renders to identify excessive re-rendering
const renderCounts: Record<string, number> = {};

/**
 * Track component renders
 */
export const trackRender = (componentName: string): number => {
  if (!__DEV__) return 0;
  
  renderCounts[componentName] = (renderCounts[componentName] || 0) + 1;
  if (renderCounts[componentName] > 50) {
    console.warn(`[PERF WARNING] Component ${componentName} has rendered ${renderCounts[componentName]} times. Possible performance issue.`);
  }
  
  return renderCounts[componentName];
};

/**
 * Reset render counts for all or a specific component
 */
export const resetRenderCount = (componentName?: string): void => {
  if (componentName) {
    renderCounts[componentName] = 0;
  } else {
    for (const key in renderCounts) {
      renderCounts[key] = 0;
    }
  }
};

/**
 * Track memory usage and leaks
 */
interface MemoryStats {
  timestamp: number;
  jsHeapSizeLimit?: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
  availableMemory?: number;
}

const memorySnapshots: MemoryStats[] = [];

/**
 * Take a memory snapshot
 */
export const takeMemorySnapshot = async (): Promise<MemoryStats | null> => {
  if (!__DEV__) return null;
  
  try {
    // This is not a perfect measure of memory usage, but it's a starting point
    const memoryStats: MemoryStats = {
      timestamp: Date.now(),
    };
    
    // On browser/dev environment, attempt to get heap stats
    if (typeof window !== 'undefined' && (window as any).performance) {
      const webMemory = (window as any).performance.memory;
      if (webMemory) {
        memoryStats.jsHeapSizeLimit = webMemory.jsHeapSizeLimit;
        memoryStats.totalJSHeapSize = webMemory.totalJSHeapSize;
        memoryStats.usedJSHeapSize = webMemory.usedJSHeapSize;
      }
    }
    
    memorySnapshots.push(memoryStats);
    
    // Check for memory growth (possible leak)
    if (memorySnapshots.length >= 10) {
      const earlierSnapshot = memorySnapshots[memorySnapshots.length - 10];
      const latestSnapshot = memorySnapshots[memorySnapshots.length - 1];
      
      if (earlierSnapshot.usedJSHeapSize && latestSnapshot.usedJSHeapSize) {
        const percentGrowth = (latestSnapshot.usedJSHeapSize - earlierSnapshot.usedJSHeapSize) / 
                              earlierSnapshot.usedJSHeapSize * 100;
        
        if (percentGrowth > 20) {
          console.warn(`[MEMORY WARNING] Memory usage increased by ${percentGrowth.toFixed(2)}% over the last 10 snapshots.`);
        }
      }
    }
    
    return memoryStats;
  } catch (error) {
    console.error('Error taking memory snapshot:', error);
    return null;
  }
};

/**
 * Clear memory snapshots
 */
export const clearMemorySnapshots = (): void => {
  memorySnapshots.length = 0;
};

/**
 * Track UI responsiveness
 */
const uiLagEvents: { timestamp: number; duration: number }[] = [];

/**
 * Track UI lag events
 */
export const trackUIResponsiveness = (callback?: (avgLag: number) => void): () => void => {
  if (!__DEV__) return () => {};
  
  let lastFrameTimestamp = Date.now();
  
  const interval = setInterval(() => {
    const now = Date.now();
    const frameDuration = now - lastFrameTimestamp;
    lastFrameTimestamp = now;
    
    // Consider anything over 32ms (30 fps) as potential lag
    if (frameDuration > 32) {
      uiLagEvents.push({
        timestamp: now,
        duration: frameDuration
      });
      
      console.debug(`[UI LAG] Frame took ${frameDuration}ms to render`);
    }
    
    // Calculate average UI lag
    if (uiLagEvents.length > 0 && callback) {
      const recentEvents = uiLagEvents.slice(-10);
      const avgLag = recentEvents.reduce((sum, event) => sum + event.duration, 0) / recentEvents.length;
      callback(avgLag);
    }
  }, 1000);
  
  return () => clearInterval(interval);
};

/**
 * Run a comprehensive app health check
 */
export const runAppHealthCheck = async (): Promise<{
  device: {
    platform: string;
    os: string | number;
    screenDimensions: { width: number; height: number };
    pixelRatio: number;
    isLowEndDevice: boolean;
  };
  performance: {
    renderCounts: Record<string, number>;
    excessiveRenderComponents: string[];
    uiLagEvents: number;
    averageLagDuration: number;
  };
  memory: {
    currentMemoryUsage: MemoryStats | null;
    memoryGrowthRate: number | null;
    possibleMemoryLeak: boolean;
  };
  security: {
    secureEnvironment: boolean;
  };
  recommendations: string[];
}> => {
  if (!__DEV__) {
    console.warn('App health check should only be run in development mode');
  }
  
  // Take a memory snapshot
  const memorySnapshot = await takeMemorySnapshot();
  
  // Calculate memory growth rate if we have enough snapshots
  let memoryGrowthRate = null;
  let possibleMemoryLeak = false;
  
  if (memorySnapshots.length >= 5) {
    const firstSnapshot = memorySnapshots[memorySnapshots.length - 5];
    const latestSnapshot = memorySnapshots[memorySnapshots.length - 1];
    
    if (firstSnapshot.usedJSHeapSize && latestSnapshot.usedJSHeapSize) {
      const growth = latestSnapshot.usedJSHeapSize - firstSnapshot.usedJSHeapSize;
      const timeElapsed = latestSnapshot.timestamp - firstSnapshot.timestamp;
      
      memoryGrowthRate = (growth / firstSnapshot.usedJSHeapSize) / (timeElapsed / 1000);
      possibleMemoryLeak = memoryGrowthRate > 0.01; // More than 1% per second
    }
  }
  
  // Identify components with excessive renders
  const excessiveRenderComponents = Object.entries(renderCounts)
    .filter(([_, count]) => count > 20)
    .map(([component]) => component);
  
  // Calculate average UI lag
  const recentLagEvents = uiLagEvents.slice(-20);
  const averageLagDuration = recentLagEvents.length > 0
    ? recentLagEvents.reduce((sum, event) => sum + event.duration, 0) / recentLagEvents.length
    : 0;
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (excessiveRenderComponents.length > 0) {
    recommendations.push(`Optimize renders for components: ${excessiveRenderComponents.join(', ')}`);
  }
  
  if (averageLagDuration > 50) {
    recommendations.push('UI has significant lag. Consider optimizing animations and heavy processing.');
  }
  
  if (possibleMemoryLeak) {
    recommendations.push('Possible memory leak detected. Check for unmounted component updates or uncleared intervals.');
  }
  
  if (isLowEndDevice() && !PerformanceConfig.flatListConfig.removeClippedSubviews) {
    recommendations.push('Enable removeClippedSubviews for FlatLists on low-end devices.');
  }
  
  // Log the check
  if (isSecureEnvironment()) {
    logSecurityEvent('suspicious_activity', { type: 'app_health_check' });
  }
  
  return {
    device: {
      platform: Platform.OS,
      os: Platform.Version,
      screenDimensions: Dimensions.get('window'),
      pixelRatio: PixelRatio.get(),
      isLowEndDevice: isLowEndDevice(),
    },
    performance: {
      renderCounts,
      excessiveRenderComponents,
      uiLagEvents: uiLagEvents.length,
      averageLagDuration,
    },
    memory: {
      currentMemoryUsage: memorySnapshot,
      memoryGrowthRate,
      possibleMemoryLeak,
    },
    security: {
      secureEnvironment: isSecureEnvironment(),
    },
    recommendations,
  };
};

/**
 * Schedule a task with proper performance considerations
 */
export const scheduleTask = <T>(
  task: () => T | Promise<T>,
  priority: 'immediate' | 'high' | 'normal' | 'low' = 'normal'
): Promise<T> => {
  switch (priority) {
    case 'immediate':
      return Promise.resolve(task());
      
    case 'high':
      return new Promise((resolve) => {
        // High priority runs as soon as possible, but still async
        setTimeout(() => resolve(task()), 0);
      });
      
    case 'normal':
      return new Promise((resolve) => {
        // Normal priority waits for any ongoing interactions
        InteractionManager.runAfterInteractions(() => {
          resolve(task());
        });
      });
      
    case 'low':
      return new Promise((resolve) => {
        // Low priority runs after a delay and after interactions
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => resolve(task()), 300);
        });
      });
      
    default:
      return Promise.resolve(task());
  }
}; 