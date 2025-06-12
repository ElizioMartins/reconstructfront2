import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { VolunteerPageComponent } from './features/volunteer/volunteer-page/volunteer-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'volunteers', component: VolunteerPageComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
