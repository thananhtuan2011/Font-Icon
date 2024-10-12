const rootStyles = getComputedStyle(document.documentElement);
const solidClass = rootStyles.getPropertyValue('--sj-ic-solid-variables');
const outlineClass = rootStyles.getPropertyValue('--sj-ic-outline-variables');
const FONT_OUTLINE_CLASS = 'sj-ic-outline';
const FONT_SOLID_CLASS = 'sj-ic';
const classRegex = /sj-ic-[a-zA-Z0-9\-]+/g;
const OUTLINE_CLASS = outlineClass.match(classRegex) || [];
const SOLID_CLASS = solidClass.match(classRegex) || [];

export const FONT_ICONS_OUTLINE_CLASS = OUTLINE_CLASS.map((c) => `${FONT_OUTLINE_CLASS} ${c}`);

export const FONT_ICONS_SOLID_CLASS = SOLID_CLASS.map((c) => `${FONT_SOLID_CLASS} ${c}`);

export function generateFontFaceSjIcon(assetsUrl: string) {
  const newStyle = document.createElement('style');
  newStyle.setAttribute('id', `font-${assetsUrl}`);
  newStyle.appendChild(
    document.createTextNode(`
  @font-face {
    font-family: 'font-sj-icon';
    src: url('${assetsUrl || ''}/font-sj-icon.eot?trhxih');
    src: url('${assetsUrl || ''}/font-sj-icon.eot?trhxih#iefix') format('embedded-opentype'),
    url('${assetsUrl || ''}/font-sj-icon.ttf?trhxih') format('truetype'),
    url('${assetsUrl || ''}/font-sj-icon.woff?trhxih') format('woff'),
    url('${assetsUrl || ''}/font-sj-icon.svg?trhxih#font-sj-icon') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }

  @font-face {
    font-family: 'font-sj-icon-outline';
    src: url('${assetsUrl || ''}/font-sj-icon-outline.eot?trhxih');
    src: url('${assetsUrl || ''}/font-sj-icon-outline.eot?trhxih#iefix') format('embedded-opentype'),
    url('${assetsUrl || ''}/font-sj-icon-outline.ttf?trhxih') format('truetype'),
    url('${assetsUrl || ''}/font-sj-icon-outline.woff?trhxih') format('woff'),
    url('${assetsUrl || ''}/font-sj-icon-outline.svg?trhxih#font-sj-icon-outline') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  `)
  );
  document.head.appendChild(newStyle);
}

export function getFontFaceSjIconStyle(assetsUrl: string) {
  return `
  @font-face {
    font-family: 'font-sj-icon';
    src: url('${assetsUrl || ''}/font-sj-icon.eot?trhxih');
    src: url('${assetsUrl || ''}/font-sj-icon.eot?trhxih#iefix') format('embedded-opentype'),
    url('${assetsUrl || ''}/font-sj-icon.ttf?trhxih') format('truetype'),
    url('${assetsUrl || ''}/font-sj-icon.woff?trhxih') format('woff'),
    url('${assetsUrl || ''}/font-sj-icon.svg?trhxih#font-sj-icon') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }

  @font-face {
    font-family: 'font-sj-icon-outline';
    src: url('${assetsUrl || ''}/font-sj-icon-outline.eot?trhxih');
    src: url('${assetsUrl || ''}/font-sj-icon-outline.eot?trhxih#iefix') format('embedded-opentype'),
    url('${assetsUrl || ''}/font-sj-icon-outline.ttf?trhxih') format('truetype'),
    url('${assetsUrl || ''}/font-sj-icon-outline.woff?trhxih') format('woff'),
    url('${assetsUrl || ''}/font-sj-icon-outline.svg?trhxih#font-sj-icon-outline') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  `;
}

export function removeFontFaceSjIcon(assetsUrl: string) {
  const styleElement = document.getElementById(`font-${assetsUrl}`);
  if (!styleElement) {
    return;
  }

  styleElement.remove();
}
