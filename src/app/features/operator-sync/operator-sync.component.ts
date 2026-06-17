import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OfflineSyncService } from '../../core/services/offline-sync.service';
import {
  Alocacao,
  AcaoOperador,
  RegistroFila,
  EventTypeEnum,
  ConfirmacaoAcaoDialogData,
  ConfirmacaoAcaoDialogResult,
} from '../../core/models/alocacao.model';
import { ConfirmacaoAcaoDialogComponent } from './confirmacao-acao-dialog.component';

const ACOES: AcaoOperador[] = [
  { label: 'Iniciar',      eventTypeEnum: 'start',        icone: 'play_arrow',   allowedFrom: ['scheduler'],           observacaoObrigatoria: false },
  { label: 'Concluído',    eventTypeEnum: 'end_success',  icone: 'check_circle', allowedFrom: ['start'],               observacaoObrigatoria: false },
  { label: 'Deserção',     eventTypeEnum: 'end_failure',  icone: 'person_off',   allowedFrom: ['start'],               observacaoObrigatoria: true  },
  { label: 'Ocorrência',   eventTypeEnum: 'notification', icone: 'report',       allowedFrom: ['start'],               observacaoObrigatoria: true  },
  { label: 'Disciplina',   eventTypeEnum: 'notification', icone: 'gavel',        allowedFrom: ['start'],               observacaoObrigatoria: true  },
  { label: 'Troca Função', eventTypeEnum: 'change_job',   icone: 'swap_horiz',   allowedFrom: ['scheduler', 'start'],  observacaoObrigatoria: false },
];

// Ações que registram sem alterar o status do membro
const ACOES_SEM_MUDANCA_STATUS = new Set<EventTypeEnum>(['notification']);

@Component({
  selector: 'app-operator-sync',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './operator-sync.component.html',
  styleUrls: ['./operator-sync.component.scss']
})
export class OperatorSyncComponent implements OnInit {

  readonly ACOES = ACOES;

  alocacoesTrabalho: Alocacao[] = [];
  locaisUnicos: string[] = [];
  localSelecionado = '';
  filaOffline: RegistroFila[] = [];
  isLoading = false;
  isSyncing = false;
  simulandoOffline = false;

  constructor(
    private readonly offlineSyncService: OfflineSyncService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.carregarAlocacoes();
  }

  get isOnline(): boolean {
    return navigator.onLine && !this.simulandoOffline;
  }

  get membrosFiltrados(): Alocacao[] {
    if (!this.localSelecionado) return [];
    return this.alocacoesTrabalho.filter(a => a.localNome === this.localSelecionado);
  }

  carregarAlocacoes(): void {
    if (!this.isOnline) {
      const msg = this.alocacoesTrabalho.length > 0
        ? 'Sem conexão. Usando dados já carregados para trabalho em campo.'
        : 'Sem conexão. Não foi possível carregar as alocações.';
      this.snackBar.open(msg, 'OK', { duration: 4000 });
      return;
    }

    this.isLoading = true;
    this.offlineSyncService.getAlocacoesMock().subscribe({
      next: (dados: Alocacao[]) => {
        this.alocacoesTrabalho = dados.map(d => ({ ...d }));
        this.locaisUnicos = [...new Set(dados.map(d => d.localNome))];
        if (!this.localSelecionado && this.locaisUnicos.length > 0) {
          this.localSelecionado = this.locaisUnicos[0];
        }
        this.isLoading = false;
        this.snackBar.open('Lista de alocações atualizada.', '', { duration: 2000 });
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar alocações.', 'OK', { duration: 4000 });
      }
    });
  }

  isAcaoPermitida(acao: AcaoOperador, membro: Alocacao): boolean {
    return acao.allowedFrom.includes(membro.statusAtualEnum);
  }

  abrirConfirmacao(membro: Alocacao, acao: AcaoOperador): void {
    const ref = this.dialog.open<
      ConfirmacaoAcaoDialogComponent,
      ConfirmacaoAcaoDialogData,
      ConfirmacaoAcaoDialogResult
    >(ConfirmacaoAcaoDialogComponent, {
      data: { membro, acao },
      width: '420px',
      disableClose: true,
    });

    ref.afterClosed().subscribe((resultado) => {
      if (!resultado) return; // usuário cancelou
      this.registrarAcao(membro, acao, resultado.observacao);
    });
  }

  registrarAcao(membro: Alocacao, acao: AcaoOperador, observacao: string): void {
    const registro: RegistroFila = {
      memberId: membro.memberId,
      celebrationJobLocationId: membro.celebrationJobLocationId,
      localNome: membro.localNome,
      membroNome: membro.membroNome,
      acao: acao.label,
      eventTypeEnum: acao.eventTypeEnum,
      observacao,
      dataHora: new Date().toISOString(),
    };

    if (!ACOES_SEM_MUDANCA_STATUS.has(acao.eventTypeEnum)) {
      membro.statusAtualEnum = acao.eventTypeEnum;
    }

    this.filaOffline.push(registro);

    const msgOffline = this.isOnline
      ? `"${acao.label}" registrado. Aguardando sincronização.`
      : `"${acao.label}" salvo na fila offline.`;
    this.snackBar.open(msgOffline, '', { duration: 2500 });
  }

  sincronizar(): void {
    if (!this.isOnline) {
      this.snackBar.open('Sem conexão. Conecte-se à internet para sincronizar.', 'OK', { duration: 4000 });
      return;
    }
    if (this.filaOffline.length === 0) {
      this.snackBar.open('Nenhum registro pendente na fila.', '', { duration: 2000 });
      return;
    }

    this.isSyncing = true;
    this.offlineSyncService.syncOcorrenciasMock(this.filaOffline).subscribe({
      next: (res: { success: boolean; message: string }) => {
        this.filaOffline = [];
        this.isSyncing = false;
        this.snackBar.open(res.message || 'Sincronização concluída!', 'OK', { duration: 3000 });
      },
      error: () => {
        this.isSyncing = false;
        this.snackBar.open('Erro ao sincronizar. Tente novamente.', 'OK', { duration: 4000 });
      }
    });
  }

  toggleSimularOffline(): void {
    this.simulandoOffline = !this.simulandoOffline;
    const msg = this.simulandoOffline
      ? 'Modo offline ATIVADO (simulação).'
      : 'Modo offline DESATIVADO. Conexão restaurada.';
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

  getWhatsappUrl(telefone: string): string {
    const digits = telefone.replace(/\D/g, '');
    return `https://wa.me/55${digits}`;
  }

  getStatusLabel(statusEnum: EventTypeEnum): string {
    const map: Record<EventTypeEnum, string> = {
      scheduler:    'Agendado',
      start:        'Em Turno',
      end_success:  'Concluído',
      end_failure:  'Deserção',
      change_job:   'Troca de Função',
      notification: 'Em Turno',
    };
    return map[statusEnum] ?? statusEnum;
  }

  getStatusClass(statusEnum: EventTypeEnum): string {
    const map: Record<EventTypeEnum, string> = {
      scheduler:    'status-agendado',
      start:        'status-em-turno',
      end_success:  'status-concluido',
      end_failure:  'status-desercao',
      change_job:   'status-troca',
      notification: 'status-em-turno',
    };
    return map[statusEnum] ?? '';
  }
}
