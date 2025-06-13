import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getJobsById(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.API_URL}/bpv/jobs/${jobId}`, this.getHttpOptions());
  }

  private getHttpOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }
}
