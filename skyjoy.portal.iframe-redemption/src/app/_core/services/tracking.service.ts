import { Injectable, inject } from '@angular/core';
import { CHANNEL_SOURCE_ENUM, EKYC_STATUS, STORAGE_KEY } from '@app/_core/constants/common';
import { TRACKING_CHANNEL } from '@app/_core/constants/tracking';
import { IUserProfile } from '@app/_core/interfaces/profile.interface';
import { ITrackingEvent } from '@app/_core/interfaces/tracking.interface';
import { TrackingGaService } from '@app/_share/modules/tracking-ga/tracking-ga.service';
import { TrackingMoeService } from '@app/_share/modules/tracking-moe/tracking-moe.service';
import { Md5 } from 'ts-md5';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private trackingMoeService = inject(TrackingMoeService);
  private trackingGaService = inject(TrackingGaService);
  private storageService = inject(StorageService);

  sendTracking(data: ITrackingEvent) {
    // const userData: any = this.storageService.get({ key: STORAGE_KEY.USER_PROFILE }) || {};
    const source =
      this.storageService.get({ key: STORAGE_KEY.SOURCE, keyExcludedISS: true }) || CHANNEL_SOURCE_ENUM.APP_SJ;
    const channel = TRACKING_CHANNEL[source];

    const eventData = {
      ...data.eventData,
      channel: channel
      // member_code: userData?.member?.memberCode || ''
    };
    if (!environment.production) {
      console.log(` ℹ️ \x1b[103m sendTracking(from, data) \x1b[0m`, channel, data);
    }
    this.trackingMoeService.trackEvent(data.eventName, eventData);
    // this.trackingGaService.pushToDataLayer({ event: data.eventName, ...eventData });
  }

  loginTrackingEvent(profile: IUserProfile | null) {
    if (!profile) {
      console.log(` ℹ️ \x1b[103m profile null \x1b[0m`);
      return;
    }

    // Push a login event to Google Analytics
    const md5 = new Md5();
    const profileData = {
      memberCode: profile['member'] ? profile.member['memberCode'] || '' : '',
      phone: profile?.phone.substr(1),
      hashPhone: md5.appendStr(profile?.phone || '').end(),
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      fullName: profile?.fullName,
      email: profile?.email,
      hasEmail: md5.appendStr(profile?.email || '').end(),
      gender: profile?.member?.gender,
      birthday: profile?.member?.dateOfBirth?.toString()?.substr(0, 10),
      tier: profile?.tier?.tierTitle,
      user_point: profile?.balance?.balance,
      is_ekyc: profile?.member?.ekycStatus === EKYC_STATUS.IN_COMPLETE ? 'no' : 'yes',
      birthday_year: profile?.member?.dateOfBirth ? new Date(profile?.member?.dateOfBirth).getFullYear() : '',
      nationality: profile?.country
    };

    this.trackingMoeService?.setUserLogin(profileData);
    // this.trackGaLoginEvent(profileData);
  }

  private trackGaLoginEvent(profileData: any) {
    if (typeof window !== 'undefined' && typeof window.dataLayer !== 'undefined') {
      this.trackingGaService.pushToDataLayer({
        event: 'login',
        method: 'SkyJoy',
        id: profileData.memberCode,
        pn: profileData.hashPhone,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        fullName: profileData.fullName,
        em: profileData.hasEmail,
        // address: "",
        // city: "",
        gender: profileData.gender,
        birthday: profileData.birthday,
        tier: profileData.tier,
        user_point: profileData.user_point,
        is_ekyc: profileData.is_ekyc,
        birthday_year: profileData.birthday_year,
        nationality: profileData.nationality
      });
    }
  }
}
