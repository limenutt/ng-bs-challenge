import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { decode as jwtDecode } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(protected localStorage: LocalStorageService) {}
  get token(): string {
    return this.localStorage.get<string>('token');
  }
  set token(token: string) {
    if (!token) {
      this.localStorage.remove('token');  
    } else {
      this.localStorage.set('token', token);
    }
  }
  get expiresAt(): number {
    const token = this.token;
    if (!token) {
      return undefined;
    }
    const payload: {
      exp: number
    } = <any>jwtDecode(token);
    return payload.exp * 1000;
  }
}