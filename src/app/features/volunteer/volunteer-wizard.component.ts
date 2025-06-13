import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VolunteerService } from '../../core/services/volunteer.service';
import { EventService } from '../../core/services/event.service';
import { JobService } from '../../core/services/job.service';
import { ShiftService } from '../../core/services/shift.service';
import { Job } from '../../core/models/job.model';
import { Shift } from '../../core/models/shift.model';
import { Event as EventModel } from '../../core/models/event.model';

import { Volunteer } from '../../models/volunteer.model';

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
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './volunteer-wizard.component.html',
  styleUrls: ['./volunteer-wizard.component.scss']
})
export class VolunteerWizardComponent {
  @ViewChild('stepper') stepper!: MatStepper;
  eventForm: FormGroup;
  cpfForm: FormGroup;
  jobForm: FormGroup;
  shiftForm: FormGroup;
  volunteerData: Volunteer | null = null;
  volunteerError: string | null = null;
  isLoadingVolunteer = false;
  events: EventModel[] = [];
  validEvents: EventModel[] = [];
  jobs: Job[] = [];
  selectedEvent: EventModel | null = null;
  selectedJob: Job | null = null;
  isLoadingEvents = false;
  isLoadingJobs = false;
  shifts: Shift[] = [];
  selectedShift: Shift | null = null;
  isLoadingShifts = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly volunteerService: VolunteerService,
    private readonly eventService: EventService,
    private readonly jobService: JobService,
    private readonly shiftService: ShiftService
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
      next: (data: EventModel[]) => {
        console.log('Dados de eventos recebidos:', data);
        this.events = data;
        this.validEvents = this.events.filter(event =>
          event.startAt && event.endAt &&
          new Date(event.endAt) >= new Date()
        );
        this.isLoadingEvents = false;
      },
      error: (error: Error) => {
        console.error('Erro ao carregar eventos:', error);
        this.isLoadingEvents = false;
      }
    });
  }

  onEventSelected(event: EventModel) {
    console.log('Evento selecionado:', event);
    this.selectedEvent = event;
    if (this.selectedEvent?.locationList) {
      this.processJobsFromEvent(this.selectedEvent);
    }
  }

  processJobsFromEvent(event: EventModel) {
    const jobsMap = new Map<string, Job>();

    event.locationList?.forEach(location => {
      location.celebrationJobLocationList?.forEach(cjl => {
        if (cjl.job) {
          jobsMap.set(cjl.job.uuid, cjl.job);
        }
      });
    });

    event.celebrationJobLocationList?.forEach(cjl => {
      if (cjl.job) {
        jobsMap.set(cjl.job.uuid, cjl.job);
      }
    });

    this.jobs = Array.from(jobsMap.values());
    console.log('Jobs processados:', this.jobs);
  }

  onJobSelected(jobId: string) {
    this.selectedJob = this.jobs.find(j => j.uuid === jobId) || null;
    if (this.selectedJob && this.selectedEvent) {
      this.loadShiftsForJob(this.selectedEvent.uuid, jobId);
    }
  }

  loadShiftsForJob(eventId: string, jobId: string) {
    this.isLoadingShifts = true;
    this.shiftService.getShifts(eventId, jobId).subscribe({
      next: (shifts: Shift[]) => {
        this.shifts = shifts;
        this.isLoadingShifts = false;
      },
      error: (error: Error) => {
        console.error('Erro ao carregar turnos:', error);
        this.isLoadingShifts = false;
      }
    });
  }

  onShiftSelected(shiftId: string) {
    this.selectedShift = this.shifts.find(s => s.id === shiftId) || null;
  }

  buscarVoluntario() {
    if (this.cpfForm.valid) {
      this.isLoadingVolunteer = true;
      this.volunteerError = null;
      this.volunteerService.getVolunteerByCpf(this.cpfForm.value.cpf).subscribe({
        next: (data: Volunteer) => {
          this.volunteerData = data;
          this.isLoadingVolunteer = false;
          if (this.stepper) {
            this.stepper.next();
          }
        },
        error: (error: Error) => {
          console.error('Erro ao buscar voluntário:', error);
          this.volunteerError = 'Erro ao buscar voluntário. Por favor, verifique o CPF e tente novamente.';
          this.isLoadingVolunteer = false;
        }
      });
    }
  }
}
