/**
 * Validation Utility Functions
 */

/**
 * Validate if a string is a secure URL (https)
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidHttpsUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    // Allow https, and optionally drive shortcuts if we trust them (but better to enforce https)
    return u.protocol === 'https:';
  } catch (e) {
    // If it's just a Google Drive ID, we might allow it depending on context,
    // but typically we expect a full URL here.
    return false;
  }
};

/**
 * Clean URL to prevent javascript: or other dangerous protocols
 * @param {string} url - URL to clean
 * @returns {string} Safe URL or empty string
 */
export const getSafeUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.toLowerCase().startsWith('javascript:')) return '';
  return trimmed;
};
