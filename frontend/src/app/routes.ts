import { Routes } from '@angular/router';

import { LoginPage } from './pages/login/login.page';
import { MainPage } from './pages/main/main.page';
import { ProjectsPage } from './pages/projects/projects.page';

import { AuthenticationMiddleware } from './middleware/authentication/authentication.middleware';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: 'app', 
    canActivate: [AuthenticationMiddleware],
    children: [
      {
        path: '',
        component: MainPage,
        children: [
          { path: '', redirectTo: 'projects', pathMatch: 'full' },
          { path: 'projects', component: ProjectsPage }
        ]
      },
    ]
  },
  { path: 'login', component: LoginPage },
];