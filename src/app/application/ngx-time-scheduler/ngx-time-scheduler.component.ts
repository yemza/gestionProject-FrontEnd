import {ChangeDetectorRef, Component, ElementRef, Input,  OnDestroy, OnInit, ViewChild,SimpleChanges} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {NgxTimeSchedulerService} from './ngx-time-scheduler.service';
import {
  HeaderDetails,
  Header,
  ItemMeta,
  Item,
  Period,
  SectionItem,
  Section,
  Text,
  Events,
} from './ngx-time-scheduler.model';
import Swal from 'sweetalert2';
import * as moment_ from 'moment';
import {Observable, Subscription} from 'rxjs';
import 'moment/locale/fr'
const moment = moment_;
import {ResizeEvent} from 'angular-resizable-element';
import { ITask } from 'src/app/_shared/models/task.interface';
import { TaskService } from 'src/app/_core/_services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../task/add/add.component';
import { ShowComponent } from '../task/show/show.component';




@Component({
  selector: 'ngx-ts[items][periods][sections]',
  templateUrl: './ngx-time-scheduler.component.html',
  styleUrls: ['./ngx-time-scheduler.component.css'],

})
export class NgxTimeSchedulerComponent implements OnInit, OnDestroy {

  @ViewChild('sectionTd') set SectionTd(elementRef: ElementRef) {
    if (elementRef) { // Vérifie si elementRef est défini
      this.SectionLeftMeasure = elementRef.nativeElement.clientWidth + 'px';
      this.changeDetector.detectChanges();
    }
  }

  @Input() currentTimeFormat = 'DD-MMM-YYYY HH:mm';//The Moment format to use when displaying Tooltip information
  @Input() showCurrentTime = false;  /* Whether to show the Current Time or not */
  @Input() showGoto = true; /* Whether to show the Goto button */
  @Input() showToday = true;  /* Whether to show the Today button */
  @Input() allowDragging = true;
  @Input() allowResizing = true;
  @Input() locale = 'fr';
  @Input() showBusinessDayOnly = false;
  @Input() headerFormat = 'DD MMMM YYYY';  //The Moment format to use when displaying Header information
  @Input() minRowHeight = 80;
  @Input() minRowHeightTask = 40;
  @Input() maxHeight: string = null;
  @Input() text = new Text();       /* Text to use when creating the scheduler */
  @Input() items: Item[];
  @Input() sections: Section[];
  @Input() periods: Period[];
  @Input() events: Events = new Events();
  @Input() start = moment().startOf('day');// The Moment to start the calendar
  today = moment().startOf('day');
  tasks : ITask[];

  end = moment().endOf('day');
  showGotoModal = false;                //modal de navigation par défaut false
  currentTimeIndicatorPosition: string; //Stocke la position actuelle de l'indicateur de temps
 // currentTimeVisibility = 'visible';    visibilité de l'indicateur de temps
 // currentTimeTitle : String;            //Stocke le titre de l'indicateur de temps
//  ShowCurrentTimeHandle = null;         //Afficher l'heure actuelle
  SectionLeftMeasure = '0';             //Mesure de la section gauche
  currentPeriod: Period;                //variable qui stocke l'objet "Period" en cours
  currentPeriodMinuteDiff = 0;          //la différence en minutes entre deux périodes.
  header: Header[];                     //variable qui stocke un tableau d'objets de type "Header"
  sectionItems: SectionItem[];          //variable qui stocke un tableau d'objets de type "SectionItem"
  subscription = new Subscription();    //variable qui stocke une instance de la classe "Subscription" pour gérer des observables.
  eventOutput = '';

  /*Resize calendar*/
  sectionwidth=0;
  prevright=0;
  currright=0;
  itemHold: Item[]=[];  
  iTask : ITask[];

  constructor(
              private changeDetector: ChangeDetectorRef,
              private service: NgxTimeSchedulerService,
              private taskService: TaskService,
              public  dialog: MatDialog, 
            ) { }

