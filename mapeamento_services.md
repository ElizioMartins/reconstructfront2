# Mapeamento de Services

## 1. auth.service.ts
**Classe:** `AuthService`

### Métodos
| Método | Parâmetros | Tipo de Retorno | Descrição |
|--------|-----------|------------------|-----------|
| `login` | `credentials: LoginCredentials` | `Observable<AuthResponse>` | Realiza POST para `/auth/login` enviando credenciais e retorna a resposta de autenticação. |
| `logout` | - | `void` | Remove token e usuário do `localStorage`. |
| `getToken` | - | `string \| null` | Recupera token armazenado no `localStorage`. |
| `getUser` | - | `User \| null` | Recupera usuário serializado do `localStorage`. |
| `isAuthenticated` | - | `boolean` | Verifica se há token presente. |

**Observações:**
- Os métodos de obtenção (`getToken`, `getUser`) expõem diretamente o `localStorage`; considerar encapsular em um storage service para melhorar testabilidade e suporte offline.
- Nenhum campo de retorno excessivo, porém a lógica de autenticação está dispersa.

---

## 2. event.service.ts
**Classe:** `EventService`

### Métodos
| Método | Parâmetros | Tipo de Retorno | Descrição |
|--------|-----------|------------------|-----------|
| `getOngoingEvents` | - | `Observable<any[]>` | Busca eventos em andamento usando token de autenticação no header. |
| `getEventById` | `id: string` | `Observable<any>` | Busca evento específico pelo ID com autenticação. |

**Observações:**
- Retorna `any[]`/`any`; usar interfaces fortes (ex.: `Event`) para tipagem.
- Cada chamada recria token e cabeçalhos; poderia ser centralizado em um interceptor HTTP.
- Não há método de criação/edição; se houver, pode ser redundante.

---

## 3. job.service.ts
**Classe:** `JobService`

### Métodos
| Método | Parâmetros | Tipo de Retorno | Descrição |
|--------|-----------|------------------|-----------|
| `getJobsById` | `jobId: string` | `Observable<Job>` | Obtém job pelo ID usando cabeçalhos de autorização. |
| `getHttpOptions` (private) | - | `{ headers: HttpHeaders }` | Constrói opções HTTP com token.

**Observações:**
- O nome `getJobsById` sugere múltiplos, mas retorna um único `Job`. Renomear para `getJobById`.
- Tipagem está correta, porém poderia reutilizar o `getHttpOptions` via interceptor.

---

## 4. shift.service.ts
**Classe:** `ShiftService`

### Métodos
| Método | Parâmetros | Tipo de Retorno | Descrição |
|--------|-----------|------------------|-----------|
| `getHttpOptions` (private) | - | `{ headers: HttpHeaders }` | Monta cabeçalhos com token. |
| `getShiftsByEventAndJob` | `eventId: string, jobId: string` | `Observable<Shift[]>` | Busca turnos filtrados por evento e job. |
| `getShifts` | `eventId: string, jobId: string` | `Observable<Shift[]>` | Alias para `getShiftsByEventAndJob`. |
| `getShiftsByJob` | `jobId: string` | `Observable<any[]>` | Busca turnos apenas por job, monta cabeçalhos localmente (duplicação de lógica). |

**Observações:**
- Duplicação de construção de headers entre `getHttpOptions` e `getShiftsByJob`.
- Retorno de `getShiftsByJob` usa `any[]`; definir `Shift[]`.
- Possível excesso de métodos: `getShifts` pode ser removido se for redundante.

---

## 5. staff.service.ts
**Classe:** `StaffService`

### Métodos
| Método | Parâmetros | Tipo de Retorno | Descrição |
|--------|-----------|------------------|-----------|
| `createStaff` | `{ memberId: string; celebrationJobLocationId: string; description: string; }` | `Observable<any>` | Cria registro de staff via POST.

**Observações:**
- Apenas método de criação; faltam list, update, delete que podem ser necessários.
- Tipo de retorno `any`; definir interface `Staff`.

---

## 6. volunteer.service.ts
**Classe:** `VolunteerService`

### Métodos
| Método | Parâmetros | Tipo de Retorno | Descrição |
|--------|-----------|------------------|-----------|
| `getVolunteers` | `filter?: VolunteerFilter` | `Observable<Volunteer[]>` | Busca lista de voluntários, passando filtros como params. |
| `getVolunteerById` | `id: string` | `Observable<Volunteer>` | Busca voluntário por ID. |
| `createVolunteer` | `volunteer: Omit<Volunteer, 'id'>` | `Observable<Volunteer>` | Cria novo voluntário. |
| `updateVolunteer` | `id: string, volunteer: Partial<Volunteer>` | `Observable<Volunteer>` | Atualiza campos do voluntário. |
| `deleteVolunteer` | `id: string` | `Observable<void>` | Remove voluntário. |
| `getVolunteerByCpf` | `cpf: string` | `Observable<Volunteer>` | Busca voluntário por CPF, limpa CPF, adiciona cabeçalhos, mapeia resposta para objeto `Volunteer` com campos adicionais e padronizações. |

**Observações:**
- `getVolunteerByCpf` realiza muita transformação manual; considerar mover lógica para um mapper/util.
- O endpoint usado (`${this.API_URL}/bpv/cpf/${cleanCpf}`) devolve campos diferentes do modelo `Volunteer`; o mapeamento pode ocultar inconsistências.
- O método `getVolunteers` passa `filter` como `any` via `params`; validar que o backend aceita todos os campos.
- Tipagem está boa, porém `any[]` em outros services ainda aparece.

---

# Recomendações Gerais
1. **Centralizar Autenticação:** Criar um `HttpInterceptor` que anexa token a todas as requisições, eliminando a repetição de `HttpHeaders`.
2. **Tipagem Forte:** Substituir retornos `any` por interfaces específicas (`Event`, `Shift`, `Staff`).
3. **Consolidar Serviços de Dados:** Avaliar agrupar serviços relacionados (ex.: `ShiftService` e `JobService`) em um módulo de API.
4. **Suporte Offline:** Implementar cache local (ex.: `IndexedDB` ou `ngx-indexed-db`) nos métodos de leitura e um fallback quando offline.
5. **Refatorar Nomes:** Ajustar nomes como `getJobsById` → `getJobById`.
6. **Remover Redundâncias:** Eliminar métodos duplicados (`getShifts`), unificar construção de headers.
7. **Documentação:** Manter este arquivo `mapeamento_services.md` como referência e gerar documentação automática via compodoc.

*Arquivo gerado para consulta futura.*
