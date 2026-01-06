# JS Analyzer - Quick Start Guide

## Installation

### Option 1: Global Installation (Recommended)

```bash
# From project directory
npm install -g .

# Now use anywhere
js-analyzer <files>
```

### Option 2: NPX Usage (No Installation)

```bash
# Run directly with npx
npx js-analyzer-cli <files>
```

### Option 3: Direct Execution

```bash
# Make executable
chmod +x bin/cli.js

# Run with bun
bun bin/cli.js <files>
```

## Quick Examples

### 1. Analyze a Single File

```bash
js-analyzer bundle.js
```

**Output:**
```json
{
  "summary": {
    "total": 15,
    "endpoints": 5,
    "urls": 3,
    "secrets": 2,
    "emails": 3,
    "files": 2
  },
  "findings": { ... }
}
```

### 2. Analyze a Directory

```bash
# Recursive scan (default)
js-analyzer src/

# Non-recursive (top-level only)
js-analyzer --no-recursive dist/
```

### 3. Pretty Print Output

```bash
js-analyzer --pretty dist/
```

### 4. Multiple Paths with Verbose Mode

```bash
js-analyzer --verbose --pretty frontend/ backend/ utils.js
```

**Output:**
```
Found 24 JavaScript file(s) to analyze
Analyzing: frontend/app.js
  Found 12 items
Analyzing: frontend/config.js
  Found 3 items
Analyzing: backend/server.js
  Found 7 items
...
{
  "summary": { "total": 22, ... },
  ...
}
```

### 5. Analyze Downloaded JS

```bash
# Download and analyze
curl -s https://example.com/app.js -o temp.js
js-analyzer temp.js
rm temp.js
```

### 6. With Claude Code Skill

```bash
# In Claude Code, simply use:
analyze-js dist/
analyze-js src/ lib/
analyze-js --format=toon src/  # TOON format for LLMs
```

## Output Formats

### JSON (Default)

Standard JSON output with all details:
```bash
js-analyzer --pretty app.js
```

### TOON Format

Token-efficient format optimized for Large Language Models:
```bash
js-analyzer --format=toon app.js
```

**Benefits of TOON:**
- 40-50% fewer tokens than JSON
- Compact tabular arrays
- Easy for LLMs to parse
- Human-readable

**Example:**
```toon
# JS Analyzer Results
summary:
  total: 4
  endpoints: 1

findings:
  endpoints[1]{value,source,line,column}:
    /api/v1/users,app.js,5,12
```

Read more: [TOON Format Specification](https://github.com/toon-format/toon)

## Claude Code Integration

### Auto-discovery

The skill is automatically available in projects with `.claude/skills/analyze-js.md`.

### Manual Trigger

Ask Claude to analyze JS files:
```
"Can you analyze the bundle.js file for security issues?"
```

Claude will automatically invoke:
```bash
analyze-js bundle.js
```

### Parse Results in Claude

Claude receives structured JSON and can:
- Summarize findings by category
- Highlight high-priority secrets
- Generate security reports
- Suggest remediation steps

## What Gets Detected?

### ✅ Endpoints
- `/api/v1/users`
- `/oauth/token`
- `/admin/dashboard`
- `/graphql`
- `/.well-known/openid-configuration`

### ✅ URLs
- `https://api.example.com/data`
- `wss://realtime.example.com/ws`
- `https://bucket.s3.amazonaws.com/file.json`
- `https://storage.googleapis.com/project/data`

### ✅ Secrets (Masked)
- `AKIAIOSFOD...AMPLE (AWS Key)`
- `AIzaSyDaGm...ewQe (Google API)`
- `sk_live_51...d9sK (Stripe Live)`
- `ghp_123456...uvwx (GitHub PAT)`
- `eyJhbGciOi...sw5c (JWT)`

### ✅ Emails
- `admin@company.com`
- `support@example.io`

### ✅ Files
- `.env.production`
- `database.config.yml`
- `ssl/server.pem`
- `backup.sql`

## What Gets Filtered?

### ❌ Noise (Automatically Removed)
- Module imports: `./utils/helper`, `../lib/db`
- Build artifacts: `webpack`, `polyfill`, `chunk.js`
- Static files: `.css`, `.png`, `.woff`
- Test domains: `example.com`, `test.com`, `localhost`
- Locale files: `en.js`, `en-US.json`
- XML namespaces: `http://www.w3.org/...`

## Output Schema

```json
{
  "files": [
    {
      "path": "app.js",
      "status": "analyzed",      // or "not_found", "error"
      "findings": 15
    }
  ],
  "summary": {
    "total": 15,
    "endpoints": 5,
    "urls": 3,
    "secrets": 2,
    "emails": 3,
    "files": 2
  },
  "findings": {
    "endpoints": [
      {
        "category": "endpoints",
        "value": "/api/v1/users",
        "source": "app.js",
        "position": {
          "line": 42,
          "column": 15
        }
      }
    ],
    "urls": [ ... ],
    "secrets": [ ... ],
    "emails": [ ... ],
    "files": [ ... ]
  }
}
```

### Position Information

Each finding includes `position` with:
- **line**: Line number (1-indexed) where the finding was detected
- **column**: Column number (1-indexed) where the match starts

This allows quick navigation in editors:
```bash
# VS Code / WebStorm
app.js:42:15

# Vim
vim +42 app.js

# Claude Code
# Click on "app.js:42" in findings
```

## Common Use Cases

### Security Audit
```bash
# Analyze all production JS
js-analyzer --verbose dist/*.js > security-audit.json
```

### Bug Bounty Recon
```bash
# Download target JS
curl -s https://target.com/bundle.js | js-analyzer /dev/stdin
```

### CI/CD Integration
```bash
# Add to pipeline
js-analyzer build/*.js --pretty > artifacts/security-report.json
if [ $(jq '.summary.secrets' artifacts/security-report.json) -gt 0 ]; then
  echo "SECRETS DETECTED!"
  exit 1
fi
```

### Development Review
```bash
# Pre-commit hook
js-analyzer src/**/*.js --verbose
```

## Troubleshooting

### Command Not Found
```bash
# Ensure Bun is installed
bun --version

# Install Bun if needed
curl -fsSL https://bun.sh/install | bash
```

### No Findings
- File might be minified/obfuscated
- Content might be too short (< 50 chars)
- All findings might be filtered as noise

### Too Many False Positives
- Tool is designed to reduce noise
- Check if patterns match your use case
- Adjust validators in `lib/validators.js`

## Next Steps

1. Install globally: `npm install -g .`
2. Test with sample: `js-analyzer test-sample.js`
3. Use in Claude Code: `analyze-js <file>`
4. Review findings and remediate

## Security Reminder

Only use on:
- ✅ Your own code
- ✅ Authorized penetration tests
- ✅ Bug bounty programs
- ✅ Security research with permission

**Never** use on unauthorized systems.
