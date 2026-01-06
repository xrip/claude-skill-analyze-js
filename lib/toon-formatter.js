/**
 * TOON (Token-Oriented Object Notation) formatter
 * Uses official @toon-format/toon library
 * https://github.com/toon-format/toon
 */

import { encode } from '@toon-format/toon';

/**
 * Format analysis results as TOON using tab delimiter
 */
export function formatAsToon(results) {
  // Add metadata comment
  const metadata = {
    __comment: `JS Analyzer Results - Generated: ${new Date().toISOString()}`,
    summary: results.summary,
    files: results.files,
    findings: {}
  };

  // Transform findings to tabular format
  const categories = ['endpoints', 'urls', 'secrets', 'emails', 'files', 'bundlers'];

  for (const category of categories) {
    const items = results.findings[category] || [];
    if (items.length > 0) {
      // Convert to array of arrays for tabular format
      metadata.findings[category] = items.map(item => ({
        value: item.value,
        source: item.source,
        line: item.position?.line || 0,
        column: item.position?.column || 0
      }));
    } else {
      metadata.findings[category] = [];
    }
  }

  // Encode to TOON with tab delimiter for better tokenization
  const toonOutput = encode(metadata, {
    delimiter: '\t',  // Use tabs for better LLM tokenization
    indent: 2         // 2 spaces for indentation
  });

  return toonOutput;
}

