# JS Analyzer - Quick Start Guide

**🤖 Primary use:** Claude Code Skill
**⚙️ Alternative:** Standalone CLI tool

## Using as Claude Code Skill (Recommended)

### In this project (no setup needed)

Just use it naturally in Claude Code:

```
User: analyze-js bundle.js
User: analyze-js src/
User: analyze-js --verbose dist/
```

Claude will:
- Execute the analyzer
- Parse TOON/JSON results
- Highlight critical findings (secrets, admin endpoints)
- Provide security context
- Show clickable `file:line:column` locations

### In other projects

**Quick setup (npx - no installation):**

```bash
# In your project directory
mkdir -p .claude/skills/analyze-js

# Download skill file
curl -o .claude/skills/analyze-js/SKILL.md \
  https://raw.githubusercontent.com/xrip/claude-skill-analyze-js/master/.claude/skills/analyze-js/SKILL.md
```

Done! The skill uses `npx js-analyzer-cli` which works without installation.

**For better performance (bunx):**

```bash
# Edit .claude/skills/analyze-js/SKILL.md and change:
bunx --bun js-analyzer-cli [OPTIONS] <paths...>
```

**For fastest execution (global install):**

```bash
# Install globally
bun install -g js-analyzer-cli
# or: npm install -g js-analyzer-cli

# Edit .claude/skills/analyze-js/SKILL.md and use:
js-analyzer [OPTIONS] <paths...>
```

### Example Usage

**Security analysis:**
```
User: I downloaded bundle.js from example.com, can you analyze it?

Claude: [Runs analyze-js bundle.js]
Found 23 findings:
- 🔴 2 AWS keys at bundle.js:1247:15 and bundle.js:2891:22
- ⚠️ Admin endpoint /admin/users at bundle.js:234:12
- 12 API endpoints
- Webpack 5.88.2 detected
```

**Technology fingerprinting:**
```
User: analyze-js dist/app.js

Claude: Detected build tools:
- Vite 4.3.9
- Rollup 3.26.0
```

**Combined workflows:**
```
User: Download JS from https://example.com/app.js and analyze it

Claude: [Downloads file]
Claude: [Runs analyze-js app.js]
Claude: Found 15 items including 3 sensitive endpoints...

User: Create a security report

Claude: [Generates detailed report with recommendations]
```

## Standalone CLI Usage (Alternative)

### Installation

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

### Quick Examples

**Analyze a single file:**
```bash
js-analyzer bundle.js
```

**Analyze a directory (recursive):**
```bash
js-analyzer src/
```

**Verbose mode with pretty JSON:**
```bash
js-analyzer --verbose --pretty frontend/ backend/
```

**Non-recursive scan:**
```bash
js-analyzer --no-recursive dist/
```

### Output Formats

**TOON Format (Default)**

Token-efficient format optimized for Large Language Models:
```bash
js-analyzer app.js
```

**Benefits of TOON:**
- 40-50% fewer tokens than JSON
- Tab-delimited tabular arrays for optimal tokenization
- Official `@toon-format/toon` library
- Easy for LLMs to parse
- Human-readable
- **Default output format**

**Example:**
```toon
# JS Analyzer Results
summary:
  total: 4
  endpoints: 1

findings:
  endpoints[1	]{value	source	line	column}:
    /api/v1/users	app.js	5	12
```

Read more: [TOON Format Specification](https://github.com/toon-format/toon)

### JSON Format (Optional)

Standard JSON output with all details:
```bash
js-analyzer --format=json --pretty app.js
```

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
