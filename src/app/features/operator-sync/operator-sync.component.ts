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
import { OfflineSyncService } from '../../core/services/offline-sync.service';

interface Acao {
  label: string;
  eventTypeEnum: string;
  icone: string;
  allowedFrom: string[];
}

interface RegistroFila {
  memberId: string;
  celebrationJobLocationId: string;
  localNome: string;
  membroNome: string;
  acao: string;
  eventTypeEnum: string;
  dataHora: string;
}

const ACOES: Acao[] = [
  { label: 'Iniciar',       eventTypeEnum: 'start',        icone: 'play_arrow',   allowedFrom: ['scheduler'] },
  { label: 'Concluído',     eventTypeEnum: 'end_success',  icone: 'check_circle', allowedFrom: ['start'] },
  { label: 'Deserção',      eventTypeEnum: 'end_failure',  icone: 'person_off',   allowedFrom: ['start'] },
  { label: 'Ocorrência',    eventTypeEnum: 'notification', icone: 'report',       allowedFrom: ['start'] },
  { label: 'Disciplina',    eventTypeEnum: 'notification', icone: 'gavel',        allowedFrom: ['start'] },
  { label: 'Troca Função',  eventTypeEnum: 'change_job',   icone: 'swap_horiz',   allowedFrom: ['scheduler', 'start'] },
];

// Ações que registram ocorrência sem mudar o status do membro
const ACOES_SEM_MUDANCA_STATUS = new Set(['notification']);

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
  ],
  templateUrl: './operator-sync.component.html',
  styleUrls: ['./operator-sync.component.scss']
})
export class OperatorSyncComponent implements OnInit {

  readonly ACOES = ACOES;

  alocacoesTrabalho: any[] = [];
  locaisUnicos: string[] = [];
  localSelecionado: string = '';
  filaOffline: RegistroFila[] = [];
  isLoading = false;
  isSyncing = false;
  simulandoOffline = false;

  constructor(
    private readonly offlineSyncService: OfflineSyncService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarAlocacoes();
  }

  get isOnline(): boolean {
    return navigator.onLine && !this.simulandoOffline;
  }

  get membrosFiltrados(): any[] {
    if (!this.localSelecionado) return [];
    return this.alocacoesTrabalho.filter(a => a.localNome === this.localSelecionado);
  }

  carregarAlocacoes(): void {
    if (!this.isOnline) {
      if (this.alocacoesTrabalho.length > 0) {
        this.snackBar.open('Sem conexão. Usando dados já carregados para trabalho em campo.', 'OK', { duration: 4000 });
      } else {
        this.snackBar.open('Sem conexão. Não foi possível carregar as alocações.', 'OK', { duration: 4000 });
      }
      return;
    }

    this.isLoading = true;
    this.offlineSyncService.getAlocacoesMock().subscribe({
      next: (dados) => {
        this.alocacoesTrabalho = dados.map(d => ({ ...d }));
        this.locaisUnicos = [...new Set<string>(dados.map((d: any) => d.localNome))];
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

  isAcaoPermitida(acao: Acao, membro: any): boolean {
    return acao.allowedFrom.includes(membro.statusAtualEnum);
  }

  registrarAcao(membro: any, acao: Acao): void {
    const registro: RegistroFila = {
      memberId: membro.memberId,
      celebrationJobLocationId: membro.celebrationJobLocationId,
      localNome: membro.localNome,
      membroNome: membro.membroNome,
      acao: acao.label,
      eventTypeEnum: acao.eventTypeEnum,
      dataHora: new Date().toISOString()
    };

    if (!ACOES_SEM_MUDANCA_STATUS.has(acao.eventTypeEnum)) {
      membro.statusAtualEnum = acao.eventTypeEnum;
    }

    this.filaOffline.push(registro);

    if (!this.isOnline) {
      this.snackBar.open(`"${acao.label}" salvo na fila offline.`, 'OK', { duration: 3000 });
    } else {
      this.snackBar.open(`"${acao.label}" registrado. Aguardando sincronização.`, '', { duration: 2000 });
    }
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
      next: (res) => {
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
      ? 'Modo offline ATIVADO (simulação). Registros irão para a fila.'
      : 'Modo offline DESATIVADO. Conexão restaurada.';
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

  getStatusLabel(statusEnum: string): string {
    const map: Record<string, string> = {
      scheduler:   'Agendado',
      start:       'Em Turno',
      end_success: 'Concluído',
      end_failure: 'Deserção',
      change_job:  'Troca de Função',
      notification: 'Em Turno',
    };
    return map[statusEnum] ?? statusEnum;
  }

  getStatusClass(statusEnum: string): string {
    const map: Record<string, string> = {
      scheduler:   'status-agendado',
      start:       'status-em-turno',
      end_success: 'status-concluido',
      end_failure: 'status-desercao',
      change_job:  'status-troca',
      notification: 'status-em-turno',
    };
    return map[statusEnum] ?? '';
  }
}
