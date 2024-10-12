import { IProfileQueryParams } from '@app/_core/interfaces/profile.interface';

export interface IIntegrateQueryParams extends IProfileQueryParams {
  status?: 'success' | 'failure' | any;
  errorCode?: any;
}

export interface IUserAuthentication {
  access_token?: string;
  expires_in?: number;
  id_token?: string;
  'not-before-policy'?: string;
  refresh_expires_in?: number;
  refresh_token?: string;
  scope?: string;
  session_state?: string;
  token_type?: string;
}

export interface IUserInfo {
  preferred_username: string;
}

export interface IApiObject {
  url: string;
  method: 'DELETE' | 'GET' | 'HEAD' | 'JSONP' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH';
  authorize?: boolean;
  external?: boolean;
}

export interface IApiOptions {
  apiObject: IApiObject;
  body: any;
  apiParams?: { [key: string]: string };
  customHeader?: any;
  customParams?: any;
  queryParams?: any;
  forceToken?: string;
}

export interface IPartnerModuleAvailables {
  partnerNames: any;
  moduleRoutePath: string;
  moduleName: string;
  moduleData?: {
    header?: {
      title?: string;
    };
  };
}

export interface ILoyaltyModuleAvailables {
  [module: string]: {
    moduleName: string;
    path: string;
    data: {
      moduleLink: string;
      header?: {
        title?: string;
      };
    };
  };
}

export enum ELoyaltyModuleSharedDate {
  STORAGE_KEY = 'STORAGE_KEY',
  STORAGE_TYPE = 'STORAGE_TYPE',
  MAIN_MODULE = 'MAIN_MODULE',
  services = 'services'
}

export type TLoyaltyModuleSharedDate = {
  [objectName in ELoyaltyModuleSharedDate]: any;
};
