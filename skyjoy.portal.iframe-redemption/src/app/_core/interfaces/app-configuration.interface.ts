export interface IAppConfiguration {
  amount: ICurrency;
  point: ICurrency;
  userFraudEkycUrl: string;
}

export interface ICurrency {
  thousandSign: string;
  decimalSign: string;
  currencySign: string;
}

export interface IAppVisibilityConfig {
  appVersion: string;
  rollOutMemberCode: string[];
}

export interface IAppFeatureModule {
  [module: string]: IAppFeatureFieldVersion;
}

export interface IAppFeatureFieldVersion {
  content: {
    [lang: string]: {
      [lang: string]: string;
    };
  };
  appVersion: string;
  rollOutMemberCode: string[];
}

export interface IAppFeatureVersion {
  [feature: string]: IAppFeatureModule;
}
