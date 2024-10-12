import { InjectionToken } from '@angular/core';
import { ISentryConfig } from './sentry-logger.interface';

export const SENTRY_CONFIG = new InjectionToken<ISentryConfig>('SENTRY_CONFIG');
