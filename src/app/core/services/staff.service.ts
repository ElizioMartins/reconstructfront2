import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private readonly API_URL = environment.API_URL;

  constructor(private readonly http: HttpClient) {}

  createStaff(data: {
    memberId: string;
    celebrationJobLocationId: string;
    description: string;

  }): Observable<any> {
    return this.http.post(`${this.API_URL}/bpv/staffs`, data);
  }
}
