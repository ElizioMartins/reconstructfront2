import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Volunteer, VolunteerFilter } from '../../models/volunteer.model';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private readonly API_URL = 'http://localhost:3000/api/volunteers';

  constructor(private http: HttpClient) {}

  getVolunteers(filter?: VolunteerFilter): Observable<Volunteer[]> {
    return this.http.get<Volunteer[]>(this.API_URL, { params: filter as any });
  }

  getVolunteerById(id: string): Observable<Volunteer> {
    return this.http.get<Volunteer>(`${this.API_URL}/${id}`);
  }

  createVolunteer(volunteer: Omit<Volunteer, 'id'>): Observable<Volunteer> {
    return this.http.post<Volunteer>(this.API_URL, volunteer);
  }

  updateVolunteer(id: string, volunteer: Partial<Volunteer>): Observable<Volunteer> {
    return this.http.patch<Volunteer>(`${this.API_URL}/${id}`, volunteer);
  }

  deleteVolunteer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
