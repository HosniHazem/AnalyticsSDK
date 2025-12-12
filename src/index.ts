/**
 * Analytics SDK
 * A lightweight, TypeScript-based analytics SDK for web applications
 */

export { AnalyticsClient } from './client';
export { EventQueue } from './queue';
export type { SDKConfig, Event, User, APIResponse } from './types';

// Default export for easier usage
import { AnalyticsClient } from './client';
export default AnalyticsClient;
