import { Directive, HostListener, Input } from '@angular/core';

declare const gtag: Function;

@Directive({
  selector: '[TrackingGa]'
})
export class TrackingGaDirective {
  @Input('gaCategory') category: string = '';
  @Input('gaEvent') event: string = '';
  @Input('gaEventParams') eventParams: any;
  @Input('gaDescription') description: string = '';

  constructor() {}

  @HostListener('click')
  onClick() {
    if (typeof gtag === 'function') {
      gtag('event', this.event, {
        event_category: this.category,
        description: this.description,
        ...this.eventParams
      });
    }
  }

  @HostListener('input')
  onInput() {
    if (typeof gtag === 'function') {
      gtag('event', this.event, {
        event_category: this.category,
        description: this.description,
        ...this.eventParams
      });
    }
  }
}
