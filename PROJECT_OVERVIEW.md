# Analytics SDK - Project Overview

## 📁 Project Structure

```
analytics-sdk/
├── src/                      # Source code
│   ├── index.ts             # Main entry point
│   ├── client.ts            # Core SDK client
│   ├── queue.ts             # Event queue manager
│   ├── types.ts             # TypeScript interfaces
│   └── utils/               # Utility functions
│       ├── validator.ts     # Input validation
│       └── storage.ts       # LocalStorage wrapper
├── tests/                   # Test files
│   ├── client.test.ts       # Client tests
│   ├── queue.test.ts        # Queue tests
│   └── validator.test.ts    # Validator tests
├── examples/                # Usage examples
│   └── demo.html           # Interactive demo
├── .github/                # GitHub Actions
│   └── workflows/
│       └── ci.yml          # CI pipeline
├── dist/                   # Build output (generated)
├── coverage/               # Test coverage (generated)
├── package.json            # NPM package config
├── tsconfig.json           # TypeScript config
├── vitest.config.ts        # Test config
├── .eslintrc.js            # Linting config
├── .gitignore              # Git ignore rules
├── README.md               # Main documentation
├── GETTING_STARTED.md      # Quick start guide
├── DEPLOYMENT.md           # Deployment guide
├── CHANGELOG.md            # Version history
├── LICENSE                 # MIT License
└── quick-start.sh          # Setup script
```

## 🎯 What This SDK Does

The Analytics SDK is a production-ready TypeScript library for tracking user events and analytics in web applications. Key features:

### Core Features
- **Event Tracking**: Track custom events with properties
- **User Identification**: Identify and track users across sessions
- **Page Views**: Automatic or manual page view tracking
- **Event Batching**: Intelligent batching to reduce network requests
- **Persistence**: LocalStorage-backed queue for reliability
- **Auto-retry**: Automatic retry on failed requests
- **TypeScript**: Full type safety and IntelliSense

### Technical Highlights
- Lightweight (~5KB gzipped)
- Zero dependencies (runtime)
- Browser storage with fallbacks
- sendBeacon API for reliable delivery
- Configurable batch size and intervals
- Debug mode for development

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Build**:
   ```bash
   npm run build
   ```

4. **Try the demo**:
   - Open `examples/demo.html` in a browser
   - You'll need to build first: `npm run build`

## 📚 Documentation Files

- **README.md**: Complete API reference and features
- **GETTING_STARTED.md**: Step-by-step usage guide
- **DEPLOYMENT.md**: Testing, building, and publishing
- **CHANGELOG.md**: Version history

## 🧪 Testing

The project includes comprehensive tests:

- **Unit tests**: Individual components (client, queue, validators)
- **Integration tests**: Full workflows
- **Type checking**: TypeScript compilation
- **Linting**: Code quality checks

Run tests:
```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report
```

## 🔨 Building

Build commands:
```bash
npm run build              # Production build
npm run dev                # Development build (watch mode)
npm run type-check         # TypeScript type checking
npm run lint               # ESLint
```

Build outputs:
- `dist/index.js` - CommonJS (for Node.js)
- `dist/index.mjs` - ES Module (for browsers/bundlers)
- `dist/index.d.ts` - TypeScript definitions

## 📦 Publishing

### To NPM
```bash
npm version patch          # Update version
npm run build              # Build
npm test                   # Test
npm publish --access public
```

### To CDN
After publishing to NPM, it's automatically available on:
- unpkg.com: `https://unpkg.com/@yourorg/analytics-sdk@latest/dist/index.mjs`
- jsdelivr.com: `https://cdn.jsdelivr.net/npm/@yourorg/analytics-sdk@latest/dist/index.mjs`

## 🛠️ Customization Points

Before publishing, customize:

1. **package.json**:
   - Change `@myorg/analytics-sdk` to your org name
   - Update author, repository, etc.

2. **src/client.ts**:
   - Update default endpoint URL
   - Adjust default config values

3. **README.md**:
   - Update installation instructions
   - Add your support links

4. **LICENSE**:
   - Update copyright holder name

## 💡 Usage Example

```typescript
import AnalyticsClient from '@myorg/analytics-sdk';

// Initialize
const analytics = new AnalyticsClient({
  apiKey: 'your-api-key',
  debug: true,
});

// Track events
analytics.track('button_click', {
  button: 'signup',
  page: '/home',
});

// Identify users
analytics.identify({
  id: 'user-123',
  email: 'user@example.com',
});

// Track page views
analytics.page('Home Page');
```

## 🔍 Key Files Explained

### src/client.ts
Main SDK class that:
- Manages configuration
- Tracks events and users
- Coordinates queue and storage
- Handles API requests

### src/queue.ts
Event queue that:
- Batches events for efficiency
- Persists to localStorage
- Auto-flushes on interval
- Retries failed requests

### src/types.ts
TypeScript definitions for:
- SDK configuration
- Event structure
- User data
- API responses

### tests/*.test.ts
Test suites covering:
- All public API methods
- Error cases
- Edge cases
- Integration scenarios

## 🎨 Best Practices Implemented

1. **TypeScript**: Full type safety
2. **Testing**: Comprehensive test coverage
3. **Documentation**: Clear, detailed docs
4. **CI/CD**: Automated testing pipeline
5. **Versioning**: Semantic versioning
6. **Code Quality**: Linting and formatting
7. **Error Handling**: Graceful error management
8. **Performance**: Efficient batching and caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update documentation
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Email: support@yourcompany.com

## 🎯 Next Steps

1. Run `./quick-start.sh` to set up
2. Read GETTING_STARTED.md
3. Try the demo in examples/
4. Customize for your needs
5. Publish to NPM

---

**Happy coding! 🚀**
