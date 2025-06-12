import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EventsComponent } from './features/events/events.component';
import { JobsComponent } from './features/jobs/jobs.component';
import { PostsComponent } from './features/posts/posts.component';
import { VolunteersComponent } from './features/volunteers/volunteers.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'events',
    component: EventsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'jobs',
    component: JobsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'posts',
    component: PostsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'volunteers',
    component: VolunteersComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
