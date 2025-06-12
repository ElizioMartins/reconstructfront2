import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Volunteer, VolunteerFilter } from '../../models/volunteer.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private readonly API_URL = environment.API_URL;

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

  getVolunteerByCpf(cpf: string): Observable<any> {
    const cleanCpf = cpf.replace(/\D/g, '');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.API_URL}/bpv/cpf/${cleanCpf}`, { headers });
  }
}
