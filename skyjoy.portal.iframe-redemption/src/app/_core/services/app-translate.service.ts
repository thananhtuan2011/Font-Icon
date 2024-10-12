import { Injectable, inject } from '@angular/core';

import { URLHelper } from '@app/_core/helpers/url.helper';
import { TranslateService } from '@ngx-translate/core';
import { enUS, vi } from 'date-fns/locale';
import * as _ from 'lodash';
import { NzI18nService, en_US, vi_VN } from 'ng-zorro-antd/i18n';
import { environment } from 'src/environments/environment';
import { QUERY_PARAM_KEY, STORAGE_KEY } from '../constants/common';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppTranslateService {
  private i18n = inject(NzI18nService);
  private translateService = inject(TranslateService);
  private storageService = inject(StorageService);

  currentLang = environment.language;

  constructor() {}

  getCurrentLang(): string {
    return (
      URLHelper.getQueryString(QUERY_PARAM_KEY.LANG) ||
      this.translateService.currentLang ||
      this.storageService.get({ key: STORAGE_KEY.LANG, keyExcludedISS: true }) ||
      environment.language
    );
  }

  setLang(language: string = '') {
    let lang = language;
    if (_.isEmpty(language)) {
      lang = this.getCurrentLang();
    }

    this.translateService.use(lang).subscribe((resp: any) => {
      this.storageService.set({ key: STORAGE_KEY.LANG, value: lang, keyExcludedISS: true });
      this.translateService.setTranslation(lang, resp);
      this.setAntUI(lang);
      this.setHtmlLang(lang);

      switch (lang) {
        case 'en':
          this.i18n.setDateLocale(enUS);
          break;
        default:
          this.i18n.setDateLocale(vi);
          break;
      }
    });

    this.currentLang = lang;
  }

  private setAntUI(lang: string) {
    switch (lang) {
      case 'en':
        this.i18n.setLocale(en_US);
        this.i18n.setDateLocale(enUS);
        break;
      case 'vi':
      default:
        this.i18n.setLocale(vi_VN);
        this.i18n.setDateLocale(vi);
        break;
    }
  }

  private setHtmlLang(_lang: string) {
    if (_lang && document.documentElement) {
      try {
        document.documentElement.setAttribute('lang', _lang);
      } catch {
        console.error('can not set html language');
      }
    }
  }
}
