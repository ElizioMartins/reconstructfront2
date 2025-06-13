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

  getOngoingEvents(): Observable<Event[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.API_URL}/bpv/celebrations/ongoing`, { headers }).pipe(
      map(data => data.map(item => ({
        id: item.uuid,
        name: item.name,
        code: item.shortKey,
        startDate: new Date(item.startAt),
        endDate: new Date(item.endAt),
        status: item.status,
        description: item.description,
        location: item.location,
        maxVolunteers: item.maxVolunteers,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      } as Event)))
    );
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
