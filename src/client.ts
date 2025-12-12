import { SDKConfig, Event, User, APIResponse } from './types';
import { EventQueue } from './queue';
import { validateEvent, validateUser, sanitizeProperties } from './utils/validator';
import { Storage } from './utils/storage';

/**
 * Main Analytics SDK Client
 */
export class AnalyticsClient {
  private config: Required<SDKConfig>;
  private queue: EventQueue;
  private user?: User;
  private storage: Storage;
  private sessionId: string;

  constructor(config: SDKConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    this.config = {
      apiKey: config.apiKey,
      endpoint: config.endpoint || 'https://api.analytics.example.com/events',
      debug: config.debug || false,
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 5000,
      autoTrack: config.autoTrack !== false,
    };

    this.storage = new Storage('analytics_');
    this.sessionId = this.generateSessionId();
    this.queue = new EventQueue(
      {
        batchSize: this.config.batchSize,
        flushInterval: this.config.flushInterval,
      },
      this.sendBatch.bind(this)
    );

    this.loadUser();
    this.log('SDK initialized with config:', this.config);

    if (this.config.autoTrack) {
      this.setupAutoTracking();
    }
  }

  /**
   * Track a custom event
   */
  track(eventName: string, properties?: Record<string, any>): void {
    const event: Event = {
      name: eventName,
      properties: {
        ...sanitizeProperties(properties),
        userId: this.user?.id,
        sessionId: this.sessionId,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      },
      timestamp: Date.now(),
    };

    if (!validateEvent(event)) {
      throw new Error('Invalid event data');
    }

    this.queue.add(event);
    this.log('Event tracked:', event);
  }

  /**
   * Identify a user
   */
  identify(user: User): void {
    if (!validateUser(user)) {
      throw new Error('Invalid user data');
    }

    this.user = user;
    this.storage.set('user', user);
    this.log('User identified:', user);

    this.track('user_identified', {
      userId: user.id,
      email: user.email,
      name: user.name,
    });
  }

  /**
   * Track a page view
   */
  page(name?: string, properties?: Record<string, any>): void {
    this.track('page_view', {
      pageName: name || document.title,
      ...properties,
    });
  }

  /**
   * Get current user
   */
  getUser(): User | undefined {
    return this.user;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Manually flush all pending events
   */
  async flush(): Promise<void> {
    await this.queue.flush();
  }

  /**
   * Reset the SDK (clear user and events)
   */
  reset(): void {
    this.user = undefined;
    this.sessionId = this.generateSessionId();
    this.storage.clear();
    this.queue.clear();
    this.log('SDK reset');
  }

  /**
   * Destroy the SDK instance
   */
  destroy(): void {
    this.queue.destroy();
    this.log('SDK destroyed');
  }

  /**
   * Send batch of events to API
   */
  private async sendBatch(events: Event[]): Promise<void> {
    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
        },
        body: JSON.stringify({
          events,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result: APIResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to send events');
      }

      this.log('Batch sent successfully:', events.length, 'events');
    } catch (error) {
      console.error('Failed to send events:', error);
      throw error;
    }
  }

  /**
   * Load user from storage
   */
  private loadUser(): void {
    const storedUser = this.storage.get<User>('user');
    if (storedUser) {
      this.user = storedUser;
      this.log('User loaded from storage:', storedUser);
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Setup automatic event tracking
   */
  private setupAutoTracking(): void {
    // Track initial page view
    if (document.readyState === 'complete') {
      this.page();
    } else {
      window.addEventListener('load', () => this.page());
    }

    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        this.track('click', {
          elementType: target.tagName,
          text: target.innerText?.substring(0, 100),
          href: (target as HTMLAnchorElement).href,
        });
      }
    });
  }

  /**
   * Log debug messages
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[Analytics SDK]', ...args);
    }
  }
}
