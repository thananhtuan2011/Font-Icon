import { Inject, Injectable, Optional } from '@angular/core';
import { STORAGE_KEY, STORAGE_TYPE, STORAGE_TYPE_ENUM } from '../constants/common';

@Injectable()
export class StorageService {
  constructor(
    @Inject('StorageType')
    @Optional()
    public storageType?: STORAGE_TYPE_ENUM
  ) {}

  public set(options: { key: string; value: any; keyExcludedISS?: boolean; storageType?: STORAGE_TYPE_ENUM }) {
    const type = options.storageType ? options.storageType : this.storageType;
    const issStorage = this.getISS(type);

    let issKey = '';
    if (!options.keyExcludedISS) {
      issKey = `${issStorage?.trim().replace(/\s+/g, '_')}-`;
    }
    const key = `${issKey}${options.key}`;
    if (!options.value) {
      return;
    }
    const _value = typeof options.value === 'string' ? options.value : JSON.stringify(options.value);
    if (type === STORAGE_TYPE.COOKIES) {
      return (document.cookie = `${key}=${_value}; path=/`);
    }

    // NOTE string before save
    return localStorage.setItem(key, _value);
  }

  public get(options: { key: string; keyExcludedISS?: boolean; storageType?: STORAGE_TYPE_ENUM }) {
    try {
      const type = options.storageType ? options.storageType : this.storageType;
      const issStorage = this.getISS(type);
      let issKey = '';
      if (!options.keyExcludedISS) {
        issKey = `${issStorage?.trim().replace(/\s+/g, '_')}-`;
      }
      const key = `${issKey}${options.key}`;
      if (type === STORAGE_TYPE.COOKIES) {
        return this.getCookie(key);
      }
      return localStorage.getItem(key) || null;
    } catch (e) {
      return null;
    }
  }

  public deleteCookie(name: string) {
    const date = new Date();
    date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
    document.cookie = name + '=; expires=' + date.toUTCString() + '; path=/';
  }

  public getCookie(cname: string) {
    const cookieValue = document.cookie.match('(^|;) ?' + cname + '=([^;]*)(;|$)');
    return cookieValue ? cookieValue[2] : null;
  }

  public deleteAllCookies() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      const date = new Date();
      date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
      document.cookie = name + '=; expires=' + date.toUTCString() + '; path=/';
    }
  }

  public remove(storageKey?: string, keyExcludedISS?: boolean) {
    const type = this.storageType;
    const issStorage = this.getISS(type);
    let issKey = '';
    if (!keyExcludedISS) {
      issKey = `${issStorage?.trim().replace(/\s+/g, '_')}-`;
    }
    const key = `${issKey}${storageKey}`;
    if (storageKey) {
      if (this.storageType === STORAGE_TYPE.COOKIES) {
        return this.deleteCookie(key);
      }
      localStorage.removeItem(key);
    } else {
      if (this.storageType === STORAGE_TYPE.COOKIES) {
        return this.deleteAllCookies();
      } else {
        localStorage.clear();
      }
    }
  }

  private getISS(storageType?: STORAGE_TYPE_ENUM) {
    if (storageType === STORAGE_TYPE.COOKIES) {
      return this.getCookie(STORAGE_KEY.ISSUER);
    }
    return localStorage.getItem(STORAGE_KEY.ISSUER) || null;
  }
}
