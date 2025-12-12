# Getting Started with Analytics SDK

This guide will help you get up and running with the Analytics SDK in just a few minutes.

## Step 1: Install

```bash
npm install @myorg/analytics-sdk
```

## Step 2: Initialize

Create an analytics instance with your API key:

```typescript
import AnalyticsClient from '@myorg/analytics-sdk';

const analytics = new AnalyticsClient({
  apiKey: 'your-api-key-here',
  debug: true, // See events in console during development
});
```

## Step 3: Track Your First Event

```typescript
// Track a button click
analytics.track('button_click', {
  button: 'Get Started',
  location: 'hero_section',
});
```

## Step 4: Identify Users

When a user signs up or logs in:

```typescript
analytics.identify({
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
});
```

## Step 5: Track Page Views

```typescript
// Automatic page tracking is enabled by default
// Or track manually:
analytics.page('Product Details', {
  productId: 'abc-123',
  category: 'Electronics',
});
```

## Common Patterns

### E-commerce Tracking

```typescript
// Product viewed
analytics.track('product_viewed', {
  productId: 'abc-123',
  name: 'Wireless Headphones',
  price: 99.99,
  category: 'Electronics',
});

// Add to cart
analytics.track('product_added', {
  productId: 'abc-123',
  quantity: 1,
  price: 99.99,
});

// Purchase completed
analytics.track('purchase_completed', {
  orderId: 'order-456',
  total: 99.99,
  currency: 'USD',
  items: ['abc-123'],
});
```

### Form Tracking

```typescript
// Form started
analytics.track('form_started', {
  formName: 'contact_form',
});

// Form submitted
analytics.track('form_submitted', {
  formName: 'contact_form',
  fields: ['name', 'email', 'message'],
});
```

### Error Tracking

```typescript
try {
  // Your code
} catch (error) {
  analytics.track('error_occurred', {
    errorMessage: error.message,
    errorStack: error.stack,
    page: window.location.pathname,
  });
}
```

## Best Practices

### 1. Initialize Once

Create a single analytics instance and reuse it throughout your app:

```typescript
// analytics.ts
export const analytics = new AnalyticsClient({
  apiKey: process.env.ANALYTICS_API_KEY,
});

// other-file.ts
import { analytics } from './analytics';
analytics.track('event_name');
```

### 2. Use Descriptive Event Names

```typescript
// ✅ Good
analytics.track('checkout_completed');
analytics.track('video_played');

// ❌ Avoid
analytics.track('click');
analytics.track('action');
```

### 3. Include Relevant Properties

```typescript
// ✅ Good - includes context
analytics.track('button_click', {
  button: 'signup',
  location: 'header',
  page: '/pricing',
});

// ❌ Missing context
analytics.track('button_click');
```

### 4. Handle Errors Gracefully

```typescript
try {
  analytics.track('event_name', properties);
} catch (error) {
  console.error('Failed to track event:', error);
  // Continue with your app logic
}
```

### 5. Flush Before Navigation

For single-page apps, flush events before navigation:

```typescript
router.beforeEach(async (to, from, next) => {
  await analytics.flush();
  next();
});
```

## Development vs Production

Use different configurations for development and production:

```typescript
const analytics = new AnalyticsClient({
  apiKey: process.env.ANALYTICS_API_KEY,
  debug: process.env.NODE_ENV === 'development',
  endpoint: process.env.NODE_ENV === 'production'
    ? 'https://api.yourservice.com/events'
    : 'http://localhost:3000/events',
});
```

## Testing

Mock the SDK in your tests:

```typescript
// Jest example
jest.mock('@myorg/analytics-sdk', () => ({
  default: jest.fn().mockImplementation(() => ({
    track: jest.fn(),
    identify: jest.fn(),
    page: jest.fn(),
  })),
}));
```

## Next Steps

- Read the [full API documentation](./README.md)
- Check out the [examples](./examples/)
- Review [configuration options](./README.md#configuration)

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/yourusername/analytics-sdk/issues)
- 💬 [Join Discord](https://discord.gg/your-server)
