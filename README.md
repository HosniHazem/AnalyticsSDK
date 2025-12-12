# Analytics SDK

A lightweight, TypeScript-based analytics SDK for web applications with automatic event batching, local storage persistence, and retry logic.

## Features

✨ **TypeScript First** - Full type safety and IntelliSense support
🚀 **Lightweight** - Minimal bundle size (~5KB gzipped)
📦 **Event Batching** - Automatic batching and flushing of events
💾 **Persistent Queue** - Events persisted to localStorage
🔄 **Retry Logic** - Automatic retry on network failures
🎯 **Auto-tracking** - Optional automatic page view and click tracking
🔒 **Type Safe** - Complete TypeScript definitions
🧪 **Well Tested** - Comprehensive test coverage

## Installation

```bash
npm install @haz3m/analytics-sdk
```

Or using yarn:

```bash
yarn add @haz3m/analytics-sdk
```

## Quick Start

```typescript
import AnalyticsClient from '@haz3m/analytics-sdk';

// Initialize the SDK
const analytics = new AnalyticsClient({
  apiKey: 'your-api-key',
  endpoint: 'https://api.yourservice.com/events',
  debug: true, // Enable debug logging
});

// Track events
analytics.track('button_click', {
  button: 'signup',
  page: '/landing',
});

// Identify users
analytics.identify({
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
});

// Track page views
analytics.page('Home Page', {
  section: 'hero',
});
```

## Configuration

```typescript
interface SDKConfig {
  apiKey: string;           // Required: Your API key
  endpoint?: string;        // Optional: Custom endpoint URL
  debug?: boolean;          // Optional: Enable debug logging (default: false)
  batchSize?: number;       // Optional: Events per batch (default: 10)
  flushInterval?: number;   // Optional: Auto-flush interval in ms (default: 5000)
  autoTrack?: boolean;      // Optional: Enable auto-tracking (default: true)
}
```

## API Reference

### `track(eventName, properties?)`

Track a custom event.

```typescript
analytics.track('purchase_completed', {
  amount: 99.99,
  currency: 'USD',
  items: ['item1', 'item2'],
});
```

### `identify(user)`

Identify a user.

```typescript
analytics.identify({
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  properties: {
    plan: 'premium',
    signupDate: '2024-01-01',
  },
});
```

### `page(name?, properties?)`

Track a page view.

```typescript
analytics.page('Product Details', {
  productId: 'prod-123',
  category: 'electronics',
});
```

### `flush()`

Manually flush all pending events.

```typescript
await analytics.flush();
```

### `reset()`

Reset the SDK (clear user and events).

```typescript
analytics.reset();
```

### `getUser()`

Get the currently identified user.

```typescript
const user = analytics.getUser();
console.log(user?.id);
```

### `getSessionId()`

Get the current session ID.

```typescript
const sessionId = analytics.getSessionId();
```

## Event Batching

Events are automatically batched and sent when:
- The batch size is reached (default: 10 events)
- The flush interval elapses (default: 5 seconds)
- `flush()` is called manually
- The page is about to unload (using `sendBeacon`)

## Auto-tracking

When `autoTrack` is enabled (default), the SDK automatically tracks:
- **Page views** - On initial load and navigation
- **Click events** - On links and buttons

Disable auto-tracking:

```typescript
const analytics = new AnalyticsClient({
  apiKey: 'your-api-key',
  autoTrack: false,
});
```

## Error Handling

The SDK includes comprehensive error handling:

```typescript
try {
  analytics.track('event_name', properties);
} catch (error) {
  console.error('Failed to track event:', error);
}
```

Failed events are automatically retried on the next flush attempt.

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import { AnalyticsClient, SDKConfig, Event, User } from '@haz3m/analytics-sdk';

const config: SDKConfig = {
  apiKey: 'your-api-key',
  debug: true,
};

const client = new AnalyticsClient(config);
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)

Requires:
- `fetch` API
- `localStorage`
- ES2020 support

## Development

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build
npm run build

# Lint
npm run lint
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test client.test.ts
```

### Building

```bash
npm run build
```

This generates:
- `dist/index.js` - CommonJS bundle
- `dist/index.mjs` - ES Module bundle
- `dist/index.d.ts` - TypeScript definitions

## Examples

See the `examples/` directory for complete examples:
- `demo.html` - Interactive demo page

To run the demo:

```bash
npm run build
cd examples
# Open demo.html in your browser
```

## Publishing

```bash
# Build and test
npm run build
npm test

# Publish to NPM
npm publish --access public
```

## CDN Usage

After publishing to NPM, the package is available via CDN:

```html
<!-- ES Module -->
<script type="module">
  import AnalyticsClient from 'https://unpkg.com/@haz3m/analytics-sdk@latest/dist/index.mjs';
  
  const analytics = new AnalyticsClient({
    apiKey: 'your-api-key'
  });
</script>
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Your Name]

## Support

- 📧 Email: support@yourcompany.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/analytics-sdk/issues)
- 📖 Documentation: [Full Docs](https://docs.yourcompany.com)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.
