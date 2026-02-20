import type { StatusCode } from 'hono/utils/http-status';
import type { Enum } from 'schema-manager-types';

export const PrefixEnum = {
  Outgoing: '-->',
  Incoming: '<--',
  Error: 'xxx',
} as const;
export type Prefix = Enum<typeof PrefixEnum>;

// Global storage for request logs
const requestLogs: Record<string, string[]> = {};

/**
 * Initialize logs for a request
 */
export const initRequestLogs = (requestId: string): void => {
  requestLogs[requestId] = [];
};

/**
 * Add a log message to the request's log array
 */
const addLogToRequest = (requestId: string, message: string): void => {
  if (requestId && requestLogs[requestId]) {
    requestLogs[requestId].push(message);
  }
};

/**
 * Add a raw log message to the request's log array (without prefix)
 */
export const addRawLogToRequest = (requestId: string, message: string): void => {
  if (requestLogs[requestId]) {
    requestLogs[requestId].push(message);
  }
};
export const flushRequestLogs = (requestId: string): void => {
  const logs = requestLogs[requestId];
  if (logs && logs.length > 0) {
    // eslint-disable-next-line no-console
    console.log(logs.join('\n'));
  }

  delete requestLogs[requestId];
};

export const colorString = (message: string, status: 'info' | 'success' | 'warning' | 'error') => {
  switch (status) {
    case 'error': {
      // red
      return `\x1B[31m${message}\x1B[0m`;
    }
    case 'warning': {
      // yellow
      return `\x1B[33m${message}\x1B[0m`;
    }
    case 'info': {
      // cyan
      return `\x1B[36m${message}\x1B[0m`;
    }
    case 'success': {
      // green
      return `\x1B[32m${message}\x1B[0m`;
    }
    default: {
      const never: never = status;
      return never;
    }
  }
};

const colorStatus = (status: StatusCode): string => {
  switch ((status / 100) | 0) {
    case 5: // red = error
      return colorString(String(status), 'error');
    case 4: // yellow = warning
      return colorString(String(status), 'warning');
    case 3: // cyan = redirect
      return colorString(String(status), 'info');
    case 2: // green = success
      return colorString(String(status), 'success');
    default:
      return `${status}`;
  }
};

export const log = (requestId: string, message: string, ...rest: string[]) => {
  const logMessage = [colorString('│', 'info'), message, ...rest].join(' ');
  addLogToRequest(requestId, logMessage);
};

export const logRequest = (requestId: string, method: string, path: string, ...rest: string[]) => {
  log(requestId, PrefixEnum.Incoming, method, path, ...rest);
};

export const logResponse = (
  requestId: string,
  method: string,
  path: string,
  status: StatusCode,
  elapsed: string,
  ...rest: string[]
) => {
  log(requestId, PrefixEnum.Outgoing, method, path, colorStatus(status), elapsed, ...rest);
};

export const logError = (
  requestId: string,
  method: string,
  path: string,
  status: StatusCode,
  ...rest: string[]
) => {
  log(requestId, PrefixEnum.Error, method, path, colorStatus(status), ...rest);
};

export const logExternalRequest = (
  requestId: string,
  method: string,
  path: string,
  ...rest: string[]
) => {
  log(requestId, PrefixEnum.Outgoing, method, path, ...rest);
};

export const logExternalResponse = (
  requestId: string,
  method: string,
  path: string,
  status: StatusCode,
  ...rest: string[]
) => {
  log(requestId, PrefixEnum.Incoming, method, path, colorStatus(status), ...rest);
};

export const logExternalError = (
  requestId: string,
  method: string,
  path: string,
  status: StatusCode,
  ...rest: string[]
) => {
  log(requestId, PrefixEnum.Error, method, path, colorStatus(status), ...rest);
};
