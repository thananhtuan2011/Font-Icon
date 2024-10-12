import { Injectable, inject } from '@angular/core';
import { UtilService } from '@app/_core/services/util.service';
// @ts-ignore
import moengage from '@moengage/web-sdk';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingMoeService {
  private utilService = inject(UtilService);

  constructor() {}

  isEnable(isInit = false) {
    const isEnable =
      this.utilService.checkEnvironment(environment.MOENGAGE.IS_ENABLE) &&
      !!this.utilService.checkEnvironment(environment.MOENGAGE.APP_ID) &&
      !_.isEmpty(moengage);
    if (!isEnable && isInit) {
      console.info(`MOENGAGE is disabled or missing config`, {
        IS_ENABLE: environment.MOENGAGE.IS_ENABLE,
        APP_ID: environment.MOENGAGE.APP_ID,
        IS_PRODUCTION: environment.production
      });
    }

    return isEnable;
  }

  init() {
    if (!this.isEnable(true)) {
      return;
    }

    moengage.initialize({
      app_id: environment.MOENGAGE.APP_ID,
      debug_logs: environment.MOENGAGE.DEBUG_LOGS || 0
      // swPath: `${environment.baseHref}combined-sw.js`
    });
    moengage.call_web_push();
  }

  setUserLogin(profile: any) {
    if (!this.isEnable()) return;
    if (!profile?.memberCode) return;

    moengage.add_unique_user_id(profile?.memberCode)?.then(() => {
      moengage.add_mobile(profile?.phone);
      moengage.add_first_name(profile?.firstName);
      moengage.add_last_name(profile?.lastName);
      moengage.add_user_name(profile?.fullName);
      moengage.add_email(profile?.email);
      moengage.add_gender(profile?.gender);
      moengage.add_birthday(new Date(profile?.birthday));
      // custom attributes
      this.addAttribute({
        tier: profile?.tier,
        user_point: profile?.user_point,
        is_ekyc: profile?.is_ekyc,
        birthday_year: profile?.birthday_year
      });
    });

    // this.trackEvent(TRACKING_EVENT_NAME.GAME_VJL_LOGIN, {
    //     method: MOENGAGE_EVENT_METHOD.SKYJOY,
    //     id: profile?.memberCode,
    //     memberCode: profile?.memberCode,
    //     email: profile?.email,
    //     phone: profile?.phone,
    //     tier: profile?.tier
    // });
  }

  destroyUserSession() {
    if (!this.isEnable()) return;
    moengage.destroy_session();
  }

  addAttribute(attribute: any) {
    if (!this.isEnable()) return;
    if (_.isEmpty(attribute)) return;
    for (const property in attribute) {
      moengage.add_user_attribute(property, attribute[property]);
    }
  }

  trackEvent(eventName: string, attributes?: any) {
    if (!this.isEnable()) return;
    if (!eventName) return;
    if (!environment.production) {
      console.log(` ℹ️ \x1b[102m MO_ENGAGE trackingEvent \x1b[0m  `, {
        MoeInstance: moengage,
        eventName,
        attributes
      });
    } else {
      console.log('MO_ENGAGE: trackingEvent', {
        MoeInstance: moengage,
        eventName,
        attributes
      });
    }
    moengage.track_event(eventName, attributes || undefined);
  }
}
