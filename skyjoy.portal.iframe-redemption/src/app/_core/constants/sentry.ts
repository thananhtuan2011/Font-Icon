export enum SENTRY_ERROR_TYPE_ENUM {
  API = 'Api',
  UI = 'UI',
  EXCEPTION = 'Exception'
}

export enum SENTRY_SEVERITY_LEVEL_ENUM {
  FATAL = 'fatal',
  ERROR = 'error',
  WARNING = 'warning',
  LOG = 'log',
  INFO = 'info',
  DEBUG = 'debug'
}

export enum SENTRY_SECURITY_INFO_ENUM {
  TOKEN = 'token_REDACTED',
  PHONE = 'phone_REDACTED',
  MAIL = 'mail_REDACTED',
  USERNAME = 'username_REDACTED'
}

export const SENTRY_SECURITY_KEYS = [
  {
    key: 'email',
    replaceValue: SENTRY_SECURITY_INFO_ENUM.MAIL
  },
  {
    key: 'phone_number',
    replaceValue: SENTRY_SECURITY_INFO_ENUM.PHONE
  },
  {
    key: 'token',
    replaceValue: SENTRY_SECURITY_INFO_ENUM.TOKEN
  },
  {
    key: 'preferred_username',
    replaceValue: SENTRY_SECURITY_INFO_ENUM.USERNAME
  },
  {
    key: 'authorization',
    replaceValue: SENTRY_SECURITY_INFO_ENUM.TOKEN
  }
];

export const SENTRY_TOKEN_SECURITY_REGEX = /(([?&])t=([^&]+))|(Bearer[^&]+)|(eyJ[^&]+)/;
