/**
 * Configuration options for the Analytics SDK
 */
export interface SDKConfig {
  /** API key for authentication */
  apiKey: string;
  /** Custom endpoint URL (optional) */
  endpoint?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Number of events to batch before sending */
  batchSize?: number;
  /** Interval in milliseconds to flush events */
  flushInterval?: number;
  /** Enable automatic page view tracking */
  autoTrack?: boolean;
}

/**
 * Event data structure
 */
export interface Event {
  /** Event name/type */
  name: string;
  /** Custom properties for the event */
  properties?: Record<string, any>;
  /** Event timestamp (auto-generated if not provided) */
  timestamp?: number;
}

/**
 * User identification data
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User email (optional) */
  email?: string;
  /** User name (optional) */
  name?: string;
  /** Additional user properties */
  properties?: Record<string, any>;
}

/**
 * API response structure
 */
export interface APIResponse {
  success: boolean;
  message?: string;
  errors?: string[];
}
