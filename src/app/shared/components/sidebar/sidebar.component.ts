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
      <a mat-list-item routerLink="/voluntariado">
        <mat-icon matListItemIcon>group</mat-icon>
        <span matListItemTitle>Voluntariado</span>
      </a>
    </mat-nav-list>
  `,  styles: [`
    :host {
      display: block;
      height: 100%;
      min-width: 280px;
      background: url('/assets/images/fundo_comandoClaro.jpg') no-repeat center center fixed;
      background-size: cover;
    }

    mat-nav-list {
      padding: 26px 16px;
    }

    .mat-mdc-list-item {
      margin-bottom: 8px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateX(5px);
      }
    }

    .mat-icon {
      margin-right: 12px;
      color: white;
    }

    span[matListItemTitle] {
      font-size: 1rem;
      //color: white;
      letter-spacing: 0.5px;
    }
  `]
})
export class SidebarComponent {}
