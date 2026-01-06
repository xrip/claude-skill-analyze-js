# JS Analyzer CLI

Command-line tool for analyzing JavaScript files to find API endpoints, secrets, URLs, emails, and sensitive file references. Ported from Burp Suite JS Analyzer extension.

## Features

- **API Endpoints Detection**: REST APIs, GraphQL, OAuth paths, admin panels, sensitive paths
- **URL Extraction**: HTTP/HTTPS/WebSocket URLs, cloud storage (S3, Azure Blob, GCS)
- **Secret Detection**: AWS keys, Google API keys, Stripe tokens, GitHub tokens, JWT, private keys, database credentials
- **Email Discovery**: Valid email addresses (filters test/placeholder emails)
- **File References**: Sensitive files (.env, .key, .pem, configs, backups, certificates)
- **Bundler Detection**: Identifies bundlers and their versions (Webpack, Vite, Rollup, Parcel, esbuild, Browserify, Turbopack, SWC, Metro, and more)
- **Noise Filtering**: Removes build artifacts, module imports, XML namespaces, and other false positives
- **Deduplication**: Tracks seen values across multiple files

## Installation

### Option 1: Use with bunx (Recommended)

Run directly without installation:
```bash
bunx js-analyzer-cli <files>
```

### Option 2: Global Installation

```bash
# Install globally
bun install -g js-analyzer-cli

# Use anywhere
js-analyzer <files>
```

### Option 3: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/js-analyzer-cli.git
cd js-analyzer-cli

# Run directly
bun bin/cli.js <files>

# Or install locally
bun install -g .
```

### Requirements

- **Bun** 1.0+ (not Node.js - this tool uses Bun runtime)

Install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

## Usage

### Basic Usage

```bash
# Analyze a single file
js-analyzer file.js

# Analyze a directory (recursive)
js-analyzer src/

# Analyze multiple paths
js-analyzer dist/ lib/ app.js
```

### Directory Scanning

The tool automatically:
- Scans directories recursively by default
- Finds all `.js`, `.jsx`, `.mjs` files
- Skips `node_modules/` and hidden directories (`.git/`, etc.)

```bash
# Recursive scan (default)
js-analyzer src/

# Non-recursive (only top-level files)
js-analyzer --no-recursive src/

# Multiple directories
js-analyzer frontend/ backend/
```

### With Options

```bash
# Pretty print JSON output
js-analyzer --pretty dist/

# Verbose mode (shows progress and file count)
js-analyzer --verbose src/

# TOON format output (optimized for LLMs)
js-analyzer --format=toon src/

# Combine flags
js-analyzer --pretty --verbose --no-recursive bundle/
```

### Output Formats

**TOON (default):**
```bash
js-analyzer app.js
```

TOON format is the default output, optimized for Large Language Models (LLMs) with:
- ~40-50% fewer tokens than JSON (typically 50% smaller file size)
- Tab-delimited tabular arrays for optimal tokenization
- Human-readable structure
- Explicit array lengths
- Official `@toon-format/toon` library

Example TOON output:
```toon
# JS Analyzer Results
summary:
  total: 13
  endpoints: 4
  urls: 1

findings:
  endpoints[4	]{value	source	line	column}:
    /api/v1/users	app.js	5	12
    /graphql	app.js	9	14
```

Learn more: [TOON Format](https://github.com/toon-format/toon)

**JSON (optional):**
```bash
js-analyzer --format=json app.js

