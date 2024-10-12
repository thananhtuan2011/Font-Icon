import * as svgCodeNamespace from './svg-code';

interface ISkyjoySvgIcon {
  name: string;
  svgCode: string;
}

export const SkyjoyIconsNameSpace = 'sj-ic';

export const SKYJOY_SVG_ICONS: ISkyjoySvgIcon[] = Object.keys(svgCodeNamespace).map((key) => {
  return {
    name: `${SkyjoyIconsNameSpace}:${key
      .split(/(?=[A-Z])/)
      .join('-')
      .toLowerCase()}`,
    svgCode: (svgCodeNamespace as any)[key]
  };
});
