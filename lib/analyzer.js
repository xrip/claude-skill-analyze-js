/**
 * Core analyzer module
 * Analyzes JavaScript content for endpoints, URLs, secrets, emails, and files
 */

import {
  ENDPOINT_PATTERNS,
  URL_PATTERNS,
  SECRET_PATTERNS,
  EMAIL_PATTERN,
  FILE_PATTERNS,
  BUNDLER_PATTERNS
} from './patterns.js';

import {
  isValidEndpoint,
  isValidUrl,
  isValidSecret,
  isValidEmail,
  isValidFile,
  isValidBundler
} from './validators.js';

/**
 * Analyzer class with deduplication
 */
export class JSAnalyzer {
  constructor() {
    this.seenValues = new Set();
    this.findings = [];
  }

  /**
   * Add finding with deduplication
   */
  addFinding(category, value, source, position = null) {
    const key = `${category}:${value}`;

    if (this.seenValues.has(key)) {
      return null;
    }

    this.seenValues.add(key);
    const finding = {
      category,
      value,
      source,
      ...(position && { position })
    };

    this.findings.push(finding);
    return finding;
  }

  /**
   * Calculate line and column from string index
   */
  getPosition(content, index) {
    const lines = content.substring(0, index).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    return { line, column };
  }

  /**
   * Analyze JavaScript content
   */
  analyze(content, sourceName = 'unknown') {
    if (!content || content.length < 50) {
      return [];
    }

    const newFindings = [];

    // 1. Extract endpoints
    for (const pattern of ENDPOINT_PATTERNS) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const value = match[1]?.trim();
        if (value && isValidEndpoint(value)) {
          const position = this.getPosition(content, match.index);
          const finding = this.addFinding('endpoints', value, sourceName, position);
          if (finding) {
            newFindings.push(finding);
          }
        }
      }
    }

    // 2. URLs
    for (const pattern of URL_PATTERNS) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const value = (match[1] || match[0])?.trim();
        if (value && isValidUrl(value)) {
          const position = this.getPosition(content, match.index);
          const finding = this.addFinding('urls', value, sourceName, position);
          if (finding) {
            newFindings.push(finding);
          }
        }
      }
    }

    // 3. Secrets
    for (const { pattern, type } of SECRET_PATTERNS) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const value = match[1]?.trim();
        if (value && isValidSecret(value)) {
          // Mask sensitive values
          const masked = value.length > 20
            ? `${value.slice(0, 10)}...${value.slice(-4)}`
            : value;
          const position = this.getPosition(content, match.index);
          const finding = this.addFinding('secrets', `${masked} (${type})`, sourceName, position);
          if (finding) {
            newFindings.push(finding);
          }
        }
      }
    }

    // 4. Emails
    const emailMatches = content.matchAll(EMAIL_PATTERN);
    for (const match of emailMatches) {
      const value = match[1]?.trim();
      if (value && isValidEmail(value)) {
        const position = this.getPosition(content, match.index);
        const finding = this.addFinding('emails', value, sourceName, position);
        if (finding) {
          newFindings.push(finding);
        }
      }
    }

    // 5. Files
    const fileMatches = content.matchAll(FILE_PATTERNS);
    for (const match of fileMatches) {
      const value = match[1]?.trim();
      if (value && isValidFile(value)) {
        const position = this.getPosition(content, match.index);
        const finding = this.addFinding('files', value, sourceName, position);
        if (finding) {
          newFindings.push(finding);
        }
      }
    }

    // 6. Bundlers
    for (const { pattern, type } of BUNDLER_PATTERNS) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const version = match[1]?.trim();
        const fullMatch = match[0];

        // Determine the value to report
        let value;
        if (version && /\d+\.\d+\.\d+/.test(version)) {
          // We found a version number
          value = `${type} ${version}`;
        } else if (fullMatch) {
          // Runtime signature without version
          value = `${type} (detected)`;
        } else {
          continue;
        }

        if (isValidBundler(version || fullMatch, type)) {
          const position = this.getPosition(content, match.index);
          const finding = this.addFinding('bundlers', value, sourceName, position);
          if (finding) {
            newFindings.push(finding);
          }
        }
      }
    }

    return newFindings;
  }

  /**
   * Get all findings
   */
  getAllFindings() {
    return this.findings;
  }

  /**
   * Get findings grouped by category
   */
  getFindingsByCategory() {
    const grouped = {
      endpoints: [],
      urls: [],
      secrets: [],
      emails: [],
      files: [],
      bundlers: []
    };

    for (const finding of this.findings) {
      if (grouped[finding.category]) {
        grouped[finding.category].push(finding);
      }
    }

    return grouped;
  }

  /**
   * Get summary statistics
   */
  getStats() {
    const byCategory = this.getFindingsByCategory();
    return {
      total: this.findings.length,
      endpoints: byCategory.endpoints.length,
      urls: byCategory.urls.length,
      secrets: byCategory.secrets.length,
      emails: byCategory.emails.length,
      files: byCategory.files.length,
      bundlers: byCategory.bundlers.length
    };
  }

  /**
   * Clear all findings
   */
  clear() {
    this.seenValues.clear();
    this.findings = [];
  }
}
