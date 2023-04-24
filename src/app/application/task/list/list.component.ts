import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ShowComponent } from '../show/show.component';
import { TaskService } from 'src/app/_core/_services/task.service';
import { ITask } from 'src/app/_shared/models/task.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  @Output() refreshEmitter = new EventEmitter<boolean>();

  tasks: Observable<Array<ITask>>;
  constructor(private taskService: TaskService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getTasks();
  }
  getTasks() {
    this.tasks = this.taskService.getTaskList();
  }

  onOpenDialog(task: ITask) {
    const dialogRef = this.dialog.open(ShowComponent, {
      data: task,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTasks();
      this.refreshEmitter.emit(true);
    });
  }
}
