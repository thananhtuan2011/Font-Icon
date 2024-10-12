import { Injectable, inject } from '@angular/core';
import { SentryLoggerService } from '@app/_share/modules/sentry-logger/sentry-logger.service';
import * as _ from 'lodash';
import { SENTRY_ERROR_TYPE_ENUM, SENTRY_SEVERITY_LEVEL_ENUM } from '../constants/sentry';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private sentryLoggerService = inject(SentryLoggerService);

  private requestId: string | null = null;
  private traceId: string | null = null;
  private className: string | null = null;
  private functionName: string | null = null;
  private memberCode: string | null = null;

  constructor() {}

  updateLogContext(className: string, functionName: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this; // Capture the correct context
    if (className) {
      self.className = className; // Use captured context
    }
    if (functionName) {
      self.functionName = functionName; // Use captured context
    }
  }

  setRequestLog(from: string, request: { requestId: string; traceId: string }) {
    if (request.traceId) {
      this.traceId = request.traceId;
    }
    if (request.requestId) {
      this.requestId = request.requestId;
    }
  }

  setMemberCode(memberCode: string) {
    if (memberCode) {
      this.memberCode = memberCode;
    }
  }

  clearRequestLog() {
    this.requestId = null;
    this.traceId = null;
  }

  log(name: string, ...args: any[]) {
    console.log.apply(console, this.argMerge(name, args, SENTRY_SEVERITY_LEVEL_ENUM.LOG));
  }

  error(name: string, ...args: any[]) {
    console.error.apply(console, this.argMerge(name, args, SENTRY_SEVERITY_LEVEL_ENUM.ERROR));
  }

  warn(name: string, ...args: any[]) {
    console.warn.apply(console, this.argMerge(name, args, SENTRY_SEVERITY_LEVEL_ENUM.WARNING));
  }

  info(name: string, ...args: any[]) {
    console.info.apply(console, this.argMerge(name, args, SENTRY_SEVERITY_LEVEL_ENUM.INFO));
  }

  private argMerge(...args: any[]) {
    let exceptionAPIResponse = null;
    let exceptionError = null;
    let exceptionInfo = null;
    if (args[0] === 'API_INTERCEPT') {
      exceptionAPIResponse = args[1][0];
      exceptionError = _.get(exceptionAPIResponse, 'error') || {};
    }
    exceptionInfo = { ...exceptionError, level: args[args.length - 1] };

    // MEMBER_CODE] - [REQUEST_ID] - [TRACE_ID]
    this.sentryLoggerService.addScope({
      requestId: this.requestId,
      traceId: this.traceId,
      memberCode: this.memberCode,
      className: this.className,
      functionName: this.functionName,
      statusCode: exceptionInfo?.statusCode, //For Api Error
      errorNumber: exceptionInfo?.errors?.errorNumber, //For Api Error
      errorCode: exceptionInfo?.errors?.code //For Api Error
    });
    const messageBody = _.slice(args, 1, args.length - 1);
    this.sentryLoggerService.captureException(new Error(JSON.stringify(messageBody)), {
      errorName: exceptionAPIResponse ? exceptionAPIResponse.url : args[0],
      level: exceptionInfo.level,
      type: exceptionAPIResponse
        ? this.setExceptionType(exceptionAPIResponse, exceptionError)
        : SENTRY_ERROR_TYPE_ENUM.EXCEPTION
    });
    return [...args];
  }

  private setExceptionType(apiResponse: any, error: any): string {
    const statusCode = error?.statusCode ? '- ' + (error.statusCode || apiResponse.status) : '';
    const errorNumber = error?.errors?.errorNumber ? '- ' + error?.errors?.errorNumber : '';
    const code = error?.errors?.code ? '- ' + error?.errors?.code : '';
    return `${SENTRY_ERROR_TYPE_ENUM.API} ${statusCode} ${errorNumber} ${code}`;
  }
}
