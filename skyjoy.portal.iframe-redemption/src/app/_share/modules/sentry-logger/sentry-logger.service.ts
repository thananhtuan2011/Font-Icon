import { Inject, Injectable } from '@angular/core';
import { STORAGE_KEY } from '@app/_core/constants/common';
import {
  SENTRY_SECURITY_INFO_ENUM,
  SENTRY_SECURITY_KEYS,
  SENTRY_SEVERITY_LEVEL_ENUM,
  SENTRY_TOKEN_SECURITY_REGEX
} from '@app/_core/constants/sentry';
import { Helpers } from '@app/_core/helpers/helpers';
import { ISentryConfig } from '@app/_share/modules/sentry-logger/sentry-logger.interface';
import { StorageService } from '@app/_core/services/storage.service';
import * as Sentry from '@sentry/browser';
import * as _ from 'lodash';
import { isEmpty } from 'lodash';
import { environment } from '../../../../environments/environment';
import { SENTRY_CONFIG } from './sentry-logger';

@Injectable({
  providedIn: 'root'
})
export class SentryLoggerService {
  client: any;
  captureExceptionLevels = [SENTRY_SEVERITY_LEVEL_ENUM.ERROR, SENTRY_SEVERITY_LEVEL_ENUM.WARNING];

  constructor(
    @Inject(SENTRY_CONFIG) private sentryConfig: ISentryConfig,
    private storageService: StorageService
  ) {}

  init() {
    const userProfile = JSON.parse(this.storageService.get({ key: STORAGE_KEY.USER_PROFILE }) || '{}');
    const memberCode = _.get(userProfile, 'member.memberCode', 'NULL');

    if (!isEmpty(this.sentryConfig) && Helpers.getEnvironmentKey(this.sentryConfig.isEnable)) {
      let integrations: any = [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false
        })
      ];
      if (Helpers.getEnvironmentKey(this.sentryConfig.isDebug)) {
        integrations = [...integrations];
      }

      // Sentry.captureException({ levels: ['log', 'info', 'warn', 'error', 'debug'] });
      Sentry.init({
        dsn: this.sentryConfig.dsn,
        release: Helpers.getEnvironmentKey(environment.releaseVersion),
        initialScope: (scope) => {
          scope.setTags({ memberCode });
          scope.setUser({
            memberCode
          });
          return scope;
        },
        stackParser: Sentry.defaultStackParser,
        transport: Sentry.makeFetchTransport,
        beforeSend: (e) => {
          if (!this.isAllowLevel(e.level)) {
            return null;
          }

          if (e.exception?.values?.length) {
            //Set type for exception.
            e.exception.values[0].type = (e.extra?.['errorCustomInfo'] as any)?.type || '';
            const mechanism = e.exception.values[0].mechanism;
            if (mechanism) {
              e.exception.values[0].mechanism = {
                ...mechanism,
                //True when captureException is called with anything other than an instance of Error
                synthetic: false
              };
            }
          }
          e = this.replaceSecurityInfo(e);
          return e;
        },
        integrations: [...integrations],
        ignoreErrors: [],
        denyUrls: [
          // Facebook flakiness
          /graph\.facebook\.com/i,
          // Facebook blocked
          /connect\.facebook\.net\/en_US\/all\.js/i,
          // Chrome extensions
          /extensions\//i,
          /^chrome:\/\//i,
          /^chrome-extension:\/\//i,
          // Other plugins
          /webappstoolbarba\.texthelp\.com\//i,
          /metrics\.itunes\.apple\.com\.edgesuite\.net\//i
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
        // Session Replay
        replaysSessionSampleRate: this.sentryConfig.replaysSessionSampleRate, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: this.sentryConfig.replaysOnErrorSampleRate // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      });

      console.info(`SENTRY_LOGGER is enabled:`, {
        sentryConfig: this.sentryConfig
      });
    } else {
      console.info(`SENTRY_LOGGER is disabled or missing config: `, {
        sentryConfig: this.sentryConfig
      });
    }
  }

  captureException(
    error: any,
    errorCustomInfo: {
      level: SENTRY_SEVERITY_LEVEL_ENUM;
      type: any;
      errorName: string;
    }
  ): void {
    try {
      if (!_.isUndefined(Sentry)) {
        let errorParse: any = null;
        if (error instanceof Error) {
          // For Error objects, extract relevant properties
          errorParse = {
            name: error.name,
            message: error.message,
            stack: error.stack
          };
        } else {
          // For other objects, stringify if possible
          try {
            errorParse = JSON.stringify(error, null, 2);
          } catch (e) {
            // If stringification fails, log the original error object
            errorParse = error;
          }
        }
        Sentry.captureException(error, (scope) => {
          if (errorCustomInfo?.errorName) {
            scope.setTransactionName(errorCustomInfo.errorName);
          }
          scope.setExtras({
            error: errorParse,
            errorCustomInfo: errorCustomInfo
          });
          scope.setLevel(errorCustomInfo?.level);
          return scope;
        });
      }
    } catch (e) {
      // Handle any errors that occur during the capturing process
    }
  }

  addScope(scopes: any) {
    const scope = Sentry.getCurrentScope();
    scope.setTags({
      ...scopes
    });
  }

  private replaceSecurityInfo(e: any): any {
    if (!e) {
      return e;
    }

    switch (true) {
      case typeof e === 'object':
        Object.keys(e).forEach((key) => {
          const securityItem = SENTRY_SECURITY_KEYS.find((item) => item.key === key);
          if (!securityItem) {
            e[key] = this.replaceSecurityInfo(e[key]);
          } else {
            e[key] = securityItem.replaceValue;
          }
        });
        break;

      case Array.isArray(e):
        e.forEach((item: any) => this.replaceSecurityInfo(item));
        break;

      case typeof e === 'string':
        e = e.replace(SENTRY_TOKEN_SECURITY_REGEX, SENTRY_SECURITY_INFO_ENUM.TOKEN);
        break;

      default:
        break;
    }

    return e;
  }

  private isAllowLevel(level: string | undefined): boolean {
    return this.captureExceptionLevels.includes(<SENTRY_SEVERITY_LEVEL_ENUM>level);
  }
}
