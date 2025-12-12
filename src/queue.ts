import { Event } from './types';
import { Storage } from './utils/storage';

/**
 * Manages event queuing and batching
 */
export class EventQueue {
  private events: Event[] = [];
  private timer?: number;
  private storage: Storage;
  private isProcessing = false;

  constructor(
    private config: { batchSize: number; flushInterval: number },
    private onFlush: (events: Event[]) => Promise<void>
  ) {
    this.storage = new Storage('analytics_queue_');
    this.loadPersistedEvents();
    this.startTimer();
    this.setupBeforeUnload();
  }

  /**
   * Add event to queue
   */
  add(event: Event): void {
    this.events.push(event);
    this.persistEvents();

    if (this.events.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Flush all events in queue
   */
  async flush(): Promise<void> {
    if (this.events.length === 0 || this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    const eventsToSend = [...this.events];
    this.events = [];
    this.persistEvents();

    try {
      await this.onFlush(eventsToSend);
    } catch (error) {
      console.error('Failed to flush events:', error);
      // Re-add events on failure
      this.events.unshift(...eventsToSend);
      this.persistEvents();
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Get current queue size
   */
  size(): number {
    return this.events.length;
  }

  /**
   * Clear all events from queue
   */
  clear(): void {
    this.events = [];
    this.storage.clear();
  }

  /**
   * Stop the automatic flush timer
   */
  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * Start automatic flush timer
   */
  private startTimer(): void {
    this.timer = window.setInterval(() => {
      if (this.events.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  /**
   * Load persisted events from storage
   */
  private loadPersistedEvents(): void {
    const persisted = this.storage.get<Event[]>('events');
    if (persisted && Array.isArray(persisted)) {
      this.events = persisted;
    }
  }

  /**
   * Persist events to storage
   */
  private persistEvents(): void {
    this.storage.set('events', this.events);
  }

  /**
   * Setup beforeunload handler to flush events
   */
  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      if (this.events.length > 0) {
        // Use sendBeacon for guaranteed delivery
        const blob = new Blob(
          [JSON.stringify({ events: this.events })],
          { type: 'application/json' }
        );
        navigator.sendBeacon('/api/analytics', blob);
      }
    });
  }
}
