import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { decode as jwtDecode } from 'jsonwebtoken';
import { APIService } from '../api/api.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthenticationService {
  constructor(protected tokenService: TokenService, protected api: APIService) {}
  async isAuthenticated(): Promise<boolean> {
    const expiresAt = this.tokenService.expiresAt;
    if (!expiresAt) {
      return false;
    }
    if (new Date().getTime() > expiresAt) {
      return false;
    }
    return true;
  }
  signIn(email: string, password: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.api.signIn({ email, password }).subscribe(async result => {
        this.tokenService.token = result.token.accessToken;
        resolve(await this.isAuthenticated());
      }, error => reject(error));
    });
  }
  signUp(email: string, password: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.api.signUp({ email, password }).subscribe(async result => {
        this.tokenService.token = result.token.accessToken;
        resolve(await this.isAuthenticated());
      }, error => reject(error));
    });
  }
  logout() {
    this.tokenService.token = null;
  }
}