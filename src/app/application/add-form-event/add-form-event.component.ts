import { Component,OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DialogData } from '../ngx-time-scheduler/ngx-time-scheduler.model';
import { EventService } from 'src/app/_core/_services/event.service';
import { Employee } from 'src/app/_shared/models/employee.model';
import { EventParams } from 'src/app/_shared/models/Event.model';


@Component({
  selector: 'app-add-form-event',
  templateUrl: './add-form-event.component.html',
  styleUrls: ['./add-form-event.component.css']
})
export class AddFormEventComponent implements OnInit {

  title: string;
  dateStart: string;
  dateEnd: string;
 // employee: String | number;

    ngOnInit(): void {}

  constructor(
    public dialogRef: MatDialogRef<AddFormEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private eventService: EventService) {} // Injectez le service fictif EventService

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    // Appel du service pour sauvegarder les données dans la base de données
    const event: EventParams = {
      title: this.title,
      dateStart: this.dateStart,
      dateEnd: this.dateEnd,
     //  employee: this.employee
  };

    this.eventService.saveEvent(event).subscribe(response => {
      console.log('Event saved successfully', response);
      // Fermer le dialogue et renvoyer les données sauvegardées
      this.dialogRef.close(response);
    }, error => {
      console.error('Error saving event', error);
    });
    
  }


}


