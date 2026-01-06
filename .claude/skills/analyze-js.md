---
name: analyze-js
description: Analyze JavaScript files and directories for API endpoints, secrets, URLs, emails, and sensitive file references
examples:
  - analyze-js bundle.js
  - analyze-js src/
  - analyze-js dist/ lib/
  - analyze-js --verbose --no-recursive build/
---

When the user invokes this skill, run the JS analyzer tool located in this project.

## Command to Execute

```bash
bun bin/cli.js [OPTIONS] <paths...>
```

## What This Tool Does

Analyzes JavaScript files and directories for security-relevant information:
- **API Endpoints**: REST APIs, GraphQL, OAuth paths, admin panels
- **URLs**: External links, cloud storage URLs, WebSocket connections
- **Secrets**: API keys, tokens, JWT, private keys, database credentials
- **Emails**: Email addresses (excluding test/placeholder addresses)
- **Files**: References to sensitive files (.env, .key, configs, backups)

The tool filters out common noise (build artifacts, module imports, XML namespaces) to provide high-signal results.

## Usage Instructions

When the user requests to analyze JavaScript files:

1. Identify the paths (files or directories) to analyze
2. Determine if any special flags are needed:
   - `--verbose` - Show detailed progress
   - `--pretty` - Pretty print JSON output
   - `--format=toon` - Use TOON format (optimized for LLMs, 50% smaller)
   - `--no-recursive` - Don't scan directories recursively
3. Run: `bun bin/cli.js [flags] <paths>`
4. Parse and present the results to the user

**Directory Scanning:**
- Automatically finds `.js`, `.jsx`, `.mjs` files
- Skips `node_modules/` and hidden directories
- Recursive by default

**Output Formats:**
- `json` (default) - Full JSON with all details
- `toon` - Compact format optimized for LLMs (40-50% fewer tokens)

## Example Commands

```bash
# Analyze single file
bun bin/cli.js bundle.js

# Analyze directory with TOON format
bun bin/cli.js --format=toon src/

# Verbose analysis of multiple directories
bun bin/cli.js --verbose --pretty frontend/ backend/

# Non-recursive scan
bun bin/cli.js --no-recursive build/
```

## Output Structure

Each finding includes:
- **category**: endpoints, urls, secrets, emails, or files
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

Position info allows easy navigation: `app.js:42:15`

## Security Note

This tool is for **authorized security testing** only:
- Penetration testing with proper authorization
- Bug bounty programs
- Security research on your own applications
- Code review and security audits
