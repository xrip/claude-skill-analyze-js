/**
 * Validators for filtering out noise and false positives
 */

import { NOISE_STRINGS, NOISE_PATTERNS, NOISE_DOMAINS, MODULE_PREFIXES } from './patterns.js';

/**
 * Validate endpoint paths
 */
export function isValidEndpoint(value) {
  if (!value || value.length < 3) {
    return false;
  }

  // Check exact matches first
  if (NOISE_STRINGS.has(value)) {
    return false;
  }

  // Check noise patterns
  for (const pattern of NOISE_PATTERNS) {
    if (pattern.test(value)) {
      return false;
    }
  }

  // Must start with / and have some path
  if (!value.startsWith('/')) {
    return false;
  }

  // Skip if just a single segment with no meaning
  const parts = value.split('/');
  if (parts.length < 2 || parts.filter(p => p).every(p => p.length < 2)) {
    return false;
  }

  return true;
}

/**
 * Validate URLs
 */
export function isValidUrl(value) {
  if (!value || value.length < 15) {
    return false;
  }

  const valLower = value.toLowerCase();

  // Check for noise domains
  for (const domain of NOISE_DOMAINS) {
    if (valLower.includes(domain)) {
      return false;
    }
  }

  // Skip if contains placeholder patterns
  if (value.includes('{') || valLower.includes('undefined') || valLower.includes('null')) {
    return false;
  }

  // Skip data URIs
  if (valLower.startsWith('data:')) {
    return false;
  }

  // Skip if ends with common static extensions
  const staticExtensions = ['.css', '.png', '.jpg', '.gif', '.svg', '.woff', '.ttf'];
  if (staticExtensions.some(ext => valLower.endsWith(ext))) {
    return false;
  }

  return true;
}

/**
 * Validate secrets
 */
export function isValidSecret(value) {
  if (!value || value.length < 10) {
    return false;
  }

  const valLower = value.toLowerCase();
  const testWords = ['example', 'placeholder', 'your', 'xxxx', 'test'];

  if (testWords.some(word => valLower.includes(word))) {
    return false;
  }

  return true;
}

/**
 * Validate email addresses
 */
export function isValidEmail(value) {
  if (!value || !value.includes('@')) {
    return false;
  }

  const valLower = value.toLowerCase();
  const domain = value.split('@')[1]?.toLowerCase();

  const testDomains = ['example.com', 'test.com', 'domain.com', 'placeholder.com'];
  if (testDomains.includes(domain)) {
    return false;
  }

  const testWords = ['example', 'test', 'placeholder', 'noreply'];
  if (testWords.some(word => valLower.includes(word))) {
    return false;
  }

  return true;
}

/**
 * Validate file references
 */
export function isValidFile(value) {
  if (!value || value.length < 3) {
    return false;
  }

  const valLower = value.toLowerCase();

  // Skip common JS/build files
  const buildFiles = [
    'package.json', 'tsconfig.json', 'webpack', 'babel',
    'eslint', 'prettier', 'node_modules', '.min.',
    'polyfill', 'vendor', 'chunk', 'bundle'
  ];

  if (buildFiles.some(x => valLower.includes(x))) {
    return false;
  }

  // Skip source maps
  if (valLower.endsWith('.map')) {
    return false;
  }

  // Skip common locale/language files
  if (valLower.endsWith('.json') && value.split('/').pop().length <= 7) {
    return false;
  }

  return true;
}
