import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_PATH, STORAGE_KEY } from '@app/_core/constants/common';
import { LogAllMethods } from '@app/_core/functions/log-all-methods.decorator';
import { IUserProfile, STATUS_EKYC } from '@app/_core/interfaces/profile.interface';
import { LoggingService } from '@app/_core/services/logging.service';
import { StorageService } from '@app/_core/services/storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@LogAllMethods()
export class UserSessionService {
  public userStatus$ = new BehaviorSubject<string | null>(null);
  public dataToCheckStatus$ = new BehaviorSubject<any>(null);
  public showFraudPopup$ = new BehaviorSubject<boolean>(false);
  public redeemFail$ = new BehaviorSubject<boolean>(false);
  private profileInfo: IUserProfile | null = null;
  // private gidToken = "";
  // private readonly token: string | null = "";
  // private tokenObject = {} as any;

  private storageService = inject(StorageService);
  private loggingService = inject(LoggingService);
  private router = inject(Router);

  constructor() {
    this.storageService.get({ key: STORAGE_KEY.ACCESS_TOKEN });
  }

  logout() {
    this.storageService.remove();
    this.userStatus$.next(null);
    this.dataToCheckStatus$.next(null);
    this.router.navigate([APP_PATH.ERROR.TOKEN_EXPIRED], {});
  }

  getTokenPartner() {
    return this.storageService.get({ key: STORAGE_KEY.EXCHANGE_TOKEN, keyExcludedISS: true });
  }

  getToken(): string {
    return this.storageService.get({ key: STORAGE_KEY.ACCESS_TOKEN }) || '';
  }

  getProfileInfo(): any {
    return this.profileInfo || null;
  }

  setProfileInfo(_profileInfo: any = null) {
    if (_profileInfo) {
      this.profileInfo = _profileInfo;
      this.storageService.set({ key: STORAGE_KEY.USER_PROFILE, value: JSON.stringify(_profileInfo) });
      this.setDataToCheckStatus(_profileInfo);
      this.loggingService.setMemberCode(_profileInfo.member.memberCode);
    }
  }

  isEkyc(): boolean {
    if (this.profileInfo) {
      return [STATUS_EKYC.COMPLETE, STATUS_EKYC.VERIFIED].includes(this.profileInfo.member.ekycStatus);
    } else {
      return false;
    }
  }

  setUserStatus(status: string) {
    this.userStatus$.next(status);
  }

  getUserStatus() {
    this.userStatus$.value;
  }

  setShowFraudPopup(state: boolean) {
    this.showFraudPopup$.next(state);
  }

  getShowFraudPopup(state: boolean) {
    return this.showFraudPopup$.value;
  }

  setRedeemFail(state: boolean) {
    this.redeemFail$.next(state);
  }

  getRedeemFail(state: boolean) {
    return this.redeemFail$.value;
  }

  setDataToCheckStatus(data: any) {
    let userData: any = {};

    if (data.username) {
      userData = { type: '2', content: data.username };
    } else if (data.email) {
      userData = { type: '1', content: data.email };
    }

    this.storageService.set({
      key: STORAGE_KEY.CHECK_STATUS_TYPE,
      value: userData?.type ?? ''
    });

    this.storageService.set({
      key: STORAGE_KEY.CHECK_STATUS_CONTENT,
      value: userData?.content ?? ''
    });

    this.dataToCheckStatus$.next(userData);
  }

  getDataToCheckStatus() {
    let data: any = null;

    if (this.dataToCheckStatus$.value) {
      data = this.dataToCheckStatus$.value;
    } else if (
      this.storageService.get({ key: STORAGE_KEY.CHECK_STATUS_TYPE }) &&
      this.storageService.get({ key: STORAGE_KEY.CHECK_STATUS_CONTENT })
    ) {
      data = {
        type: this.storageService.get({ key: STORAGE_KEY.CHECK_STATUS_TYPE }),
        content: this.storageService.get({ key: STORAGE_KEY.CHECK_STATUS_CONTENT })
      };
    }
    return data;
  }

  gotoErrorUserStatus(status: any) {
    this.logout();
    console.log(
      ` 🔥 \x1b[101m Error! \x1b[0m \x1b[31m ${APP_PATH.ERROR.USER_STATUS}/${status} ___:`,
      `${APP_PATH.ERROR.USER_STATUS}/${status}`
    );

    this.router.navigate([`${APP_PATH.ERROR.USER_STATUS}/${status}`], {});
  }

  gotoErrorNotFound() {
    this.logout();
    this.router.navigate([APP_PATH.ERROR.RESULT_NOT_FOUND], {});
  }

  gotoNotFound() {
    this.logout();
    this.router.navigate([APP_PATH.ERROR.NOT_FOUND], {});
  }

  gotoUnauthorized() {
    this.logout();
    // this.storageService.remove()
    this.router.navigate([APP_PATH.ERROR.TOKEN_EXPIRED], {});
  }

  gotoTokenExpired() {
    this.logout();
    // this.storageService.remove()
    this.router.navigate([APP_PATH.ERROR.TOKEN_EXPIRED], {});
  }
}
