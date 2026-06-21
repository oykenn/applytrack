import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Applications } from './pages/applications/applications';
import { AddApplication } from './pages/add-application/add-application';
import { ApplicationDetails } from './pages/application-details/application-details';
import { EditApplication } from './pages/edit-application/edit-application';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'applications', component: Applications, canActivate: [authGuard] },
  { path: 'applications/add', component: AddApplication, canActivate: [authGuard] },
  { path: 'applications/:id', component: ApplicationDetails, canActivate: [authGuard] },
  { path: 'applications/:id/edit', component: EditApplication, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];