import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EventsComponent } from './features/events/events.component';
import { JobsComponent } from './features/jobs/jobs.component';
import { PostsComponent } from './features/posts/posts.component';
import { VolunteerPageComponent } from './features/volunteer/volunteer-page/volunteer-page.component';
import { authGuard } from './core/guards/auth.guard';
import { VolunteerWizardComponent } from './features/volunteer/volunteer-wizard.component';

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
    component: VolunteerPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'voluntariado',
    component: VolunteerWizardComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
