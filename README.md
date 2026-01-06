# JS Analyzer CLI

Command-line tool for analyzing JavaScript files to find API endpoints, secrets, URLs, emails, sensitive file references, and bundler information. Ported from Burp Suite JS Analyzer extension.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Output Formats](#output-formats)
- [Bundler Detection](#bundler-detection)
- [Claude Code Integration](#claude-code-integration)
  - [What is a Claude Code Skill?](#what-is-a-claude-code-skill)
  - [Usage as Skill](#usage-as-skill)
  - [Common Use Cases](#common-use-cases)
  - [Using the Skill in Other Projects](#using-the-skill-in-other-projects)
- [Example](#example)
- [Noise Filtering](#noise-filtering)
- [Security Notice](#security-notice)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

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

This tool includes a Claude Code skill for seamless integration with Claude CLI.

### What is a Claude Code Skill?

Claude Code skills are reusable commands that you can invoke directly in conversations with Claude. This project includes an `analyze-js` skill that makes it easy to analyze JavaScript files without typing the full command.

### Installation

The skill is automatically available when you're in this project directory. Claude Code detects skills from the `.claude/skills/` directory.

**Skill location:** `.claude/skills/analyze-js/SKILL.md`

### Usage as Skill

Instead of typing the full command:
```bash
bun bin/cli.js --verbose src/app.js
```

You can simply use:
```bash
analyze-js src/app.js
```

Or even more naturally in Claude Code conversation:
```
User: analyze-js bundle.js
User: analyze-js --verbose dist/
User: analyze-js frontend/ backend/
```

### Skill Capabilities

When you invoke the skill, Claude will:

1. **Execute the analyzer** on the specified files/directories
2. **Parse the results** automatically (TOON or JSON format)
3. **Present findings** in a structured, readable format
4. **Highlight important discoveries** like secrets, sensitive endpoints
5. **Provide context** about what was found and why it matters

### Common Use Cases

**1. Analyzing downloaded JavaScript files:**
```
User: I downloaded bundle.js from example.com. Can you analyze it?
Claude: [Uses analyze-js to scan bundle.js]
Claude: Found 23 endpoints, 5 secrets, and identified Webpack 5.88.2...
```

**2. Security audit:**
```
User: analyze-js dist/main.js
Claude: Analyzing... Found:
- 12 API endpoints (including /admin/users)
- 2 AWS keys (AKIA...)
- Webpack 5.75.0 (note: vulnerable version)
```

**3. Multiple directories:**
```
User: analyze-js src/ public/js/
Claude: Scanning 45 files...
Summary: 67 findings across 2 directories
```

**4. Technology fingerprinting:**
```
User: What bundler and version is this app using?
Claude: [Uses analyze-js]
Found: Vite 4.3.9 and Rollup 3.26.0
```

### Skill Output

The skill provides:
- **Summary statistics** - Total findings by category
- **Detailed findings** - All discovered items with positions
- **Bundler information** - Detected build tools and versions
- **Security insights** - Highlighted sensitive data
- **Navigation hints** - Line:column references for quick access

Example output:
```
📊 Analysis Results for bundle.js

Summary:
- Total findings: 28
- Endpoints: 12
- Secrets: 3 (masked)
- Bundlers: Webpack 5.88.2

🔴 Critical Findings:
- AWS Key found at line 1247
- Private API key at line 3891
- Admin endpoint: /admin/users

🔧 Build Info:
- Webpack 5.88.2 (bundler)
- Built with production mode
```

### Advanced Usage

**Combining with other Claude capabilities:**

```
User: Download the JS from https://example.com/app.js and analyze it
Claude: [Downloads file]
Claude: [Runs analyze-js app.js]
Claude: Here's what I found...

User: analyze-js dist/ and create a security report
Claude: [Analyzes all JS files]
Claude: [Generates detailed security report with findings]
```

**With specific flags:**
```
User: analyze-js --format=json --pretty bundle.js
Claude: [Returns formatted JSON for further processing]

User: analyze-js --verbose --no-recursive build/
Claude: [Scans only top-level files with progress details]
```

### Skill Configuration

The skill is configured in `.claude/skills/analyze-js/SKILL.md`:

```yaml
---
name: analyze-js
description: Analyze JavaScript files for API endpoints, secrets, URLs, emails,
             sensitive files, and bundler versions
examples:
  - analyze-js bundle.js
  - analyze-js src/
  - analyze-js --verbose dist/
---
```

You can customize:
- **name**: The command you type
- **description**: What Claude shows in skill suggestions
- **examples**: Sample usage patterns

### Benefits of Using the Skill

✅ **Faster**: Type `analyze-js` instead of full command path
✅ **Context-aware**: Claude understands the results and provides insights
✅ **Integrated**: Works seamlessly with other Claude Code features
✅ **Smart parsing**: Claude interprets findings and highlights important items
✅ **Interactive**: Ask follow-up questions about findings
✅ **Automated workflows**: Combine with downloads, reports, and other tasks

### Troubleshooting

**Skill not found:**
```bash
# Verify you're in the project directory
pwd

# Check skill file exists
ls .claude/skills/analyze-js/SKILL.md

# Restart Claude Code if needed
```

**Permission issues:**
```bash
# Ensure Bun is installed
bun --version

# Make CLI executable (Unix/Mac)
chmod +x bin/cli.js
```

### Using the Skill in Other Projects

You can use this skill in any project by either:

**Option 1: Install globally and symlink the skill**
```bash
# Install the tool globally
bun install -g js-analyzer-cli

# Create skill directory in your project
mkdir -p .claude/skills/analyze-js

# Copy the skill file
cp /path/to/tools/.claude/skills/analyze-js/SKILL.md .claude/skills/analyze-js/

# Update the command path in SKILL.md to use global installation:
# Change: bun bin/cli.js
# To: js-analyzer
```

**Option 2: Reference this project's skill**
```bash
# In your project's .claude/skills/ directory
ln -s /path/to/tools/.claude/skills/analyze-js ./analyze-js
```

**Option 3: Use bunx (no installation needed)**

Modify the skill file to use `bunx`:
```yaml
---
name: analyze-js
description: Analyze JavaScript files...
---

## Command to Execute

```bash
bunx js-analyzer-cli [OPTIONS] <paths...>
```
```

This way, the skill works in any project without local installation.

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

## Bundler Detection

The tool can detect JavaScript bundlers and their versions in compiled/bundled code:

### Supported Bundlers

- **Webpack** - Detects version strings and runtime signatures (`__webpack_require__`, `__webpack_modules__`, `webpackJsonp`)
- **Vite** - Detects version strings and `__vite__` runtime signature
- **Rollup** - Detects version from comments (e.g., `/*** Rollup (3.26.0) ***/`)
- **Parcel** - Detects version strings and `__parcel__` runtime signature
- **esbuild** - Detects version from comments (e.g., `/* esbuild 0.18.11 */`)
- **Browserify** - Detects version strings
- **Turbopack** - Detects version strings
- **SWC** - Detects `@swc/core` version strings
- **Metro** - Detects Metro bundler (React Native)
- **FuseBox** - Detects version strings
- **Snowpack** - Detects version strings
- **WMR** - Detects version strings

### Example Output

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

For runtime signatures without explicit versions:
```json
{
  "category": "bundlers",
  "value": "Webpack (detected)",
  "source": "app.js",
  "position": {
    "line": 42,
    "column": 5
  }
}
```

This is useful for:
- Security assessment (identifying outdated bundler versions)
- Technology fingerprinting
- Build process analysis
- Understanding minified/bundled code

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
