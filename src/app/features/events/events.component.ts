import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="events-container">
      <div class="header">
        <h1>Eventos</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Novo Evento
        </button>
      </div>

      <table mat-table [dataSource]="[]" class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let element">{{element.name}}</td>
        </ng-container>

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Data</th>
          <td mat-cell *matCellDef="let element">{{element.date}}</td>
        </ng-container>

        <ng-container matColumnDef="location">
          <th mat-header-cell *matHeaderCellDef>Local</th>
          <td mat-cell *matCellDef="let element">{{element.location}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="primary">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .events-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    table {
      width: 100%;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class EventsComponent {
  displayedColumns: string[] = ['name', 'date', 'location', 'actions'];
}
