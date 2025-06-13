import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Shift } from '../models/shift.model';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getShiftsByEventAndJob(eventId: string, jobId: string): Observable<Shift[]> {
    return this.http.get<Shift[]>(
      `${this.API_URL}/bpv/shifts?eventId=${eventId}&jobId=${jobId}`,
      this.getHttpOptions()
    );
  }

  getShifts(eventId: string, jobId: string): Observable<Shift[]> {
    return this.getShiftsByEventAndJob(eventId, jobId);
  }

  getShiftsByJob(jobId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.API_URL}/bpv/shifts?jobId=${jobId}`, { headers });
  }
}
