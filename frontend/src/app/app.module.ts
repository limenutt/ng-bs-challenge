import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { LocalStorageModule } from 'angular-2-local-storage';

import { APP_ROUTES } from './routes';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainPage } from './pages/main/main.page';
import { LoginPage } from './pages/login/login.page';
import { ProjectsPage } from './pages/projects/projects.page';

import { AuthenticationMiddleware } from './middleware/authentication/authentication.middleware';
import { AuthenticationService } from './services/authentication/authentication.service';
import { APIService } from './services/api/api.service';
import { TokenService } from './services/authentication/token.service';

@NgModule({
  declarations: [
    AppComponent,

    NavbarComponent,
    MainPage,
    LoginPage,
    ProjectsPage
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FlexLayoutModule, ReactiveFormsModule, FormsModule,
    HttpClientModule,

    LocalStorageModule.withConfig({
      prefix: 'ngbs',
      storageType: 'localStorage'
    }),

    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [TokenService, APIService, AuthenticationService, AuthenticationMiddleware],
  bootstrap: [AppComponent]
})
export class AppModule { }
