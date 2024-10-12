import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private loaders: Promise<any>[] = [];
  private selector = 'skyjoy-global-spinner';

  constructor() {}

  private static removeElement(parentId: string, elementRemove: any): void {
    const elParentId = document.getElementById(parentId);
    if (elParentId != null && typeof elParentId !== typeof undefined) {
      const elRemoves = elParentId.querySelectorAll(elementRemove);
      if (elRemoves.length > 0) {
        for (let i = elRemoves.length; i--; ) {
          const elRemove = elRemoves[i];
          elRemove.parentNode.removeChild(elRemove);
        }
      }
    }
  }

  // TODO is there any better way of doing this?
  public showSpinner(
    containerId: string | 'body' | 'fixed' = 'body',
    isSpinning: boolean = true,
    options?: {
      top: number;
    }
  ): void {
    this.renderSpinner(containerId, isSpinning, options);
  }

  public showSpinnerSmall(
    containerId: string | 'body' | 'fixed' = 'body',
    isSpinning: boolean = true,
    options?: {
      top: number;
    }
  ): void {
    this.renderSpinner(containerId, isSpinning, options, '-small');
  }

  /**
   * Clears the list of loader
   */
  private clear(): void {
    this.loaders = [];
  }

  /**
   * Start the loader process, show spinner and execute loaders
   */
  private load(): void {
    this.showGlobalSpinner();
    this.executeAll();
  }

  /**
   * Appends new loader to the list of loader to be completed before
   * spinner will be hidden
   * @param method Promise<any>
   */
  private registerLoader(method: Promise<any>): void {
    this.loaders.push(method);
  }

  private renderSpinner(
    containerId: string | 'body' | 'fixed' = 'body',
    isSpinning: boolean = true,
    options?: {
      top: number;
    },
    size: '-small' | '' = ''
  ): void {
    const elSpinner = document.createElement('div');
    const elChildSpinner = document.createElement('div');
    elSpinner.setAttribute(`data-spinner${size}`, 'loader');

    elChildSpinner.setAttribute('data-spinner-item', 'loader');
    if (options?.top) {
      elChildSpinner.style.cssText = `top: ${options.top}px`;
    }

    elSpinner.appendChild(elChildSpinner);
    const position = containerId;
    if (position === 'fixed') {
      containerId = 'body';
    }
    if (containerId === 'body') {
      document.querySelector(containerId)?.setAttribute('id', containerId);
    }
    const elContainer = document.getElementById(containerId);
    if (elContainer != null && typeof elContainer !== typeof undefined) {
      if (isSpinning) {
        const existSpinner = elContainer.querySelector(`[data-spinner${size}=\'loader\']`);
        if (existSpinner) {
          SpinnerService.removeElement(containerId, `[data-spinner${size}=\'loader\']`);
        }
        setTimeout(() => {
          elContainer.setAttribute('data-spinner', 'container');
          elContainer.appendChild(elSpinner);
          elContainer.classList.add('data-spinner__' + position);
        });
      } else {
        setTimeout(() => {
          SpinnerService.removeElement(containerId, `[data-spinner${size}=\'loader\']`);
          const elContainerClassList = elContainer.classList.value;
          if (elContainerClassList) {
            elContainerClassList.split(/ /g).filter((c: any) => {
              if (c.indexOf('data-spinner__') !== -1) {
                elContainer.classList.remove(c);
              }
            });
          }
          if (elContainer.hasAttribute('data-spinner')) {
            elContainer.removeAttribute('data-spinner');
          }
        });
      }
    }
  }

  private executeAll(done = () => {}): void {
    Promise.all(this.loaders)
      .then((values) => {
        this.hideSpinner();
        // done.call(null, values);
      })
      .catch((error) => {
        // TODO: Promise.reject
        console.error(error);
      });
  }

  // tslint:disable-next-line:typedef
  private getSpinnerElement() {
    return document.getElementById(this.selector);
  }

  private hideSpinner(): void {
    const el = this.getSpinnerElement();
    if (el) {
      el.style.display = 'none';
    }
  }

  // TODO is there any better way of doing this?
  private showGlobalSpinner(): void {
    const el = this.getSpinnerElement();
    if (el) {
      el.style.display = 'block';
    }
  }
}
