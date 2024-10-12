import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_BYPASS } from '@app/_core/constants/api-bypass.enum';
import { LogAllMethods } from '@app/_core/functions/log-all-methods.decorator';
import { STATUS_PROFILE } from '@app/_core/interfaces/profile.interface';
import { LoggingService } from '@app/_core/services/logging.service';
import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, filter, take, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APP_PATH } from '../constants/common';
import { UserSessionService } from '../services/user-session.service';

@Injectable()
@LogAllMethods()
export class AppInterceptor implements HttpInterceptor {
  constructor(
    private message: NzMessageService,
    private loggingService: LoggingService,
    private router: Router,
    private userSessionService: UserSessionService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loggingService.clearRequestLog();

    return next.handle(request).pipe(
      filter((e) => e.type !== 0),
      take(1),
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.initLogService(request, event);
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.initLogService(request, err);
        const sjErrorCode = _.get(err, 'error.errors.code');
        this.loggingService.error(`API_INTERCEPT`, err);

        switch (err?.status) {
          case 406:
            this.userSessionService.logout();
            this.router.navigate([`${APP_PATH.ERROR.USER_STATUS}/${sjErrorCode}`], {});
            break;
          case 0 || 400:
            if (sjErrorCode && sjErrorCode === STATUS_PROFILE.ACCOUNT_IS_CLOSED) {
              this.userSessionService.gotoErrorUserStatus(sjErrorCode);
              break;
            } else {
              if (API_BYPASS.includes(request.url)) {
                this.userSessionService.logout();
              }
            }
            break;
          case 401:
            this.message.create('error', `Token invalid.`, {
              nzPauseOnHover: true
            });
            setTimeout(() => {
              this.userSessionService.gotoErrorNotFound();
            }, 500);
            break;
          case 404:
            this.userSessionService.gotoNotFound();
            break;
          case 403:
            this.message.create('error', `Access is denied.`, {
              nzPauseOnHover: true
            });
            // setTimeout(() => {
            //     this.userSessionService.gotoUnauthorized()
            // }, 500)
            break;
          default:
            break;
        }
        return throwError(() => err);
      })
    );
  }

  private checkURLAcceptLog(requestUrl: any) {
    return !!(
      requestUrl &&
      !requestUrl.endsWith('.json') &&
      !requestUrl.endsWith('.svg') &&
      !requestUrl.includes('assets/svg/icons-v2.svg')
    );
  }

  private initLogService(request: HttpRequest<any>, event: HttpErrorResponse | HttpResponse<any>) {
    const requestId = event.headers.get('Request-Id');
    const traceId = event.headers.get('Trace-Id');
    if (this.checkURLAcceptLog(request.url)) {
      this.loggingService.setRequestLog(request.url, {
        requestId: requestId || '',
        traceId: traceId || ''
      });
    }
  }
}
