import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationExtras, Router, RouterStateSnapshot } from '@angular/router';
import { Helpers } from '@app/_core/helpers/helpers';
import { IIntegrateQueryParams } from '@app/_core/interfaces/common.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Observable, finalize } from 'rxjs';
import { APP_PATH, QUERY_PARAM_KEY, STORAGE_KEY } from '../constants/common';
import { STATUS_PROFILE } from '../interfaces/profile.interface';
import { ApiIdentityService } from '../services/api-identity.service';
import { SpinnerService } from '../services/spinner.service';
import { StorageService } from '../services/storage.service';
import { UserSessionService } from '../services/user-session.service';

@Injectable({
  providedIn: 'root'
})
@UntilDestroy()
export class AuthGuard {
  private apiIdentityService = inject(ApiIdentityService);
  private location = inject(Location);
  private translateService = inject(TranslateService);
  private userSessionService = inject(UserSessionService);
  private spinnerService = inject(SpinnerService);
  protected readonly router = inject(Router);
  private readonly storageService = inject(StorageService);

  private currentStateUrl = '';
  private currentQueryParams = {};

  constructor() {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url = window.location.href;
    const urlTree = new HttpParams({ fromString: url.split('?')[1] });
    const token_query = urlTree.get(QUERY_PARAM_KEY.EXCHANGE_TOKEN);
    const token_query_has = urlTree.has(QUERY_PARAM_KEY.EXCHANGE_TOKEN);
    const errorCode_query = urlTree.get(QUERY_PARAM_KEY.ERROR_CODE);
    const status_query = urlTree.get(QUERY_PARAM_KEY.STATUS);
    const moduleName = urlTree.get(QUERY_PARAM_KEY.MODULE);
    const lang_query = urlTree.get(QUERY_PARAM_KEY.LANG);
    const version_query = urlTree.get(QUERY_PARAM_KEY.VERSION);
    const source_query = urlTree.get(QUERY_PARAM_KEY.SOURCE);
    this.currentStateUrl = state.url.split('?')[0] || '';
    this.currentQueryParams = route.queryParams || {};

    // if (!token_query)
    const queryParams: IIntegrateQueryParams = this.getQueryParams(urlTree);

    if (status_query && ['success', 'failure'].includes(status_query)) {
      this.implementIntegration(queryParams, token_query);
      return false;
    }

    const _currentTokenExchange = this.storageService.get({
      key: STORAGE_KEY.EXCHANGE_TOKEN,
      keyExcludedISS: true
    });

    if (token_query_has) {
      this.storageService.remove();
    }

    if (token_query) {
      if (_currentTokenExchange && _currentTokenExchange != token_query) {
        this.storageService.remove();
      }

      if (Helpers.tokenIsValid(token_query)) {
        try {
          const _token_exchange = Helpers.parseJWT(token_query);
          const _iss = _.get(_token_exchange, 'iss', '').trim().replace(/\s+/g, '_');

          this.storageService.set({
            key: STORAGE_KEY.ISSUER,
            value: _iss,
            keyExcludedISS: true
          });

          if (moduleName) {
            this.storageService.set({ key: STORAGE_KEY.MODULE, value: moduleName });
          }
        } catch (e) {
          /* empty */
        }
      }
    }

    if (lang_query) {
      this.storageService.set({ key: STORAGE_KEY.LANG, value: lang_query, keyExcludedISS: true });
    }

    if (version_query) {
      this.storageService.set({ key: STORAGE_KEY.VERSION_PARTNER, value: version_query });
    }

    if (errorCode_query) {
      this.storageService.set({ key: STORAGE_KEY.ERROR_CODE, value: errorCode_query, keyExcludedISS: true });
    }

    if (status_query) {
      this.storageService.set({ key: STORAGE_KEY.INTEGRATE_STATUS, value: status_query, keyExcludedISS: true });
    }

    if (source_query) {
      this.storageService.set({ key: STORAGE_KEY.SOURCE, value: source_query, keyExcludedISS: true });
    }

    const _isAuthenticated = this.storageService.get({
      key: STORAGE_KEY.ACCESS_TOKEN
    });

    if (_isAuthenticated) {
      if (token_query && Helpers.tokenIsValid(token_query) && token_query !== _currentTokenExchange) {
        this.storageService.set({ key: STORAGE_KEY.EXCHANGE_TOKEN, value: token_query, keyExcludedISS: true });
        this.onExchangeToken();
        return false;
      }

      // const _moduleName = this.storageService.get({ key: STORAGE_KEY.MODULE }) || '';
      // const _modulePath = Helpers.getPathByModuleName(_moduleName);
      // if (_modulePath && !state.url.includes(_modulePath)) {
      //   this.router.navigate([_modulePath], { queryParams: {} });
      //   return false;
      // }

      return true;
    } else {
      if (token_query && Helpers.tokenIsValid(token_query)) {
        this.storageService.set({ key: STORAGE_KEY.EXCHANGE_TOKEN, value: token_query, keyExcludedISS: true });
      }
      this.onExchangeToken();
      return false;
    }
  }

