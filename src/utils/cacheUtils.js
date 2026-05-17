/**
 * Teaching Torch Cache Utilities
 * A simple localStorage wrapper with TTL (Time To Live) support.
 */

const CACHE_PREFIX = 'tt_cache:';
const DEFAULT_TTL = 3600000; // 1 hour

const isDev = process.env.NODE_ENV === 'development';

/**
 * Save data to local storage with a timestamp
 */
export const setCache = (key, data, ttl = DEFAULT_TTL) => {
  try {
    const cacheData = {
      data,
      expiresAt: Date.now() + ttl
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('[Cache] Storage quota exceeded, clearing old entries...');
      clearExpiredCache(); // Try to free up space
    } else {
      console.error('Cache set error:', error);
    }
  }
};

/**
 * Retrieve data from local storage if it hasn't expired
 */
export const getCached = (key) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const { data, expiresAt } = JSON.parse(raw);
    
    if (Date.now() > expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    if (isDev) console.log(`%c[Cache] HIT: ${key}`, 'color: #00ff00; font-weight: bold;');
    return data;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

/**
 * Remove a specific item from cache
 */
export const invalidateCache = (key) => {
  localStorage.removeItem(CACHE_PREFIX + key);
  if (isDev) console.log(`%c[Cache] INVALIDATED: ${key}`, 'color: #ff0000; font-weight: bold;');
};

/**
 * Clear all expired Teaching Torch specific cache
 */
export const clearExpiredCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      try {
        const { expiresAt } = JSON.parse(localStorage.getItem(key));
        if (Date.now() > expiresAt) localStorage.removeItem(key);
      } catch (e) {
        localStorage.removeItem(key); // Remove malformed
      }
    }
  });
};

/**
 * Clear all Teaching Torch specific cache
 */
export const clearAllCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
  if (isDev) console.log('[Cache] ALL CLEARED');
};
