#!/usr/bin/env bun

/**
 * JS Analyzer CLI
 * Command-line tool for analyzing JavaScript files
 */

import { JSAnalyzer } from '../lib/analyzer.js';
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { basename, join, relative } from 'path';

const VERSION = '1.0.0';

/**
 * Recursively find all JS files in a directory
 */
function findJsFiles(path, recursive = true) {
  const files = [];

  try {
    const stat = statSync(path);

    if (stat.isFile()) {
      // If it's a file, check if it's a JS file
      if (path.endsWith('.js') || path.endsWith('.jsx') || path.endsWith('.mjs')) {
        files.push(path);
      }
      return files;
    }

    if (stat.isDirectory()) {
      const entries = readdirSync(path, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(path, entry.name);

        // Skip node_modules and hidden directories
        if (entry.isDirectory() && (entry.name === 'node_modules' || entry.name.startsWith('.'))) {
          continue;
        }

        if (entry.isDirectory() && recursive) {
          files.push(...findJsFiles(fullPath, recursive));
        } else if (entry.isFile()) {
          if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx') || entry.name.endsWith('.mjs')) {
            files.push(fullPath);
          }
        }
      }
    }
  } catch (error) {
    // Ignore errors for individual files/directories
  }

  return files;
}

/**
 * Print usage information
 */
function printHelp() {
  console.log(`
JS Analyzer v${VERSION}
Analyze JavaScript files for API endpoints, secrets, URLs, emails, and sensitive files

USAGE:
  js-analyzer [OPTIONS] <paths...>

ARGUMENTS:
  <paths...>       Files or directories to analyze
                   Directories are scanned recursively for .js, .jsx, .mjs files
                   Automatically skips node_modules and hidden directories

OPTIONS:
  -h, --help           Show this help message
  -v, --version        Show version
  --verbose            Show detailed analysis progress
  --pretty             Pretty print JSON output
  --no-recursive       Don't scan directories recursively

EXAMPLES:
  js-analyzer app.js                    # Analyze single file
  js-analyzer src/                      # Analyze all JS files in src/
  js-analyzer dist/ lib/                # Analyze multiple directories
  js-analyzer --no-recursive src/       # Only top-level files in src/
  js-analyzer --pretty --verbose dist/  # Verbose with pretty output

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
  let paths = [];
  let verbose = false;
  let pretty = false;
  let recursive = true;

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
    } else if (arg === '--no-recursive') {
      recursive = false;
    } else if (!arg.startsWith('-')) {
      paths.push(arg);
    } else {
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
    }
  }

  // No paths specified
  if (paths.length === 0) {
    console.error('Error: No files or directories specified');
    printHelp();
    process.exit(1);
  }

  // Expand paths to files
  let allFiles = [];
  for (const path of paths) {
    if (!existsSync(path)) {
      if (verbose) {
        console.error(`Warning: Path not found: ${path}`);
      }
      continue;
    }

    const foundFiles = findJsFiles(path, recursive);
    allFiles.push(...foundFiles);
  }

  if (allFiles.length === 0) {
    console.error('Error: No JavaScript files found');
    process.exit(1);
  }

  if (verbose) {
    console.error(`Found ${allFiles.length} JavaScript file(s) to analyze`);
  }

  // Create analyzer
  const analyzer = new JSAnalyzer();
  const results = {
    files: [],
    summary: {},
    findings: {}
  };

  // Analyze each file
  for (const filePath of allFiles) {
    try {
      if (verbose) {
        console.error(`Analyzing: ${filePath}`);
      }

      const content = readFileSync(filePath, 'utf-8');
      const sourceName = filePath; // Use full path as source for better tracking
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