  removeQueryParams() {
    // Get the current URL tree
    const currentUrlTree = this.router.parseUrl(this.router.url);

    // Remove the query parameters
    currentUrlTree.queryParams = {};

    // Create navigation extras with replaceUrl to replace the current state
    const navigationExtras: NavigationExtras = {
      queryParams: {},
      queryParamsHandling: 'merge', // merge with the current parameters
      replaceUrl: true // Replace the current URL without pushing a new state
    };

    // Navigate to the same route with updated URL (without query parameters)
    this.router.navigate([currentUrlTree.toString()], navigationExtras);
  }

  getQueryParams(urlParams: any) {
    let queryParams = {};
    const paramNames = urlParams.keys();
    paramNames.forEach((paramName: any) => {
      const paramValue = urlParams.get(paramName);
      queryParams = {
        ...queryParams,
        [paramName]: paramValue
      };
    });
    return queryParams;
  }

  implementIntegration(queryParams: IIntegrateQueryParams, token_query: any) {
    if (queryParams.status === 'success') {
      this.router.navigate([APP_PATH.INTEGRATION.SUCCESS_INTEGRATION], {
        queryParams: {
          ...queryParams
        }
      });
    } else if (queryParams.status === 'failure') {
      this.router.navigate([APP_PATH.INTEGRATION.ERROR_INTEGRATION], {
        queryParams: {
          ...queryParams
        }
      });
    }
  }

  //#region exchange token
  onExchangeToken(): void {
    const token_query = this.storageService.get({
      key: STORAGE_KEY.EXCHANGE_TOKEN,
      keyExcludedISS: true
    });
    this.setLoading(true);
    if (token_query) {
      this.getMemberToken(token_query);
    } else {
      this.setLoading(false);
      this.router.navigate([APP_PATH.ERROR.RESULT_NOT_FOUND], {});
    }
  }

  getMemberToken(exchangeToken: string) {
    this.apiIdentityService
      .exchangeToken(exchangeToken)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this.setLoading(false);
        })
      )
      .subscribe({
        next: (data: any) => {
          const _tokenAccess = _.get(data, 'access_token', '');
          const _tokenRefresh = _.get(data, 'refresh_token', '');

          this.storageService.set({
            key: STORAGE_KEY.ACCESS_TOKEN,
            value: _tokenAccess
          });

          this.storageService.set({
            key: STORAGE_KEY.REFRESH_TOKEN,
            value: _tokenRefresh
          });

          this.storageService.set({
            key: STORAGE_KEY.EXCHANGE_TOKEN,
            value: exchangeToken
          });

          this.storageService.set({
            key: STORAGE_KEY.CHANNEL_AUTH,
            value: _.get(data, 'info', '')
          });

          // Handle check navigate to module
          const _moduleName = this.storageService.get({ key: STORAGE_KEY.MODULE }) || '';
          const _modulePath = Helpers.getPathByModuleName(_moduleName);

          if (!_.isEmpty(_moduleName) && !_.isEmpty(_modulePath)) {
            this.router.navigate([_modulePath], { queryParams: {} });
            // this.versionVisibilityService
            //     .checkFeatureVisible$(_moduleName)
            //     .pipe(untilDestroyed(this))
            //     .subscribe({
            //         next: (isVisible: boolean) => {
            //             if (isVisible) {
            //                 this.router.navigate([_modulePath], { queryParams: {} });
            //             } else {
            //                 this.router.navigate([APP_PATH.ERROR.UNAUTHORIZED], {});
            //             }
            //         }
            //     });
          } else {
            setTimeout(() => {
              this.clearHistory();
              // this.router.navigate([APP_PATH.HOME.HOME], { queryParams: {} });
            }, 500);
          }
        },
        error: (err: any) => {
          this.storageService.remove();
          this.storageService.set({
            key: STORAGE_KEY.LANG,
            value: this.translateService.currentLang,
            keyExcludedISS: true
          });
          const sjErrorCode = _.get(err, 'error.errors.code');
          if (sjErrorCode && sjErrorCode === STATUS_PROFILE.ACCOUNT_IS_CLOSED) {
            this.userSessionService.gotoErrorUserStatus(sjErrorCode);
          } else {
            this.router.navigate([APP_PATH.ERROR.UNAUTHORIZED], {});
          }
        }
      });
  }

  clearHistory(): void {
    this.handleQueryParams();
    this.location.replaceState('/', '');
    setTimeout(() => {
      this.router.navigate([this.currentStateUrl], {
        replaceUrl: true,
        onSameUrlNavigation: 'reload',
        queryParams: this.currentQueryParams
      });
    }, 0);
  }

  handleQueryParams(): void {
    this.currentQueryParams = {
      ...this.currentQueryParams,
      [QUERY_PARAM_KEY.EXCHANGE_TOKEN]: null,
      [QUERY_PARAM_KEY.MODULE]: null,
      [QUERY_PARAM_KEY.LANG]: null,
      [QUERY_PARAM_KEY.VERSION]: null,
      [QUERY_PARAM_KEY.SOURCE]: null
    };
  }

  setLoading(value: boolean): void {
    const moduleAvailable = this.storageService.get({ key: STORAGE_KEY.MODULE });
    if (moduleAvailable) {
      return;
    }

    this.spinnerService.showSpinner('body', value);
  }
  //#endregion exchange token
}
