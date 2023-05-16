import { Component, AfterViewInit, Inject, OnInit ,Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from 'src/app/_core/_services/task.service';
import { Employee } from 'src/app/_shared/models/employee.model';
import { ITask, ITaskTypeOption } from 'src/app/_shared/models/task.interface';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css'],
})
export class ShowComponent implements OnInit {

  taskForm: FormGroup;
  typeOptions: Array<ITaskTypeOption> = [];
  employees : Employee[] =[];
  filteredEmployees: Observable<Employee[]>;
  filteredTasks: Observable<ITask[]>;
  task: ITask;
  public show = true;
  tasks : ITask[] = [];

  constructor(
    public dialogRef: MatDialogRef<ShowComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {id_task, date}, 
    private taskService : TaskService,
    private fb : FormBuilder,
  ) { }

  ngOnInit(): void {

    this.taskForm = this.fb.group({

      title: ['', Validators.required ],
      startDate: [new Date(this.data.date), Validators.required],
      endDate: [new Date(this.data.date), Validators.required],
      type: ['', Validators.required],
      description: [''],
    });

    this.typeOptions = this.taskService.getTypeOptions();
    this.taskService.getTaskList().subscribe(
      (result: ITask[]) => {
        this.tasks = result;
        this.filteredTasks = this.taskForm.controls.title.valueChanges.pipe(
          startWith(''),
          map((values) => this.filterTasks(values))
        );
      },
      (error) => {
        console.error(error);
      }
    );
   
    /* validation et de réinitialisation du champ "title" en fonction de la valeur sélectionnée dans le champ "type"*/
    this.taskForm.get('type').valueChanges.subscribe((value) => {
      if (value === 'Absent' || value === 'Sans affectation') {
        this.taskForm.get('title').clearValidators();
        this.taskForm.get('title').setValue('');
      } else {
        this.taskForm.get('title').setValidators([Validators.required]);
      }
      this.taskForm.get('title').updateValueAndValidity();
    }); 
    
    (error) => {
      console.error(error);
    }

    this.showTask();
  
    }
     //fonction pour annuler la validation du formulaire
     onNoClick(): void {
      this.dialogRef.close();
    }


  
    // Fonction filterEmployees: Filtrer les employés en fonction de la valeur saisie
    filterTasks(values: string): ITask[] {
      const filterValues = this.normalizeValues(values);
      return this.tasks.filter((task) => this.normalizeValues(task.title).includes(filterValues));
    }

    normalizeValues(values: string): string {
      return values.toLowerCase().replace(/\s/g, '');
    }

    // ngAfterViewInit(): void {
    //   this.showTask();
    // }

    showTask() {
        this.taskService.getTaskById(this.data.id_task).subscribe(
          
          (d: ITask) => {
          this.taskForm.controls['title'].setValue(d.title);
          this.taskForm.controls['type'].setValue(d.type);
          this.taskForm.controls['startDate'].setValue(new Date(d.startDate).toISOString());
          this.taskForm.controls['endDate'].setValue(new Date(d.endDate).toISOString());
          this.taskForm.controls['description'].setValue(d.description);

          //this.taskForm.controls['employee'].setValue(d.employee);
        },
          (error) => console.error(error)
        );
    }

    
    updateTask() {

      this.taskService.updateTask(this.taskForm.value, this.data.id_task).subscribe(

        (d) => {
          this.dialogRef.close();

         // this.reloadData();
        // window.location.reload(); // Recharger la page entière

//         this.showTask(); // Update the tasks array
        },
        (error) => console.error(error)
      );  

    }
  
    onDeleteTask() {
          this.taskService.deleteTask(this.data.id_task).subscribe(
            (d) => {
              this.dialogRef.close();
             window.location.reload();
             //this.reloadData();

           //  this.showTask(); // Update the tasks array


            },
            (error) => console.error(error)
          );
    }

    // reloadData() {
    //   this.show = false;
    //   setTimeout(() => {
    //     this.show = true;
    //     this.showTask(); // Recharge les données de la tâche

    //   }); }
}
