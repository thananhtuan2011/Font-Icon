import { Router } from '@angular/router';

export class URLHelper {
  /**
   * Get value of query params
   * @param key Key of query
   */
  public static getQueryString = (key: string): string => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const value = params.get(key);
    return value ? value : '';
  };

  /**
   * Get current host like: https://localhost:8000/
   */
  public static getCurrentHost = (): string => window.location.protocol.concat('//').concat(window.location.host);

  /**
   * Get path with /
   * @param paths Array of path
   * @param prefix Key if prefix / is includes
   * @returns string with paths
   */
  public static JoinPaths = (paths: string[], prefix: boolean = false): string => {
    const _pathMatches = paths.join('/');
    return prefix ? `/${_pathMatches}` : _pathMatches;
  };

  public static convertObjectToParams = (_obj: any) => {
    if (_obj) {
      let str = '';
      // tslint:disable-next-line:forin
      for (const key in _obj) {
        if (_obj[key]) {
          if (str !== '') {
            str += '&';
          }
          str += key + '=' + encodeURIComponent(_obj[key]);
        }
      }
      return str;
    } else {
      return '';
    }
  };
  public static convertParamsToObject = (_string: string) => {
    // var search = location.search.substring(1);
    if (_string && _string.length > 0 && _string !== '/') {
      return JSON.parse(
        '{"' + decodeURI(_string).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
      );
    }
    return undefined;
  };
  public static getParamString = () => {
    return window.location.search.replace(/\?/g, '') || '';
  };

  public static convertUrlToCustomFormat = (url: string) => {
    return url.replace(/\//g, '--').replace(/\?/g, '___').replace(/=/g, '_').replace(/&/g, '__');
  };

  public static convertUrlToRouteAndParams = (router: Router, urlString: string) => {
    const urlTree = router.parseUrl(urlString);
    const route = urlTree.root.children['primary'];
    const routeSegments = route ? route.segments.map((segment) => segment.path) : [];
    const queryParams = urlTree.queryParams;

    return { route: '/' + routeSegments.join('/'), queryParams };
  };
  public static revertCustomFormatToUrl = (customFormat: string) => {
    return customFormat.replace(/--/g, '/').replace(/___/g, '?').replace(/__/g, '&').replace(/_/g, '=');
  };
}
