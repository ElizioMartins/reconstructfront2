import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Volunteer } from '../../../models/volunteer.model';

@Component({
  selector: 'app-volunteer-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './volunteer-page.component.html',
  styleUrls: ['./volunteer-page.component.scss']
})
export class VolunteerPageComponent implements OnInit {
  volunteers: Volunteer[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];

  constructor() {}

  ngOnInit(): void {
    // TODO: Carregar dados dos voluntários
  }
}
