---
name: analyze-js
description: Analyze JavaScript files and directories for API endpoints, secrets, URLs, emails, and sensitive file references
examples:
  - analyze-js bundle.js
  - analyze-js src/
  - analyze-js dist/ lib/
  - analyze-js --verbose --no-recursive build/
---

Analyzes JavaScript files and directories for security-relevant information:
- **API Endpoints**: REST APIs, GraphQL, OAuth paths, admin panels
- **URLs**: External links, cloud storage URLs, WebSocket connections
- **Secrets**: API keys, tokens, JWT, private keys, database credentials
- **Emails**: Email addresses (excluding test/placeholder addresses)
- **Files**: References to sensitive files (.env, .key, configs, backups)

The tool filters out common noise (build artifacts, module imports, XML namespaces) to provide high-signal results.

## Usage

```bash
js-analyzer [OPTIONS] <paths...>
```

**Paths can be:**
- Individual files: `app.js`
- Directories: `src/` (scanned recursively by default)
- Multiple paths: `frontend/ backend/ utils.js`

**Directory Scanning:**
- Automatically finds `.js`, `.jsx`, `.mjs` files
- Skips `node_modules/` and hidden directories
- Use `--no-recursive` to scan only top-level files

## Options

- `--verbose` - Show detailed progress and file count during analysis
- `--pretty` - Pretty print JSON output for readability
- `--format=FORMAT` - Output format: `json` (default) or `toon`
- `--no-recursive` - Don't scan directories recursively (top-level files only)
- `-h, --help` - Show help message
- `-v, --version` - Show version

### TOON Format

TOON (Token-Oriented Object Notation) is optimized for LLM consumption:
- Uses 40-50% fewer tokens than JSON
- Tabular arrays for compact representation
- Explicit array lengths for easier parsing

Example: `analyze-js --format=toon src/`

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

Analyze entire directory recursively:
```bash
analyze-js src/
```

Analyze multiple directories:
```bash
analyze-js --verbose --pretty frontend/ backend/
```

Non-recursive directory scan:
```bash
analyze-js --no-recursive build/
```

## Security Note

This tool is designed for **authorized security testing** only:
- Penetration testing with proper authorization
- Bug bounty programs
- Security research on your own applications
- Code review and security audits

Do not use on applications you do not own or have permission to test.
