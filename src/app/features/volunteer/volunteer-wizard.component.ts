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
import { Event, LocationItem, CelebrationJobLocation } from '../../core/models/event.model';
import { Job } from '../../core/models/job.model';
import { Shift } from '../../core/models/shift.model';

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
  volunteerData: any = null;
  volunteerError: string | null = null;
  isLoadingVolunteer = false;
  events: Event[] = [];
  jobs: Job[] = [];
  selectedEvent: Event | null = null;
  selectedJob: Job | null = null;
  isLoadingEvents = false;
  isLoadingJobs = false;
  shifts: Shift[] = [];
  selectedShift: Shift | null = null;
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
      next: (data: Event[]) => {
        console.log('Dados de eventos recebidos:', data);
        this.events = data.map(event => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
        this.isLoadingEvents = false;
      },
      error: () => {
        this.isLoadingEvents = false;
      }
    });
  }

  onEventSelected(event: Event) {
    console.log('Evento selecionado no onEventSelected:', event);
    this.selectedEvent = event;
    this.eventForm.patchValue({ event: event });
    if (this.selectedEvent) {
      this.processJobsFromEvent(this.selectedEvent);
    }
  }

  processJobsFromEvent(event: Event) {
    this.isLoadingJobs = true;
    let jobsFromEvent: Job[] = [];

    if (event.celebrationJobLocationList && event.celebrationJobLocationList.length > 0) {
      jobsFromEvent = event.celebrationJobLocationList.map((jobLocation: CelebrationJobLocation) => ({
        id: jobLocation.uuid,
        name: jobLocation.job.name,
        description: jobLocation.job.description,
        eventId: event.id,
        location: 'Geral',
        maxVolunteers: jobLocation.staffMax
      }));
    }

    this.jobs = jobsFromEvent;
    console.log('Dados de jobs processados do evento:', this.jobs);
    this.isLoadingJobs = false;
  }

  buscarVoluntario() {
    this.volunteerData = null;
    this.volunteerError = null;
    if (this.cpfForm.valid) {
      this.isLoadingVolunteer = true;
      this.volunteerService.getVolunteerByCpf(this.cpfForm.value.cpf).subscribe({
        next: (data: any) => {
          this.volunteerData = data;
          console.log('Dados do voluntário recebidos:', this.volunteerData);
          this.isLoadingVolunteer = false;
          if (this.volunteerData) {
            this.stepper.next();
          }
        },
        error: (err: any) => {
          console.error('Erro ao buscar voluntário:', err);
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

  onJobSelected(job: Job) {
    this.selectedJob = job;
    if (this.selectedJob) {
      this.loadShifts(job.id);
    }
  }

  onShiftSelected(shiftId: string) {
    this.selectedShift = this.shifts.find(s => s.id === shiftId) || null;
  }

  get validEvents() {
    return (this.events);
  }
}
