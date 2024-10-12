import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import vi from '@angular/common/locales/vi';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterOutlet, provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { en_US, provideNzI18n, vi_VN } from 'ng-zorro-antd/i18n';
import { environment } from 'src/environments/environment';
import { CoreModule } from './_core/core.module';
import { TestComponent } from './_share/components/test/test.component';
import { SentryLoggerModule } from './_share/modules/sentry-logger/sentry-logger.module';
import { routes } from './app.routes';

registerLocaleData(vi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzI18n(vi_VN),
    provideNzI18n(en_US),
    importProvidersFrom(
      FormsModule,
      CoreModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        },
        defaultLanguage: environment.language
      }),
      SentryLoggerModule.forRoot({
        isDebug: environment.SENTRY_LOGGER.IS_DEBUG,
        isEnable: environment.SENTRY_LOGGER.IS_ENABLE,
        dsn: environment.SENTRY_LOGGER.DSN_URL,
        showDialog: false,
        replaysSessionSampleRate: parseFloat(environment.SENTRY_LOGGER.REPLAYS_SESSION ?? '0'),
        replaysOnErrorSampleRate: parseFloat(environment.SENTRY_LOGGER.REPLAYS_ON_ERROR ?? '0')
      })
    ),
    provideAnimationsAsync(),
    provideHttpClient()
  ]
};

export function createTranslateLoader(http: HttpClient) {
  // const url = `${environment.staticEndpoint}/localizations/${environment.repoName}/`;
  const url = `/assets/i18n/`;
  return new TranslateHttpLoader(http, url, '.json');
}

export const AppImportModules = [CommonModule, RouterOutlet, TranslateModule, TestComponent];
