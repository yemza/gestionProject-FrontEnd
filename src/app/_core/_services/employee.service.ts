import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/_shared/models/employee.model';

@Injectable({
  providedIn: 'root'
})

export class  employee { 
  [x: string]: any;
  private apiUrl = 'http://localhost:8081/api/employees';

  constructor(private http: HttpClient) { }

  getAllEmployee()  {
    return this.http.get("http://localhost:8081/api/employees/all");
  }
  // getAllEmployee(): Observable<Employee[]> {
  //   return this.http.get<Employee[]>(`${this.apiUrl}/all`);
  // }
  getEmployees(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getEmployeeList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}`, employee);
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}