    getTasks(): void {
      this.taskService.getTaskList().subscribe( result => {
        this.tasks = result;
        this.items = [];
        let i = 0;
        this.tasks.forEach(tsk => {
          tsk?.employee?.forEach(emp => {
            let classe: string;
            switch (tsk?.type) {
              case 'Affecté':
                classe = 'item-success';
                break;
              case 'Absent':
                classe = 'item-warning';
                break;
              case 'Sans affectation':
                classe = 'item-info';
                break;
                default:
                  classe = 'item-warning';
            }
            this.items.push({
              id: i++,
              id_task: tsk.id,
              sectionID: parseInt(emp?.id),
              name: tsk?.title,
              start: moment(tsk?.startDate).startOf('day'),
              end: moment(tsk?.endDate).endOf('day'),
              classes: classe,
            });
          });
        });  
      
      });
    }
    /*******      Add  Task        *******/
    onOpenDialogAdd(id: number, date: string) {
      const dialogRef = this.dialog.open(AddComponent, {
      data: {id, date},
      height: '530px',
      maxHeight: '550px',
      width: '350px',
      position: { top: "150px" , left: "730px" },

      });
 
      dialogRef.afterClosed().subscribe((result) => {
        this.getTasks();  
     
      });
      
    }
    /*******      Modification  Task        *******/
    onOpenDialogShow(task: ITask) {
        const dialogRef = this.dialog.open(ShowComponent, {
          data:  task, 
          height: '530px',
          maxHeight: '550px',
          width: '350px',
          position: { top: "125px" , left: "730px" },
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getTasks();  
     
        });
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['sections']) {
        this.setSectionsInSectionItems();
        this.getTasks();

      }
    }

    ngOnInit(): void {
      this.getTasks();
      this.transferItem();
     this.setSectionsInSectionItems();
      this.changePeriod(this.periods[1], false);
      this.refresh();
    }
    transferItem(){
      //transfer items defined in app to this itemHold
      this.itemHold=this.items;
    }
    
    /*Appelle la méthode "changePeriod()" avec le paramètre "currentPeriod" pour changer la période en cours
    avec la valeur actuelle de "currentPeriod" et en passant "false" comme deuxième paramètre pour indiquer
      que la période ne doit pas être modifiée.*/
    refreshView() {
      this.setSectionsInSectionItems();
      this.getTasks();
      this.changePeriod(this.currentPeriod, false);
      
    }
    // Fonction de performance qui permet de suivre chaque élément par son index dans le tableau
    trackByFn(index, item) {
      return index;
    }

   /*La fonction setSectionsInSectionItems() crée une liste de SectionItem. 
   Elle prend chaque objet section dans la liste sections, crée une nouvelle
   instance de SectionItem et assigne la section correspondante à cette instance. 
   La liste de SectionItem créée est stockée dans la propriété sectionItems.*/
  setSectionsInSectionItems() {
    this.sectionItems = new Array<SectionItem>();
    this.sections.forEach(section => {
      const perSectionItem = new SectionItem();
      perSectionItem.section = section;
      perSectionItem.minRowHeight = this.minRowHeight;
      this.sectionItems.push(perSectionItem);
    });
    


  }
  // getItemTooltip(itemMeta: any): string {
  //   if (itemMeta.item.tooltip) {
  //     return itemMeta.item.tooltip;
  //   } else {
  //     return '';
  //   }
  // }
  // get methodedatapopup(){

  //   // let event = {
  //   //   title : "hello",
  //   //   task : 'anatst',
  //   //   date :'2023-12-15'

  //   // }

  //   return JSON.stringify(event)
  // }

    /*La fonction setItemsInSectionItems() est responsable de créer une liste d'objets ItemMeta
    pour chaque SectionItem créé précédemment. Elle boucle sur chaque SectionItem créé précédemment
    et crée une nouvelle liste d'objets ItemMeta correspondant à chaque élément de la liste items. 
    Si un objet ItemMeta est créé avec des propriétés de temps qui tombent dans la plage start et end, 
    il est ajouté à la liste d'objets ItemMeta stockée dans la propriété itemMetas de chaque SectionItem.*/
  setItemsInSectionItems() {
    const itemMetas = new Array<ItemMeta>();

    this.sectionItems.forEach(ele => {
      ele.itemMetas = new Array<ItemMeta>();
      ele.minRowHeight = this.minRowHeight;

      this.itemHold?.filter(i=>{
        let itemMeta = new ItemMeta();

        if (i.sectionID === ele.section.id  ) {
          itemMeta.item = i;
          if (itemMeta.item.start <= this.end && itemMeta.item.end >= this.start  ) {
            itemMeta = this.itemMetaCal(itemMeta  );
            ele.itemMetas.push(itemMeta);
            itemMetas.push(itemMeta);
          }
        }
      });
    });
    /*la méthode reduce pour créer un nouvel objet sortedItems à partir d'un tableau d'objets itemMetas
     Pour chaque objet itemMeta dans itemMetas, il recherche l'index de l'objet correspondant dans 
     un autre tableau d'objets sectionItems en comparant les identifiants de section.
     Ensuite, il ajoute l'objet itemMeta dans un sous-tableau correspondant à cet index dans l'objet sortItems*/
    const sortedItems = itemMetas.reduce((sortItems: {}, itemMeta: ItemMeta) => {
      const index = this.sectionItems.findIndex(sectionItem => sectionItem.section.id === itemMeta.item.sectionID);
      if (!sortItems[index]) {
        sortItems[index] = [];
      }
      sortItems[index].push(itemMeta);
      return sortItems;
    }, {});

    this.calCssTop(sortedItems);
    }

  /* cette méthode calcule les propriétés CSS de l'élément d'un calendrier, telles que la position et la largeur, 
  en fonction de la période en cours, de l'heure de début et de fin de l'élément sans les jours de week-end*/
  itemMetaCal(itemMeta: ItemMeta) {
    const foundStart = moment.max(itemMeta.item.start, this.start);
    const foundEnd = moment.min(itemMeta.item.end, this.end);

    let widthMinuteDiff = Math.abs(foundStart.diff(foundEnd, 'minutes'));
    let leftMinuteDiff = foundStart.diff(this.start, 'minutes');
    if (this.showBusinessDayOnly) {
      widthMinuteDiff -= (this.getNumberOfWeekendDays(moment(foundStart), moment(foundEnd)) * this.currentPeriod.timeFramePeriod);
      leftMinuteDiff -= (this.getNumberOfWeekendDays(moment(this.start), moment(foundStart)) * this.currentPeriod.timeFramePeriod);
    }

    itemMeta.cssLeft = (leftMinuteDiff / this.currentPeriodMinuteDiff) * 100;
    itemMeta.cssWidth = (widthMinuteDiff / this.currentPeriodMinuteDiff) * 100;

    if (itemMeta.item.start >= this.start) {
      itemMeta.isStart = true;
    }
    if (itemMeta.item.end <= this.end) {
      itemMeta.isEnd = true;
    }

    return itemMeta;
  }

  
  calCssTop(sortedItems) {
    for (const prop of Object.keys(sortedItems)) {
      for (let i = 0; i < sortedItems[prop].length; i++) {
        let elemBottom;
        const elem = sortedItems[prop][i];

        for (let prev = 0; prev < i; prev++) {
          const prevElem = sortedItems[prop][prev];
          const prevElemBottom = prevElem.cssTop + this.minRowHeightTask ;
          elemBottom = elem.cssTop + this.minRowHeight;

          if ((
            (prevElem.item.start <= elem.item.start && elem.item.start <= prevElem.item.end) ||
            (prevElem.item.start <= elem.item.end && elem.item.end <= prevElem.item.end) ||
            (prevElem.item.start >= elem.item.start && elem.item.end >= prevElem.item.end)
          ) && (
            (prevElem.cssTop <= elem.cssTop && elem.cssTop <= prevElemBottom) ||
            (prevElem.cssTop <= elemBottom && elemBottom <= prevElemBottom)
          )) {
            elem.cssTop = prevElemBottom + 1;
          }
        }

        elemBottom = elem.cssTop + this.minRowHeight  + 1;
        if (this.sectionItems[Number(prop)] && elemBottom > this.sectionItems[Number(prop)].minRowHeight) {
          this.sectionItems[Number(prop)].minRowHeight = elemBottom;
        }
      }
    }
  }

  /*changePeriod  pour changer la période affichée dans le calendrier. Elle prend en paramètre un objet 
  Period qui représente la nouvelle période à afficher, ainsi que deux paramètres  userTrigger et useMoment.
  Si useMoment est true, la fonction utilise la bibliothèque Moment.js pour définir les valeurs de start et end 
  en fonction de la période sélectionnée.
  Si userTrigger est true et la fonction PeriodChange est définie dans this.events, alors la fonction PeriodChange est appelée
  avec start et end comme arguments. Cela permet de déclencher un événement lorsque la période est modifiée.
  */

  changePeriod(period: Period, userTrigger: boolean = true, useMoment: boolean = true) {
  this.currentPeriod = period;
  if(useMoment){
    if (this.currentPeriod.name === 'Mois') {
      this.start = moment().startOf('month');
      this.end = moment().endOf('month');
    } else if (this.currentPeriod.name === 'Semaine') {
      this.start = moment().startOf('week');
      this.end = moment().endOf('week');
    } else if (this.currentPeriod.name === 'Année') {
      this.start = moment().startOf('year');
      this.end = moment().endOf('year');
    }
  }
  this.currentPeriodMinuteDiff = Math.abs(this.start.diff(this.end, 'minutes'));


    if (userTrigger && this.events.PeriodChange) {
      this.events.PeriodChange(this.start, this.end);
    }
  
    if (this.showBusinessDayOnly) {
      this.currentPeriodMinuteDiff -=
        (this.getNumberOfWeekendDays(moment(this.start), moment(this.end)) * this.currentPeriod.timeFramePeriod);
    }
  
    this.header = new Array<Header>();
    this.currentPeriod.timeFrameHeaders.forEach((ele: string, index: number) => {
      this.header.push(this.getDatesBetweenTwoDates(ele, index));
    });
  
    this.setItemsInSectionItems();
   // this.showCurrentTimeIndicator();
  }

  // showCurrentTimeIndicator = () => {
  //   if (this.ShowCurrentTimeHandle) {
  //     clearTimeout(this.ShowCurrentTimeHandle);
  //   }

  //   const currentTime = moment();
  //   if (currentTime >= this.start && currentTime <= this.end) {
  //     this.currentTimeVisibility = 'visible';
  //     this.currentTimeIndicatorPosition = (
  //       (Math.abs(this.start.diff(currentTime, 'minutes')) / this.currentPeriodMinuteDiff) * 100
  //     ) + '%';
  //     this.currentTimeTitle = currentTime.format(this.currentTimeFormat);
  //   } else {
  //     this.currentTimeVisibility = 'hidden';
  //   }
  //   this.ShowCurrentTimeHandle = setTimeout(this.showCurrentTimeIndicator, 30000);
  // }

  gotoToday() {
    this.start = moment(this.start).startOf('day');
    this.changePeriod(this.currentPeriod);
  }



  nextPeriod() {
    
    if ( this.currentPeriod.name === 'Mois') {
      this.start.add(1, 'month').startOf('month');
      this.end.add(1, 'month').endOf('month');
    } else if (this.currentPeriod.name === 'Semaine') {
      this.start.add(1, 'week').startOf('week');
      this.end.add(1, 'week').endOf('week');
    } else if ( this.currentPeriod.name === 'Année') {
      this.start.add(1, 'year').startOf('year');
      this.end.add(1, 'year').endOf('year');

    }
    this.changePeriod(this.currentPeriod, true, false);
  }
  
  
  previousPeriod() {
    if (this.currentPeriod.name === 'Mois') {
      this.start.subtract(1, 'month');
      this.end.subtract(1, 'month').endOf('month');
    } else if (this.currentPeriod.name === 'Semaine') {
      this.start.subtract(1, 'week');
      this.end.subtract(1, 'week').endOf('week');
    } else if (this.currentPeriod.name === 'Année') {
      this.start.subtract(1, 'year');
      this.end.subtract(1, 'year').endOf('year');
     } 
  
   this.changePeriod(this.currentPeriod,true, false);

  }
  
  gotoDate(event: any) {
    this.showGotoModal = false;
    let selectedDate = moment(event).startOf('day');
  
    if (this.currentPeriod.name === 'Mois') {
      this.start = moment(selectedDate).startOf('month');
      this.end = moment(selectedDate).endOf('month');
    } else if (this.currentPeriod.name === 'Semaine') {
      this.start = moment(selectedDate).startOf('week');
      this.end = moment(selectedDate).endOf('week');
    } else if (this.currentPeriod.name === 'Année') {
      this.start = moment(selectedDate).startOf('year');
      this.end = moment(selectedDate).endOf('year');
    }
  
    this.changePeriod(this.currentPeriod,true, false);
  }
  
  /*Cette méthode prend en paramètre un format de date et un index. 
  Elle retourne un objet Header contenant une liste de HeaderDetails.*/
  getDatesBetweenTwoDates(format: string, index: number): Header {
    const now = moment(this.start);
    const dates = new Header();
    let prev: string;
    let colspan = 0;

    while (now.isBefore(this.end) || now.isSame(this.end)) {
      if (!this.showBusinessDayOnly || (now.day() !== 0 && now.day() !== 6)) {
        const headerDetails = new HeaderDetails();
        headerDetails.name = now.locale(this.locale).format(format);
        if (prev && prev !== headerDetails.name) {
          colspan = 1;
        } else {
          colspan++;
          dates.headerDetails.pop();
        }
        prev = headerDetails.name;
        headerDetails.colspan = colspan;
        headerDetails.tooltip = this.currentPeriod.timeFrameHeadersTooltip && this.currentPeriod.timeFrameHeadersTooltip[index] ?
        now.locale(this.locale).format(this.currentPeriod.timeFrameHeadersTooltip[index]) : '';
        headerDetails.fullDate = now.locale(this.locale).format(this.currentPeriod.currentDate[index]);
        dates.headerDetails.push(headerDetails);
      }
      now.add(this.currentPeriod.timeFramePeriod, 'minutes');
    }

    return dates;
  }

  
  getNumberOfWeekendDays(startDate, endDate) {
    let count = 0;
    while (startDate.isBefore(endDate) || startDate.isSame(endDate)) {
      if ((startDate.day() === 0 || startDate.day() === 6)) {
        count++;
      }
      startDate.add(this.currentPeriod.timeFramePeriod, 'minutes');
    }
    return count;
  }

  drop(event: CdkDragDrop<Section>) {
  // event.item.data.sectionID = event.container.data.id;
    this.refreshView();
    this.events.ItemDropped(event.item.data);
  }

  refresh() {
    this.subscription.add(this.service.refreshView.asObservable().subscribe(() => {
      this.refreshView();
    }));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



  onResizeStart(event: ResizeEvent,itemmeta): void {
      //console.log('Element start resized' +  JSON.stringify(event) + " , itemmeta "+ JSON.stringify(itemmeta) + " , section "+ JSON.stringify(sectionitem));
    let dtstart = moment(itemmeta.item.start); //extrait la date début de l'élement redimentionné
    let dtend = moment(itemmeta.item.end); //extrait la date fin de l'élement redimentionné
      
    //in case the items are ovelapping
    if(dtstart< this.start){
      dtstart=this.start;
    }
  
    let daysinbtween= Number(dtend.diff(dtstart,'days') +1); //calcule le nombre de jours entre les dates de début et de fin 
    //console.log("days in between are-"+daysinbtween);
    let rectwwidth= Number(event.rectangle.width); //Elle extrait la largeur du rectangle de redimensionnement
    //console.log("Rect width is "+rectwwidth + " , each sec is "+ (rectwwidth/daysinbtween));
    //to calculate how far the item was dragged
    this.sectionwidth=rectwwidth/daysinbtween; //la largeur d'une section (une unité de temps) lors du redimensionnement.
    this.prevright =  Number(event.rectangle.right); //enregistre la position de droite précédente
    //this.events.ItemResizeStart(itemmeta.item);
    }

   async onResizeEnd(event: ResizeEvent,itemmeta) {
    
    // console.log('Element was resized' +  JSON.stringify(event) + " , itemmeta "+ JSON.stringify(itemmeta) + " , section "+ JSON.stringify(sectionitem));
     //find out previous and current 
     this.currright =  Number(event.rectangle.right);//extrait la position de droite de l'élément redimensionné.
     let cursorMoved=this.currright - this.prevright;//la distance parcourue par le curseur lors du redimensionnement.
     let datesMoved= (cursorMoved / this.sectionwidth);
     let movedEndDt;
     //console.log("Units moved "+ Math.ceil(datesMoved));
     //add end date to itemmeta;
     await this.calcEndLoction(itemmeta,datesMoved);

      // Show an alert to indicate successful resizing
      const swalWithTimeout = Swal.mixin({
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
      
      swalWithTimeout.fire({
        icon: 'success',
        title: 'Redimensionnement terminé !',
        text: 'L\'affectation a été redimensionné avec succès.'
      });
      
     this.events.ItemResizedEnd(itemmeta.item,itemmeta.item.start,movedEndDt);
    
   }

   async calcEndLoction(itemmeta,datesMoved){
     return new Promise(  async (res, rej)  => {
       let movedEndDt;
       for(let i=0;i<=this.itemHold.length;i++){
         //console.log("Itemhold is "+this.itemHold[i].id)
         if(this.itemHold[i].id == itemmeta.item.id){
           //console.log("Found item1- "+this.itemHold[i].end);
           movedEndDt = moment(itemmeta.item.end).add(Math.ceil(datesMoved),'days').startOf('day');
           this.itemHold[i].end = moment(itemmeta.item.end).add(Math.ceil(datesMoved),'days').endOf('day')
          //console.log("Found item2- "+this.itemHold[i].end);

          let currentTask = this.itemHold[i];
          this.taskService.getTaskById(currentTask.id_task).subscribe(task1 => {
            if ( task1 !== null && task1 !== undefined ) {
              task1.endDate = movedEndDt;
              this.taskService.updateTask(task1, task1.id).subscribe(result => {

              })
            }
          })
  
          break;
        }//end of if
      }//end of for 
       this.refreshView();
       //console.log("Calculation done");
       res({'status':'done'})
     });
   }
    

  
    async callRefreshwDelay(ms: number){
      await this.delay(ms);
      this.refreshView();
      }

       delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
      }
      
 
}