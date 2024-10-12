import { Injectable, inject } from '@angular/core';
import { API_DEFINE } from '@app/_core/constants/api-define.enum';
import { IProfileBalance } from '@app/_core/interfaces/profile.interface';
import { APIService } from '@app/_core/services/api.service';
import { UserSessionService } from '@app/_core/services/user-session.service';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {
  private apiService = inject(APIService);
  private userSessionService = inject(UserSessionService);

  private profileBalance$ = new BehaviorSubject<IProfileBalance | null>(null);
  private userProfile$: Observable<any> | undefined;

  token = this.userSessionService.getToken();

  constructor() {}

  // getErrorsIntegrationList() {
  //   return this.apiService.callApi({ apiObject: API_DEFINE.USER.PUBLIC.INTEGRATE_ERRORS, body: null });
  // }

  getInfo(from: string) {
    const apiInfo = API_DEFINE.USER.USER.PROFILE_API;
    return this.apiService.callApi({ apiObject: apiInfo, body: null });
  }

  getUserProfile(from: string): Observable<any> {
    if (!this.userProfile$) {
      this.userProfile$ = this.getInfo('').pipe(
        shareReplay(1) // Share the result and replay 1 item to new subscribers
      );
    }
    return this.userProfile$;
  }

  setProfileBalance(data: IProfileBalance) {
    this.profileBalance$.next(data);
  }

  getProfileBalance(): Observable<IProfileBalance | any> {
    return this.profileBalance$;
  }
}
