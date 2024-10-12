import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'assetUrl'
})
export class AssetUrlPipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    if (!value) {
      return environment.staticAssetsUrl + '/assets/images/not-found-image.jpg';
    }
    if (value && environment.staticAssetsUrl) {
      if (value.charAt(0) === '/') {
        return environment.staticAssetsUrl + value;
      }
      return environment.staticAssetsUrl + '/' + value;
    }
    return value;
  }
}
