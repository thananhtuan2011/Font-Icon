import { TRACKING_EVENT_NAME_ENUM, TRACKING_ITEM_NAME_ENUM } from '../constants/tracking';

export interface ITrackingData {
  item_name?: TRACKING_ITEM_NAME_ENUM;
  item_value?: any;
  channel?: string;
  error_code?: string;

  [key: string]: any;
}

export interface ITrackingEvent {
  eventName: TRACKING_EVENT_NAME_ENUM;
  eventData: ITrackingData;
}
