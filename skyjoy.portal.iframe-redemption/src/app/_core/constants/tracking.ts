export enum TRACKING_EVENT_NAME_ENUM {
  ERROR_TRACK = 'error_track'
}

export const MOENGAGE_EVENT_METHOD = {
  SKYJOY: 'SkyJoy'
};

export enum TRACKING_ITEM_NAME_ENUM {}

export enum TRACKING_ITEM_VALUE_ENUM {
  SUCCESS = 'success',
  FAIL = 'fail'
}

export const TRACKING_CHANNEL: { [key: string]: string } = {
  'app-vja': 'VJ_App',
  'app-sj': 'SJ_App',
  'web-vja': 'VJ_Web',
  'web-sj': 'SJ_Web'
};
