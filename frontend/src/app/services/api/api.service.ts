import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { TokenService } from '../authentication/token.service';

import { IRegistrationResponse, ILoginPayload, IRegistrationPayload } from '../../../../../backend/src/api';
export * from '../../../../../backend/src/api';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class APIService {

  constructor(protected http: HttpClient, protected tokenService: TokenService) {}
  get<T>(url: string, params?: {[key: string]: any}) {
    return this.http.get<T>(this.url(url, params), {
      headers: { authorization: `Bearer ${this.tokenService.token}` }
    });
  }
  delete<T>(url: string) {
    return this.http.delete<T>(this.url(url), {
      headers: { authorization: `Bearer ${this.tokenService.token}` }
    });
  }
  post<T>(url: string, body: any) {
    return this.http.post<T>(this.url(url), body, {
      headers: { authorization: `Bearer ${this.tokenService.token}` }
    });
  }
  put<T>(url: string, body: any) {
    return this.http.put<T>(this.url(url), body, {
      headers: { authorization: `Bearer ${this.tokenService.token}` }
    });
  }
  signIn(payload: ILoginPayload) {
    return this.http.post<IRegistrationResponse>(this.url('auth/signin'), payload);
  }
  signUp(payload: IRegistrationPayload) {
    return this.http.post<IRegistrationResponse>(this.url('auth/signup'), payload);
  }
  protected url(resourceURL: string, params?: {[key: string]: any}) {
    let url = [environment.apiEndpoint, resourceURL].join('/');
    if (params) {
      const glue = url.includes('?') ? '&' : '?';
      url += glue + Object.keys(params)
        .map(paramName => `${encodeURIComponent(paramName)}=${encodeURIComponent(params[paramName])}`)
        .join('&');
    }
    return url;
  }
}