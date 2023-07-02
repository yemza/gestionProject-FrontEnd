import { Component, AfterViewInit, Inject, OnInit ,Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/_core/_services/task.service';
import { Employee } from 'src/app/_shared/models/employee.model';
import { ITask, ITaskTypeOption } from 'src/app/_shared/models/task.interface';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


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
  tasks : ITask[] = [];

  constructor(
    public dialogRef: MatDialogRef<ShowComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {id_task, date}, 
    private taskService : TaskService,
    private fb : FormBuilder,
    private dialog: MatDialog,

  ) {}

  ngOnInit(): void {

    this.taskForm = this.fb.group({

      title: ['', Validators.required],
      startDate: [new Date(this.data.date), Validators.required],
      endDate: [new Date(this.data.date),Validators.required],
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

  
    // Fonction filterTasks: Filtrer les tasks en fonction de la valeur saisie
    filterTasks(values: string): ITask[] {
      // Normaliser la valeur saisie en minuscules et en supprimant les espaces
        const filterValues = this.normalizeValues(values);
      // Filtration des affaires en vérifiant si leur titre normalisé inclut la valeur filtrée et n'est pas vide
        return this.tasks.filter((task) => {
          const normalizedTitle = this.normalizeValues(task.title);
      // Vérifier si le titre normalisé inclut la valeur filtrée et n'est pas vide
          return normalizedTitle.includes(filterValues) && normalizedTitle.length > 0;
        });
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

        },
          (error) => console.error(error)
        );
    }

    
    updateTask() {

      this.taskService.updateTask(this.taskForm.value, this.data.id_task).subscribe(

        (d) => {

        this.dialogRef.close();
         window.location.reload();

        },
        (error) => console.error(error)
      );  

    }

    onDeleteTask() {
          this.taskService.deleteTask(this.data.id_task).subscribe(
            (d) => {
              this.dialogRef.close();
              window.location.reload();

            },
            (error) => console.error(error)
          );
    }
    openConfirmationDialog(): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
       
        panelClass: 'confirm-dialog-container',
        disableClose: true,
        position: { top: "325px" , left: "600px" },

        maxHeight: '200px',
        // maxWidth: AUTO_STYLE,
        data: 'Êtes-vous sûr de vouloir supprimer cette Affectation ?'
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {

          this.onDeleteTask();
        }
      });
    }
    

}
