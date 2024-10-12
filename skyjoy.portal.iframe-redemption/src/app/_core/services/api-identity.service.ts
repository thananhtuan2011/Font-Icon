import { Injectable, inject } from '@angular/core';
import { API_DEFINE } from '@app/_core/constants/api-define.enum';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiIdentityService {
  private apiService = inject(APIService);

  constructor() {}

  exchangeToken(_token: string) {
    return this.apiService.callApi({
      apiObject: API_DEFINE.IDENTITY.PUBLIC.EXCHANGE_TOKEN,
      body: { token: _token }
    });
  }

  refreshToken(_refreshToken: string) {
    return this.apiService.callApi({
      apiObject: API_DEFINE.IDENTITY.PUBLIC.REFRESH_TOKEN,
      body: { refreshToken: _refreshToken }
    });
  }

  getOneTimeToken(params: object) {
    // const url = API_DEFINE.IDENTITY.MEMBER.GET_ONE_TIME_TOKEN.url;
    // return this.apiService.callApi({
    //   apiObject: { ...API_DEFINE.IDENTITY.MEMBER.GET_ONE_TIME_TOKEN, url: url },
    //   body: params
    // });
  }
}
