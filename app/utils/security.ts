/**
 * Security utilities for Storda app
 * 
 * This file contains utilities for input validation, encryption, 
 * authorization checks, and other security-related functionality.
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

/**
 * Input validation patterns
 */
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[0-9]{10,15}$/,
  imei: /^[0-9]{15,17}$/,
  macAddress: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
  nin: /^[0-9]{11}$/,
  deviceId: /^STD-\d{6}$/i,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

/**
 * Validate input based on provided pattern
 */
export const validateInput = (input: string, pattern: RegExp): boolean => {
  return pattern.test(input);
};

/**
 * Sanitize input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/\\/g, '&#92;')
    .replace(/\//g, '&#47;');
};

/**
 * Generate a secure device ID
 */
export const generateSecureDeviceId = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(4);
  const hexString = Array.from(randomBytes)
    .map((byte: number) => byte.toString(16).padStart(2, '0'))
    .join('');
  
  return `STD-${hexString.toUpperCase()}`;
};

/**
 * Securely store sensitive data
 */
export const secureStore = {
  /**
   * Save data to secure storage
   */
  setItem: async (key: string, value: string): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        // Web fallback with encryption before storing
        const encryptedValue = await hashValue(value);
        await AsyncStorage.setItem(`secure_${key}`, encryptedValue);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
      return true;
    } catch (error) {
      console.error('Error storing secure data:', error);
      return false;
    }
  },
  
  /**
   * Retrieve data from secure storage
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(`secure_${key}`);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  },
  
  /**
   * Delete data from secure storage
   */
  deleteItem: async (key: string): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(`secure_${key}`);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
      return true;
    } catch (error) {
      console.error('Error deleting secure data:', error);
      return false;
    }
  }
};

/**
 * Hash a value using SHA-256
 */
export const hashValue = async (value: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    value
  );
};

/**
 * Authorization utilities
 */
export const Auth = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await secureStore.getItem('auth_token');
    return !!token;
  },
  
  /**
   * Get authorization headers for API requests
   */
  getAuthHeaders: async (): Promise<Record<string, string>> => {
    const token = await secureStore.getItem('auth_token');
    if (!token) return {};
    
    return {
      'Authorization': `Bearer ${token}`
    };
  },
  
  /**
   * Check if a user has permission for a specific action
   */
  hasPermission: async (permission: string): Promise<boolean> => {
    try {
      const permissions = await secureStore.getItem('user_permissions');
      if (!permissions) return false;
      
      const parsedPermissions = JSON.parse(permissions);
      return parsedPermissions.includes(permission);
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }
};

/**
 * Token management
 */
export const TokenManager = {
  /**
   * Store authentication tokens
   */
  setTokens: async (accessToken: string, refreshToken: string): Promise<boolean> => {
    try {
      await secureStore.setItem('auth_token', accessToken);
      await secureStore.setItem('refresh_token', refreshToken);
      
      // Store token expiry (typically 1 hour from now)
      const expiryTime = Date.now() + 60 * 60 * 1000;
      await AsyncStorage.setItem('token_expiry', expiryTime.toString());
      
      return true;
    } catch (error) {
      console.error('Error storing tokens:', error);
      return false;
    }
  },
  
  /**
   * Check if token is expired
   */
  isTokenExpired: async (): Promise<boolean> => {
    try {
      const expiryTimeStr = await AsyncStorage.getItem('token_expiry');
      if (!expiryTimeStr) return true;
      
      const expiryTime = parseInt(expiryTimeStr, 10);
      return Date.now() > expiryTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  },
  
  /**
   * Clear all authentication tokens
   */
  clearTokens: async (): Promise<boolean> => {
    try {
      await secureStore.deleteItem('auth_token');
      await secureStore.deleteItem('refresh_token');
      await AsyncStorage.removeItem('token_expiry');
      return true;
    } catch (error) {
      console.error('Error clearing tokens:', error);
      return false;
    }
  }
};

/**
 * Detect if running in secure environment 
 * (used to disable certain features in developer mode)
 */
export const isSecureEnvironment = (): boolean => {
  return !__DEV__ && Platform.OS !== 'web';
};

/**
 * Log security events
 * In production, these would be sent to a monitoring service
 */
export const logSecurityEvent = (
  eventType: 'login' | 'logout' | 'permission_denied' | 'invalid_token' | 'suspicious_activity',
  details: Record<string, any> = {}
): void => {
  if (isSecureEnvironment()) {
    // In production environment, send to monitoring service
    // For now, we just log to console
    console.info(`[SECURITY EVENT] ${eventType}`, details);
  }
};

/**
 * Rate limiter for sensitive operations
 */
const rateLimits: Record<string, { count: number, timestamp: number }> = {};

export const checkRateLimit = (
  operation: string,
  maxAttempts: number = 5,
  timeWindowMs: number = 60000
): boolean => {
  const now = Date.now();
  
  // Initialize or reset if window expired
  if (!rateLimits[operation] || now - rateLimits[operation].timestamp > timeWindowMs) {
    rateLimits[operation] = { count: 1, timestamp: now };
    return true;
  }
  
  // Increment counter
  rateLimits[operation].count += 1;
  
  // Check if limit exceeded
  if (rateLimits[operation].count > maxAttempts) {
    logSecurityEvent('suspicious_activity', { 
      operation, 
      attempts: rateLimits[operation].count,
      timeWindow: timeWindowMs
    });
    return false;
  }
  
  return true;
}; 