import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE_KEY } from '@app/_core/constants/common';
import { ISendMessageContent, POST_MESSAGE_ACTION } from '@app/_core/interfaces/post-message.interface';
import { PostMessageService } from '@app/_core/services/post-message.service';
import { StorageService } from '@app/_core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectToScreenService {
  path_storage: any[] = [];

  pathClearAll = ['/'];

  pathNotHandle = [``];

  constructor(
    private router: Router,
    private storageService: StorageService,
    private postMessageService: PostMessageService
  ) {
    const routeStorage = sessionStorage.getItem('route');
    if (routeStorage) {
      this.path_storage = JSON.parse(routeStorage);
    }
  }

  handleAddPathToStorage(path: any) {
    // User when back home and clear all route in array
    if (this.pathClearAll.includes(path)) {
      this.path_storage = [];
    }
    const hasPathNotHandle = this.pathNotHandle.some((item) => (path || '').includes(item));
    console.log('hasPathNotHandle', hasPathNotHandle, path);
    if (hasPathNotHandle) {
      this.handleRoutingNotSaveInService(path.split('?')[0]);
    } else {
      const index = this.path_storage.findIndex((item) => {
        if (item) {
          return item.split('?')[0] === path.split('?')[0];
        } else {
          return null;
        }
      });

      if (index === -1) {
        this.path_storage.push(path);
      } else {
        this.path_storage[index] = path;
      }

      this.saveArrayToSession();
    }
  }

  handleBackToScreen() {
    const path = window.location.pathname;
    const moduleOnly = this.storageService.get({ key: STORAGE_KEY.MODULE }) || '';

    // if (moduleOnly && this.path_storage.length === 1) {
    //   const modulePath = (environment.partnerAppModules as any)[moduleOnly]?.path || '';
    //   const index = this.path_storage.indexOf(`/${modulePath}`);
    //   if (index === 0) {
    //     // IN case SkyJoy app
    //     this.postMessageService.postMessageToPartner({
    //       action: POST_MESSAGE_ACTION.EXIT,
    //       data: null,
    //       topic: POST_MESSAGE_TOPIC_NAME.EXIT
    //     });
    //     return;
    //   }
    // }
    if (
      this.path_storage.length === 1 &&
      ((this.path_storage.includes(`/home`) && path === `/home`) || (this.path_storage.includes(`/`) && path === `/`))
    ) {
      const data: ISendMessageContent = {
        action: POST_MESSAGE_ACTION.BACK_TO_APP,
        data: null
      };
      this.postMessageService.postMessageToPartner(data);
      // in case SJ app
      this.postMessageService.postMessageToPartner({
        action: POST_MESSAGE_ACTION.EXIT,
        data: null
      });
      return;
    }

    const index = this.path_storage.findIndex((item) => {
      return item.split('?')[0] === path.split('?')[0];
    });

    if (index > -1) {
      this.path_storage.splice(index);
      // const moduleConfig = this.moduleBaseService.moduleConfig$.value;
      // if (moduleOnly && moduleConfig && moduleConfig.moduleName === moduleOnly && moduleConfig.moduleRouter) {
      //   let path = this.path_storage[index - 1] as string;
      //   if (path.startsWith('/')) {
      //     path = path.slice(1);
      //   }
      //   path = path.replace(moduleConfig.modulePath, '');
      //   moduleConfig.moduleRouter.navigateByUrl(path, { onSameUrlNavigation: 'reload' });
      //   this.saveArrayToSession();
      //   return;
      // }
      this.router.navigateByUrl(this.path_storage[index - 1]);
      this.saveArrayToSession();
    } else {
      this.router.navigateByUrl(this.path_storage[0]);
    }
  }

  handleRoutingNotSaveInService(path: any) {
    if (path) {
      const index = this.path_storage.findIndex((item) => {
        if (item) {
          return item.split('?')[0] === path;
        } else {
          return null;
        }
      });

      if (index > -1) {
        this.path_storage[index] = null;
      }
    }
  }

  saveArrayToSession() {
    sessionStorage.setItem('route', JSON.stringify(this.path_storage));
  }
}
