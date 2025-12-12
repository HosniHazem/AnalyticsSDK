import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventQueue } from '../src/queue';
import { Event } from '../src/types';

describe('EventQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should add events to queue', () => {
    const onFlush = vi.fn().mockResolvedValue(undefined);
    const queue = new EventQueue(
      { batchSize: 5, flushInterval: 1000 },
      onFlush
    );

    const event: Event = { name: 'test_event', timestamp: Date.now() };
    queue.add(event);

    expect(queue.size()).toBe(1);
  });

  it('should flush when batch size is reached', async () => {
    const onFlush = vi.fn().mockResolvedValue(undefined);
    const queue = new EventQueue(
      { batchSize: 2, flushInterval: 10000 },
      onFlush
    );

    queue.add({ name: 'event1', timestamp: Date.now() });
    queue.add({ name: 'event2', timestamp: Date.now() });

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(onFlush).toHaveBeenCalled();
    expect(queue.size()).toBe(0);
  });

  it('should flush manually', async () => {
    const onFlush = vi.fn().mockResolvedValue(undefined);
    const queue = new EventQueue(
      { batchSize: 10, flushInterval: 10000 },
      onFlush
    );

    queue.add({ name: 'event1', timestamp: Date.now() });
    await queue.flush();

    expect(onFlush).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'event1' })
      ])
    );
    expect(queue.size()).toBe(0);
  });

  it('should handle flush errors', async () => {
    const onFlush = vi.fn().mockRejectedValue(new Error('Network error'));
    const queue = new EventQueue(
      { batchSize: 1, flushInterval: 10000 },
      onFlush
    );

    queue.add({ name: 'event1', timestamp: Date.now() });

    await new Promise(resolve => setTimeout(resolve, 100));

    // Events should be re-added on failure
    expect(queue.size()).toBe(1);
  });

  it('should clear queue', () => {
    const onFlush = vi.fn().mockResolvedValue(undefined);
    const queue = new EventQueue(
      { batchSize: 10, flushInterval: 10000 },
      onFlush
    );

    queue.add({ name: 'event1', timestamp: Date.now() });
    queue.add({ name: 'event2', timestamp: Date.now() });

    expect(queue.size()).toBe(2);
    queue.clear();
    expect(queue.size()).toBe(0);
  });

  it('should not flush empty queue', async () => {
    const onFlush = vi.fn().mockResolvedValue(undefined);
    const queue = new EventQueue(
      { batchSize: 10, flushInterval: 10000 },
      onFlush
    );

    await queue.flush();
    expect(onFlush).not.toHaveBeenCalled();
  });
});
