import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { Event as EventModel } from '../../core/models/event.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule
  ],  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  jobs: EventModel[] = [];
  eventId: string = '';
  event: EventModel | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private readonly eventService: EventService) {}

  searchEvent() {
    if (!this.eventId.trim()) {
      this.error = 'Por favor, insira um ID de evento válido';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.event = null;

    this.eventService.getEventById(this.eventId).subscribe({
      next: (response: EventModel) => {
        this.event = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar evento:', error);
        this.error = 'Erro ao buscar o evento. Por favor, tente novamente.';
        this.isLoading = false;
      }
    });
  }
}
