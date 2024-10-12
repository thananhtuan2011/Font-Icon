import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { STORAGE_KEY } from '@app/_core/constants/common';
import { IUserAuthentication, IUserInfo } from '@app/_core/interfaces/common.interface';
import { StorageService } from '@app/_core/services/storage.service';
import { UserSessionService } from '@app/_core/services/user-session.service';
import { Buffer } from 'buffer';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiIdentityService } from './api-identity.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public readonly userInfo$: BehaviorSubject<IUserInfo | null> = new BehaviorSubject<IUserInfo | null>(null);
  public authSubject$: BehaviorSubject<IUserAuthentication | null>;
  private refreshTokenTimeout?: any;
  private isRequireRefreshToken = true;
  private http = inject(HttpClient);
  private userSessionService = inject(UserSessionService);
  private storageService = inject(StorageService);
  private apiIdentity = inject(ApiIdentityService);

  constructor() {
    this.authSubject$ = new BehaviorSubject<IUserAuthentication | null>(null);
  }

  public get authValue(): IUserAuthentication | null {
    return this.authSubject$.value;
  }

  refreshToken(from: string) {
    const _refreshToken = this.storageService.get({ key: STORAGE_KEY.REFRESH_TOKEN });

    if (!this.isRequireRefreshToken) {
      return this.authSubject$;
    }

    if (!_refreshToken) {
      return of(null);
    }

    return this.apiIdentity.refreshToken(_refreshToken).pipe(
      map((response: IUserAuthentication) => {
        const userToken = response;
        this.isRequireRefreshToken = false;
        this.authSubject$.next(userToken);
        this.updateTokenStorage(response);

        this.startRefreshTokenTimer();
        return userToken;
      }),
      catchError((err) => {
        this.userSessionService.logout();
        this.stopRefreshTokenTimer();
        return of(null);
      })
    );
  }

  updateTokenStorage(auth: IUserAuthentication) {
    this.storageService.set({ key: STORAGE_KEY.ACCESS_TOKEN, value: auth.access_token });
    this.storageService.set({ key: STORAGE_KEY.REFRESH_TOKEN, value: auth.refresh_token });
    this.storageService.set({ key: STORAGE_KEY.TOKEN_EXPIRED, value: auth.expires_in });
  }

  logoutClient(): Observable<any> {
    const _refreshToken = this.storageService.get({ key: STORAGE_KEY.REFRESH_TOKEN });
    if (!_refreshToken) {
      return of(null);
    }

    const customHeader = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const params = new URLSearchParams({
      client_id: environment.sso.clientId,
      refresh_token: _refreshToken
    });
    return this.http
      .post(`${environment.sso.ssoUrl}realms/${environment.sso.realmName}/protocol/openid-connect/logout`, params, {
        headers: customHeader
      })
      .pipe();
  }

  private startRefreshTokenTimer() {
    const jwtBase64 = this.authValue!.access_token!.split('.')[1];
    const jwtToken = JSON.parse(Buffer.from(jwtBase64, 'base64').toString());
    this.userInfo$.next(jwtToken);

    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(() => {
      this.isRequireRefreshToken = true;
      // NOTE auto refresh before a minute
    }, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
