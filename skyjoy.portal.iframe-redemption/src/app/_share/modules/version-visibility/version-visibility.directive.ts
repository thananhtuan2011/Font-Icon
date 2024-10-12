import { Directive, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { VersionVisibilityService } from './version-visibility.service';
import * as _ from 'lodash';

@Directive({
  selector: '[featureVisibility]'
})
@UntilDestroy()
export class VersionVisibilityDirective implements OnInit {
  @Input('featureVisibility') features!: string;
  @Input() index: number = -1;

  elementRef!: ElementRef;
  rendererRef!: Renderer2;

  constructor(
    private el: ElementRef,
    public versionVisibilityService: VersionVisibilityService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    const featureName = this.features;

    if (!_.isEmpty(featureName) && this.el.nativeElement.style) {
      this.elementRef = _.cloneDeep(this.el);
      this.el.nativeElement.style.display = 'none';

      this.versionVisibilityService
        .checkFeatureVisibleDirective$(featureName)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (isVisible: boolean) => {
            this.toggleButton(isVisible);
          },
          error: (err) => {},
          complete: () => {}
        });
    }
  }

  toggleButton(show: boolean) {
    if (!show && this.el) {
      this.el.nativeElement.style.display = 'none';
    } else {
      this.el.nativeElement.style.display = '';
    }
  }
}
