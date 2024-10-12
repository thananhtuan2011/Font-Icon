import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppTranslateService } from '@app/_core/services/app-translate.service';
import { UserSessionService } from '@app/_core/services/user-session.service';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Helpers } from '../helpers/helpers';
import { IApiOptions } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private API_URL = environment.apiEndpoint;
  private readonly http = inject(HttpClient);
  private userSessionService = inject(UserSessionService);
  private appTranslateService = inject(AppTranslateService);

  constructor() {}

  /**
   * Call api
   * @param object The api object for calling
   * @param body Body to param
   * @param customHeader Custom header
   * @param customParams Custom params
   * @param forceToken
   * @returns Observable data
   */
  public callApi(apiOptions: IApiOptions) {
    try {
      const { apiObject, customHeader, customParams, queryParams, forceToken, body, apiParams } = apiOptions;
      const uri = this.buildURI(!!apiObject.external, apiObject.url);
      const apiUrl = this.mapObjectToApi(uri, apiParams);
      const query = Helpers.convertObjectToParams(queryParams);

      const initials = this.setInit(
        customHeader,
        customParams,
        false,
        `${apiUrl}${query ? `?${query}` : ''}`,
        forceToken
      );
      const reqOption = new HttpRequest(apiObject.method, `${apiUrl}${query ? `?${query}` : ''}`, body, initials);

      return this.http.request(reqOption).pipe(
        map((response: any) => {
          if (response && [200, 201].includes(response.status) && response['body']) {
            return response.body as any;
          } else {
            return response;
          }
        })
      );
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  /**
   * Set a header to api request
   * @param _customHeader Customer header from outside
   * @param forceToken Force token to set
   * @returns HTTP Header
   */
  private setHeader(_customHeader?: any, forceToken?: string) {
    const access_token = forceToken && forceToken !== '' ? forceToken : this.userSessionService.getToken();

    let headers: HttpHeaders = new HttpHeaders();
    if (access_token && access_token !== '') {
      headers = headers.append('Authorization', `Bearer ${access_token}`);
    }
    headers = headers.append('Content-Language', this.appTranslateService.getCurrentLang() || 'vi');
    headers = headers.append('Content-Type', 'application/json');

    if (_customHeader) {
      // return _customHeader;
      for (const d in _customHeader) {
        headers = headers.set(d, _customHeader[d]);
      }
    }
    return headers;
  }

  /**
   * Set the initial param value
   * @param customHeader Custom Header
   * @param customParams Custom params
   * @param notReplaceHeader Force not replace header
   * @param url url to call
   * @returns a init to option
   */
  private setInit(customHeader: any, customParams?: any, notReplaceHeader = false, url?: string, forceToken?: string) {
    const headers = notReplaceHeader ? customHeader : this.setHeader(customHeader, forceToken);
    let _init = {
      headers: headers,
      withCredentials: undefined,
      reportProgress: undefined,
      responseType: undefined, // 'arraybuffer'|'blob'|'json'|'text',
      observe: undefined
      // observe: 'response'
    };
    if (customParams) {
      _init = { ..._init, ...customParams };
    }
    return _init;
  }

  /**
   * Build the uri
   * @param external IF true, the url will be used directly
   * @param url Url to call
   * @returns Url of api
   */
  private buildURI(external: boolean, url: string) {
    if (external) {
      return url;
    }
    return `${this.API_URL}${url}`;
  }

  private mapObjectToApi(apiTemplate: string, obj: { [key: string]: any } | undefined): string {
    const matches = apiTemplate.match(/:[a-zA-Z_][a-zA-Z0-9_]*/g);

    if (!matches) {
      return apiTemplate;
    }
    if (!obj || isEmpty(obj)) {
      return apiTemplate;
    }

    let api = apiTemplate;

    for (const match of matches) {
      const key = match.substr(1); // Remove the leading ':'
      if (obj[key] !== undefined) {
        api = api.replace(match, obj[key]);
      }
    }

    return api;
  }
}
