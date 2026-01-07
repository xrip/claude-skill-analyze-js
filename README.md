# JS Analyzer - Claude Code Skill

🤖 **Claude Code skill** for JavaScript static analysis - detect endpoints, URLs, secrets, and security issues with TOON format support for efficient LLM consumption.

**Primary use:** Claude Code skill via `/analyze-js` command
**Secondary use:** Standalone CLI tool via `npx js-analyzer-cli`

## Table of Contents

- [Quick Start with Claude Code](#quick-start-with-claude-code)
- [What is a Claude Code Skill?](#what-is-a-claude-code-skill)
- [Features](#features)
- [Using as Claude Skill](#using-as-claude-skill)
  - [Installation](#installation-as-skill)
  - [Usage Examples](#usage-examples)
  - [Common Use Cases](#common-use-cases)
  - [Using the Skill in Other Projects](#using-the-skill-in-other-projects)
- [Standalone CLI Usage](#standalone-cli-usage)
  - [Installation](#installation-standalone)
  - [Basic Usage](#basic-usage)
  - [Output Formats](#output-formats)
- [What Gets Detected](#what-gets-detected)
- [Bundler Detection](#bundler-detection)
- [Noise Filtering](#noise-filtering)
- [Security Notice](#security-notice)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Quick Start with Claude Code

**Simplest way to use this tool - as a Claude Code skill:**

1. In any project directory with this skill installed:
```
User: analyze-js bundle.js
User: analyze-js src/ dist/
User: analyze-js --verbose frontend/
```

2. Claude automatically:
   - Executes the analyzer
   - Parses TOON/JSON results
   - Highlights critical findings (secrets, admin endpoints)
   - Provides security insights
   - Shows exact locations (`file:line:column`)

That's it! No installation needed if using in this project.

## What is a Claude Code Skill?

Claude Code skills are reusable commands that you can invoke directly in conversations with Claude. This project provides an `analyze-js` skill that makes JavaScript security analysis seamless and context-aware.

**Benefits:**
- ✅ **Natural language interface** - Just say "analyze this bundle"
- ✅ **Automatic interpretation** - Claude understands findings and provides insights
- ✅ **Context-aware** - Combines with other Claude capabilities (downloads, reports, etc.)
- ✅ **No command memorization** - No need to remember CLI flags

## Features

- **API Endpoints Detection**: REST APIs, GraphQL, OAuth paths, admin panels, sensitive paths
- **URL Extraction**: HTTP/HTTPS/WebSocket URLs, cloud storage (S3, Azure Blob, GCS)
- **Secret Detection**: AWS keys, Google API keys, Stripe tokens, GitHub tokens, JWT, private keys, database credentials
- **Email Discovery**: Valid email addresses (filters test/placeholder emails)
- **File References**: Sensitive files (.env, .key, .pem, configs, backups, certificates)
- **Bundler Detection**: Identifies bundlers and their versions (Webpack, Vite, Rollup, Parcel, esbuild, Browserify, Turbopack, SWC, Metro, and more)
- **Noise Filtering**: Removes build artifacts, module imports, XML namespaces, and other false positives
- **Deduplication**: Tracks seen values across multiple files
- **TOON Format**: Default output optimized for LLMs (50% smaller than JSON)

## Using as Claude Skill

### Installation as Skill

**Option 1: Use in this project (no installation)**

The skill is automatically available when you're in this project directory. Claude Code detects skills from the `.claude/skills/` directory.

**Option 2: Install globally for use anywhere**

```bash
# 1. Install the CLI tool globally
bun install -g js-analyzer-cli
# or: npm install -g js-analyzer-cli

# 2. Copy the skill to your project
mkdir -p .claude/skills/analyze-js
curl -o .claude/skills/analyze-js/SKILL.md \
  https://raw.githubusercontent.com/xrip/claude-skill-analyze-js/master/.claude/skills/analyze-js/SKILL.md

# 3. Update SKILL.md to use global command
# Change: bunx --bun js-analyzer-cli
# To: js-analyzer
```

**Option 3: Use with npx (no installation)**

```bash
# Copy the skill file
mkdir -p .claude/skills/analyze-js
curl -o .claude/skills/analyze-js/SKILL.md \
  https://raw.githubusercontent.com/xrip/claude-skill-analyze-js/master/.claude/skills/analyze-js/SKILL.md

# The skill will use: npx js-analyzer-cli
# (already configured in SKILL.md)
```

### Usage Examples

In Claude Code, simply use the skill naturally:

```
User: analyze-js bundle.js
User: analyze-js src/
User: analyze-js --verbose dist/
User: analyze-js frontend/ backend/
User: analyze-js --format=json app.js
```

Or in natural language:
```
User: Can you analyze the bundle.js file for security issues?
User: Check dist/ for API endpoints and secrets
User: What bundler is this application using?
```

### Skill Capabilities

When you invoke the skill, Claude will:

1. **Execute the analyzer** on specified files/directories
2. **Parse results** automatically (TOON or JSON format)
3. **Present findings** in a structured, readable format
4. **Highlight critical items**:
   - 🔴 Secrets (AWS keys, API tokens, credentials)
   - ⚠️ Admin endpoints
   - 🔧 Bundler information
   - 📧 Email addresses
   - 📁 Sensitive file references
5. **Provide security context** about what was found and why it matters
6. **Show exact locations** using `file:line:column` format (clickable in most IDEs)

### Common Use Cases

**1. Security Analysis:**
```
User: I downloaded bundle.js from example.com. Can you analyze it for security issues?

Claude: [Runs analyze-js bundle.js]
Found 23 findings:
- 🔴 2 AWS keys at bundle.js:1247:15 and bundle.js:2891:22
- ⚠️ Admin endpoint /admin/users at bundle.js:234:12
- 12 API endpoints
- Webpack 5.88.2 detected
```

**2. Technology Fingerprinting:**
```
User: analyze-js dist/app.js

Claude: Detected build tools:
- Vite 4.3.9
- Rollup 3.26.0 (used by Vite internally)
```

**3. Multiple Directories:**
```
User: analyze-js src/ public/js/

Claude: Scanning 45 files across 2 directories...
Summary: 67 findings
- 34 endpoints
- 12 URLs
- 3 secrets (masked)
- 18 other items
```

**4. Combined Workflows:**
```
User: Download JS from https://example.com/app.js and analyze it

Claude: [Downloads file]
Claude: [Runs analyze-js app.js]
Claude: Security analysis complete. Here's what I found...

User: Create a security report from those findings

Claude: [Generates detailed report with recommendations]
```

### Skill Output Example

```
📊 Analysis Results for bundle.js

Summary:
- Total findings: 28
- Endpoints: 12
- Secrets: 3 (masked for safety)
- URLs: 5
- Bundler: Webpack 5.88.2

🔴 Critical Findings:
• AWS Access Key at bundle.js:1247:15
  Value: AKIA...AMPLE (masked)

• Stripe Live Key at bundle.js:3891:22
  Value: sk_live_51...d9sK (masked)

• Admin endpoint: /admin/users/delete at bundle.js:234:12

⚠️ Notable Endpoints:
• /api/v1/users at bundle.js:42:15
• /oauth/token at bundle.js:105:18
• /graphql at bundle.js:67:14

🔧 Build Information:
• Webpack 5.88.2 at bundle.js:1:15
```

### Using the Skill in Other Projects

To use this skill in any project:

**Quick method (npx/bunx - no installation):**

```bash
# In your project directory
mkdir -p .claude/skills/analyze-js

# Download the skill file
curl -o .claude/skills/analyze-js/SKILL.md \
  https://raw.githubusercontent.com/xrip/claude-skill-analyze-js/master/.claude/skills/analyze-js/SKILL.md
```

The skill is pre-configured to use `npx js-analyzer-cli` which works without installation.

**For better performance, use bunx:**

Edit `.claude/skills/analyze-js/SKILL.md` and change the command to:
```bash
bunx --bun js-analyzer-cli [OPTIONS] <paths...>
```

**For fastest execution (global install):**

```bash
# Install globally first
bun install -g js-analyzer-cli

# Then in SKILL.md, use:
js-analyzer [OPTIONS] <paths...>
```

## Standalone CLI Usage

While the primary use case is as a Claude Code skill, you can also use this as a standalone CLI tool.

### Installation (Standalone)

**Option 1: npx (no installation)**
```bash
npx js-analyzer-cli <files>
```

**Option 2: bunx (faster)**
```bash
bunx --bun js-analyzer-cli <files>
```

**Option 3: Global installation**
```bash
# With bun (recommended)
bun install -g js-analyzer-cli

# Or with npm
npm install -g js-analyzer-cli

# Then use:
js-analyzer <files>
```

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
- Compact `file:line:column` location format
- Tab-delimited columns for optimal tokenization
- Human-readable structure
- Explicit array lengths
- Official `@toon-format/toon` library

Example TOON output:
```
__comment: "JS Analyzer Results - Generated: 2026-01-06T20:45:12.345Z"
summary:
  total: 13
  endpoints: 4
  urls: 1
  secrets: 0
  emails: 0
  files: 0
  bundlers: 1

findings:
  endpoints[4	]{value	location}:
    /api/v1/users	app.js:42:15
    /api/v1/posts	app.js:58:23
    /oauth/token	app.js:105:18
    /graphql	app.js:9:14
  urls[1	]{value	location}:
    https://api.example.com	app.js:67:20
  bundlers[1	]{value	location}:
    Webpack 5.88.2	app.js:1:15
```

**Location format**: `file:line:column` - click to navigate in most IDEs and terminals.

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

**JSON Format:**

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

**TOON Format (default):**

Uses compact `file:line:column` notation:
```
endpoints[4	]{value	location}:
  /api/v1/users	app.js:42:15
  /api/v1/posts	app.js:58:23
  /oauth/token	app.js:105:18
  /admin/dashboard	app.js:234:12
```

This allows easy navigation to POI (Points of Interest) in your editor:
- VS Code: Click on `app.js:42:15`
- Vim: `:e app.js | :42 | norm 15|`
- Terminal: Most modern terminals auto-detect and make it clickable
- Claude Code: Click on `app.js:42`

### Categories

- **endpoints**: API paths, auth endpoints, admin panels
- **urls**: Full URLs including cloud storage
- **secrets**: API keys, tokens, credentials (masked for safety)
- **emails**: Email addresses
- **files**: References to sensitive file types
- **bundlers**: JavaScript bundlers and their versions (Webpack, Vite, Rollup, Parcel, esbuild, etc.)

## What Gets Detected

### ✅ API Endpoints
- REST APIs: `/api/v1/users`, `/api/auth/login`
- GraphQL: `/graphql`, `/graphql/v1`
- OAuth paths: `/oauth/token`, `/oauth/authorize`
- Admin panels: `/admin/dashboard`, `/admin/users`
- Sensitive paths: `/.well-known/openid-configuration`

### ✅ URLs
- HTTP/HTTPS: `https://api.example.com/data`
- WebSocket: `wss://realtime.example.com/ws`
- Cloud Storage:
  - AWS S3: `https://bucket.s3.amazonaws.com/file.json`
  - Google Cloud Storage: `https://storage.googleapis.com/project/data`
  - Azure Blob: `https://account.blob.core.windows.net/container/file`

### ✅ Secrets (Masked for Safety)
- **AWS Keys**: `AKIAIOSFOD...AMPLE (AWS Key)`
- **Google API**: `AIzaSyDaGm...ewQe (Google API)`
- **Stripe**: `sk_live_51...d9sK (Stripe Live Key)`
- **GitHub**: `ghp_123456...uvwx (GitHub PAT)`
- **JWT Tokens**: `eyJhbGciOi...sw5c (JWT)`
- **Private Keys**: `-----BEGIN PRIVATE KEY-----`
- **Database**: Connection strings, credentials

### ✅ Email Addresses
- Valid emails: `admin@company.com`, `support@example.io`
- Filters out: test emails, placeholders, example domains

### ✅ Sensitive Files
- Environment: `.env`, `.env.production`, `.env.local`
- Configs: `database.config.yml`, `aws.config.json`
- Certificates: `ssl/server.pem`, `cert.key`
- Backups: `backup.sql`, `db_dump.sql`
- SSH keys: `id_rsa`, `id_ed25519`

### ✅ Bundlers
- **Webpack**: Version detection via comments and runtime signatures
- **Vite**: Version strings and `__vite__` signature
- **Rollup**: From banner comments
- **Parcel, esbuild, Turbopack, SWC, Metro** and more

### ❌ Noise (Auto-filtered)
- Module imports: `./utils/helper`, `../lib/db`
- Build artifacts: `webpack`, `polyfill`, `chunk.js`
- Static files: `.css`, `.png`, `.woff`
- Test domains: `example.com`, `test.com`, `localhost`
- XML namespaces, locale files

## Bundler Detection

The tool automatically detects JavaScript bundlers and their versions in compiled/bundled code:

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

Based on the Burp Suite JS Analyzer extension. This is a Claude Code skill and standalone CLI port optimized for:

- **Claude Code integration** - Seamless skill-based workflow
- **LLM consumption** - TOON format for efficient token usage
- **Command-line usage** - Standalone tool for CI/CD and automation
- **Bun runtime performance** - Fast execution with modern runtime

## License

MIT
