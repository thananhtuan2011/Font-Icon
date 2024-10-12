export const STORAGE_KEY = {
  EXCHANGE_TOKEN: 'exchange-token',
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh-token',
  TOKEN_EXPIRED: 'token-expired',
  LANG: 'lang',
  VERSION_PARTNER: 'partner-version',
  ERROR_CODE: 'error-code',
  INTEGRATE_STATUS: 'integrate-status',
  ISSUER: 'issuer',
  SOURCE: 'source',
  // https://id.dev.skyjoy.io/realms/dev-loyalty
  CHANNEL_AUTH: 'channel-auth',

  FEATURE_CONFIG_VERSION: 'sj-config-version',
  USER_PROFILE: 'sj-user-profile',
  KEY_GID: 'tokenGID',
  KEY_HBD: 'token',
  JWT_HBD_EXPIRED: 'JWT_EXPIRED',
  REQUEST_ID: 'requestId',
  HDB_TOKEN: 'hdb_token',
  TOKEN_REFRESH_KEY: 'refresh_token',
  EXPIRED_TIME: 'expires_in',
  CHECK_STATUS_TYPE: 'check_status_type',
  CHECK_STATUS_CONTENT: 'check_status_content',
  REDEMPTION_PAYLOAD: 'redemption_payload',
  REDEMPTION_FILTERS_PAGE_DATA: 'redemption_filters_page_data',
  MODULE: 'module'
};

export enum STORAGE_TYPE_ENUM {
  Cookies = 'cookies',
  LocalStorage = 'localStorage',
  SessionStorage = 'sessionStorage',
  Memory = 'memory'
}

export const STORAGE_TYPE = {
  COOKIES: 'cookies' as STORAGE_TYPE_ENUM,
  LOCAL_STORAGE: 'localStorage' as STORAGE_TYPE_ENUM,
  SESSION_STORAGE: 'sessionStorage' as STORAGE_TYPE_ENUM,
  MEMORY: 'memory' as STORAGE_TYPE_ENUM
};
export const SSO_SCOPE = {
  LOGIN_SCOPE: {
    scope: 'openid address phone'
  }
};
export const DATETIME_FORMAT = {
  FE_DATETIME: 'MMM d, y, h:mm:ss a',
  FE_DD_MM_YYYY: 'dd-MM-yyyy HH:mm:ss'
};

export const QUERY_PARAM_KEY = {
  EXCHANGE_TOKEN: 't',
  LANG: 'l',
  VERSION: 'v',
  STATUS: 'status',
  ERROR_CODE: 'errorCode',
  SOURCE: 'source',

  PHONE: 'phone',
  DATE_OF_BIRTH: 'dateOfBirth',
  FULL_NAME: 'fullName',
  MEMBER_CODE: 'memberCode',
  EXTERNAL_ID: 'externalId',
  MODULE: 'm'
};

export const QUERY_PARAM_PROFILE = [
  QUERY_PARAM_KEY.STATUS,
  QUERY_PARAM_KEY.ERROR_CODE,
  QUERY_PARAM_KEY.PHONE,
  QUERY_PARAM_KEY.DATE_OF_BIRTH,
  QUERY_PARAM_KEY.FULL_NAME,
  QUERY_PARAM_KEY.MEMBER_CODE,
  QUERY_PARAM_KEY.EXTERNAL_ID
];

export const CONFIGURATION_FIELD_SERVER = {
  AMOUNT: 'formatAmount',
  POINT: 'formatPoint'
};

export const CONFIGURATION_GROUP_KEY_SERVER = {
  AMOUNT_NUMBER_FORMAT: 'AMOUNT_NUMBER_FORMAT',
  PARTNER_WEBVIEW_VERSION: 'PARTNER_WEBVIEW_VERSION'
};

