import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private readonly http = inject(HttpClient);
  private IPAddress!: string;

  constructor() {}
  checkEnvironment(key: any) {
    if ((!key && typeof key === 'boolean') || typeof key === 'undefined') {
      return false;
    }
    if (key === 'false') {
      return false;
    }
    if (key === 'true') {
      return true;
    }
    const data = key.toString();
    return data.startsWith('%') && data.endsWith('%') ? false : key;
  }

  getIpAddress(): Observable<{ ip: string }> {
    if (this.IPAddress) return of({ ip: this.IPAddress });
    try {
      return this.http
        .get<{ ip: string }>('https://api.ipify.org?format=json', {})
        .pipe(tap((response: { ip: string }) => (this.IPAddress = response.ip)));
    } catch (e) {
      return of({ ip: '' });
    }
  }
}
