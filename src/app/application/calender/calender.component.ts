import {Component,  OnInit, ViewChild,EventEmitter,Output} from '@angular/core';
import * as moment from 'moment';
import { NgxTimeSchedulerService } from '../ngx-time-scheduler/ngx-time-scheduler.service';
import { Events, Item, Period, Section } from '../ngx-time-scheduler/ngx-time-scheduler.model';
import { employee } from 'src/app/_core/_services/employee.service';
import { TaskService } from 'src/app/_core/_services/task.service';
import { ITask, } from '../../_shared/models/task.interface';
import { NgxTimeSchedulerComponent } from '../ngx-time-scheduler/ngx-time-scheduler.component';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})

export class CalenderComponent implements OnInit {

  @ViewChild(NgxTimeSchedulerComponent) ngxTimeSchedulerComponent;
  eventOutput = '';
  events: Events = new Events();
  periods: Period[];
  sections: Section[] = [];
  items: Item[] = [];
  itemCount = 3;
  sectionCount = 10;
  tasks : ITask[];
  task:ITask ;


  constructor(private service: NgxTimeSchedulerService, 
              private employee: employee,
              private taskService: TaskService,

           ) {
      this.events.SectionClickEvent = (section) => {
        this.eventOutput += '\n' + JSON.stringify(section);
      };
      this.events.SectionContextMenuEvent = (section, {x, y}: MouseEvent) => {
        this.eventOutput += '\n' + JSON.stringify(section) + ',' + JSON.stringify({x, y});
      };

      this.events.ItemClicked = (item) => {
        this.eventOutput += '\n' + JSON.stringify(item);
       // this.onOpenDialog(task); // Appeler la méthode onOpenDialog avec l'objet Item sélectionné
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
        name: 'Semaine',
        timeFrameHeaders: ['MMMM  yyyy',' w','DD(ddd)'],
        classes: '',
        timeFramePeriod: 1440, // durée de chaque période de temps en minutes (7 jours)
        currentDate: ['', '', 'YYYY-MM-DD']
      },
      {
        name: 'Mois',//le nom de la vue, dans ce cas "Month".
        timeFrameHeaders: ['MMMM  yyyy','  w', 'DD'],//les en-têtes de temps pour chaque période de temp
        timeFrameHeadersTooltip: ['MMM yyyy', ' w', 'dddd'],
        classes: '',
        timeFramePeriod: 1440 , // durée de chaque période de temps en minutes 
        currentDate: ['', '', 'YYYY-MM-DD']
       },
       {
        name: 'Année',
        timeFrameHeaders: ['yyyy', 'MMM', 'w'],
        classes: '',
        timeFramePeriod: 1440 * 5 , // durée de chaque période de temps en minutes (7 jours)((-2) jours de weekends)
        currentDate: ['', '', 'YYYY-MM-DD']

      } ];
      

}


/****************Get Employee  **************** */

  ngOnInit() {
    this.employee.getAllEmployee().subscribe(
      (res: Section[]) => {
        console.log(res);
        this.sections = res;
    //    this.addItem();

      }

    );
    this.getTasks();

  }
 
/****************Get Tasks  **************** */
  getTasks(): void {
    this.taskService.getTaskList().subscribe( result => {
      this.tasks = result;
      let i = 0;
      this.tasks.forEach(tsk => {
        tsk?.employee?.forEach(emp => {
          let classe: string;
          switch (tsk?.type) {
            case 'Affecté':
              classe = 'item-success';
              break;
            case 'Absent':
              classe = 'item-info';
              break;
            case 'Sans affectation':
              classe = 'item-warning';
              break;
            default:
              classe = 'item-warning';
          }
          this.items.push({
            id: i++,
            id_task:tsk.id,  
            sectionID: parseInt(emp?.id),
            name: tsk?.title,
            start: moment(tsk?.startDate).startOf('day'),
            end: moment(tsk?.endDate).endOf('day'),
            classes: classe,
           });
        });
      });
     this.refresh();
     this.ngxTimeSchedulerComponent.gotoToday();

    });

  }
   
    // AfterViewInit(){
    //   this.getTasks();
    // }

    // reload(){
    //  this.getTasks();  
    // }

    refresh() {
  
      this.service.refresh();
    //  this.getTasks();
    }
}



