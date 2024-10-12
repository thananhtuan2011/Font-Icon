import { DecimalPipe } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CONFIGURATION_FIELD_SERVER, STORAGE_KEY } from '../constants/common';
import { IAppConfiguration, ICurrency } from '../interfaces/app-configuration.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigurationService {
  appConfig: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentLang = environment.language;
  public currentZoom: number = 0;
  DEFAULT_VALUE = 1234.12;
  DEFAULT_LOCALE = 'en_US';
  DEFAULT_LOCALE_FIELD_NAME = 'locale';
  DEFAULT_CURRENCY_FIELD_NAME = 'currency';
  getConfigSuccess = new BehaviorSubject(false);
  public configData: IAppConfiguration = this.getDefaultCurrencyConfig();
  public apiResponse: any;
  readonly appConfigVersion$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private storageService = inject(StorageService);

  constructor() {}

  set appConfigVersion(_config: any) {
    if (_config) {
      this.appConfigVersion$.next(_config);
      this.storageService.set({
        key: STORAGE_KEY.FEATURE_CONFIG_VERSION,
        value: JSON.stringify(_config)
      });
    }
  }

  getDefaultCurrencyConfig() {
    return {
      amount: {
        thousandSign: environment.configurationDefault.numberFormat.thousandSign,
        decimalSign: environment.configurationDefault.numberFormat.decimalSign,
        currencySign: environment.configurationDefault.CURRENCY_SIGN
      },
      point: {
        thousandSign: environment.configurationDefault.numberFormat.thousandSign,
        decimalSign: environment.configurationDefault.numberFormat.decimalSign,
        currencySign: ''
      }
    } as IAppConfiguration;
  }

  checkSignConfigFromApi(type: typeof CONFIGURATION_FIELD_SERVER.AMOUNT | typeof CONFIGURATION_FIELD_SERVER.POINT) {
    if (!this.apiResponse) return;

    const _object = this.apiResponse[CONFIGURATION_FIELD_SERVER[type as 'AMOUNT' | 'POINT']];
    if (_object) {
      const _defaultValue = this.getDefaultValue(_object[this.DEFAULT_LOCALE_FIELD_NAME]);
      const _defaultSign = this.getSignByValue(_object[this.DEFAULT_LOCALE_FIELD_NAME], _defaultValue, _object);
      (this.configData as any)[(type as 'AMOUNT' | 'POINT').toLowerCase()] = _defaultSign;
    }
  }

  getSignByValue(_locale = this.DEFAULT_LOCALE, _defaultValue?: any, _object?: any) {
    if (!_defaultValue) _defaultValue = this.getDefaultValue(_locale) || '1.234,12';
    return {
      decimalSign: _defaultValue.length > 2 ? _defaultValue.charAt(_defaultValue.length - 3) : '',
      thousandSign: _defaultValue.charAt(1),
      currencySign:
        (_object && _object[this.DEFAULT_CURRENCY_FIELD_NAME] ? _object[this.DEFAULT_CURRENCY_FIELD_NAME] : 'VND') ||
        'VND'
    } as ICurrency;
  }

  getDefaultValue(_locale = this.DEFAULT_LOCALE): string {
    let _value = '';
    try {
      _value = DecimalPipe.prototype.transform(this.DEFAULT_VALUE, '', _locale || this.DEFAULT_LOCALE) || '1.234,12';
    } catch (ex) {
      // console.log(ex);
    }
    return _value;
  }

  public getUserFraudEkycUr() {
    return this.configData.userFraudEkycUrl ?? '';
  }

  public decimalSign(type: 'amount' | 'point') {
    return this.configData[type].thousandSign;
  }

  public thousandSign(type: 'amount' | 'point') {
    return this.configData[type].thousandSign;
  }

  public currencySign(type: 'amount' | 'point') {
    return this.configData[type].currencySign ? this.configData[type].currencySign.toUpperCase() : '';
  }

  init(object: any | null = null) {
    if (object && (object[CONFIGURATION_FIELD_SERVER.AMOUNT] || object[CONFIGURATION_FIELD_SERVER.POINT])) {
      this.apiResponse = object;
      if (!this.apiResponse) this.apiResponse = {} as any;
      this.checkSignConfigFromApi('AMOUNT');
      this.checkSignConfigFromApi('POINT');
    }
  }

  setUserFraudEkycUr(url: string) {
    (this.configData as any)['userFraudEkycUrl'] = url;
  }
}
