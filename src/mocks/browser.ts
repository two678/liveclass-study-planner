import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * 브라우저 환경에서 동작하는 MSW Service Worker 인스턴스
 * 클라이언트 사이드에서만 import 되어야 합니다.
 */
export const worker = setupWorker(...handlers);