export const APP_ROUTE = {
  ERROR: {
    HOME: 'error',
    NOT_FOUND: `not-found`,
    RESULT_NOT_FOUND: `result-not-found`,
    UNAUTHORIZED: `unauthorized`,
    TOKEN_EXPIRED: `expired`,
    SERVER_ERROR: `server-error`,
    USER_STATUS: `user-status`
  },
  EXCHANGE: {
    HOME: 'exchange'
  },
  HOME: {
    HOME: 'home'
  },
  GAME: {
    HOME: 'game',
    DETAIL: 'detail'
  },
  ACCOUNT: {
    HOME: 'account',
    BLOCKED: `blocked`,
    PROFILE: `profile`
  },
  INTEGRATION: {
    HOME: 'integration',
    ERROR_INTEGRATION: `error`,
    SUCCESS_INTEGRATION: `success`
  },
  TRANSACTION: {
    HOME: 'transaction',
    DETAIL: `detail`,
    LINK: `link`
  },
  LANDING: {
    HOME: 'landing',
    REWARD: `reward`,
    POINT_ACC: `point-acc`,
    REWARD_V2: `reward-v2`
  },
  MY_REWARD: {
    HOME: `my-reward`,
    LIST: `list`,
    DETAIL: `detail`
  },
  REDEMPTION: {
    HOME: 'redemption',
    OFFER: `offer`,
    PAYMENT: `payment`,
    PAYMENT_RETREIVE: `payment-retreive`,
    INDUSTRY_DETAIL: `industry-detail`,
    INDUSTRY_BRANCH: `industry-detail/branch`,
    LOCATION_SELECTION: `location-selection`,
    OFFER_LOCATION: `offer-location`,
    OFFER_DETAIL_CONFIRM: `offer/confirm`,
    OFFER_LIST_ALL: `offer/list-all`,
    LIST_ALL: `offer/confirm`,
    FILTERS: 'filters',
    RESULT: {
      HOME: `result`,
      RESULT_PROCESSING: `processing`,
      RESULT_SUCCESS: `success`,
      RESULT_FAILED: `failed`
    }
  },
  DOWNLOAD: 'download',
  LOCATION: {
    HOME: 'location'
  },
  BACK_TO_APP: {
    HOME: 'back-to-app'
  }
};
export const APP_PATH = {
  ERROR: {
    HOME: APP_ROUTE.ERROR.HOME,
    NOT_FOUND: `${APP_ROUTE.ERROR.HOME}/not-found`,
    UNAUTHORIZED: `${APP_ROUTE.ERROR.HOME}/unauthorized`,
    TOKEN_EXPIRED: `${APP_ROUTE.ERROR.HOME}/expired`,
    RESULT_NOT_FOUND: `${APP_ROUTE.ERROR.HOME}/result-not-found`,
    USER_STATUS: `${APP_ROUTE.ERROR.HOME}/user-status`
  },
  GAME: {
    HOME: APP_ROUTE.GAME.HOME,
    DETAIL: `${APP_ROUTE.GAME.HOME}/detail`
  },
  HOME: {
    HOME: APP_ROUTE.HOME.HOME
  },
  ACCOUNT: {
    HOME: APP_ROUTE.ACCOUNT.HOME,
    BLOCKED: `${APP_ROUTE.ACCOUNT.HOME}/blocked`,
    PROFILE: `${APP_ROUTE.ACCOUNT.HOME}/profile`
  },
  INTEGRATION: {
    HOME: APP_ROUTE.INTEGRATION.HOME,
    ERROR_INTEGRATION: `${APP_ROUTE.INTEGRATION.HOME}/error`,
    SUCCESS_INTEGRATION: `${APP_ROUTE.INTEGRATION.HOME}/success`
  },
  TRANSACTION: {
    HOME: APP_ROUTE.TRANSACTION.HOME,
    DETAIL: `${APP_ROUTE.TRANSACTION.HOME}/detail`,
    LINK: `${APP_ROUTE.TRANSACTION.HOME}/link`
  },
  LANDING: {
    HOME: APP_ROUTE.LANDING.HOME,
    REWARD: `${APP_ROUTE.LANDING.HOME}/reward`,
    POINT_ACC: `${APP_ROUTE.LANDING.HOME}/point-acc`,
    REWARD_V2: `${APP_ROUTE.LANDING.HOME}/reward-v2`
  },
  MY_REWARD: {
    HOME: APP_ROUTE.MY_REWARD.HOME,
    LIST: `${APP_ROUTE.MY_REWARD.HOME}/list`,
    DETAIL: `${APP_ROUTE.MY_REWARD.HOME}/detail`
  },
  REDEMPTION: {
    HOME: APP_ROUTE.REDEMPTION.HOME,
    OFFER: `${APP_ROUTE.REDEMPTION.HOME}/offer`,
    PAYMENT: `${APP_ROUTE.REDEMPTION.HOME}/payment`,
    PAYMENT_RETREIVE: `${APP_ROUTE.REDEMPTION.HOME}/payment-retreive`,
    INDUSTRY_DETAIL: `${APP_ROUTE.REDEMPTION.HOME}/industry-detail`,
    INDUSTRY_BRANCH: `${APP_ROUTE.REDEMPTION.HOME}/industry-detail/branch`,
    OFFER_LOCATION: `${APP_ROUTE.REDEMPTION.HOME}/offer-location`,
    OFFER_DETAIL_CONFIRM: `${APP_ROUTE.REDEMPTION.HOME}/offer/confirm`,
    OFFER_LIST_ALL: `${APP_ROUTE.REDEMPTION.HOME}/offer/list-all`,
    FILTERS: `${APP_ROUTE.REDEMPTION.HOME}/filters`,
    RESULT: {
      HOME: `${APP_ROUTE.REDEMPTION.HOME}/${APP_ROUTE.REDEMPTION.RESULT.HOME}`,
      RESULT_PROCESSING: `${APP_ROUTE.REDEMPTION.HOME}/${APP_ROUTE.REDEMPTION.RESULT.HOME}/processing`,
      RESULT_SUCCESS: `${APP_ROUTE.REDEMPTION.HOME}/${APP_ROUTE.REDEMPTION.RESULT.HOME}/success`,
      RESULT_FAILED: `${APP_ROUTE.REDEMPTION.HOME}/${APP_ROUTE.REDEMPTION.RESULT.HOME}/failed`
    },

    LOCATION_SELECTION: `location-selection`,
    LIST_ALL: `offer/confirm`
  },
  DOWNLOAD: 'download',

  LOCATION: {
    HOME: 'location'
  },
  BACK_TO_APP: {
    HOME: 'back-to-app'
  }
};
export const TIME = {
  JUST_NOW: 'less than a minute',
  MINUTE: 'minute',
  MINUTES: 'minutes',
  DAY: 'day',
  DAYS: 'days',
  MONTH: 'month',
  MONTHS: 'months',
  YEAR: 'year',
  YEARS: 'years',
  HOUR: 'hour',
  HOURS: 'hours',
  ABOUT: 'about',
  OVER: 'over',
  ALMOST: 'almost'
};

export enum STATUS_CODE {
  COMPLETE = 'COMPLETE',
  IN_COMPLETE = 'IN_COMPLETE',
  VERIFIED = 'VERIFIED'
}

export enum SKYPOINT_ENUM {
  POINT_2000 = 2000,
  POINT_10000 = 10000,
  POINT_10000000 = 10000000
}

export const OFFER_TYPE = {
  REWARD: 'reward',
  AWARD: 'award',
  DEAL: 'deal',
  PRIVILEGE: 'privilege'
};

export enum CHANNEL_SOURCE_ENUM {
  APP_VJA = 'app-vja',
  APP_SJ = 'app-sj',
  WEB_VJA = 'web-vja',
  WEB_SJ = 'web-sj'
}

export enum EKYC_STATUS {
  IN_COMPLETE = 'IN_COMPLETE',
  COMPLETE = 'COMPLETE',
  VERIFIED = 'VERIFIED'
}
