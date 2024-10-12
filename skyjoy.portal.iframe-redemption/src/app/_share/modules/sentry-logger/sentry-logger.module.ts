import { APP_INITIALIZER, ErrorHandler, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISentryConfig } from './sentry-logger.interface';
import { SENTRY_CONFIG } from './sentry-logger';
import * as Sentry from '@sentry/angular-ivy';
import { Router } from '@angular/router';
import { SentryLoggerService } from '@app/_share/modules/sentry-logger/sentry-logger.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [SentryLoggerService]
})
export class SentryLoggerModule {
  static forRoot(config: ISentryConfig): ModuleWithProviders<SentryLoggerModule> {
    let _providers: Provider[] = [];

    if (config.dsn) {
      _providers = [
        { provide: SENTRY_CONFIG, useValue: config },
        {
          provide: ErrorHandler,
          useValue: Sentry.createErrorHandler({
            showDialog: config.showDialog || false
          })
        },
        {
          provide: Sentry.TraceService,
          deps: [Router]
        },
        {
          provide: APP_INITIALIZER,
          useFactory: () => () => {},
          deps: [Sentry.TraceService],
          multi: true
        }
      ];
    } else {
      _providers = [{ provide: SENTRY_CONFIG, useValue: {} }];
    }

    return {
      ngModule: SentryLoggerModule,
      providers: _providers
    };
  }
}
