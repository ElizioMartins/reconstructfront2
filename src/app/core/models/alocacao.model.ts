export type EventTypeEnum =
  | 'scheduler'
  | 'start'
  | 'end_success'
  | 'end_failure'
  | 'notification'
  | 'change_job';

export interface Alocacao {
  celebrationJobLocationId: string;
  localNome: string;
  memberId: string;
  membroNomeColete: string;
  membroNome: string;
  telefoneCelular: string;
  statusAtualEnum: EventTypeEnum;
}

export interface AcaoOperador {
  label: string;
  eventTypeEnum: EventTypeEnum;
  icone: string;
  allowedFrom: EventTypeEnum[];
  observacaoObrigatoria: boolean;
}

export interface RegistroFila {
  memberId: string;
  celebrationJobLocationId: string;
  localNome: string;
  membroNome: string;
  acao: string;
  eventTypeEnum: EventTypeEnum;
  observacao: string;
  dataHora: string;
}

export interface ConfirmacaoAcaoDialogData {
  membro: Alocacao;
  acao: AcaoOperador;
}

export interface ConfirmacaoAcaoDialogResult {
  observacao: string;
}
