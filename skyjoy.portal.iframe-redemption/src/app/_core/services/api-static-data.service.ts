import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { VersionVisibilityService } from '@app/_share/modules/version-visibility/version-visibility.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, catchError, of, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppTranslateService } from './app-translate.service';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class ApiStaticDataService {
  private _localDataAssets = `${environment.staticAssetsUrl}/assets/data`;
  private _staticManualAssets = `${environment.staticEndpoint}`;
  private _moduleName = environment.moduleName;
  private versionVisibilityService = inject(VersionVisibilityService);
  private appTranslateService = inject(AppTranslateService);
  private httpClient = inject(HttpClient);
  private translateService = inject(TranslateService);

  private deletionReasonsSubject = new BehaviorSubject<{ fileName: string; staticUrl: string }>({
    fileName: '',
    staticUrl: ''
  });
  private deletionReasons$: Observable<any> = this.deletionReasonsSubject.asObservable().pipe(
    switchMap(({ fileName, staticUrl }) => {
      if (!fileName && !staticUrl) {
        return of(null);
      }

      return this.getDataAssets(fileName, staticUrl);
    })
  );

  constructor() {
    this.initStaticData();
    this.translateService.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.initStaticData();
    });
  }

  private initStaticData(): void {
    this.setDeletionReasons();
  }

  private setDeletionReasons(): void {
    const fileName = `reasons-${this.appTranslateService.currentLang}.json`;
    const url = this.versionVisibilityService.getFeatureDataIncludeLanguage(this._moduleName, 'content.reasons');
    const staticUrl = `${this._staticManualAssets}${url}`;
    this.deletionReasonsSubject.next({ fileName, staticUrl });
  }

  getDeletionReasons(): Observable<any> {
    return this.deletionReasons$.pipe(shareReplay(1));
  }

  getDataAssets(fileName: string, staticUrl: string): Observable<any> {
    const staticManualAssets$ = this.httpClient.get(`${staticUrl}`);
    const localAssets$ = this.httpClient.get(`${this._localDataAssets}/${fileName}`);
    return staticManualAssets$.pipe(
      // switchMap((e) => {
      //   return e;
      //   return localAssets$
      // }),
      // shareReplay(1),
      catchError(() => {
        return localAssets$;
      })
    );
  }
}
