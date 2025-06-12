import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [mode]="isMobile ? 'over' : 'side'"
          [opened]="!isMobile">
        <mat-toolbar class="sidenav-toolbar">
          <span>Menu</span>
        </mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/job-search" routerLinkActive="active">
            <mat-icon matListItemIcon>work</mat-icon>
            <span matListItemTitle>Trabalhos</span>
          </a>
          <a mat-list-item routerLink="/event-search" routerLinkActive="active">
            <mat-icon matListItemIcon>event</mat-icon>
            <span matListItemTitle>Eventos</span>
          </a>
          <a mat-list-item routerLink="/volunteer" routerLinkActive="active">
            <mat-icon matListItemIcon>volunteer_activism</mat-icon>
            <span matListItemTitle>Voluntariado</span>
          </a>
          <a mat-list-item routerLink="/post-selection" routerLinkActive="active">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span matListItemTitle>Seleção de Postos</span>
          </a>
        </mat-nav-list>
        <div class="sidenav-footer">
          <button mat-button color="warn" (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            Sair
          </button>
        </div>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="drawer.toggle()" *ngIf="isMobile">
            <mat-icon>menu</mat-icon>
          </button>
          <span>IMC BPV</span>
        </mat-toolbar>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 250px;
      background-color: #fafafa;
    }

    .sidenav-toolbar {
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }

    .sidenav-footer {
      padding: 16px;
      border-top: 1px solid #e0e0e0;
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: #fafafa;
    }

    mat-nav-list {
      padding-top: 0;
    }

    .active {
      background-color: rgba(0, 0, 0, 0.04);
    }

    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class SidebarComponent {
  isMobile = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  constructor() {
    this.isMobile = window.innerWidth <= 768;
  }

  logout(): void {
    // TODO: Implementar logout
    console.log('Logout clicked');
  }
}
