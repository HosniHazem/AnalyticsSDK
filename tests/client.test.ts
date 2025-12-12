import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnalyticsClient } from '../src/client';

// Mock fetch globally
global.fetch = vi.fn();

describe('AnalyticsClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock successful fetch by default
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
      text: async () => '',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with valid config', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      expect(client).toBeDefined();
      expect(client.getSessionId()).toBeDefined();
    });

    it('should throw error without API key', () => {
      expect(() => new AnalyticsClient({} as any)).toThrow('API key is required');
    });

    it('should use default config values', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      expect(client).toBeDefined();
    });

    it('should accept custom config', () => {
      const client = new AnalyticsClient({
        apiKey: 'test-key',
        endpoint: 'https://custom.endpoint.com',
        debug: true,
        batchSize: 20,
        flushInterval: 10000,
      });
      expect(client).toBeDefined();
    });
  });

  describe('Event Tracking', () => {
    it('should track events', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      expect(() => {
        client.track('page_view', { page: '/home' });
      }).not.toThrow();
    });

    it('should track events with properties', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      client.track('button_click', {
        button: 'signup',
        page: '/landing',
      });
      // No assertion needed, just ensuring no error
    });

    it('should throw error for invalid event name', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      expect(() => {
        client.track('', { page: '/home' });
      }).toThrow();
    });

    it('should track page views', () => {
      const client = new AnalyticsClient({ 
        apiKey: 'test-key',
        autoTrack: false 
      });
      expect(() => {
        client.page('Home Page', { section: 'hero' });
      }).not.toThrow();
    });
  });

  describe('User Identification', () => {
    it('should identify users', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      client.identify({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      });
      
      const user = client.getUser();
      expect(user).toBeDefined();
      expect(user?.id).toBe('user-123');
    });

    it('should persist user to storage', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      client.identify({
        id: 'user-123',
        email: 'test@example.com',
      });

      // Create new instance and check if user is loaded
      const newClient = new AnalyticsClient({ apiKey: 'test-key' });
      const user = newClient.getUser();
      expect(user?.id).toBe('user-123');
    });

    it('should throw error for invalid user', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      expect(() => {
        client.identify({ id: '' } as any);
      }).toThrow();
    });
  });

  describe('Batch Sending', () => {
    it('should send batch when flush is called', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      global.fetch = mockFetch;

      const client = new AnalyticsClient({
        apiKey: 'test-key',
        batchSize: 10,
      });

      client.track('test_event', { foo: 'bar' });
      await client.flush();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-API-Key': 'test-key',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle API errors', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      });
      global.fetch = mockFetch;

      const client = new AnalyticsClient({
        apiKey: 'test-key',
        batchSize: 1,
      });

      client.track('test_event');
      
      // Wait for flush to happen
      await new Promise(resolve => setTimeout(resolve, 100));
    });
  });

  describe('Reset and Destroy', () => {
    it('should reset SDK state', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      
      client.identify({ id: 'user-123' });
      expect(client.getUser()).toBeDefined();
      
      client.reset();
      expect(client.getUser()).toBeUndefined();
    });

    it('should destroy SDK properly', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      expect(() => client.destroy()).not.toThrow();
    });
  });

  describe('Session Management', () => {
    it('should generate unique session IDs', () => {
      const client1 = new AnalyticsClient({ apiKey: 'test-key' });
      const client2 = new AnalyticsClient({ apiKey: 'test-key' });
      
      expect(client1.getSessionId()).not.toBe(client2.getSessionId());
    });

    it('should maintain session ID across events', () => {
      const client = new AnalyticsClient({ apiKey: 'test-key' });
      const sessionId = client.getSessionId();
      
      client.track('event1');
      client.track('event2');
      
      expect(client.getSessionId()).toBe(sessionId);
    });
  });
});
