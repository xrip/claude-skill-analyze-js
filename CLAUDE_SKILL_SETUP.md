# Claude Code Skill Setup Guide

This guide shows you how to use the `analyze-js` Claude Code skill in your projects.

## What is a Claude Code Skill?

A Claude Code skill is a reusable command that you can invoke in Claude Code conversations. Instead of typing long commands, you simply use short skill names like `analyze-js bundle.js`.

## Quick Start (No Installation Required)

### Option 1: Use npx (Works everywhere)

Just copy the skill file to your project:

```bash
# Create skill directory
mkdir -p .claude/skills/analyze-js

# Download the skill file
curl -o .claude/skills/analyze-js/SKILL.md \
  https://raw.githubusercontent.com/xrip/claude-skill-analyze-js/master/.claude/skills/analyze-js/SKILL.md
```

That's it! Now you can use `analyze-js` in Claude Code:

```
User: analyze-js dist/bundle.js
Claude: [Analyzes the file using npx js-analyzer-cli]
```

The skill will automatically download and run the analyzer when needed (via npx).

**Recommended: Use bunx for faster execution:**

The skill supports both `npx` and `bunx`. If you have Bun installed, bunx is significantly faster:
- First run: npx ~2-3s, bunx ~0.5s
- Subsequent runs: both are instant (cached)

To use bunx, just install Bun: `curl -fsSL https://bun.sh/install | bash`

### Option 2: Install Globally

For faster execution (no download on first use):

```bash
# Install the tool globally
bun install -g js-analyzer-cli

# Copy the skill file (same as above)
mkdir -p .claude/skills/analyze-js
curl -o .claude/skills/analyze-js/SKILL.md \
  https://raw.githubusercontent.com/xrip/claude-skill-analyze-js/master/.claude/skills/analyze-js/SKILL.md
```

### Option 3: Local Development

Clone this repository for local development:

```bash
# Clone the repo
git clone https://github.com/xrip/claude-skill-analyze-js.git
cd claude-skill-analyze-js

# The skill is already in .claude/skills/analyze-js/
# Use: bun bin/cli.js [options] <paths>
```

## Usage in Claude Code

Once the skill is set up, use it naturally in conversation:

```
User: analyze-js bundle.js

User: analyze-js --verbose src/

User: Can you analyze dist/app.js and tell me what bundler was used?
Claude: [Uses analyze-js dist/app.js]
Claude: The application was built with Webpack 5.88.2...

User: analyze-js public/js/ and create a security report
Claude: [Analyzes all JS files and generates a report]
```

## Available Flags

- `--verbose` - Show detailed progress
- `--format=json` - Output as JSON instead of TOON
- `--pretty` - Pretty print JSON output
- `--no-recursive` - Don't scan directories recursively

## What It Detects

The analyzer finds:
- **API Endpoints** - REST APIs, GraphQL, OAuth paths
- **URLs** - External links, cloud storage, WebSockets
- **Secrets** - API keys, tokens, JWT, private keys
- **Emails** - Email addresses (filters test emails)
- **Files** - References to sensitive files (.env, .key, etc.)
- **Bundlers** - Webpack, Vite, Rollup, Parcel, esbuild, and more

## Examples

### Security Audit
```
User: analyze-js dist/main.js
Claude: Found:
- 12 API endpoints
- 2 AWS keys (masked: AKIA...MPLE)
- Webpack 5.75.0
- Admin endpoint: /admin/users at main.js:234:12

Click on main.js:234:12 to navigate directly to the finding.
```

### Technology Stack Discovery
```
User: What bundler is this app using?
Claude: [Runs analyze-js]
Found: Vite 4.3.9 at bundle.js:1:15 and Rollup 3.26.0 at bundle.js:3:20
```

### Multiple Files
```
User: analyze-js src/ public/js/
Claude: Scanning 45 files...
Total findings: 67
- Endpoints: 23 (locations in TOON format with file:line:column)
- Secrets: 4
- Bundlers: Webpack 5.88.2
```

## Execution Methods

The skill automatically chooses the best execution method:

1. **Local** - If `bin/cli.js` exists in project → uses local version
2. **Remote** - Otherwise → uses `bunx --bun js-analyzer-cli`

You can also force a specific method by editing the SKILL.md file.

## Troubleshooting

### "Skill not found"
```bash
# Verify skill file exists
ls .claude/skills/analyze-js/SKILL.md

# If missing, download it again
curl -o .claude/skills/analyze-js/SKILL.md \
  https://raw.githubusercontent.com/xrip/claude-skill-analyze-js/master/.claude/skills/analyze-js/SKILL.md
```

### "Command not found: bunx"
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Or use npx instead (edit SKILL.md to use npx)
```

### Slow first run
The first time you use bunx, it downloads the package. Subsequent runs are fast.
To avoid this, install globally with `bun install -g js-analyzer-cli`.

## Customization

You can customize the skill by editing `.claude/skills/analyze-js/SKILL.md`:

- Change the skill name
- Modify the description
- Add custom examples
- Change default flags

## More Information

- GitHub: https://github.com/xrip/claude-skill-analyze-js
- NPM Package: js-analyzer-cli
- Claude Code Docs: https://claude.com/claude-code

## License

MIT - Free to use in any project
