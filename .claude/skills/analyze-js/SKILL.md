
---
name: analyze-js
description: Analyze JavaScript files for API endpoints, secrets, URLs, emails, sensitive files, and bundler versions
examples:
  - analyze-js bundle.js
  - analyze-js src/
  - analyze-js --verbose dist/
---

# JS Analyzer Skill

Analyzes JavaScript files for security-relevant information using `npx js-analyzer-cli`.
Works in any project without installation.

## Command

```bash
npx js-analyzer-cli [OPTIONS] <paths...>
```

## Detection Categories

- **endpoints**: REST APIs, GraphQL, OAuth, admin panels
- **urls**: External links, cloud storage, WebSockets
- **secrets**: API keys, tokens, JWT, credentials (auto-masked)
- **emails**: Valid addresses (test emails filtered)
- **files**: Sensitive file references (.env, configs, backups)
- **bundlers**: Detected bundlers with versions (Webpack, Vite, Rollup, etc.)

Auto-filters noise: build artifacts, module imports, XML namespaces.

## Options

- `--verbose` - Show progress details
- `--format=json` - JSON output (default: toon)
- `--pretty` - Pretty print JSON
- `--no-recursive` - Skip subdirectories

## Directory Scanning

Default behavior:
- Finds `.js`, `.jsx`, `.mjs` files
- Skips `node_modules/` and hidden dirs
- Recursive by default

## Output Format

**TOON (default)** - Compact, optimized for LLMs (50% smaller than JSON):
```
summary:
  total: 18
  endpoints: 4
  secrets: 1
  bundlers: 2
findings:
  endpoints[4	]{value	location}:
    /api/v1/users	bundle.js:42:15
    /admin/dashboard	bundle.js:234:12
  secrets[1	]{value	location}:
    AKIA...MPLE (AWS Key)	bundle.js:312:25
  bundlers[2	]{value	location}:
    Webpack 5.88.2	bundle.js:1:15
```

**JSON** (with `--format=json`):
```json
{
  "summary": {"total": 18, "endpoints": 4, ...},
  "findings": {
    "endpoints": [
      {"value": "/api/v1/users", "source": "bundle.js", "position": {"line": 42, "column": 15}}
    ]
  }
}
```

## How to Present Results

1. **Summary** - Total + counts per category
2. **Critical items** - Secrets, admin endpoints with locations
3. **Grouped findings** - By category, preserve `file:line:column` format

Example presentation:
```
📊 Analysis: bundle.js

Summary: 18 findings
- 4 endpoints (⚠️ includes /admin/dashboard)
- 1 secret (AWS Key - masked)
- Webpack 5.88.2

🔴 Critical:
• AWS Key at bundle.js:312:25
• Admin endpoint at bundle.js:234:12

📍 Endpoints (4):
• /api/v1/users (bundle.js:42:15)
• /admin/dashboard (bundle.js:234:12)
```

Use `file:line:column` format - clickable in most IDEs.

## Usage Flow

1. Identify paths to analyze
2. Add flags if needed (--verbose, --format=json, etc.)
3. Run: `npx js-analyzer-cli [flags] <paths>`
4. Parse and present results

**Note:** First run downloads package (~2-3s), subsequent runs are instant (cached).

## Security

For authorized testing only: pentesting, bug bounties, own applications, security audits.
