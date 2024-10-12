import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { GjImageFoundPipe } from './pipes/gj-image-found';
import { SvgIconPipe } from './pipes/svg-icon.pipe';
import { AssetUrlPipe } from './pipes/asset-url.pipe';
import { CurrencyLabelPipe } from './pipes/currency-label.pipe';
import { StorageService } from './services/storage.service';

@NgModule({ declarations: [SvgIconPipe, AssetUrlPipe, CurrencyLabelPipe, GjImageFoundPipe],
    exports: [SvgIconPipe, AssetUrlPipe, CurrencyLabelPipe, GjImageFoundPipe], imports: [CommonModule], providers: [
        // ImageByLanguagePipe,
        // DateTimePipe,
        // SafePipe,
        // SvgIconPipe,
        // AssetUrlPipe,
        // CurrencyLabelPipe,
        // MenuAvailablePipe,
        // FilterLocationPipe,
        // FilterHighlightTextPipe,
        StorageService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule
    };
  }
}
