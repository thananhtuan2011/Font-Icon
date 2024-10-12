import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Helpers } from '@app/_core/helpers/helpers';
import { GTM_IDS } from '@app/_share/modules/tracking-ga/tracking-ga.module';
import { environment } from '../../../../environments/environment';

declare global {
  interface Window {
    gtag?: any;
    dataLayer?: any;
  }
}

@Injectable()
export class TrackingGaService {
  isGGTagOnReady!: boolean;

  constructor(
    @Inject(GTM_IDS) private gtmIds: string[],
    private router: Router
  ) {}

  public init(gaMeasurementId: string) {
    if (!this.checkConfig(true)) {
      return;
    }
    this.isGGTagOnReady = false;
    this.loadGtmScript(gaMeasurementId);
    // this.setupRouteTracking();
  }

  pushToDataLayer(data: any): void {
    if (!this.checkConfig()) {
      return;
    }
    if (typeof window !== 'undefined' && window.dataLayer) {
      // Push a new event onto the datalayer
      if (!environment.production) {
        console.log(` ℹ️ \x1b[102m GA trackingEvent \x1b[0m  `, {
          dataLayer: window.dataLayer,
          data
        });
      } else {
        console.log('GA: trackingEvent', {
          dataLayer: window.dataLayer,
          data
        });
      }
      window.dataLayer.push(data);
    } else {
      console.info('window.dataLayer is not defined');
    }
  }

  sendPageProfileEvent(profile: { id: string; em: any; pn: any; level: string }) {
    if (!this.checkConfig()) {
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'profile',
      ...profile
    });
  }

  // setupRouteTracking() {
  //   if (!this.checkConfig()) {
  //     return
  //   }
  //   // Send a page view when the route changes
  //   this.router.events.pipe(
  //     filter(event => event instanceof NavigationEnd)
  //   ).subscribe(() => {
  //     const url = window.location.href;
  //     const path = window.location.pathname;
  //     const title = document.title;

  //     if (typeof window !== 'undefined' && window.dataLayer) {
  //       // Push a new event onto the datalayer
  //       window.dataLayer.push({
  //         event: 'page_view',
  //         pagePath: path,
  //         pageTitle: title,
  //         pageUrl: url,
  //       });
  //     }
  //   });
  // }

  private checkConfig(isInit = false): boolean {
    const isEnable = this.gtmIds.some((gtmId) => Helpers.checkEnvironmentValue(gtmId));
    if (!isEnable && isInit) {
      console.info(`GOOGLE_ANALYTICS is disabled or missing config`, this.gtmIds);
    }
    return isEnable;
  }

  private loadGtmScript(gaMeasurementId: string) {
    // Load Google Tag's script into the page
    const head = document.getElementsByTagName('head')[0];
    const body = document.getElementsByTagName('body')[0];
    for (const gtmId of this.gtmIds) {
      // Create GTM script and add it to the head
      const gtmScript = document.createElement('script');
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      gtmScript.async = true;

      head.appendChild(gtmScript);
      if (!Helpers.checkEnvironmentValue(gaMeasurementId)) {
        console.info(`GOOGLE_ANALYTICS missing config [GA_MEASUREMENT_ID]`, gaMeasurementId);
      } else {
        gtmScript.onload = () => {
          if (!this.isGGTagOnReady) {
            const script = document.createElement('script');
            script.text = `window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${gaMeasurementId}');`;
            document.head.appendChild(script);
            this.isGGTagOnReady = true;
          }
        };
      }

      // Create GTM iframe and add it to the body
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.googletagmanager.com/ns.html?id=${gtmId}`);
      iframe.setAttribute('height', '0');
      iframe.setAttribute('width', '0');
      iframe.setAttribute('style', 'display:none;visibility:hidden');
      body.appendChild(iframe);
    }
  }
}
