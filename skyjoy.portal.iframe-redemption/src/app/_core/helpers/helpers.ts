import { inject } from '@angular/core';
import { Buffer } from 'buffer';
import { LoggingService } from '../services/logging.service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';

export class Helpers {
  public static getEnvironmentKey(environmentValue: any) {
    try {
      if ((!environmentValue && typeof environmentValue === 'boolean') || typeof environmentValue === 'undefined') {
        return false;
      }
      if (environmentValue === 'false') {
        return false;
      }
      if (environmentValue === 'true') {
        return true;
      }
      const data = environmentValue.toString();
      return data.startsWith('%') && data.endsWith('%') ? false : environmentValue;
    } catch (e) {
      return false;
    }
  }

  public static convertParamsToObject = (_string: string) => {
    // var search = location.search.substring(1);
    if (_string && _string.length > 0 && _string !== '/') {
      return JSON.parse(
        '{"' + decodeURI(_string).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
      );
    }
    return undefined;
  };

  public static convertObjectToParams = (_obj: any) => {
    if (_obj) {
      let str = '';
      // tslint:disable-next-line:forin
      for (const key in _obj) {
        if (_obj[key]) {
          if (str !== '') {
            str += '&';
          }
          str += key + '=' + encodeURIComponent(_obj[key]);
        }
      }
      return str;
    } else {
      return '';
    }
  };

  public static concatUniqueById(arr1: any[], arr2: any[]): any[] {
    const set = new Set(arr1.map((item) => item.id));
    arr2.forEach((item) => set.add(item.id));

    return Array.from(set, (id) => {
      const item1 = arr1.find((item) => item.id === id);
      if (item1) {
        return item1;
      }
      const item2 = arr2.find((item) => item.id === id);
      return item2!;
    });
  }

  public static getQueryString = (key: string): string => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const value = params.get(key);
    return value ? value : '';
  };

  public static parseJWT = (token: string): any => {
    const jwtBase64 = token.split('.')[1];
    return JSON.parse(Buffer.from(jwtBase64, 'base64').toString());
  };

  public static tokenIsValid = (token: string | null): boolean => {
    const loggingService = inject(LoggingService);
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 3) {
      loggingService.error('[EXCHANGE_TOKEN] Invalid token: Incorrect number of segments');
      return false;
    } else {
      try {
        JSON.parse(Buffer.from(parts[1], 'base64').toString());
        return true;
      } catch (error: any) {
        loggingService.error('[EXCHANGE_TOKEN] Invalid token:', error);
        return false;
      }
    }
  };

  public static getPathByModuleName(moduleName: string) {
    const _module: any = _.get(environment.partnerAppModules, moduleName, null);
    return _module && _module?.path ? _module.path : null;
  }

  public static getKeyByModuleLink(modules: any, moduleLink: string) {
    for (const key in modules) {
      if (modules[key]['data']['moduleLink'] === moduleLink) {
        return key;
      }
    }
    return null;
  }

  public static getModuleNameByModuleLink(moduleLink: string) {
    const _moduleName = this.getKeyByModuleLink(environment.partnerAppModules, moduleLink) || '';
    const _module: any = _.get(environment.partnerAppModules, _moduleName, null);

    return _module && _module?.moduleName ? _module.moduleName : null;
  }

  public static checkEnvironmentValue(environmentValue: any) {
    try {
      if ((!environmentValue && typeof environmentValue === 'boolean') || typeof environmentValue === 'undefined') {
        return false;
      }
      const data = environmentValue.toString();
      return data.startsWith('%') && data.endsWith('%') ? false : environmentValue;
    } catch (e) {
      return false;
    }
  }
}
