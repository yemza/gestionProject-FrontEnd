import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  ITask,
  ITaskTypeOption,
  ITypePercentage,
} from '../../_shared/models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private httpclient: HttpClient) {}

  getTaskList(): Observable<Array<ITask>> {
    return this.httpclient
      .get('http://localhost:8081/api/v1/task')
      .pipe(map((d: Array<ITask>) => d));
  }
  postTaskList(task: ITask, employeeId: number): Observable<ITask> {
    return this.httpclient
      .post('http://localhost:8081/api/v1/task/' + employeeId, task)
      .pipe(map((d: ITask) => d));
  }

  updateTask(task: ITask, id: string ): Observable<ITask> {
    return this.httpclient
      .put(`http://localhost:8081/api/v1/task/${id}`, task)
      .pipe(map((d: ITask) => d));
  }
  deleteTask(id: string) {
    return this.httpclient.delete(`http://localhost:8081/api/v1/task/${id}`);
  }

  getTaskById(id: string): Observable<ITask> {
    return this.httpclient
      .get(`http://localhost:8081/api/v1/task/${id}` )
  }

  getTypePercentage(): Observable<Array<ITypePercentage>> {
    return this.httpclient
      .get(`http://localhost:8081/api/v1/task/vData/percentcounttype`)
      .pipe(map((d: Array<ITypePercentage>) => d));
  }

  getTypeOptions(): Array<ITaskTypeOption> {
    return [{ type: 'Affecté' }, { type: 'Absent' }, { type: 'Sans affectation' }];
  }
}
