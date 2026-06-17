# Mapeamento de Services — imc-bpv-angular

> Objetivo: base de referência para a refatoração focada em **limpeza de dados** e **suporte offline**.
> Gerado em: 2026-06-17

---

## Índice

1. [AuthService](#1-authservice)
2. [EventService](#2-eventservice)
3. [JobService](#3-jobservice)
4. [ShiftService](#4-shiftservice)
5. [StaffService](#5-staffservice)
6. [VolunteerService](#6-volunteerservice)
7. [Problemas Transversais](#7-problemas-transversais)
8. [Plano de Ação para Refatoração](#8-plano-de-ação-para-refatoração)

---

## 1. AuthService

**Arquivo:** `src/app/core/services/auth.service.ts`

### Métodos

| Método | Parâmetros | Retorno | O que faz |
|--------|-----------|---------|-----------|
| `login` | `credentials: LoginCredentials` | `Observable<AuthResponse>` | POST `/auth/login` — autentica o usuário e retorna token + dados do usuário |
| `logout` | — | `void` | Remove `token` e `user` do localStorage |
| `getToken` | — | `string or null` | Lê o token do localStorage |
| `getUser` | — | `User or null` | Lê e faz JSON.parse do usuário armazenado no localStorage |
| `isAuthenticated` | — | `boolean` | Verifica se existe token válido no localStorage |

### Observações

- Implementação simples e direta, sem problemas estruturais.
- **Risco offline:** toda a lógica de autenticação depende de localStorage. Para suporte offline, garantir que o token persista e seja validado localmente quando não houver rede.
- Não existe interceptor de HTTP centralizado — cada service lê o token manualmente (ver seção 7).

---

## 2. EventService

**Arquivo:** `src/app/core/services/event.service.ts`
**Domínio:** Ocorrências / Celebrações em andamento

### Métodos

| Método | Parâmetros | Retorno | O que faz |
|--------|-----------|---------|-----------|
| `getOngoingEvents` | — | `Observable<any[]>` | GET `/bpv/celebrations/ongoing` — lista eventos em andamento |
| `getEventById` | `id: string` | `Observable<any>` | GET `/bpv/celebrations/{id}` — detalha um evento pelo UUID |

### Problemas identificados

| # | Gravidade | Problema |
|---|-----------|---------|
| E1 | ALTA | Retorno `any[]` e `any` — zero tipagem. A interface `Event` já existe em `src/app/core/models/event.model.ts` e não é usada |
| E2 | MÉDIA | Headers HTTP duplicados nos dois métodos — deveria usar método privado `getHttpOptions()` ou um `HttpInterceptor` |
| E3 | MÉDIA | Sem cache local — toda navegação refaz requisição HTTP |

### Interface `Event` disponível (não utilizada pelo service)

```typescript
// src/app/core/models/event.model.ts
export interface Event {
  uuid: string;
  createdAt: string;
  name: string;
  observation: string;
  shortKey: string;
  startAt: string;
  endAt: string;
  locationList: Location[];
  celebrationJobLocationList: CelebrationJobLocation[];
  printTicketCelebration: string;
}
```

**Campos potencialmente excessivos na resposta da API:**
- `printTicketCelebration`, `printTicketJob`, `printTicketLocation` — dados de impressão de ticket; relevantes apenas para fluxos de impressão física.
- `celebrationJobLocationList` aparece dentro de cada `Location` E também na raiz do `Event` — duplicidade estrutural.
- `geoLocation: { x, y }` — coordenadas geográficas; útil para mapa, desnecessário em listas simples.

---

## 3. JobService

**Arquivo:** `src/app/core/services/job.service.ts`
**Domínio:** Locais de Trabalho — Funções (Jobs)

### Métodos

| Método | Parâmetros | Retorno | O que faz |
|--------|-----------|---------|-----------|
| `getJobsById` | `jobId: string` | `Observable<Job>` | GET `/bpv/jobs/{jobId}` — retorna os dados de uma função/local de trabalho |
| `getHttpOptions` *(private)* | — | `{ headers: HttpHeaders }` | Monta o header Authorization com Bearer token |

### Observações

- Implementação mais limpa entre os services — usa método privado para headers e tipagem correta.
- **Limitação:** só busca por ID. Não há método para listar todos os jobs de um evento.
- `printTicketJob` no modelo pode ser descartado no contexto do app mobile/offline.

### Interface `Job`

```typescript
export interface Job {
  uuid: string;
  createdAt: string;
  name: string;
  description: string;
  shortKey: string;
  printTicketJob: string; // campo de impressão física — avaliar necessidade no app
}
```

---

## 4. ShiftService

**Arquivo:** `src/app/core/services/shift.service.ts`
**Domínio:** Locais de Trabalho — Turnos (Shifts)

### Métodos

| Método | Parâmetros | Retorno | O que faz |
|--------|-----------|---------|-----------|
| `getShiftsByEventAndJob` | `eventId: string, jobId: string` | `Observable<Shift[]>` | GET `/bpv/shifts?eventId=&jobId=` — lista turnos por evento + função |
| `getShifts` | `eventId: string, jobId: string` | `Observable<Shift[]>` | Wrapper redundante que apenas chama `getShiftsByEventAndJob` |
| `getShiftsByJob` | `jobId: string` | `Observable<any[]>` | GET `/bpv/shifts?jobId=` — lista turnos somente por função |

### Problemas identificados

| # | Gravidade | Problema |
|---|-----------|---------|
| S1 | ALTA | `getShiftsByJob` retorna `any[]` em vez de `Shift[]` — inconsistência de tipagem dentro do mesmo service |
| S2 | MÉDIA | `getShifts` é alias desnecessário de `getShiftsByEventAndJob` — duplicidade sem valor |
| S3 | MÉDIA | `getShiftsByJob` monta headers manualmente em vez de usar `getHttpOptions()` privado já existente no arquivo |

### Interface `Shift`

```typescript
export interface Shift {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  jobId: string;
  maxVolunteers?: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}
```

**Lacuna para offline:** a interface `Shift` não inclui `eventId`, mas a API filtra por `eventId`. Sem esse campo, não é possível reconstituir a hierarquia `Evento > Job > Shift` a partir de dados locais.

---

## 5. StaffService

**Arquivo:** `src/app/core/services/staff.service.ts`
**Domínio:** Locais de Trabalho — Alocação de Membros (Staff)

### Métodos

| Método | Parâmetros | Retorno | O que faz |
|--------|-----------|---------|-----------|
| `createStaff` | `data: { memberId, celebrationJobLocationId, description }` | `Observable<any>` | POST `/bpv/staffs` — registra um membro em um local de trabalho de uma celebração |

### Problemas identificados

| # | Gravidade | Problema |
|---|-----------|---------|
| ST1 | ALTA | POST feito **sem Authorization header** — falhará em produção com API protegida |
| ST2 | ALTA | Retorno `Observable<any>` — sem tipagem de resposta |
| ST3 | MÉDIA | Parâmetro com tipo inline — deveria ser uma interface nomeada (ex: `CreateStaffDto`) |
| ST4 | MÉDIA | `description` no payload — campo com propósito ambíguo; verificar se a API realmente exige |

### Chave de domínio: `celebrationJobLocationId`

Este campo identifica uma combinação **Celebração + Função + Local** (`CelebrationJobLocation`). É o elo central que conecta um voluntário a um posto de trabalho num evento. Qualquer estratégia de suporte offline deve preservar esses IDs localmente antes de perder conexão.

---

## 6. VolunteerService

**Arquivo:** `src/app/core/services/volunteer.service.ts`
**Domínio:** Voluntários / Membros

### Métodos

| Método | Parâmetros | Retorno | O que faz |
|--------|-----------|---------|-----------|
| `getVolunteers` | `filter?: VolunteerFilter` | `Observable<Volunteer[]>` | GET `API_URL` com params opcionais — lista voluntários com filtro |
| `getVolunteerById` | `id: string` | `Observable<Volunteer>` | GET `API_URL/{id}` — detalha voluntário pelo ID |
| `createVolunteer` | `volunteer: Omit<Volunteer, 'id'>` | `Observable<Volunteer>` | POST `API_URL` — cria voluntário |
| `updateVolunteer` | `id: string, volunteer: Partial<Volunteer>` | `Observable<Volunteer>` | PATCH `API_URL/{id}` — atualiza voluntário |
| `deleteVolunteer` | `id: string` | `Observable<void>` | DELETE `API_URL/{id}` — remove voluntário |
| `getVolunteerByCpf` | `cpf: string` | `Observable<Volunteer>` | GET `/bpv/cpf/{cpf}` — busca por CPF com mapeamento manual de campos |

### Problemas identificados

| # | Gravidade | Problema |
|---|-----------|---------|
| V1 | ALTA | `getVolunteerByCpf` usa endpoint diferente que retorna campos com nomes distintos da interface — mapeamento manual frágil |
| V2 | ALTA | Métodos CRUD (`getVolunteers`, `getVolunteerById`, `createVolunteer`, etc.) **não têm Authorization header** — só `getVolunteerByCpf` tem |
| V3 | MÉDIA | `getVolunteers` usa `filter as any` para passar params — perde validação do TypeScript |
| V4 | MÉDIA | `availability?: any[]` na interface quando `Availability` já está definida no mesmo arquivo |
| V5 | INFO | Dois arquivos de model `Volunteer` com definições diferentes (ver seção 7.2) |

### Mapeamento de campos: API CPF → Interface Volunteer

```
API (resposta /bpv/cpf/)      Interface Volunteer
────────────────────────────────────────────────────
item.nomeCompleto          ->  name
item.telefoneCelular       ->  phone
item.nomeColete            ->  nomeColete
item.numeroSistema         ->  numeroSistema
item.comandoRegional       ->  comandoRegional
item.regional              ->  regional
item.divisao               ->  divisao
item.cargo                 ->  cargo
item.erro                  ->  erro          <- campo de ERRO da API exposto como dado!
item.address || ""         ->  address       <- provavelmente nunca vem nesta rota
item.skills || []          ->  skills        <- provavelmente nunca vem nesta rota
item.availability || []    ->  availability  <- provavelmente nunca vem nesta rota
item.createdAt || Date.now() -> createdAt    <- fallback gera data falsa quando ausente
item.updatedAt || Date.now() -> updatedAt    <- fallback gera data falsa quando ausente
```

**Campos suspeitos ou desnecessários:**
- `erro` — campo de erro da API sendo tratado como propriedade do voluntário. Deveria lançar exceção com `throwError` / `catchError`.
- `address`, `skills`, `availability` — sempre recebem valor padrão vazio, indicando que esta rota da API nunca os retorna.
- `createdAt` / `updatedAt` — usar `Date.now()` como fallback cria timestamps falsos no estado local.

---

## 7. Problemas Transversais

### 7.1 Ausência de HttpInterceptor para autenticação

Todos os services leem `localStorage.getItem('token')` manualmente e constroem `HttpHeaders` individualmente. O padrão correto é um `AuthInterceptor` que adiciona o header em todas as requisições automaticamente.

**Impacto offline:** um interceptor centralizado é o lugar ideal para verificar conectividade e redirecionar requisições para fila offline.

### 7.2 Duplicidade de interfaces de Volunteer

| Arquivo | Conteúdo |
|---------|---------|
| `src/app/core/models/volunteer.model.ts` | Simplificado — sem `id`, sem campos opcionais, desatualizado |
| `src/app/models/volunteer.model.ts` | Completo — usado pelo `VolunteerService`, com `Availability` e `VolunteerFilter` |

O arquivo em `src/app/core/models/` deve ser removido para evitar ambiguidade.

### 7.3 Ausência de estratégia offline/cache

Nenhum service possui:
- Cache local (IndexedDB, localStorage com TTL, ou NgRx)
- Fila de requisições offline
- Mecanismo de sincronização ao reconectar
- Detecção de conectividade (`navigator.onLine`)

### 7.4 Interface `Event` — dados duplicados na resposta da API

O objeto retornado possui `celebrationJobLocationList` em dois níveis:

```
Event
+-- locationList[]
|   +-- celebrationJobLocationList[]   <- mesmos objetos dentro de cada Location
+-- celebrationJobLocationList[]       <- mesmos objetos na raiz do Event
```

Para armazenamento offline, isso duplica dados e complica a sincronização. Solução: normalizar via adapter antes de persistir.

---

## 8. Plano de Ação para Refatoração

### Fase 1 — Limpeza Imediata (sem mudança de comportamento)

| Prioridade | Ação | Arquivo(s) afetados |
|------------|------|-------------------|
| 1 | Criar `AuthInterceptor` e remover leitura manual de token de todos os services | Novo arquivo + todos os services |
| 2 | Tipar retornos `any` usando interfaces existentes (`Event`, `Shift`, `Volunteer`) | `event.service.ts`, `shift.service.ts`, `staff.service.ts`, `volunteer.service.ts` |
| 3 | Adicionar header de autenticação ao `StaffService.createStaff` | `staff.service.ts` |
| 4 | Remover método duplicado `getShifts` | `shift.service.ts` |
| 5 | Unificar os dois arquivos de model `Volunteer` | `src/app/core/models/` e `src/app/models/` |
| 6 | Criar interface `CreateStaffDto` para o parâmetro de `createStaff` | `staff.service.ts` |
| 7 | Trocar `availability?: any[]` por `availability?: Availability[]` | `src/app/models/volunteer.model.ts` |

### Fase 2 — Limpeza de Dados

| Prioridade | Ação |
|------------|------|
| 1 | Tratar `erro` da API de CPF com `throwError` / `catchError`, não expor no model |
| 2 | Remover mapeamento de `address`, `skills`, `availability` em `getVolunteerByCpf` se a API não os retorna nesta rota |
| 3 | Eliminar duplicidade de `celebrationJobLocationList` na resposta do Event (normalizar via adapter) |
| 4 | Avaliar campos `printTicket*` — se são somente para impressão física, isolar em sub-interface `PrintTicketData` |

### Fase 3 — Suporte Offline

| Prioridade | Ação |
|------------|------|
| 1 | Criar `OnlineStatusService` com `Observable<boolean>` baseado em `navigator.onLine` + eventos `online`/`offline` |
| 2 | Criar `CacheService` com IndexedDB (via `@ngx-pwa/local-storage` ou `idb`) para eventos e jobs |
| 3 | Criar `QueueService` para enfileirar `createStaff` quando offline e sincronizar ao reconectar |
| 4 | Registrar Service Worker via `ng add @angular/pwa` para cache de assets e GETs críticos |
| 5 | Adicionar `eventId` à interface `Shift` para permitir reconstrução da hierarquia sem depender de parâmetros de URL |
