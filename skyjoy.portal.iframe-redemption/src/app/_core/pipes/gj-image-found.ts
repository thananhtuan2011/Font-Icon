import { Pipe, PipeTransform } from '@angular/core';
import { AssetUrlPipe } from './asset-url.pipe';

@Pipe({
  name: 'gjImageFound'
})
export class GjImageFoundPipe implements PipeTransform {
  constructor(private urlPipe: AssetUrlPipe) {}

  transform(url: string): Promise<string> {
    if (!url || typeof url !== 'string') return Promise.resolve(this.urlPipe.transform(''));

    const startWithTexts = ['https://', 'http://'];
    const newUrl = startWithTexts.some((text) => url.startsWith(text)) ? url : this.urlPipe.transform(url);
    return new Promise((resolve) => {
      const imgEl = new Image();
      imgEl.addEventListener('load', () => resolve(newUrl));
      imgEl.addEventListener('error', () => resolve(this.urlPipe.transform('')));
      imgEl.src = newUrl;
      imgEl.remove();
    });
  }
}
