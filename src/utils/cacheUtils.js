/**
 * Teaching Torch Cache Utilities
 * A simple localStorage wrapper with TTL (Time To Live) support.
 */

const CACHE_PREFIX = 'tt_cache:';
const DEFAULT_TTL = 3600000; // 1 hour

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
    console.error('Cache set error:', error);
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

    console.log(`%c[Cache] HIT: ${key}`, 'color: #00ff00; font-weight: bold;');
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
  console.log(`%c[Cache] INVALIDATED: ${key}`, 'color: #ff0000; font-weight: bold;');
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
  console.log('[Cache] ALL CLEARED');
};
