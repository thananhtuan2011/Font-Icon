export interface IFont {
  KoHo: string;
}

export interface ILayout {
  containerWith: string;
  bgColor: string;
  header: {
    position: string;
    height: string;
  };
  channelSource: string;
}

export interface IColor {
  primary: string;
  secondary: string;
  neutral: string;
  transparent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  blue: string;
  cyanBlue: string;
  cyan: string;
  default: string;
}

export interface IBackground {
  header: string;
  home: string;
  home2: string;
  home1: string;
  searchFlight: string;
  searchFlightGreeting: string;
}

export interface IStyle {
  fontFamily: string;
  color: IColor;
  background: IBackground;
}

export interface ITheme {
  layout: ILayout;
  style: IStyle;
}

export interface IAppLayoutConfig {
  font: IFont;
  theme: ITheme;
}
