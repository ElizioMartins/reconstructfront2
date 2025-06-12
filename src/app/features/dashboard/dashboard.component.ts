import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <div class="dashboard-grid">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>event</mat-icon>
            <mat-card-title>Eventos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gerencie eventos e atividades</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>work</mat-icon>
            <mat-card-title>Trabalhos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gerencie trabalhos e funções</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>volunteer_activism</mat-icon>
            <mat-card-title>Voluntários</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gerencie voluntários e equipes</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>assignment</mat-icon>
            <mat-card-title>Postos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gerencie postos e funções</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }

    .dashboard-card {
      height: 100%;
    }

    mat-card-header {
      margin-bottom: 16px;
    }

    mat-icon[mat-card-avatar] {
      font-size: 40px;
      width: 40px;
      height: 40px;
      margin-right: 16px;
    }
  `]
})
export class DashboardComponent {}
