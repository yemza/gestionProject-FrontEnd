
import {Component, Inject,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators,  } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { TaskService } from 'src/app/_core/_services/task.service';
import { ITask, ITaskTypeOption } from 'src/app/_shared/models/task.interface';
import { employee } from 'src/app/_core/_services/employee.service';
import { Employee } from 'src/app/_shared/models/employee.model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})

export class AddComponent implements OnInit {
  taskForm: FormGroup;
  typeOptions: Array<ITaskTypeOption> = [];
  employees : Employee[] =[];
  filteredEmployees: Observable<Employee[]>;
  filteredTasks: Observable<ITask[]>;
  tasks : ITask[] = [];
  task: ITask;
  public show = true;

  constructor(
      public dialogRef: MatDialogRef<AddComponent>,
      @Inject(MAT_DIALOG_DATA) 
      public data: {id, date}, 
      private taskService : TaskService,
      private employee: employee,
      private fb : FormBuilder
    ) {}


  ngOnInit(): void {

    this.taskForm = this.fb.group({
      //id: [this.data.id],
      title: ['', Validators.required ],
      startDate: [new Date(this.data.date), Validators.required],
      endDate: [new Date(this.data.date), Validators.required],
      type: ['', Validators.required],
      description: [''],
      employee: ['', Validators.required],
     },
    );
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
    this.employee.getAllEmployee().subscribe(
      (resultat: Employee[]) => {
        this.employees = resultat;

        // Find the selected employee in the employees array based on their ID
        const selectedEmployee = this.employees.find((emp) => emp.id === this.data.id);
        // Check if a selected employee was found
        if (selectedEmployee) {
        // Update the value of the employee field in the taskForm with the selected employee's name
          this.taskForm.patchValue({
            employee: selectedEmployee.name,
          })}
        // Renvoie un observable qui émet des événements chaque fois que la valeur du champ employee dans taskForm change.
        this.filteredEmployees = this.taskForm.controls.employee.valueChanges.pipe(
        // Émet une valeur initiale vide lors de la souscription à l'observable. 
          startWith(''),
        //Applique une transformation à chaque valeur émise par l'observable. 
        //il appelle la fonction filterEmployees en passant la valeur émise, puis renvoie le résultat filtré. 
          map(value => this.filterEmployees(value))
        );
      },
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
   
  }

    
        // Fonction filterEmployees: Filtrer les employés en fonction de la valeur saisie
        filterEmployees(value: string): Employee[] {
        // Normaliser la valeur saisie en supprimant les espaces et en mettant en minuscule
        const filterValue = this.normalizeValue(value);
        // Filtrer les employés en vérifiant si leur nom normalisé inclut la valeur filtrée
        return this.employees.filter(employee => this.normalizeValue(employee.name).includes(filterValue));
        }

        // Fonction normalizeValue: Normaliser une valeur en minuscules et en supprimant les espaces
        normalizeValue(value: string): string {
          return value.toLowerCase().replace(/\s/g, '');
        }
        
      // Fonction filterTasks: Filtrer les tasks en fonction de la valeur saisie
      filterTasks(values: string): ITask[] {
        // Check if the value is null or undefined
       
        const filterValues = this.normalizeValues(values);
        return this.tasks.filter((task) =>
          this.normalizeValues(task.title).includes(filterValues)
        );
      }

      // Fonction normalizeValue: Normaliser une valeur en minuscules et en supprimant les espaces
      normalizeValues(values: string): string {
        return values.toLowerCase().replace(/\s/g, '');
      }
      
        //vérifie si une date donnée est valide pour être sélectionnée dans le sélecteur de date de fin.
      // Elle compare cette date avec la date de début et retourne true si elle est supérieure ou égale à la date de début
      filterDates = (date: Date ): boolean => {
        const startDate = this.taskForm.controls.startDate.value;
        return !startDate || date >= startDate;
      };

      //fonction pour annuler la validation du formulaire
        onNoClick(): void {
          this.dialogRef.close();
        }
    
      addTask() {
        if (this.taskForm.valid) {
        // Récupérer la valeur saisie dans le champ "employee" du formulaire
          let empName = this.taskForm.get('employee').value;
          let empData;
          // Vérifier si une valeur a été saisie dans le champ "employee"
          if (empName) {
          // Rechercher l'employé correspondant au nom saisi dans la liste des employés
            empData = this.employees.find(emp2 => emp2.name === empName);
          }
          this.task = { 
            type: this.taskForm.get('type').value,
            title: this.taskForm.get('title').value,
            startDate: this.taskForm.get('startDate').value,
            endDate: this.taskForm.get('endDate').value,
            description: this.taskForm.get('description').value,
          };
            this.taskService.postTaskList(this.task, empData ? empData?.id : this.data.id).subscribe(
          (d) => {    
                       
            this.dialogRef.close();
           // this.reloadData();    

          },
          (error) => {
            console.error(error);
          }
        );
      }   
      
  }
  
  // reloadData() {
  //   this.show = false;
  //   setTimeout(() => {
  //     this.show = true;
  //   }); }
}