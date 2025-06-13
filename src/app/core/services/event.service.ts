import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Event } from '../../core/models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getOngoingEvents(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.API_URL}/bpv/celebrations/ongoing`, { headers });
  }

  getEventById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.API_URL}/bpv/celebrations/${id}`, { headers });
  }
}
