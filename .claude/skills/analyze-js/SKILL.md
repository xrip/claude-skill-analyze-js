
---
name: analyze-js
description: Analyze JavaScript files and directories for API endpoints, secrets, URLs, emails, sensitive file references, and bundler versions
examples:
  - analyze-js bundle.js
  - analyze-js src/
  - analyze-js dist/ lib/
  - analyze-js --verbose --no-recursive build/
---

# JS Analyzer - Claude Code Skill

Production-ready skill for analyzing JavaScript files using npx.
No installation required - works in any project.

When the user invokes this skill, run the JS analyzer tool.

## Command to Execute

```bash
npx js-analyzer-cli [OPTIONS] <paths...>
```

The tool will be automatically downloaded and cached on first use.

## What This Tool Does

Analyzes JavaScript files and directories for security-relevant information:
- **API Endpoints**: REST APIs, GraphQL, OAuth paths, admin panels
- **URLs**: External links, cloud storage URLs, WebSocket connections
- **Secrets**: API keys, tokens, JWT, private keys, database credentials
- **Emails**: Email addresses (excluding test/placeholder addresses)
- **Files**: References to sensitive files (.env, .key, configs, backups)
- **Bundlers**: JavaScript bundlers and their versions (Webpack, Vite, Rollup, Parcel, esbuild, Browserify, Turbopack, SWC, Metro, and more)

The tool filters out common noise (build artifacts, module imports, XML namespaces) to provide high-signal results.

## Usage Instructions

When the user requests to analyze JavaScript files:

1. Identify the paths (files or directories) to analyze
2. Determine if any special flags are needed:
   - `--verbose` - Show detailed progress
   - `--format=json` - Use JSON format instead of default TOON
   - `--pretty` - Pretty print JSON output (only with --format=json)
   - `--no-recursive` - Don't scan directories recursively
3. Run: `npx js-analyzer-cli [flags] <paths>`
4. Parse and present the results to the user

**Note:** First run may take a few seconds to download the package. Subsequent runs are instant (cached).

**Directory Scanning:**
- Automatically finds `.js`, `.jsx`, `.mjs` files
- Skips `node_modules/` and hidden directories
- Recursive by default

**Output Formats:**
- `toon` (default) - Compact format optimized for LLMs (40-50% fewer tokens)
- `json` - Full JSON with all details (use --format=json) 

## Example Commands

```bash
# Analyze single file (TOON format by default)
npx js-analyzer-cli bundle.js

# Analyze directory
npx js-analyzer-cli src/

# Verbose analysis of multiple directories
npx js-analyzer-cli --verbose frontend/ backend/

# JSON format with pretty print
npx js-analyzer-cli --format=json --pretty src/

# Non-recursive scan
npx js-analyzer-cli --no-recursive build/
```

## Output Structure

Each finding includes:
- **category**: endpoints, urls, secrets, emails, files, or bundlers
- **value**: The detected value
- **source**: Source file path
- **position**: Line and column number (1-indexed)

Example:
```json
{
  "category": "endpoints",
  "value": "/api/v1/users",
  "source": "app.js",
  "position": {
    "line": 42,
    "column": 15
  }
}
```

Bundler detection example:
```json
{
  "category": "bundlers",
  "value": "Webpack 5.88.2",
  "source": "bundle.js",
  "position": {
    "line": 1,
    "column": 25
  }
}
```

Position info allows easy navigation: `app.js:42:15`

## Security Note

This tool is for **authorized security testing** only:
- Penetration testing with proper authorization
- Bug bounty programs
- Security research on your own applications
- Code review and security audits
