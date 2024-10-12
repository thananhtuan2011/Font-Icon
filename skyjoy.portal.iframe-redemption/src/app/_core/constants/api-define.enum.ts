import { IApiObject } from '../interfaces/common.interface';

export const API_DEFINE = {
  IDENTITY: {
    MEMBER: {},
    PRIVATE: {},
    PUBLIC: {
      EXCHANGE_TOKEN: {
        url: '/api-identity/public/v1/exchange-token',
        method: 'POST'
      } as IApiObject,
      REFRESH_TOKEN: {
        url: '/api-identity/public/v1/refresh-token',
        method: 'POST'
      } as IApiObject
    }
  },
  USER: {
    USER: {
      PROFILE_API: {
        url: '/api-user/user/v1/user/profile',
        method: 'GET',
        external: false
      } as IApiObject,
      GET_MEMBER_PROFILE: {
        url: '/api-user/user/v1/user/profile',
        method: 'GET'
      } as IApiObject
    },
    MEMBER: {},
    PUBLIC: {},
    PARTNER: {}
  },
  CMS: {
    PUBLIC: {},
    MEMBER: {},
    PARTNER: {}
  },
  LJI_ADAPTER: {
    PUBLIC: {},
    PRIVATE: {},
    MEMBER: {}
  },
  HDB_ADAPTER: {
    PUBLIC: {},
    MEMBER: {}
  },
  POINT: {
    MEMBER: {}
  },
  G_ID: {
    PUBLIC: {}
  }
};
