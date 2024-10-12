import { CommonModule } from '@angular/common';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { TrackingGaService } from '@app/_share/modules/tracking-ga/tracking-ga.service';
import { TrackingGaDirective } from './tracking-ga.directive';

export const GTM_IDS = new InjectionToken<string[]>('GTM_IDS');

@NgModule({
  declarations: [TrackingGaDirective],
  imports: [CommonModule],
  providers: []
})
export class TrackingGaModule {
  static forRoot(data: { gtmId: string }[]): ModuleWithProviders<TrackingGaModule> {
    const gtmIds = data.map((item) => item.gtmId).filter((item) => !!item);

    return {
      ngModule: TrackingGaModule,
      providers: [{ provide: GTM_IDS, useValue: gtmIds }, TrackingGaService]
    };
  }
}
