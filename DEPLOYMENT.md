# Deployment Guide

This guide covers testing, building, and deploying your Analytics SDK.

## Table of Contents

1. [Local Development](#local-development)
2. [Testing](#testing)
3. [Building](#building)
4. [Publishing to NPM](#publishing-to-npm)
5. [CDN Distribution](#cdn-distribution)
6. [CI/CD Setup](#cicd-setup)

## Local Development

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/analytics-sdk.git
cd analytics-sdk

# Install dependencies
npm install

# Run tests in watch mode
npm run test:watch

# Build in watch mode
npm run dev
```

### Development Workflow

1. Make changes to source files in `src/`
2. Tests run automatically if using `test:watch`
3. Build with `npm run dev` for live rebuilds
4. Test in browser using `examples/demo.html`

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

Coverage reports are generated in `coverage/` directory.

### Run Specific Tests

```bash
npm test client.test.ts
npm test validator.test.ts
```

### Writing Tests

Tests are located in the `tests/` directory and use Vitest:

```typescript
import { describe, it, expect } from 'vitest';
import { AnalyticsClient } from '../src/client';

describe('MyFeature', () => {
  it('should work correctly', () => {
    const client = new AnalyticsClient({ apiKey: 'test' });
    expect(client).toBeDefined();
  });
});
```

## Building

### Production Build

```bash
npm run build
```

This generates:
- `dist/index.js` - CommonJS format
- `dist/index.mjs` - ES Module format
- `dist/index.d.ts` - TypeScript definitions

### Build Output Analysis

Check bundle size:

```bash
npm run build
ls -lh dist/
```

Expected sizes:
- `index.js`: ~8-10KB
- `index.mjs`: ~8-10KB
- Gzipped: ~3-5KB

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Publishing to NPM

### First Time Setup

1. Create an NPM account at https://www.npmjs.com/signup

2. Login via CLI:
```bash
npm login
```

3. Update `package.json`:
```json
{
  "name": "@yourorg/analytics-sdk",
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/analytics-sdk.git"
  }
}
```

### Publishing Steps

1. **Update version** (following semver):
```bash
# Patch release (1.0.0 -> 1.0.1)
npm version patch

# Minor release (1.0.0 -> 1.1.0)
npm version minor

# Major release (1.0.0 -> 2.0.0)
npm version major
```

2. **Build and test**:
```bash
npm run build
npm test
```

3. **Publish**:
```bash
# Public package
npm publish --access public

# Private package (requires paid NPM account)
npm publish
```

4. **Tag release on GitHub**:
```bash
git push && git push --tags
```

### Publishing Checklist

- [ ] All tests passing
- [ ] Version number updated
- [ ] CHANGELOG.md updated
- [ ] README.md accurate
- [ ] Build successful
- [ ] No sensitive data in package
- [ ] .npmignore configured (or use package.json files field)

## CDN Distribution

After publishing to NPM, your package is automatically available on CDNs:

### unpkg

```html
<!-- Latest version -->
<script type="module">
  import AnalyticsClient from 'https://unpkg.com/@yourorg/analytics-sdk@latest/dist/index.mjs';
</script>

<!-- Specific version -->
<script type="module">
  import AnalyticsClient from 'https://unpkg.com/@yourorg/analytics-sdk@1.0.0/dist/index.mjs';
</script>
```

### jsDelivr

```html
<!-- Latest version -->
<script type="module">
  import AnalyticsClient from 'https://cdn.jsdelivr.net/npm/@yourorg/analytics-sdk@latest/dist/index.mjs';
</script>

<!-- With SRI hash for security -->
<script 
  type="module" 
  src="https://cdn.jsdelivr.net/npm/@yourorg/analytics-sdk@1.0.0/dist/index.mjs"
  integrity="sha384-..."
  crossorigin="anonymous">
</script>
```

## CI/CD Setup

### GitHub Actions (Included)

The repository includes a CI workflow at `.github/workflows/ci.yml` that:
- Runs on push to main/develop branches
- Runs on pull requests
- Tests on Node.js 18 and 20
- Runs linting, type checking, tests, and build
- Uploads coverage reports

### Additional Workflows

#### Auto-publish on tag

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm test
      - run: npm run build
      
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add your NPM token to GitHub Secrets:
1. Generate token at https://www.npmjs.com/settings/tokens
2. Add to GitHub: Settings → Secrets → New repository secret
3. Name: `NPM_TOKEN`

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
image: node:20

stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm test
    - npm run build

publish:
  stage: deploy
  only:
    - tags
  script:
    - echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
    - npm publish --access public
```

## Self-Hosted Distribution

If you prefer to host the SDK yourself:

1. **Build the SDK**:
```bash
npm run build
```

2. **Upload to your CDN**:
```bash
# Example: Upload to S3
aws s3 cp dist/ s3://your-bucket/analytics-sdk/ --recursive
```

3. **Set cache headers** for optimal performance:
```
Cache-Control: public, max-age=31536000, immutable
```

4. **Use in HTML**:
```html
<script type="module">
  import AnalyticsClient from 'https://cdn.yoursite.com/analytics-sdk/index.mjs';
</script>
```

## Version Management

### Semantic Versioning

Follow [semver](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

### Pre-release Versions

```bash
# Alpha release
npm version prerelease --preid=alpha
# Results in: 1.0.0-alpha.0

# Beta release
npm version prerelease --preid=beta
# Results in: 1.0.0-beta.0
```

## Monitoring & Analytics

After deployment, monitor:

1. **Download stats**: Check NPM package page
2. **Bundle size**: Use bundlephobia.com
3. **Performance**: Monitor real-world usage
4. **Errors**: Set up error tracking
5. **Feedback**: Monitor GitHub issues

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

### Tests Fail

```bash
# Run with verbose output
npm test -- --reporter=verbose

# Run specific test
npm test -- client.test.ts
```

### NPM Publish Fails

```bash
# Check if you're logged in
npm whoami

# Check package name availability
npm view @yourorg/analytics-sdk

# Verify package.json
npm pack --dry-run
```

## Next Steps

After deployment:
1. Monitor download stats
2. Collect user feedback
3. Plan next features
4. Keep dependencies updated
5. Maintain documentation

## Support

- 📖 [Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/yourusername/analytics-sdk/issues)
- 💬 [Discussions](https://github.com/yourusername/analytics-sdk/discussions)
