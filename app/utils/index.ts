/**
 * Storda Utilities
 * 
 * This file exports all utility functions from various modules in one place
 * to simplify imports throughout the application.
 */

// Performance utilities
export {
  runAfterInteractions,
  debounce,
  throttle,
  measurePerformance,
  memoize,
  isLowEndDevice,
  PerformanceConfig
} from './performance';

// Security utilities
export {
  validateInput,
  sanitizeInput,
  ValidationPatterns,
  generateSecureDeviceId,
  secureStore,
  hashValue,
  Auth,
  TokenManager,
  isSecureEnvironment,
  logSecurityEvent,
  checkRateLimit
} from './security';

// Diagnostic utilities
export {
  trackRender,
  resetRenderCount,
  takeMemorySnapshot,
  clearMemorySnapshots,
  trackUIResponsiveness,
  runAppHealthCheck,
  scheduleTask
} from './diagnostics';

// Add other utility modules as they're created 