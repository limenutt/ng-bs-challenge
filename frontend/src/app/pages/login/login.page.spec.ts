import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  template: ''
})
class Blank {}

describe('Login page', () => {
  let authService: AuthenticationService;
  let location: Location;
  beforeEach(async(() => {

    authService = new AuthenticationService(null, null);
    TestBed.configureTestingModule({
      declarations: [
        LoginPage,
        Blank
      ],
      imports: [
      FormsModule, ReactiveFormsModule,
      RouterTestingModule.withRoutes([{path: 'app', component: Blank }])
      ],
      providers: [
        { provide: AuthenticationService, useValue: authService }
      ]
    }).compileComponents();
    location = TestBed.get(Location);
  }));
  afterEach(() => {
    authService = null;
  });
  describe('appearance', () => {
    it('should create the page', async(() => {
      const fixture = TestBed.createComponent(LoginPage);
      const instance = fixture.debugElement.componentInstance;
      expect(instance).toBeTruthy();
    }));
  });
  describe('sign in', () => {
    it('should call authentication service on login', fakeAsync(() => {
      spyOn(authService, 'signIn').and.returnValue(Promise.resolve(true));
      const fixture = TestBed.createComponent(LoginPage);
      const page = fixture.debugElement.nativeElement;
      const instance: LoginPage = fixture.debugElement.componentInstance;
      instance.ngOnInit();
      instance.submit('signin');
      tick();
      expect(authService.signIn).toHaveBeenCalled();
    }));
    it('should redirect to /app on successful login', fakeAsync(() => {
      spyOn(authService, 'signIn').and.returnValue(Promise.resolve(true));
      const fixture = TestBed.createComponent(LoginPage);
      const page = fixture.debugElement.nativeElement;
      const instance: LoginPage = fixture.debugElement.componentInstance;
      instance.ngOnInit();
      instance.submit('signin');
      tick();
      expect(location.path()).toBe('/app');
    }));
    it('should not redirect to /app on unsuccessful login', fakeAsync(() => {
      spyOn(authService, 'signIn').and.returnValue(Promise.resolve(false));
      const fixture = TestBed.createComponent(LoginPage);
      const page = fixture.debugElement.nativeElement;
      const instance: LoginPage = fixture.debugElement.componentInstance;
      instance.ngOnInit();
      instance.submit('signin');
      tick();
      expect(location.path()).not.toBe('/app');
    }));
  });
  describe('sign up', () => {
    it('should call authentication service on login', fakeAsync(() => {
      spyOn(authService, 'signUp').and.returnValue(Promise.resolve(true));
      const fixture = TestBed.createComponent(LoginPage);
      const page = fixture.debugElement.nativeElement;
      const instance: LoginPage = fixture.debugElement.componentInstance;
      instance.ngOnInit();
      instance.submit('signup');
      tick();
      expect(authService.signUp).toHaveBeenCalled();
    }));
    it('should redirect to /app on successful login', fakeAsync(() => {
      spyOn(authService, 'signUp').and.returnValue(Promise.resolve(true));
      const fixture = TestBed.createComponent(LoginPage);
      const page = fixture.debugElement.nativeElement;
      const instance: LoginPage = fixture.debugElement.componentInstance;
      instance.ngOnInit();
      instance.submit('signup');
      tick();
      expect(location.path()).toBe('/app');
    }));
    it('should not redirect to /app on unsuccessful login', fakeAsync(() => {
      spyOn(authService, 'signUp').and.returnValue(Promise.resolve(false));
      const fixture = TestBed.createComponent(LoginPage);
      const page = fixture.debugElement.nativeElement;
      const instance: LoginPage = fixture.debugElement.componentInstance;
      instance.ngOnInit();
      instance.submit('signup');
      tick();
      expect(location.path()).not.toBe('/app');
    }));
  });
});
