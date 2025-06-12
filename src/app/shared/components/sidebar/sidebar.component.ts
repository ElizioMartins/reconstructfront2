import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <span matListItemTitle>Dashboard</span>
      </a>
      <a mat-list-item routerLink="/events">
        <mat-icon matListItemIcon>event</mat-icon>
        <span matListItemTitle>Eventos</span>
      </a>
      <a mat-list-item routerLink="/jobs">
        <mat-icon matListItemIcon>work</mat-icon>
        <span matListItemTitle>Trabalhos</span>
      </a>
      <a mat-list-item routerLink="/posts">
        <mat-icon matListItemIcon>assignment</mat-icon>
        <span matListItemTitle>Postos</span>
      </a>
      <a mat-list-item routerLink="/volunteers">
        <mat-icon matListItemIcon>volunteer_activism</mat-icon>
        <span matListItemTitle>Voluntários</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    mat-nav-list {
      padding-top: 16px;
    }
  `]
})
export class SidebarComponent {}
