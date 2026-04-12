/**
 * Structured logger.
 *
 * When BETTERSTACK_SOURCE_TOKEN is set, logs are sent to Better Stack (Logtail)
 * for centralized monitoring, search, and alerting.
 *
 * When not set, falls back to console (development).
 *
 * Usage:
 *   import { log } from '@/libs/logger/logger';
 *   log.info('User signed up', { userId: '123', plan: 'pro' });
 *   log.error('Webhook failed', { eventId: 'evt_123', error: err.message });
 */

interface LogContext {
  [key: string]: unknown;
}

interface Logger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}

let _betterStackLogger: any = null;

function getBetterStackLogger(): any {
  if (_betterStackLogger) return _betterStackLogger;

  const token = process.env.BETTERSTACK_SOURCE_TOKEN;
  if (!token) return null;

  try {
    const logtailNext = require('@logtail/next');
    const { Logger } = logtailNext;
    _betterStackLogger = new Logger({ sourceToken: token });
    return _betterStackLogger;
  } catch {
    return null;
  }
}

/**
 * Structured logger. Sends to Better Stack when configured, console when not.
 */
export const log: Logger = {
  info(message, context) {
    const bs = getBetterStackLogger();
    if (bs) bs.info(message, context);
    console.log(`[INFO] ${message}`, context ?? '');
  },
  warn(message, context) {
    const bs = getBetterStackLogger();
    if (bs) bs.warn(message, context);
    console.warn(`[WARN] ${message}`, context ?? '');
  },
  error(message, context) {
    const bs = getBetterStackLogger();
    if (bs) bs.error(message, context);
    console.error(`[ERROR] ${message}`, context ?? '');
  },
};
