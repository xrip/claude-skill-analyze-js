# Publishing Guide

## Prerequisites

1. Create an account on [npmjs.com](https://www.npmjs.com/)
2. Login to npm:
   ```bash
   npm login
   ```

## Before Publishing

1. Update version in `package.json` if needed
2. Update repository URLs in `package.json` with your GitHub username
3. Ensure all tests pass:
   ```bash
   bun bin/cli.js test-sample.js
   ```

## Dry Run

Test what will be published:
```bash
npm pack --dry-run
```

## Publish to npm

```bash
# Publish public package
npm publish --access public

# Or if already published
npm version patch  # or minor, or major
npm publish
```

## After Publishing

Users can now install and use:

```bash
# Use with bunx (no installation)
bunx js-analyzer-cli <files>

# Or install globally
bun install -g js-analyzer-cli
js-analyzer <files>

# Or with npm
npm install -g js-analyzer-cli
```

## Verify Publication

```bash
# Check on npm
npm view js-analyzer-cli

# Test installation
bunx js-analyzer-cli --version
```

## Update Published Package

```bash
# Make changes, then:
npm version patch  # Increments 1.0.0 -> 1.0.1
# or
npm version minor  # Increments 1.0.0 -> 1.1.0
# or
npm version major  # Increments 1.0.0 -> 2.0.0

npm publish
```

## Unpublish (use with caution)

```bash
# Unpublish specific version
npm unpublish js-analyzer-cli@1.0.0

# Unpublish entire package (only within 72 hours)
npm unpublish js-analyzer-cli --force
```
