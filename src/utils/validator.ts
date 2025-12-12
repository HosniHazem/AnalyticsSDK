import { Event, User } from '../types';

/**
 * Validates event data
 */
export function validateEvent(event: Event): boolean {
  if (!event || typeof event !== 'object') {
    return false;
  }

  if (!event.name || typeof event.name !== 'string' || event.name.trim() === '') {
    console.error('Event name is required and must be a non-empty string');
    return false;
  }

  if (event.properties && typeof event.properties !== 'object') {
    console.error('Event properties must be an object');
    return false;
  }

  return true;
}

/**
 * Validates user data
 */
export function validateUser(user: User): boolean {
  if (!user || typeof user !== 'object') {
    return false;
  }

  if (!user.id || typeof user.id !== 'string' || user.id.trim() === '') {
    console.error('User ID is required and must be a non-empty string');
    return false;
  }

  if (user.email && typeof user.email !== 'string') {
    console.error('User email must be a string');
    return false;
  }

  if (user.properties && typeof user.properties !== 'object') {
    console.error('User properties must be an object');
    return false;
  }

  return true;
}

/**
 * Sanitizes event properties to remove undefined values
 */
export function sanitizeProperties(properties?: Record<string, any>): Record<string, any> {
  if (!properties) return {};
  
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(properties)) {
    if (value !== undefined && value !== null) {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}
