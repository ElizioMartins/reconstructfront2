import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getShiftsByJob(jobId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.API_URL}/bpv/shifts?jobId=${jobId}`, { headers });
  }
}
