import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IAppLayoutConfig } from '@app/_core/interfaces/app-layout-config.interface';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { STORAGE_KEY } from '../constants/common';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public currentLang = environment.language;
  public currentZoom = 0;
  public readonly themeConfig$: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly menuConfig$: BehaviorSubject<any> = new BehaviorSubject({ isVisible: true });
  private homeWidgetDefault = {
    profile: true,
    module: true,
    features: false,
    banner: false,
    intro: false,
    download: false
  };
  public homeWidget$: BehaviorSubject<any> = new BehaviorSubject(this.homeWidgetDefault);
  private appConfig: BehaviorSubject<any> = new BehaviorSubject(null);
  private iss: BehaviorSubject<any> = new BehaviorSubject(null);
  private isReadyModule: BehaviorSubject<any> = new BehaviorSubject(false);
  private isReadyApp: BehaviorSubject<any> = new BehaviorSubject(false);
  private currentConfig: any = null;
  private storageService = inject(StorageService);
  private httpClient = inject(HttpClient);
  private translateService = inject(TranslateService);
  private readonly title = inject(Title);

  constructor() {}

  get config() {
    return this.currentConfig;
  }

  get configLazy() {
    return this.appConfig;
  }

  get isReadyModuleLazy() {
    return this.isReadyModule;
  }

  get isReadyAppNotModule() {
    return this.isReadyApp;
  }

  get issLazy() {
    return this.iss;
  }

  /**
   * Set config after get from api
   * @param _config New config from api
   */
  set setConfig(_config: any) {
    if (_config) {
      this.appConfig.next(_config);
      this.currentConfig = _config;
    }
  }

  /**
   * Get Config by country code
   * @returns any language config or null
   */
  loadConfigModule(): Observable<any> {
    const url_default = `${environment.staticAssetsUrl}/assets/themes/default.json`;
    // const url = `${environment.staticAssetsUrl}/assets/themes/${environment.repoName}.json`;
    const url = `${environment.staticEndpoint}/partner-app/themes/${environment.repoName}.json`;
    const iss = this.storageService.get({ key: STORAGE_KEY.ISSUER, keyExcludedISS: true }) || '';

    const defaultRequest$ = this.httpClient.get(url_default);
    const urlRequest$ = this.httpClient.get(url);
    return defaultRequest$.pipe(
      switchMap((defaultValue: any) =>
        urlRequest$.pipe(
          catchError((error: any) => {
            return of(defaultValue);
          }),
          map((response: any) => {
            // Temporary handle
            if (defaultValue?.default?.theme?.partner) {
              const partnerValue = defaultValue.default.theme.partner;
              for (const key in partnerValue) {
                if (Object.prototype.hasOwnProperty.call(partnerValue, key)) {
                  const element = partnerValue[key];
                  if (String(element).startsWith('/assets')) {
                    partnerValue[key] = environment.staticAssetsUrl + element;
                  }
                }
              }
            }

            return { ...defaultValue, ...response };
          })
        )
      ),
      tap({
        next: (allConfig: any) => {
          if (allConfig) {
            const _themes_default = _.get(allConfig, 'default');
            const _themes = _.get(allConfig, iss, _themes_default);

            this.applyStyles(_themes);
          } else {
            this.setConfig = null;
            this.isReadyApp.next(false);
          }
          return allConfig;
        }
      }),
      catchError((err, caught) => {
        this.setConfig = null;
        this.isReadyApp.next(false);

        return of('Themes configuration not found !!');
      })
    );
  }

  /**
   * Init zoom UI from local
   */
  initZoomUI() {
    const _rate = this.storageService.get({ key: 'zoomUI' }) || 0;
    this.zoomUI(_.isNumber(+_rate) ? +_rate : 0);
  }

  getConfigByModuleCode(_code: string): any | null {
    if (
      !_.isEmpty(_code) &&
      this.currentConfig &&
      this.currentConfig['languages'] &&
      _.isArray(this.currentConfig.languages)
    ) {
      const language = _.find(this.currentConfig.languages, { code: _code });
      if (language) return language;
    }
    return null;
  }

  /**
   * Zoom UI with rateX
   * @param _rate Number of rate to zoom
   */
  zoomUI(_rate: number) {
    if (_.isNumber(_rate)) {
      // change class to UI
      this.storageService.set({ key: 'zoomUI', value: _rate.toString(), keyExcludedISS: true });

      // clean pen-z-[rateX]
      const _bodies = document.getElementsByTagName('body');

      if (_bodies && _bodies.length > 0) {
        const _body = _bodies[0];

        const _clsList: string[] = [];
        _body.classList.forEach((cls) => _clsList.push(cls));
        _clsList.forEach((cls) => {
          if (cls && cls.includes('pen-z')) {
            _body.classList.remove(cls);
          }
        });

        // set class to body
        _body.classList.add(`pen-z-${_rate}`);
      }

      this.currentZoom = _rate;
    }
  }

  setLayoutHomeWidget(widget: {
    profile?: boolean;
    features?: boolean;
    banner?: boolean;
    intro?: boolean;
    download?: boolean;
  }) {
    this.homeWidget$.next({
      ...this.homeWidget$.value,
      ...widget
    });
  }

  setDataMenu(dataMenu: { isVisible?: string }) {
    this.menuConfig$.next({ isVisible: dataMenu?.isVisible || false });
  }

  setDataHeader(dataHeader: { title?: string }) {
    const title = dataHeader?.title
      ? this.translateService.instant(dataHeader.title)
      : this.translateService.instant('MAIN.SKY_JOY');
    this.title.setTitle(`${title}`);
  }

  private generateCSSCustomProperties(obj: IAppLayoutConfig, prefix = '') {
    let styleContent = '';

    function processObject(obj: any, currentPrefix = '') {
      for (const key in obj) {
        const value = obj[key];

        if (typeof value === 'object') {
          processObject(value, `${currentPrefix}${key}-`);
        } else {
          if (currentPrefix !== 'theme-style-background-') {
            styleContent += `--${currentPrefix}${key}: ${value};\n`;
          } else {
            styleContent += `--${currentPrefix}${key}: url('${value}');\n`;
          }
        }
      }
    }

    processObject(obj, prefix);

    return styleContent;
  }

  private applyStyles(jsonConfig: IAppLayoutConfig): void {
    if (jsonConfig) {
      const styleElement = document.createElement('style');
      let styleContent = '';

      styleContent = this.generateCSSCustomProperties(jsonConfig);

      styleElement.appendChild(document.createTextNode(`:root {\n${styleContent}}`));
      document.head.appendChild(styleElement);
    }
    this.themeConfig$.next(jsonConfig);
    this.isReadyApp.next(true);
  }
}
