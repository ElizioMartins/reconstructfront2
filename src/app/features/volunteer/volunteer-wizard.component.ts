import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VolunteerService } from '../../core/services/volunteer.service';
import { EventService } from '../../core/services/event.service';
import { JobService } from '../../core/services/job.service';
import { ShiftService } from '../../core/services/shift.service';

@Component({
  selector: 'app-volunteer-wizard',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="volunteer-wizard-container">
      <mat-card>
        <mat-card-title>Voluntariado</mat-card-title>
        <mat-card-content>
          <mat-horizontal-stepper [linear]="true" #stepper>
            <mat-step [stepControl]="eventForm">
              <form [formGroup]="eventForm">
                <ng-template matStepLabel>Evento</ng-template>
                <div class="step-content">
                  <p>Selecione o evento:</p>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Evento</mat-label>
                    <mat-select formControlName="event" (selectionChange)="onEventSelected($event.value)">
                      <mat-option *ngFor="let ev of events" [value]="ev?.id ? ev.id.toString() : null">{{ev?.name}}</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <div *ngIf="isLoadingEvents" class="alert-info">Carregando eventos...</div>
                  <div class="actions">
                    <button mat-raised-button color="primary" matStepperNext>Próximo</button>
                  </div>
                </div>
              </form>
            </mat-step>
            <mat-step [stepControl]="cpfForm">
              <form [formGroup]="cpfForm">
                <ng-template matStepLabel>Voluntário</ng-template>
                <div class="step-content">
                  <div class="event-details">
                    <strong>Evento Selecionado</strong><br>
                    <span><b>Nome:</b> {{eventForm.value.event || '---'}}</span><br>
                    <span><b>Código:</b> bpv5e</span><br>
                    <span><b>Período:</b> 03/06/2025, 00:00 até 06/07/2025, 00:00</span>
                  </div>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Digite o CPF do voluntário</mat-label>
                    <input matInput formControlName="cpf" placeholder="Digite o CPF do voluntário">
                  </mat-form-field>
                  <div class="actions">
                    <button mat-raised-button color="primary" (click)="buscarVoluntario()" [disabled]="cpfForm.invalid">Buscar</button>
                  </div>
                  <div *ngIf="!cpfForm.value.cpf" class="alert-info">
                    Digite o CPF do voluntário para continuar
                  </div>
                </div>
              </form>
            </mat-step>
            <mat-step [stepControl]="jobForm">
              <form [formGroup]="jobForm">
                <ng-template matStepLabel>Função</ng-template>
                <div class="step-content">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Selecione a função/posto</mat-label>
                    <mat-select formControlName="job" (selectionChange)="onJobSelected($event.value)">
                      <mat-option *ngFor="let job of jobs" [value]="job.id">{{job.name}}</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <div *ngIf="isLoadingJobs" class="alert-info">Carregando funções/postos...</div>
                  <div class="actions">
                    <button mat-raised-button color="primary" matStepperNext [disabled]="jobForm.invalid">Próximo</button>
                  </div>
                </div>
              </form>
            </mat-step>
            <mat-step [stepControl]="shiftForm">
              <form [formGroup]="shiftForm">
                <ng-template matStepLabel>Horário</ng-template>
                <div class="step-content">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Selecione o horário</mat-label>
                    <mat-select formControlName="shift" (selectionChange)="onShiftSelected($event.value)">
                      <mat-option *ngFor="let shift of shifts" [value]="shift.id">{{shift.name}}</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <div *ngIf="isLoadingShifts" class="alert-info">Carregando horários...</div>
                  <div class="actions">
                    <button mat-raised-button color="primary" matStepperNext [disabled]="shiftForm.invalid">Finalizar</button>
                  </div>
                </div>
              </form>
            </mat-step>
          </mat-horizontal-stepper>
          <div *ngIf="isLoadingVolunteer" class="alert-info">Buscando voluntário...</div>
          <div *ngIf="volunteerData" class="volunteer-result">
            <b>Nome:</b> {{volunteerData.name}}<br>
            <b>Email:</b> {{volunteerData.email}}<br>
            <b>Telefone:</b> {{volunteerData.phone}}
          </div>
          <div *ngIf="volunteerError" class="alert-info">{{volunteerError}}</div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .volunteer-wizard-container {
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      background: #f8f8f8;
      min-height: 100vh;
    }
    mat-card {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
    }
    .step-content {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
    .event-details {
      background: #f5f5f5;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .full-width {
      width: 100%;
    }
    .actions {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
    }
    .alert-info {
      margin-top: 1rem;
      background: #fffde7;
      border: 1px solid #ffe082;
      border-radius: 4px;
      padding: 1rem;
      color: #bfa100;
    }
    .volunteer-result {
      margin-top: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 6px;
    }
  `]
})
export class VolunteerWizardComponent {
  eventForm: FormGroup;
  cpfForm: FormGroup;
  jobForm: FormGroup;
  shiftForm: FormGroup;
  volunteerData: any = null;
  volunteerError: string | null = null;
  isLoadingVolunteer = false;
  events: any[] = [];
  jobs: any[] = [];
  selectedEvent: any = null;
  selectedJob: any = null;
  isLoadingEvents = false;
  isLoadingJobs = false;
  shifts: any[] = [];
  selectedShift: any = null;
  isLoadingShifts = false;

  constructor(
    private fb: FormBuilder,
    private volunteerService: VolunteerService,
    private eventService: EventService,
    private jobService: JobService,
    private shiftService: ShiftService
  ) {
    this.eventForm = this.fb.group({
      event: [null, Validators.required]
    });
    this.cpfForm = this.fb.group({
      cpf: ['', Validators.required]
    });
    this.jobForm = this.fb.group({
      job: ['', Validators.required]
    });
    this.shiftForm = this.fb.group({
      shift: ['', Validators.required]
    });
    this.loadEvents();
  }

  loadEvents() {
    this.isLoadingEvents = true;
    this.eventService.getOngoingEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoadingEvents = false;
      },
      error: () => {
        this.isLoadingEvents = false;
      }
    });
  }

  onEventSelected(eventId: string) {
    if (!this.events || !eventId) {
      this.selectedEvent = null;
      return;
    }
    this.selectedEvent = (this.events.find((e: any) => e && e.id && e.id.toString() === eventId)) || null;
    if (this.selectedEvent) {
      this.loadJobs(eventId);
      this.eventForm.get('event')?.markAsTouched();
      this.eventForm.get('event')?.updateValueAndValidity();
    }
    console.log('Valor do form:', this.eventForm.value);
  }

  loadJobs(eventId: string) {
    this.isLoadingJobs = true;
    this.jobService.getJobsByEvent(eventId).subscribe({
      next: (data) => {
        this.jobs = data;
        this.isLoadingJobs = false;
      },
      error: () => {
        this.isLoadingJobs = false;
      }
    });
  }

  buscarVoluntario() {
    this.volunteerData = null;
    this.volunteerError = null;
    if (this.cpfForm.valid) {
      this.isLoadingVolunteer = true;
      this.volunteerService.getVolunteerByCpf(this.cpfForm.value.cpf).subscribe({
        next: (data) => {
          this.volunteerData = data;
          this.isLoadingVolunteer = false;
        },
        error: (err) => {
          this.volunteerError = 'Voluntário não encontrado ou erro na busca.';
          this.isLoadingVolunteer = false;
        }
      });
    }
  }

  loadShifts(jobId: string) {
    this.isLoadingShifts = true;
    this.shiftService.getShiftsByJob(jobId).subscribe({
      next: (data) => {
        this.shifts = data;
        this.isLoadingShifts = false;
      },
      error: () => {
        this.isLoadingShifts = false;
      }
    });
  }

  onJobSelected(jobId: string) {
    this.selectedJob = this.jobs.find((j: any) => j.id === jobId);
    this.loadShifts(jobId);
  }

  onShiftSelected(shiftId: string) {
    this.selectedShift = this.shifts.find((s: any) => s.id === shiftId);
  }
}
