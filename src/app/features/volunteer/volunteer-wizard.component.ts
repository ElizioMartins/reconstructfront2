import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
                    <input matInput formControlName="event" placeholder="Digite o nome do evento">
                  </mat-form-field>
                  <div class="actions">
                    <button mat-raised-button color="primary" matStepperNext [disabled]="eventForm.invalid">Próximo</button>
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
            <mat-step>
              <ng-template matStepLabel>Função</ng-template>
              <div class="step-content">
                <p>Selecione a função do voluntário (em breve...)</p>
                <div class="actions">
                  <button mat-raised-button color="primary" matStepperNext>Próximo</button>
                </div>
              </div>
            </mat-step>
            <mat-step>
              <ng-template matStepLabel>Horário</ng-template>
              <div class="step-content">
                <p>Selecione o horário do voluntário (em breve...)</p>
                <div class="actions">
                  <button mat-raised-button color="primary" (click)="stepper.reset()">Finalizar</button>
                </div>
              </div>
            </mat-step>
          </mat-horizontal-stepper>
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
  `]
})
export class VolunteerWizardComponent {
  eventForm: FormGroup;
  cpfForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      event: ['', Validators.required]
    });
    this.cpfForm = this.fb.group({
      cpf: ['', Validators.required]
    });
  }

  buscarVoluntario() {
    // Lógica de busca de voluntário por CPF
    // Em breve: integração com API
  }
}
