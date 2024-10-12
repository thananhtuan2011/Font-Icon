import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { QUERY_PARAM_KEY } from '@app/_core/constants/common';
import { AppTranslateService } from '@app/_core/services/app-translate.service';
import { StorageService } from '@app/_core/services/storage.service';
import { SENTRY_CONFIG } from '@app/_share/modules/sentry-logger/sentry-logger';
import { GTM_IDS } from '@app/_share/modules/tracking-ga/tracking-ga.module';
import { TrackingGaService } from '@app/_share/modules/tracking-ga/tracking-ga.service';
import { VersionVisibilityService } from '@app/_share/modules/version-visibility/version-visibility.service';
import { BehaviorSubject } from 'rxjs';

const sentryConfig = {
  isDebug: false,
  isEnable: false,
  dsn: '',
  showDialog: false,
  replaysSessionSampleRate: '0.1',
  replaysOnErrorSampleRate: '1.0'
};

const gtmIds: { gtmId: string }[] = []; //TrackingGaService

const queryParams = {
  [QUERY_PARAM_KEY.LANG]: 'vi'
};

export const MockQueryParams = new BehaviorSubject<any>(queryParams);

export const TestingProviders = [
  AppTranslateService,
  StorageService,
  TrackingGaService,
  VersionVisibilityService,
  { provide: SENTRY_CONFIG, useValue: sentryConfig },
  {
    provide: ActivatedRoute,
    useValue: {
      queryParams: MockQueryParams.asObservable()
    }
  },
  { provide: GTM_IDS, useValue: gtmIds },
  provideHttpClient()
];
