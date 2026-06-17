import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  ConfirmacaoAcaoDialogData,
  ConfirmacaoAcaoDialogResult,
} from '../../core/models/alocacao.model';

@Component({
  selector: 'app-confirmacao-acao-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="dialog-header">
      <mat-icon class="acao-icone">{{ data.acao.icone }}</mat-icon>
      <h2 mat-dialog-title>{{ data.acao.label }}</h2>
    </div>

    <mat-dialog-content>
      <p class="membro-info">
        <strong>{{ data.membro.membroNomeColete }}</strong> — {{ data.membro.membroNome }}
      </p>

      <mat-form-field appearance="outline" class="observacao-field">
        <mat-label>
          Observação
          <span *ngIf="data.acao.observacaoObrigatoria" class="obrigatorio"> *obrigatória</span>
        </mat-label>
        <textarea
          matInput
          [(ngModel)]="observacao"
          [placeholder]="data.acao.observacaoObrigatoria
            ? 'Descreva o ocorrido...'
            : 'Opcional — adicione detalhes se necessário'"
          rows="4"
          cdkTextareaAutosize>
        </textarea>
        <mat-hint *ngIf="data.acao.observacaoObrigatoria && !observacao.trim()">
          Esta ação requer uma observação para prosseguir.
        </mat-hint>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="data.acao.observacaoObrigatoria && !observacao.trim()"
        (click)="confirmar()">
        <mat-icon>check</mat-icon>
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px 24px 0;

      .acao-icone {
        color: #1976d2;
        font-size: 26px;
        height: 26px;
        width: 26px;
      }

      h2 {
        margin: 0;
        font-size: 1.2rem;
        padding: 0;
      }
    }

    mat-dialog-content {
      padding-top: 12px !important;
      min-width: 340px;
    }

    .membro-info {
      margin: 0 0 16px;
      font-size: 0.9rem;
      color: #555;
    }

    .observacao-field {
      width: 100%;
    }

    .obrigatorio {
      color: #c62828;
      font-size: 0.75rem;
      font-weight: 600;
    }

    mat-dialog-actions {
      padding: 8px 24px 16px;
      gap: 8px;
    }
  `]
})
export class ConfirmacaoAcaoDialogComponent {

  observacao = '';

  constructor(
    private readonly dialogRef: MatDialogRef<ConfirmacaoAcaoDialogComponent, ConfirmacaoAcaoDialogResult>,
    @Inject(MAT_DIALOG_DATA) public readonly data: ConfirmacaoAcaoDialogData
  ) {}

  confirmar(): void {
    this.dialogRef.close({ observacao: this.observacao.trim() });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
