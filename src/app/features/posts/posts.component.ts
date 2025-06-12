import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="posts-container">
      <div class="header">
        <h1>Postos</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Novo Posto
        </button>
      </div>

      <table mat-table [dataSource]="[]" class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let element">{{element.name}}</td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Descrição</th>
          <td mat-cell *matCellDef="let element">{{element.description}}</td>
        </ng-container>

        <ng-container matColumnDef="requiredSkills">
          <th mat-header-cell *matHeaderCellDef>Habilidades Necessárias</th>
          <td mat-cell *matCellDef="let element">{{element.requiredSkills}}</td>
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
    .posts-container {
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
export class PostsComponent {
  displayedColumns: string[] = ['name', 'description', 'requiredSkills', 'actions'];
}
