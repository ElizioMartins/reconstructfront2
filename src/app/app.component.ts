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
            <img src="/assets/images/escudo_28.png" class="me-4" style="height:37px; margin-right: 8px; margin-left: 8px;">
            <span>INSANOS MC</span>
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
  `,  styles: [`
    .sidenav-container {
      height: 100vh;
      background: #f5f5f5;
    }

    .sidenav {
      width: 280px;
      box-shadow: 3px 0 6px rgba(0,0,0,.24);
    }

    .navbar {
      background: #b6b7bc url('/assets/images/fundo_comando.jpg') no-repeat center center fixed;
      background-size: cover;
      min-height: 100vh;
    }

    .spacer {
      flex: 1 1 auto;
    }

    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.18);
      color: white;
      padding: 0 16px;
      height: 70px;

      button {
        color: white;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        margin-right: 8px;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        mat-icon {
          color: black;
        }
      }

      span {
        font-size: 1.2rem;
        color: black;
        font-weight: 500;
        letter-spacing: 0.5px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      }
    }

    .content {
      padding: 24px;
      margin: 16px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      min-height: calc(100vh - 102px);
      border: 1px solid rgba(255, 255, 255, 0.18);
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
