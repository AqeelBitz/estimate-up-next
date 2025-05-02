// lib/utils/cookies.js
import { serialize } from 'cookie';

/**
 * Sets a cookie in the response headers.
 * @param {object} res - The Next.js API response object.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {object} options - Cookie options (e.g., httpOnly, maxAge, path, secure).
 */
export const setCookie = (res, name, value, options = {}) => {
  const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    path: '/',
    sameSite: 'lax', // Recommended default
    ...options, // Allow overriding defaults
  };

  res.setHeader('Set-Cookie', serialize(name, stringValue, defaultOptions));
};

/**
 * Clears a cookie by setting its expiration date to the past.
  * @param {object} res - The Next.js API response object.
  * @param {string} name - The name of the cookie.
  * @param {object} options - Cookie options (usually just path).
  */
export const clearCookie = (res, name, options = {}) => {
    const defaultOptions = {
        path: '/',
        ...options,
        maxAge: -1, // Set maxAge to a negative value or expires to a past date
    };
    res.setHeader('Set-Cookie', serialize(name, '', defaultOptions));
}