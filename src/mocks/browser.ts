import { setupWorker, rest } from 'msw';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);

// Expose methods globally to make them available in integration tests
(window as any).msw = { worker, rest };