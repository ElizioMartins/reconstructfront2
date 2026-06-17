import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_ALOCACOES } from '../../../environments/offline-mock.data';

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {

  constructor() { }

  // Simula o GET da API (com 1 segundo de atraso para parecer real)
  getAlocacoesMock(): Observable<any[]> {
    console.log('🚀 Recebido da API (Mock):', MOCK_ALOCACOES);
    return of(MOCK_ALOCACOES).pipe(delay(1000));
  }

  // Simula o POST de Sincronização
  syncOcorrenciasMock(filaOffline: any[]): Observable<any> {
    console.log('🚀 Enviando para a API (Mock):', filaOffline);
    // Simula um retorno de sucesso da API
    return of({ success: true, message: 'Sincronizado com sucesso!' }).pipe(delay(1500));
  }
}
