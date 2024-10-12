import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AppConfigService } from '@app/_core/services/app-config.service';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuGuard {
  protected readonly router = inject(Router);
  private readonly appConfigService = inject(AppConfigService);

  constructor() {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const dataConfig = route.data['config'] || '';
    const dataMenu = route.data['menu'] || '';
    const bodyClassModule = [
      'class-module-main',
      'class-module-booking',
      'class-module-redemption',
      'class-module-point-swap'
    ];
    if (!isEmpty(dataConfig)) {
      if (dataConfig?.class) {
        bodyClassModule.forEach((itemClass: string) => {
          if (itemClass !== dataConfig?.class) {
            this.toggleClassModule(itemClass);
          }
        });
        this.toggleClassModule(dataConfig?.class, true);
      }
    }
    if (dataMenu) {
      this.appConfigService.setDataMenu(dataMenu);
    }
    return true;
  }

  toggleClassModule(moduleClass: string, addClass: boolean = false) {
    const _elementBody = document.querySelector('body');
    if (_elementBody) {
      if (addClass) {
        _elementBody.classList.add(moduleClass);
      } else {
        _elementBody.classList.remove(moduleClass);
      }
    }
  }
}
