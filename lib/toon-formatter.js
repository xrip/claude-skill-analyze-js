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

  // Transform findings to tabular format with location as file:line:column
  const categories = ['endpoints', 'urls', 'secrets', 'emails', 'files', 'bundlers'];

  for (const category of categories) {
    const items = results.findings[category] || [];
    if (items.length > 0) {
      // Convert to compact format with location as single string
      metadata.findings[category] = items.map(item => {
        const line = item.position?.line || 0;
        const column = item.position?.column || 0;
        const location = `${item.source}:${line}:${column}`;

        return {
          value: item.value,
          location: location
        };
      });
    } else {
      metadata.findings[category] = [];
    }
  }

  // Encode to TOON with tab delimiter for better tokenization
  let toonOutput = encode(metadata, {
    delimiter: '\t',  // Use tabs for better LLM tokenization
    indent: 2         // 2 spaces for indentation
  });

  // Remove quotes from file:line:column locations
  // Match pattern: "filename.js:123:45"
  toonOutput = toonOutput.replace(/"([^"]+\.js:\d+:\d+)"/g, '$1');

  return toonOutput;
}

