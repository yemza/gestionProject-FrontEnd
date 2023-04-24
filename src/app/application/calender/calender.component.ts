import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import {  FormBuilder } from '@angular/forms';
import { NgxTimeSchedulerService } from '../ngx-time-scheduler/ngx-time-scheduler.service';
import { Events, Item, Period, Section } from '../ngx-time-scheduler/ngx-time-scheduler.model';
import { EventService} from 'src/app/_core/_services/event.service';
import { AuthService } from 'src/app/_core/_services/auth.service';
import { employee } from 'src/app/_core/_services/employee.service';
import { EventParams } from 'src/app/_shared/models/Event.model';
import { Input }from '@angular/core';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})

export class CalenderComponent implements OnInit {

  [x: string]: any;
  eventOutput = '';
  events: Events = new Events();
  periods: Period[];
  sections: Section[] =[];
  items: Item[];
  itemCount = 3;
  sectionCount = 10;





  constructor(private service: NgxTimeSchedulerService, 
              private eventService: EventService,
              private employee: employee,
    ) {
      this.events.SectionClickEvent = (section) => {
        this.eventOutput += '\n' + JSON.stringify(section);
      };
      this.events.SectionContextMenuEvent = (section, {x, y}: MouseEvent) => {
        this.eventOutput += '\n' + JSON.stringify(section) + ',' + JSON.stringify({x, y});
      };
      this.events.ItemClicked = (item, event) => {
       // console.log("ITems clicked event ");
        this.eventOutput += '\n' + JSON.stringify(item) +  " ," + event.clientX;
      };
      this.events.ItemContextMenu = (item, {x, y}: MouseEvent) => {
        // console.log("Coming here 1"+ JSON.stringify(item) + " ," + JSON.stringify({x, y}));
        this.eventOutput += '\n' + JSON.stringify(item) + ',' + JSON.stringify({x, y});
      };
      this.events.ItemDropped = (item) => {
        this.eventOutput += '\n' + JSON.stringify(item);
      };
      this.events.PeriodChange = (start, end) => {
        this.eventOutput += '\n' + JSON.stringify(start) + ',' + JSON.stringify(end);
      };
  
      this.events.ItemResizedEnd = (item,start,end)=>{
        //console.log("Item resize end");
        this.eventOutput += '\n'  + JSON.stringify(end) + " Item," + JSON.stringify(item);
      }
  
      this.events.newItemContextMenu=(section,eventclick)=>{
        this.eventOutput += '\n' + JSON.stringify(section) + " Event-" + JSON.stringify(eventclick + " "+ eventclick.clientX + ","+eventclick.clientY);
      }


    this.periods = [
      {
        name: 'Mois',//le nom de la vue, dans ce cas "Month".
        timeFrameHeaders: ['MMMM  yyyy',' w', 'DD'],//les en-têtes de temps pour chaque période de temp
        timeFrameHeadersTooltip: ['MMM yyyy', ' w', 'dddd'],
        classes: '',
        timeFrameOverall: 1440 * 28, // durée totale de la vue mensuele en minutes
        timeFramePeriod: 1440 , // durée de chaque période de temps en minutes (7 jours)
       },
      {   
        name: 'Semaine',
        timeFrameHeaders: ['MMMM  yyyy','DD(dddd)'],
        classes: '',
        timeFrameOverall: 1440 * 7, // durée totale de la vue hebdomadaire en minutes 
        timeFramePeriod: 1440, // durée de chaque période de temps en minutes (7 jours)
      },
     {
        name: 'Année',
        timeFrameHeaders: ['MMMM' , 'w'],
        classes: '',
        timeFrameOverall: 1440 * 365, // durée totale de la vue annuelle en minutes
        timeFramePeriod: 1440 * 7 , // durée de chaque période de temps en minutes 
        
     }];

      // this.sections = [{

      //   name: 'KAOUACHI Oussama',
      //   id: 1
      // }, {
      //   name: 'TALHAOUI Anas',
      //   id: 2
      // }, {
      //   name: 'Hamza el bouazaoui',
      //   id: 3
      // }, {
      //   name: 'TABIBOU mz',
      //   id: 4
      // }, {
      //   name: 'Mohammed ouafini',
      //   id: 5
      // }, {
      //   name: 'Lamiaa hamid',
      //   id: 6
      // }, {
      //   name: 'xx',
      //   id: 7
      // }];
  

    this.items = [{
      id: 1,
      sectionID: 1,
      name: 'CNOM',
      start: moment().startOf('day'),
      end: moment().add(2, 'days').endOf('day'),
      classes: 'item-success',

    }, {
      id: 2,
      sectionID: 2,
      name: 'ORDO',
      start: moment().startOf('day'),
      end: moment().add(4, 'days').endOf('day'),
      classes: 'item-success',

    }, {
      id: 3,
      sectionID: 3,
      name: 'FAM',
      start: moment().add(5, 'days').startOf('day'),
      end: moment().add(7, 'days').endOf('day'),
      classes: 'item-success',

    }, {
      id: 4,
      sectionID: 4,
      name: 'FAM',
      start: moment().add(1, 'days').startOf('day'),
      end: moment().add(3, 'days').endOf('day'),
      classes: 'item-success',

    }, {
      id: 5,
      sectionID: 5,
      name: 'CNOM',
      start: moment().startOf('day'),
      end: moment().add(8, 'days').endOf('day'),
      classes: 'item-success',
    }, {
      id: 6,
      sectionID: 6,
      name: 'Absent',
      start: moment().add(1, 'days').startOf('day'),
      end: moment().add(3, 'days').endOf('day'),
      classes: '',

    }, {
      id: 7,
      sectionID: 7,
      name: 'Sans Affectation',
      start: moment().add(1, 'days').startOf('day'),
      end: moment().add(3, 'days').endOf('day'),
      classes: 'item-warning',

     }];
 
}


/****************Get Event  **************** */


// ngOnInit() {
  
// }
// eventss: Eventt[];
// Listevents: any[];
// getEvents() {
//   if (this.employeeId) {
//     this.eventService.getAllEvents()
//       .subscribe(events => this.event = events);
//   }
// }
// ngOnInit() {
//   this.eventService.getAllEvents().subscribe(Listevents => {
//     this.eventss = Object.values(Listevents);
//     console.log(this.eventss); // Update this line to log this.events instead of this.Listevents
//   });
// }
  nb: any;

