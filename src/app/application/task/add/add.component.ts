
import {Component, Inject,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { TaskService } from 'src/app/_core/_services/task.service';
import { ITask, ITaskTypeOption } from 'src/app/_shared/models/task.interface';
import { employee } from 'src/app/_core/_services/employee.service';
import { Employee } from 'src/app/_shared/models/employee.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  taskForm: FormGroup;
  typeOptions: Array<ITaskTypeOption> = [];
  employees : Employee[] =[];

  constructor(
      public dialogRef: MatDialogRef<AddComponent>,
      @Inject(MAT_DIALOG_DATA) 
      public data: ITask,
      private taskService : TaskService,
      private employee: employee,
      private fb : FormBuilder
    ) {
      console.log(this.data)
    }

   
  ngOnInit(): void {
    this.taskForm = this.fb.group({
    //  id: [this.data.id],
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.typeOptions = this.taskService.getTypeOptions();
    this.employee.getAllEmployee().subscribe(
      (resultat: Employee[]) => {
        this.employees = resultat;
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  addTask() {

   
    if (this.taskForm.valid) {
        this.taskService.postTaskList(this.taskForm.value).subscribe(
      (d) => {                    
         this.dialogRef.close();
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
}
