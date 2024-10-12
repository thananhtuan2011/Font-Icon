export const environment = {
  production: false,
  releaseVersion: '',
  repoName: '',
  staticAssetsUrl: '',
  staticEndpoint: 'https://statics.uat.skyjoy.io',
  apiEndpoint: '',
  moduleName: '',
  language: 'vi',
  sso: {
    clientId: '',
    realmName: '',
    ssoUrl: ''
  },
  configurationDefault: {
    dateTime: 'dd-MM-yyyy HH:mm:ss',
    numberFormat: {
      numberOfDecimal: 2,
      roundUpNotZero: false,
      thousandSign: ',',
      decimalSign: '.'
    },
    POINT_FORMAT: {
      thousandSign: ',',
      decimalSign: ''
    },
    CURRENCY_SIGN: 'VND'
  },
  partnerAppModules: [],
  MOENGAGE: {
    IS_ENABLE: false,
    DEBUG_LOGS: 1,
    // APP_ID: '967KUDFY27OC2FMLWAI97L2D',
    APP_ID: ''
    // API_KEY: 'dm2Okl+3DltvYzvwwIzHoNTI'
  },
  SENTRY_LOGGER: {
    // DSN_URL: 'https://e70ac7d3dd34dd92db385de5f1659b93@o4506257099390976.ingest.us.sentry.io/4506257265262592',
    DSN_URL: '',
    IS_ENABLE: false,
    IS_DEBUG: false,
    REPLAYS_SESSION: '0.1',
    REPLAYS_ON_ERROR: '1.0'
  }
};
