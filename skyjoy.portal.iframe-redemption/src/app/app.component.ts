import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { AppTranslateService } from './_core/services/app-translate.service';
import { SpinnerService } from './_core/services/spinner.service';
import { SkyjoyIconsService } from './_share/icons/skyjoy-icons/skyjoy-icons.service';
import { SentryLoggerService } from './_share/modules/sentry-logger/sentry-logger.service';
import { TrackingMoeService } from './_share/modules/tracking-moe/tracking-moe.service';
import { AppImportModules } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: AppImportModules,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private sentryLoggerService = inject(SentryLoggerService);
  private trackingMoeService = inject(TrackingMoeService);
  private skyjoyIconsService = inject(SkyjoyIconsService);
  private spinnerService = inject(SpinnerService);
  private appTranslateService = inject(AppTranslateService);

  title = 'sample';
  showCount = signal(false);
  count = signal(0);
  checked = signal(true);
  conditionalCount = computed(() => {
    if (this.count()) {
      return `The count is ${this.count()}.`;
    } else {
      return 'Nothing to see here!';
    }
  });

  constructor() {
    this.initialize();
  }

  ngOnInit(): void {
    this.sentryLoggerService.init();
    this.trackingMoeService.init();
    // this.spinnerService.showSpinner('body', true);
    // this.changeDetectorRef.markForCheck();
    // setTimeout(() => {
    //   this.count.update((value) => value + 1);

    //   this.checked.set(false);

    //   this.appTranslateService // this.translateService.setDefaultLang('en');
    //     .setLang('en');
    //   this.spinnerService.showSpinner('body', false);
    // }, 6000);
  }

  initialize(): void {
    this.skyjoyIconsService.addIcons();
  }
}
