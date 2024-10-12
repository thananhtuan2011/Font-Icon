import { Injectable, inject } from '@angular/core';
import { STORAGE_KEY } from '@app/_core/constants/common';
import { IAppFeatureFieldVersion, IAppFeatureVersion } from '@app/_core/interfaces/app-configuration.interface';
import { ApiConfigurationService } from '@app/_core/services/api-configuration.service';
import { ApiUserService } from '@app/_core/services/api-user.service';
import { AppTranslateService } from '@app/_core/services/app-translate.service';
import { StorageService } from '@app/_core/services/storage.service';
import { UserSessionService } from '@app/_core/services/user-session.service';
import { compare } from 'compare-versions';
import * as _ from 'lodash';
import { Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

type FeatureBooleanMap<T> = T extends string ? boolean : T extends any[] ? T : [];

@Injectable({
  providedIn: 'root'
})
export class VersionVisibilityService {
  private storageService = inject(StorageService);
  private appTranslateService = inject(AppTranslateService);
  private userSessionService = inject(UserSessionService);
  private apiConfigurationService = inject(ApiConfigurationService);
  private apiUserService = inject(ApiUserService);

  constructor() {}

  public checkFeatureVisibleDirective$<T extends string | any[]>(featureName: T): Observable<FeatureBooleanMap<T>> {
    return this.apiConfigurationService.appConfigVersion$.pipe(
      map((response: IAppFeatureVersion) => {
        return this.isVisibleFeatureWithModule(response || {}, featureName);
      })
    ) as Observable<FeatureBooleanMap<T>>;
  }

  public checkFeatureVisible$<T extends string | any[]>(featureName: T): Observable<FeatureBooleanMap<T>> {
    return this.apiUserService.getUserProfile('checkFeatureVisible$').pipe(
      switchMap((response: any) => {
        if (response?.data) {
          this.userSessionService.setProfileInfo(response.data);
        }
        return this.apiConfigurationService.appConfigVersion$.pipe(
          map((response: IAppFeatureVersion) => {
            return this.isVisibleFeatureWithModule(response || {}, featureName);
          })
        ) as Observable<FeatureBooleanMap<T>>;
      })
    );
  }

  public getFeatureDataIncludeLanguage(featureName: string, contentObj: string): string {
    const partnerAppVersion = this.storageService.get({ key: STORAGE_KEY.VERSION_PARTNER });
    const config = this.getFeatureConfig(featureName);
    const lang = this.appTranslateService.getCurrentLang();

    if (partnerAppVersion) {
      if (config?.appVersion !== '*' && compare(partnerAppVersion, config.appVersion, '>=')) {
        return '';
      }
    }
    if (!contentObj) return '';
    return _.get(config, `${contentObj}.${lang}`, '');
  }

  getFeatureConfig(featureName: string, featureConfigVersion?: IAppFeatureVersion): IAppFeatureFieldVersion {
    const _issuer = this.storageService.get({ key: STORAGE_KEY.ISSUER, keyExcludedISS: true }) || '';
    const _defaultConfig = { appVersion: '', content: {}, rollOutMemberCode: [] };

    if (!featureConfigVersion || _.isEmpty(featureConfigVersion)) {
      featureConfigVersion = JSON.parse(this.storageService.get({ key: STORAGE_KEY.FEATURE_CONFIG_VERSION }) || '{}');
    }
    if (featureConfigVersion) {
      try {
        return featureConfigVersion[featureName][_issuer];
      } catch (e) {
        return _defaultConfig;
      }
    } else {
      return _defaultConfig;
    }
  }

  private isCheckConfigFeatureIssuerModule(featureConfigVersion: IAppFeatureFieldVersion): boolean {
    try {
      const {
        member: { memberCode }
      } = JSON.parse(this.storageService.get({ key: STORAGE_KEY.USER_PROFILE }) || '{}');

      const partnerAppVersion = this.storageService.get({ key: STORAGE_KEY.VERSION_PARTNER });

      const a = featureConfigVersion;

      if (!a) {
        return false;
      }

      if (a.appVersion === '*') {
        if (!a.rollOutMemberCode?.length) {
          return true;
        } else if ((a?.rollOutMemberCode || []).findIndex((m: string) => m === memberCode) != -1) {
          return true;
        }
      } else if (a.appVersion && partnerAppVersion && partnerAppVersion !== 'undefined') {
        if (compare(partnerAppVersion, a.appVersion, '>=')) {
          if (!a.rollOutMemberCode?.length) {
            return true;
          } else if ((a?.rollOutMemberCode || []).findIndex((m: string) => m === memberCode) != -1) {
            return true;
          }
        }
      } else {
        // invisible feature
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  private isVisibleFeatureWithModule(
    featureConfigVersion: IAppFeatureVersion,
    featureName: string | any[]
  ): boolean | any[] {
    if (typeof featureName === 'string') {
      return this.isCheckFeaturePermission(featureConfigVersion, featureName);
    } else if (Array.isArray(featureName)) {
      const arrFeatureHasPer: any[] = [];
      for (const f of featureName) {
        const _isHasPer = this.isCheckFeaturePermission(featureConfigVersion, f);
        if (_isHasPer) {
          arrFeatureHasPer.push(f);
        }
      }
      return arrFeatureHasPer;
    }
    return false;
  }

  private isCheckFeaturePermission(featureConfigVersion: any, featureName: string): boolean {
    const issuer = this.storageService.get({ key: STORAGE_KEY.ISSUER, keyExcludedISS: true }) || '';
    const _moduleConfig = _.get(featureConfigVersion, featureName);
    if (_moduleConfig) {
      try {
        const _featureConfig = _moduleConfig[issuer];
        if (_featureConfig) {
          return this.isCheckConfigFeatureIssuerModule(_featureConfig);
        }
        return false;
      } catch (e) {
        return false;
      }
    }

    return false;
  }

  private checkVisibleMenu(featureConfigVersion?: IAppFeatureVersion) {
    try {
      if (!featureConfigVersion || _.isEmpty(featureConfigVersion)) {
        featureConfigVersion = JSON.parse(this.storageService.get({ key: STORAGE_KEY.FEATURE_CONFIG_VERSION }) || '{}');
      }

      if (_.isEmpty(featureConfigVersion)) {
        return false;
      }

      const _isVisible = Object.keys(featureConfigVersion).some((featureName) => {
        if (featureName && featureConfigVersion) {
          return this.isVisibleFeatureWithModule(featureConfigVersion, featureName);
        }
        return false;
      });

      return _isVisible;
    } catch (e) {
      console.log(` ⚠️ \x1b[103m Warning! \x1b[0m \x1b[33m waiting...:`, e);
      return false;
    }
  }
}
