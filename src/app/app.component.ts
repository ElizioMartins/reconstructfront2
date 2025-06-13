import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent,
    HttpClientModule
  ],
  template: `
    <ng-container *ngIf="isAuthenticated(); else login">
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #drawer class="sidenav" fixedInViewport
            [mode]="'side'"
            [opened]="true">
          <app-sidebar></app-sidebar>
        </mat-sidenav>
        <mat-sidenav-content class="navbar">
          <mat-toolbar >
            <button
              type="button"
              mat-icon-button
              (click)="drawer.toggle()">
              <mat-icon>menu</mat-icon>
            </button>
            <span>IMC BPV</span>
            <span class="spacer"></span>
            <button mat-icon-button (click)="logout()">
              <mat-icon>logout</mat-icon>
            </button>
          </mat-toolbar>
          <div class="content">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </ng-container>
    <ng-template #login>
      <div class="login-wrapper">
        <router-outlet></router-outlet>
      </div>
    </ng-template>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 280px;
      box-shadow: 3px 0 6px rgba(0,0,0,.24);
    }

    .navbar {
      background: #f5f5f5;
    }

    .spacer {
      flex: 1 1 auto;
    }

    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,.1);
    }

    .content {
      padding: 20px;
      background: #f5f5f5;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class AppComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
