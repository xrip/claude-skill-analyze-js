
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

**Quick Summary:**
When presenting results to the user, start with the summary statistics:
- Total findings
- Count by category (endpoints, secrets, urls, emails, files, bundlers)
- Highlight critical items (secrets, admin endpoints)

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

The tool outputs results in TOON format by default (use `--format=json` for JSON).

**TOON Format Example (default):**
```
__comment: "JS Analyzer Results - Generated: 2026-01-06T20:15:32.456Z"
summary:
  total: 18
  endpoints: 4
  urls: 2
  secrets: 1
  emails: 0
  files: 1
  bundlers: 2
files[1	]{path	status	findings}:
  bundle.js	analyzed	18
findings:
  endpoints[4	]{value	location}:
    /api/v1/users	bundle.js:42:15
    /api/v1/posts	bundle.js:58:23
    /oauth/token	bundle.js:105:18
    /admin/dashboard	bundle.js:234:12
  urls[2	]{value	location}:
    https://api.example.com/data	bundle.js:89:20
    https://cdn.example.com/assets	bundle.js:156:34
  secrets[1	]{value	location}:
    AKIAIOSFOD...MPLE (AWS Key)	bundle.js:312:25
  emails[0	]:
  files[1	]{value	location}:
    config.json	bundle.js:67:19
  bundlers[2	]{value	location}:
    Webpack 5.88.2	bundle.js:1:15
    Webpack (detected)	bundle.js:3:5
```

**Key features:**
- **Location format**: `file:line:column` - easy to parse and click
- Tab-delimited columns (`\t` separator)
- Explicit array lengths for easy parsing
- 40-50% fewer tokens than JSON
- Human-readable structure

Each finding includes:
- **value**: The detected item
- **location**: File path with position in format `file:line:column`

This format is universally recognized by IDEs and text editors for navigation.

**Presenting Results to User:**

Format findings in a clear, actionable way:

```
📊 Analysis Results for bundle.js

Summary:
- Total findings: 18
- Endpoints: 4 (including /admin/dashboard ⚠️)
- Secrets: 1 (AWS Key - masked)
- Bundlers: Webpack 5.88.2

🔴 Critical Findings:
• AWS Key detected at bundle.js:312:25
• Admin endpoint /admin/dashboard at bundle.js:234:12

📍 API Endpoints (4):
• /api/v1/users (bundle.js:42:15)
• /api/v1/posts (bundle.js:58:23)
• /oauth/token (bundle.js:105:18)
• /admin/dashboard (bundle.js:234:12)

🔧 Build Info:
• Webpack 5.88.2 detected at bundle.js:1:15
```

Use `file:line:column` format for easy navigation in any IDE or editor.

## Security Note

This tool is for **authorized security testing** only:
- Penetration testing with proper authorization
- Bug bounty programs
- Security research on your own applications
- Code review and security audits
