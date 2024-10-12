import { inject, Injectable } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { SKYJOY_SVG_ICONS } from './skyjoy-icons-svg';

@Injectable({
  providedIn: 'root'
})
export class SkyjoyIconsService {
  private iconService = inject(NzIconService);
  skyjoySvgIcons = SKYJOY_SVG_ICONS;

  constructor() {}

  addIcons(): void {
    this.skyjoySvgIcons.forEach((icon) => {
      this.iconService.addIconLiteral(icon.name, icon.svgCode);
    });
  }
}
