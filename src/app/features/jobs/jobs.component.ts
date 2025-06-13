import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/job.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent {
  searchId: string = '';
  jobs: Job[] = [];
  isLoading: boolean = false;

  constructor(
    private readonly jobService: JobService,
    private readonly snackBar: MatSnackBar
  ) {}

  searchJob() {
    if (!this.searchId.trim()) {
      this.snackBar.open('Por favor, digite um ID de trabalho', 'OK', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.jobService.getJobsById(this.searchId).subscribe({
      next: (job: Job) => {
        this.jobs = [job];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao buscar trabalho:', error);
        this.snackBar.open('Erro ao buscar trabalho. Verifique o ID e tente novamente.', 'OK', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }
}