# With pretty printing
js-analyzer --format=json --pretty app.js
```

### Help & Version

```bash
js-analyzer --help
js-analyzer --version
```

## Output Format

The tool outputs JSON with three main sections:

```json
{
  "files": [
    {
      "path": "test.js",
      "status": "analyzed",
      "findings": 13
    }
  ],
  "summary": {
    "total": 13,
    "endpoints": 4,
    "urls": 2,
    "secrets": 3,
    "emails": 2,
    "files": 2,
    "bundlers": 0
  },
  "findings": {
    "endpoints": [...],
    "urls": [...],
    "secrets": [...],
    "emails": [...],
    "files": [...],
    "bundlers": [...]
  }
}
```

### Finding Object Structure

Each finding includes:
- **category**: Type of finding (endpoints, urls, secrets, emails, files, bundlers)
- **value**: The detected value
- **source**: Source filename
- **position**: Location in file
  - **line**: Line number (1-indexed)
  - **column**: Column number (1-indexed)

Example finding:
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

This allows easy navigation to POI (Points of Interest) in your editor:
- VS Code: `app.js:42:15`
- Vim: `:42` then `15|`
- Claude Code: Click on `app.js:42`

### Categories

- **endpoints**: API paths, auth endpoints, admin panels
- **urls**: Full URLs including cloud storage
- **secrets**: API keys, tokens, credentials (masked for safety)
- **emails**: Email addresses
- **files**: References to sensitive file types
- **bundlers**: JavaScript bundlers and their versions (Webpack, Vite, Rollup, Parcel, esbuild, etc.)

## Claude Code Integration

This tool includes a Claude Code skill for easy integration.

### Usage as Skill

```bash
# In Claude Code
analyze-js bundle.js
analyze-js --verbose src/app.js
```

The skill is defined in `.claude/skills/analyze-js.md` and automatically available in projects with this tool.

### Skill Features

- Structured JSON output for easy parsing
- Automatic filtering of noise
- Security-focused analysis
- Works with downloaded JS files

## Example

### Input File (test.js)

```javascript
const API = '/api/v1/users';
const AWS_KEY = 'AKIAIOSFODNN7EXAMPLE';
const S3_URL = 'https://bucket.s3.amazonaws.com/data.json';
const email = 'admin@company.com';
```

### Command

```bash
js-analyzer --pretty test.js
```

### Output

```json
{
  "summary": {
    "total": 4,
    "endpoints": 1,
    "urls": 1,
    "secrets": 1,
    "emails": 1,
    "files": 0
  },
  "findings": {
    "endpoints": [
      {
        "category": "endpoints",
        "value": "/api/v1/users",
        "source": "test.js",
        "position": {
          "line": 5,
          "column": 12
        }
      }
    ],
    "urls": [
      {
        "category": "urls",
        "value": "https://bucket.s3.amazonaws.com/data.json",
        "source": "test.js",
        "position": {
          "line": 8,
          "column": 18
        }
      }
    ],
    "secrets": [
      {
        "category": "secrets",
        "value": "AKIAIOSFOD...AMPLE (AWS Key)",
        "source": "test.js",
        "position": {
          "line": 3,
          "column": 16
        }
      }
    ],
    "emails": [
      {
        "category": "emails",
        "value": "admin@company.com",
        "source": "test.js",
        "position": {
          "line": 10,
          "column": 4
        }
      }
    ],
    "files": []
  }
}
```

## Noise Filtering

The tool automatically filters out:

- Module imports (`./`, `../`, `node_modules`)
- Build artifacts (webpack, babel, polyfills)
- XML/PDF internal structures
- Locale files (en.js, en-US.js)
- Static assets (.css, .png, .svg)
- Test/placeholder domains (example.com, test.com)
- Common JS library internals

## Security Notice

This tool is designed for **authorized security testing only**:

- ✅ Penetration testing with proper authorization
- ✅ Bug bounty programs
- ✅ Security research on your own applications
- ✅ Code review and security audits
- ❌ Unauthorized testing of third-party applications
- ❌ Malicious use

Always ensure you have permission to analyze the code you're testing.

## Architecture

```
tools/
├── bin/
│   └── cli.js           # CLI entry point (Bun shebang)
├── lib/
│   ├── analyzer.js      # Core analyzer with deduplication
│   ├── patterns.js      # Regex patterns for detection
│   └── validators.js    # Validation and noise filtering
├── .claude/
│   └── skills/
│       └── analyze-js.md  # Claude Code skill definition
├── package.json         # NPM package config
└── README.md
```

## Contributing

Based on the Burp Suite JS Analyzer extension. This is a standalone CLI port optimized for:

- Command-line usage
- Integration with Claude Code
- Bun runtime performance
- JSON output for automation

## License

MIT
