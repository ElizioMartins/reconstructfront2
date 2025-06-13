import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VolunteerService } from '../../core/services/volunteer.service';
import { EventService } from '../../core/services/event.service';
import { JobService } from '../../core/services/job.service';
import { ShiftService } from '../../core/services/shift.service';
import { StaffService } from '../../core/services/staff.service';
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
    MatSnackBarModule,
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
  staffCreated = false;
  volunteerSelected = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly volunteerService: VolunteerService,
    private readonly eventService: EventService,
    private readonly jobService: JobService,
    private readonly shiftService: ShiftService,
    private readonly staffService: StaffService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
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
      error: (error: any) => {
        console.error('Erro ao carregar eventos:', error);
        this.isLoadingEvents = false;
        this.snackBar.open('Não foi possível carregar os eventos. Tente novamente mais tarde.', 'Fechar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
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
    console.log('Job selecionado:', jobId);
    this.selectedJob = this.jobs.find(j => j.uuid === jobId) || null;
    if (this.selectedJob && this.selectedEvent) {
      this.loadShiftsForJob(this.selectedEvent.uuid, jobId);
    }
  }

  loadShiftsForJob(eventId: string, jobId: string) {
    this.isLoadingShifts = true;
    this.shiftService.getShiftsByEventAndJob(eventId, jobId).subscribe({
      next: (shifts: Shift[]) => {
        console.log('Shifts carregados:', shifts);
        this.shifts = shifts;
        this.isLoadingShifts = false;
      },
      // error: (error) => {
      //   console.error('Erro ao carregar shifts:', error);
      //   this.isLoadingShifts = false;
      //   this.snackBar.open('Erro ao carregar horários disponíveis', 'Fechar', {
      //     duration: 5000
      //   });
      // }
    });
  }

  onShiftSelected(shiftId: string) {
    console.log('Shift selecionado:', shiftId);
    this.selectedShift = this.shifts.find(s => s.id === shiftId) || null;

    // Atualiza o formulário
    this.shiftForm.patchValue({
      shift: shiftId
    });
  }

  buscarVoluntario() {
    if (this.cpfForm.valid) {
      this.isLoadingVolunteer = true;
      this.volunteerError = null;
      this.volunteerSelected = false;
      this.volunteerService.getVolunteerByCpf(this.cpfForm.value.cpf).subscribe({
        next: (data: Volunteer) => {
          this.volunteerData = data;
          this.isLoadingVolunteer = false;
        },
        error: (error: Error) => {
          console.error('Erro ao buscar voluntário:', error);
          this.volunteerError = 'Erro ao buscar voluntário. Por favor, verifique o CPF e tente novamente.';
          this.isLoadingVolunteer = false;
        }
      });
    }
  }

  selectVolunteer() {
    this.volunteerSelected = true;
    if (this.stepper) {
      this.stepper.next();
    }
  }

  confirmarCadastro() {
    if (!this.selectedEvent || !this.volunteerData || !this.selectedJob ) {
      this.snackBar.open('Dados incompletos. Por favor, verifique todas as informações.', 'Fechar', {
        duration: 5000
      });
      return;
    }
    const staffData = {
      memberId: this.volunteerData.id,
      celebrationJobLocationId: this.selectedEvent.uuid,
      description:"",
    };
    console.log('Dados do voluntário:', staffData);

    this.staffService.createStaff(staffData).subscribe({
      next: () => {
        this.staffCreated = true;
        this.stepper.next();
      },
      error: (error) => {
        console.error('Erro ao criar staff:', error);
        this.staffCreated = false;
        this.stepper.next();
        this.snackBar.open('Erro ao criar staff. Por favor, tente novamente.', 'Fechar', {
          duration: 5000
        });
      }
    });
  }

  onStaffCreated() {
    this.staffCreated = true;
    this.snackBar.open('Staff criado com sucesso!', 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  onComplete() {
    // Você pode navegar para a página inicial ou para onde desejar
    this.router.navigate(['/volunteers']);
  }
}
