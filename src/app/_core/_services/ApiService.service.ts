import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/_shared/models/employee.model';
import { Event } from 'src/app/_shared/models/Event.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/employees`);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/events`);
  }

  saveEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/events`, event);
  }

  deleteEvent(event: Event): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${event.id}`);
  }

}
