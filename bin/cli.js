#!/usr/bin/env bun

/**
 * JS Analyzer CLI
 * Command-line tool for analyzing JavaScript files
 */

import { JSAnalyzer } from '../lib/analyzer.js';
import { readFileSync, existsSync } from 'fs';
import { basename } from 'path';

const VERSION = '1.0.0';

/**
 * Print usage information
 */
function printHelp() {
  console.log(`
JS Analyzer v${VERSION}
Analyze JavaScript files for API endpoints, secrets, URLs, emails, and sensitive files

USAGE:
  js-analyzer [OPTIONS] <files...>

OPTIONS:
  -h, --help       Show this help message
  -v, --version    Show version
  --verbose        Show detailed analysis progress
  --pretty         Pretty print JSON output

EXAMPLES:
  js-analyzer app.js
  js-analyzer bundle.js vendor.js
  js-analyzer --pretty src/**/*.js
  js-analyzer --verbose dist/main.js

OUTPUT:
  JSON format with findings grouped by category
  `.trim());
}

/**
 * Print version
 */
function printVersion() {
  console.log(VERSION);
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);

  // No arguments
  if (args.length === 0) {
    printHelp();
    process.exit(0);
  }

  // Parse flags
  let files = [];
  let verbose = false;
  let pretty = false;

  for (const arg of args) {
    if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (arg === '-v' || arg === '--version') {
      printVersion();
      process.exit(0);
    } else if (arg === '--verbose') {
      verbose = true;
    } else if (arg === '--pretty') {
      pretty = true;
    } else if (!arg.startsWith('-')) {
      files.push(arg);
    } else {
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
    }
  }

  // No files specified
  if (files.length === 0) {
    console.error('Error: No files specified');
    printHelp();
    process.exit(1);
  }

  // Create analyzer
  const analyzer = new JSAnalyzer();
  const results = {
    files: [],
    summary: {},
    findings: {}
  };

  // Analyze each file
  for (const filePath of files) {
    if (!existsSync(filePath)) {
      if (verbose) {
        console.error(`Warning: File not found: ${filePath}`);
      }
      results.files.push({
        path: filePath,
        status: 'not_found',
        findings: 0
      });
      continue;
    }

    try {
      if (verbose) {
        console.error(`Analyzing: ${filePath}`);
      }

      const content = readFileSync(filePath, 'utf-8');
      const sourceName = basename(filePath);
      const newFindings = analyzer.analyze(content, sourceName);

      results.files.push({
        path: filePath,
        status: 'analyzed',
        findings: newFindings.length
      });

      if (verbose && newFindings.length > 0) {
        console.error(`  Found ${newFindings.length} items`);
      }
    } catch (error) {
      if (verbose) {
        console.error(`Error analyzing ${filePath}: ${error.message}`);
      }
      results.files.push({
        path: filePath,
        status: 'error',
        error: error.message,
        findings: 0
      });
    }
  }

  // Collect results
  results.summary = analyzer.getStats();
  results.findings = analyzer.getFindingsByCategory();

  // Output JSON
  const json = pretty
    ? JSON.stringify(results, null, 2)
    : JSON.stringify(results);

  console.log(json);

  // Exit with error code if no findings
  process.exit(results.summary.total > 0 ? 0 : 0);
}

// Run
main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
