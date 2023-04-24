import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventData, EventParams } from '../../_shared/models/Event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  [x: string]: any;
  private baseUrl = 'http://localhost:8081/api/events';

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<EventData[]> {
    return this.http.get<EventData[]>(`${this.baseUrl}/all`);
  }

  // createEvent(event: Eventt): Observable<Eventt> {
  //   return this.http.post<Eventt>(`${this.baseUrl}`, event);
  // }
  saveEvent(event: EventParams): Observable<EventData[]> {
    // if (!event.title || !event.dateStart || !event.dateEnd || !event.employee) {
    //     // Gérer les erreurs de validation
    //     throw new Error('Les données de l\'événement sont invalides.');
    // }
    return this.http.post<EventData[]>(`${this.baseUrl}/addEvent`, event);
}
  getEventsForEmployee(employeeId: number): Observable<EventData[]> {
    const url = `${this.baseUrl}/employee/${employeeId}`;
    return this.http.get<EventData[]>(url);
  }
 
  
  updateEvent(id: number, event: EventParams): Observable<EventData> {
    return this.http.put<EventData>(`${this.baseUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
