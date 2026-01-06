/**
 * Pattern definitions for JS analysis
 * Ported from Burp Suite JS Analyzer extension
 */

// ==================== ENDPOINT PATTERNS ====================
export const ENDPOINT_PATTERNS = [
  // API endpoints
  /["']((?:https?:)?\/\/[^"']+\/api\/[a-zA-Z0-9/_-]+)["']/gi,
  /["'](\/api\/v?\d*\/[a-zA-Z0-9/_-]{2,})["']/gi,
  /["'](\/v\d+\/[a-zA-Z0-9/_-]{2,})["']/gi,
  /["'](\/rest\/[a-zA-Z0-9/_-]{2,})["']/gi,
  /["'](\/graphql[a-zA-Z0-9/_-]*)["']/gi,

  // OAuth/Auth endpoints
  /["'](\/oauth[0-9]*\/[a-zA-Z0-9/_-]+)["']/gi,
  /["'](\/auth[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/login[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/logout[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/token[a-zA-Z0-9/_-]*)["']/gi,

  // Sensitive paths
  /["'](\/admin[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/dashboard[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/internal[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/debug[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/config[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/backup[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/private[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/upload[a-zA-Z0-9/_-]*)["']/gi,
  /["'](\/download[a-zA-Z0-9/_-]*)["']/gi,

  // Well-known paths
  /["'](\/\.well-known\/[a-zA-Z0-9/_-]+)["']/gi,
  /["'](\/idp\/[a-zA-Z0-9/_-]+)["']/gi,
];

// ==================== URL PATTERNS ====================
export const URL_PATTERNS = [
  /["'](https?:\/\/[^\s"'<>]{10,})["']/g,
  /["'](wss?:\/\/[^\s"'<>]{10,})["']/g,
  /["'](sftp:\/\/[^\s"'<>]{10,})["']/g,
  // Cloud storage
  /(https?:\/\/[a-zA-Z0-9.-]+\.s3[a-zA-Z0-9.-]*\.amazonaws\.com[^\s"'<>]*)/g,
  /(https?:\/\/[a-zA-Z0-9.-]+\.blob\.core\.windows\.net[^\s"'<>]*)/g,
  /(https?:\/\/storage\.googleapis\.com\/[^\s"'<>]*)/g,
];

// ==================== SECRET PATTERNS ====================
export const SECRET_PATTERNS = [
  { pattern: /(AKIA[0-9A-Z]{16})/g, type: "AWS Key" },
  { pattern: /(AIza[0-9A-Za-z\-_]{35})/g, type: "Google API" },
  { pattern: /(sk_live_[0-9a-zA-Z]{24,})/g, type: "Stripe Live" },
  { pattern: /(ghp_[0-9a-zA-Z]{36})/g, type: "GitHub PAT" },
  { pattern: /(xox[baprs]-[0-9a-zA-Z\-]{10,48})/g, type: "Slack Token" },
  { pattern: /(eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+)/g, type: "JWT" },
  { pattern: /(-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/g, type: "Private Key" },
  { pattern: /(mongodb(?:\+srv)?:\/\/[^\s"'<>]+)/g, type: "MongoDB" },
  { pattern: /(postgres(?:ql)?:\/\/[^\s"'<>]+)/g, type: "PostgreSQL" },
];

// ==================== EMAIL PATTERN ====================
export const EMAIL_PATTERN = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/g;

// ==================== FILE PATTERNS ====================
export const FILE_PATTERNS = /["']([a-zA-Z0-9_/.-]+\.(?:sql|csv|xlsx|xls|json|xml|yaml|yml|txt|log|conf|config|cfg|ini|env|bak|backup|old|orig|copy|key|pem|crt|cer|p12|pfx|doc|docx|pdf|zip|tar|gz|rar|7z|sh|bat|ps1|py|rb|pl))["']/gi;

// ==================== NOISE FILTERS ====================

export const NOISE_DOMAINS = new Set([
  'www.w3.org', 'schemas.openxmlformats.org', 'schemas.microsoft.com',
  'purl.org', 'purl.oclc.org', 'openoffice.org', 'docs.oasis-open.org',
  'sheetjs.openxmlformats.org', 'ns.adobe.com', 'www.xml.org',
  'example.com', 'test.com', 'localhost', '127.0.0.1',
  'fusioncharts.com', 'jspdf.default.namespaceuri',
  'npmjs.org', 'registry.npmjs.org',
  'github.com/indutny', 'github.com/crypto-browserify',
  'jqwidgets.com', 'ag-grid.com',
]);

export const MODULE_PREFIXES = [
  './', '../', '.../',
  './lib', '../lib', './utils', '../utils',
  './node_modules', '../node_modules',
  './src', '../src', './dist', '../dist',
];

export const NOISE_PATTERNS = [
  /^\.\.?\//,  // Starts with ./ or ../
  /^[a-z]{2}(-[a-z]{2})?\.js$/,  // Locale files: en.js, en-gb.js
  /^[a-z]{2}(-[a-z]{2})?$/,  // Just locale: en, en-gb
  /-xform$/,  // Excel xform modules
  /^sha\d*$/,  // sha, sha1, sha256
  /^aes$|^des$|^md5$/,  // Crypto modules

  // PDF internal structure
  /^\/[A-Z][a-z]+\s/,  // /Type /Font, /Filter /Standard
  /^\/[A-Z][a-z]+$/,  // /Parent, /Kids, /Resources
  /^\d+ \d+ R$/,  // PDF object references

  // Excel/XML internal paths
  /^xl\//,  // Excel internal
  /^docProps\//,  // Document properties
  /^_rels\//,  // Relationships
  /^META-INF\//,  // Manifest
  /\.xml$/,  // XML files
  /^worksheets\//,
  /^theme\//,

  // Build/bundler artifacts
  /^webpack/,
  /^zone\.js$/,
  /^readable-stream\//,
  /^process\//,
  /^stream\//,
  /^buffer$/,
  /^events$/,
  /^util$/,
  /^path$/,

  // Generic noise
  /^\+/,  // Starts with +
  /^\$\{/,  // Template literal
  /^#/,  // Fragment only
  /^\?\\ref=/,
  /^\/[a-z]$/,  // Single letter paths
  /^\/[A-Z]$/,  // Single letter paths
  /^http:\/\/$/,  // Empty http://
  /_ngcontent/,  // Angular internals
];

export const NOISE_STRINGS = new Set([
  'http://', 'https://', '/a', '/P', '/R', '/V', '/W',
  'zone.js', 'bn.js', 'hash.js', 'md5.js', 'sha.js', 'des.js',
  'asn1.js', 'declare.js', 'elliptic.js',
]);