    addItem() {
      this.eventService.getAllEvents().subscribe(Listevents => {
        this.eventss = Listevents.map(eventss => eventss as EventParams);
    
      // Loop through the sections and push items to the service
      for (let i = 0; i < this.sections.length; i++) {
        const section = this.sections[i];
      //  if(this.eventss[i].employee)
        this.service.itemPush({
          id: this.itemCount,
          sectionID: this.nb--,
          name: '',
          start: moment().startOf('day'),
          end: moment().add(3, 'days').endOf('day'),
          classes: ''
        });
  
        this.itemCount++; 
      }
    });
  }
  
/****************Get Employee  **************** */

  ngOnInit() {
    this.employee.getAllEmployee().subscribe(
      (res: Section[]) => {
        console.log(res);
        this.sections = res;
      }
    );
  }

  
// employes : any[] = [];
// ngOnInit() {
//   this.employee.getAllEmployee().subscribe({
//       next: (employee) => {
//           this.employes = Object.values(employee);
//         this.getemployee();
//         //this.addItem();
//       }
//   });
// }
// getemployee(){
//   console.log("zeeee");
//   for(let i = 0 ; i < this.employes.length; i++){
//       this.sections.push({id: this.employes[i].id , name: this.employes[i].name + this.employes[i].id });
//   }
// }
   
// AfterViewInit(){
//   this.getemployee();
// }

// getAllEmployee(): any {
//   let employes : any[] = [];
// }
// reload(){
//   this.getemployee();
// }

}

