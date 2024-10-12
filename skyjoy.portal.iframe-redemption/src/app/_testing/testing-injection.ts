import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTranslateService } from '@app/_core/services/app-translate.service';
import { PostMessageService } from '@app/_core/services/post-message.service';
import { StorageService } from '@app/_core/services/storage.service';
import { TrackingService } from '@app/_core/services/tracking.service';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface ComponentInjection<T> {
  fixture: ComponentFixture<T>;
  component: T;
  storageService: StorageService;
  router: Router;
  translateService: TranslateService;
  appTranslateService: AppTranslateService;
  activatedRoute: ActivatedRoute;
  modalService: NzModalService;
  postMessageService: PostMessageService;
  trackingService: TrackingService;
  [key: string]: any;
}

export const NewComponentInjection = (componentType: Type<any>) => {
  const activatedRoute = TestBed.inject(ActivatedRoute);
  const modalService = TestBed.inject(NzModalService);
  const postMessageService = TestBed.inject(PostMessageService);
  const router = TestBed.inject(Router);
  const appTranslateService = TestBed.inject(AppTranslateService);
  const storageService = TestBed.inject(StorageService);
  const translateService = TestBed.inject(TranslateService);
  const trackingService = TestBed.inject(TrackingService);
  const fixture = TestBed.createComponent(componentType);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    activatedRoute,
    modalService,
    postMessageService,
    router,
    appTranslateService,
    storageService,
    translateService,
    trackingService,
    fixture,
    component
  };
};
