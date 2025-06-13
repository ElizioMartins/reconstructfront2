import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getJobsByEvent(eventId: string): Observable<Job[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.API_URL}/bpv/jobs?eventId=${eventId}`, { headers }).pipe(
      map(data => data.map(item => ({
        id: item.uuid,
        name: item.name,
        description: item.description,
        eventId: item.eventId,
        maxVolunteers: item.maxVolunteers,
        status: item.status,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      } as Job)))
    );
  }
}
