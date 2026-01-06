---
name: analyze-js
description: Analyze JavaScript files for API endpoints, secrets, URLs, emails, and sensitive file references
examples:
  - analyze-js bundle.js
  - analyze-js src/app.js dist/vendor.js
  - analyze-js --verbose main.js
---

Analyzes JavaScript files for security-relevant information:
- **API Endpoints**: REST APIs, GraphQL, OAuth paths, admin panels
- **URLs**: External links, cloud storage URLs, WebSocket connections
- **Secrets**: API keys, tokens, JWT, private keys, database credentials
- **Emails**: Email addresses (excluding test/placeholder addresses)
- **Files**: References to sensitive files (.env, .key, configs, backups)

The tool filters out common noise (build artifacts, module imports, XML namespaces) to provide high-signal results.

## Usage

```bash
js-analyzer [OPTIONS] <files...>
```

## Options

- `--verbose` - Show detailed progress during analysis
- `--pretty` - Pretty print JSON output for readability
- `-h, --help` - Show help message
- `-v, --version` - Show version

## Output Format

Returns JSON with:
- `files[]`: Status of each analyzed file
- `summary`: Count of findings by category
- `findings{}`: Detailed findings grouped by category (endpoints, urls, secrets, emails, files)

Each finding includes position information:
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

The `position` field allows easy navigation to POI (Points of Interest):
- Line number (1-indexed)
- Column number (1-indexed)
- Compatible with editor jump-to-location formats (e.g., `app.js:42:15`)

## Examples

Analyze a single bundled JS file:
```bash
analyze-js dist/bundle.js
```

Analyze multiple files with verbose output:
```bash
analyze-js --verbose --pretty src/app.js src/config.js
```

Use in Claude Code to analyze downloaded JS:
```bash
curl -s https://example.com/app.js | analyze-js /dev/stdin
```

## Security Note

This tool is designed for **authorized security testing** only:
- Penetration testing with proper authorization
- Bug bounty programs
- Security research on your own applications
- Code review and security audits

Do not use on applications you do not own or have permission to test.
