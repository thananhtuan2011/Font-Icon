import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FONT_ICONS_OUTLINE_CLASS, FONT_ICONS_SOLID_CLASS } from '@app/_share/icons/font-icons/font-icons';
import { SKYJOY_SVG_ICONS } from '@app/_share/icons/skyjoy-icons/skyjoy-icons-svg';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzColor, NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

export const DEFAULT_FONT_SIZE = 36;
export const DEFAULT_FONT_COLOR = '#FFAA00';
export const FONT_CODE = `<i class="fontClass text-[20px]"></i>`;
export const SKYJOY_ICONS_CODE = `<i class="text-[20px]" nz-icon nzType="fontClass" ></i>`;

@Component({
  selector: 'app-icons',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    NzAffixModule,
    NzSliderModule,
    FormsModule,
    NzColorPickerModule,
    NzInputModule,
    NzToolTipModule
  ],
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss'
})
export class IconsComponent {
  skyjoySvgIcons = signal(SKYJOY_SVG_ICONS);
  fontIconsClass = signal(FONT_ICONS_SOLID_CLASS);
  fontOutlineIconsClass = signal(FONT_ICONS_OUTLINE_CLASS);
  fontSize = DEFAULT_FONT_SIZE;
  fontColor = DEFAULT_FONT_COLOR;
  searchValue = '';
  totalIcons = SKYJOY_SVG_ICONS.length + FONT_ICONS_SOLID_CLASS.length + FONT_ICONS_OUTLINE_CLASS.length;
  private searchValue$: Subject<string> = new Subject();

  private nzMessageService = inject(NzMessageService);

  constructor() {
    this.handleSearchValue();
  }

  onCopyCode(fontClass: string, isNzIcon = false): void {
    let code = FONT_CODE.replace('fontClass', fontClass);
    if (isNzIcon) {
      code = SKYJOY_ICONS_CODE.replace('fontClass', fontClass);
    }
    navigator.clipboard.writeText(code);
    this.nzMessageService.success('Copied');
  }

  onFontColorChange({ color }: { color: NzColor; format: string }): void {
    this.fontColor = color.originalInput + '';
  }

  onSearch(): void {
    this.searchValue$.next(this.searchValue);
  }

  handleSearchValue(): void {
    this.searchValue$.pipe(debounceTime(200), distinctUntilChanged()).subscribe((value: string) => {
      if (!value) {
        this.skyjoySvgIcons.set(SKYJOY_SVG_ICONS);
        this.fontIconsClass.set(FONT_ICONS_SOLID_CLASS);
        this.fontOutlineIconsClass.set(FONT_ICONS_OUTLINE_CLASS);
        return;
      }

      this.fontIconsClass.update(() => FONT_ICONS_SOLID_CLASS.filter((item) => item.includes(value)));
      this.fontOutlineIconsClass.update(() => FONT_ICONS_OUTLINE_CLASS.filter((item) => item.includes(value)));
      this.skyjoySvgIcons.update(() => SKYJOY_SVG_ICONS.filter((item) => item.name.includes(value)));
    });
  }

  trackByIcons(index: number, value: any): void {
    if (value.name) {
      return value.name;
    }

    return value;
  }
}
