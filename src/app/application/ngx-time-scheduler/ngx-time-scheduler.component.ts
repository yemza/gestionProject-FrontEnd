import {ChangeDetectorRef, Component, ElementRef, Input, EventEmitter,Output, OnDestroy, OnInit, ViewChild,SimpleChanges} from '@angular/core';
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
import * as moment_ from 'moment';
import {Observable, Subscription} from 'rxjs';
import 'moment/locale/fr'
const moment = moment_;
import {ResizeEvent} from 'angular-resizable-element';
import { ITask } from 'src/app/_shared/models/task.interface';
import { TaskService } from 'src/app/_core/_services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../task/add/add.component';




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
  @Output() refreshEmitter = new EventEmitter<boolean>();
  @Input() currentTimeFormat = 'DD-MMM-YYYY HH:mm';//The Moment format to use when displaying Tooltip information
  @Input() showCurrentTime = true;  /* Whether to show the Current Time or not */
  @Input() showGoto = true; /* Whether to show the Goto button */
  @Input() showToday = true;  /* Whether to show the Today button */
  @Input() allowDragging = true;
  @Input() allowResizing = true;
  @Input() locale = 'fr';
  @Input() showBusinessDayOnly = false;
  @Input() headerFormat = 'DD MMMM YYYY';  //The Moment format to use when displaying Header information
  @Input() minRowHeight = 40;
  @Input() maxHeight: string = null;
  @Input() text = new Text();       /* Text to use when creating the scheduler */
  @Input() items: Item[];
  @Input() sections: Section[];
  @Input() periods: Period[];
  @Input() events: Events = new Events();
  @Input() start = moment().startOf('day');// The Moment to start the calendar

  end = moment().endOf('day');
  showGotoModal = false;                //modal de navigation par défaut false
  currentTimeIndicatorPosition: string; //Stocke la position actuelle de l'indicateur de temps
  currentTimeVisibility = 'visible';    //visibilité de l'indicateur de temps
  currentTimeTitle : String;            //Stocke le titre de l'indicateur de temps
  ShowCurrentTimeHandle = null;         //Afficher l'heure actuelle
  SectionLeftMeasure = '0';             //Mesure de la section gauche
  currentPeriod: Period;                //variable qui stocke l'objet "Period" en cours
  currentPeriodMinuteDiff = 0;          //la différence en minutes entre deux périodes.
  header: Header[];                     //variable qui stocke un tableau d'objets de type "Header"
  sectionItems: SectionItem[];          //variable qui stocke un tableau d'objets de type "SectionItem"
  subscription = new Subscription();    //variable qui stocke une instance de la classe "Subscription" pour gérer des observables.
  
  /*Resize the scheduler*/
  sectionwidth=0;
  prevright=0;
  currright=0;
  itemHold: Item[]=[];  

  iTask : ITask[];
  tasks: Observable<Array<ITask>>;
  constructor(
              private changeDetector: ChangeDetectorRef,
              private service: NgxTimeSchedulerService,
              private taskService: TaskService,
              public dialog: MatDialog             
  ) {
  
    moment.locale(this.locale);
  }

/**
 *  Dialog Overview
 */
getTasks() {
  this.taskService.getTaskList().subscribe(
    (d) => {
      this.iTask = d;
    },
    (error) => {
      console.error(error);
    }
  ); ;
}

onOpenDialog(task: ITask) {
  const dialogRef = this.dialog.open(AddComponent, {
    data: this.iTask[0] ,
  });

  dialogRef.afterClosed().subscribe((result) => {
    this.getTasks();
    this.refreshEmitter.emit(true);
  });
  
}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sections']) {
      this.setSectionsInSectionItems();
    }
  }

  ngOnInit(): void {
    this.getTasks();
    this.transferItem();
    this.setSectionsInSectionItems();
    this.changePeriod(this.periods[0], false);
    this.itemPush();
    this.itemPop();
    this.itemRemove();
    this.sectionPush();
    this.sectionPop();
    this.sectionRemove();
    this.refresh();

  }
  transferItem(){
    //transfer items defined in app to this library
    this.itemHold=this.items;
  }
  
  /*Appelle la méthode "changePeriod()" avec le paramètre "currentPeriod" pour changer la période en cours
   avec la valeur actuelle de "currentPeriod" et en passant "false" comme deuxième paramètre pour indiquer
    que la période ne doit pas être modifiée.*/
  refreshView() {
    this.setSectionsInSectionItems();
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

      this.itemHold.filter(i=>{
        let itemMeta = new ItemMeta();

        if (i.sectionID === ele.section.id) {
          itemMeta.item = i;
          if (itemMeta.item.start <= this.end && itemMeta.item.end >= this.start) {
            itemMeta = this.itemMetaCal(itemMeta);
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
          const prevElemBottom = prevElem.cssTop + this.minRowHeight;
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
         // prev = 0;
          }
        }

        elemBottom = elem.cssTop + this.minRowHeight + 1;
        if (this.sectionItems[Number(prop)] && elemBottom > this.sectionItems[Number(prop)].minRowHeight) {
          this.sectionItems[Number(prop)].minRowHeight = elemBottom;
        }
      }
    }
  }

  changePeriod(period: Period, userTrigger: boolean = true) {
    this.currentPeriod = period;
    const _start = this.start;
    this.end = moment(_start).add(this.currentPeriod.timeFrameOverall, 'minutes').endOf('day');
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
    this.showCurrentTimeIndicator();
  }

  showCurrentTimeIndicator = () => {
    if (this.ShowCurrentTimeHandle) {
      clearTimeout(this.ShowCurrentTimeHandle);
    }

    const currentTime = moment();
    if (currentTime >= this.start && currentTime <= this.end) {
      this.currentTimeVisibility = 'visible';
      this.currentTimeIndicatorPosition = (
        (Math.abs(this.start.diff(currentTime, 'minutes')) / this.currentPeriodMinuteDiff) * 100
      ) + '%';
      this.currentTimeTitle = currentTime.format(this.currentTimeFormat);
    } else {
      this.currentTimeVisibility = 'hidden';
    }
    this.ShowCurrentTimeHandle = setTimeout(this.showCurrentTimeIndicator, 30000);
  }

  gotoToday() {
    this.start = moment().startOf('day');
    this.changePeriod(this.currentPeriod);
  }

  nextPeriod() {
    this.start.add(this.currentPeriod.timeFrameOverall, 'minutes');
    this.changePeriod(this.currentPeriod);
  }

  previousPeriod() {
    this.start.subtract(this.currentPeriod.timeFrameOverall, 'minutes');
    this.changePeriod(this.currentPeriod);
  }

  gotoDate(event: any) {
    this.showGotoModal = false;
    this.start = moment(event).startOf('day');
    this.changePeriod(this.currentPeriod);
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
   //event.item.data.sectionID = event.container.data.id;
    this.refreshView();
    this.events.ItemDropped(event.item.data);
  }

  itemPush() {
    this.subscription.add(this.service.itemAdd.asObservable().subscribe((item: Item) => {
      this.items.push(item);
      this.refreshView();
    }));
  }

  itemPop() {
    this.subscription.add(this.service.item.asObservable().subscribe(() => {
      this.items.pop();
      this.refreshView();
    }));
  }

  itemRemove() {
    this.subscription.add(this.service.itemId.asObservable().subscribe((itemId: number) => {
      this.items.splice(this.items.findIndex((item) => {
        return item.id === itemId;
      }), 1);
      this.refreshView();
    }));
  }

  sectionPush() {
    this.subscription.add(this.service.sectionAdd.asObservable().subscribe((section: Section) => {
      this.sections.push(section);
      this.refreshView();
    }));
  }

  sectionPop() {
    this.subscription.add(this.service.section.asObservable().subscribe(() => {
      this.sections.pop();
      this.refreshView();
    }));
  }

  sectionRemove() {
    this.subscription.add(this.service.sectionId.asObservable().subscribe((sectionId: number) => {
      this.sections.splice(this.sections.findIndex((section) => {
        return section.id === sectionId;
      }), 1);
      this.refreshView();
    }));
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

  
  async onResizeEnd(event: ResizeEvent,itemmeta) {
    
    // console.log('Element was resized' +  JSON.stringify(event) + " , itemmeta "+ JSON.stringify(itemmeta) + " , section "+ JSON.stringify(sectionitem));
     //find out previous and current 
     this.currright =  Number(event.rectangle.right);
     let cursorMoved=this.currright- this.prevright;
     let datesMoved= (cursorMoved/this.sectionwidth);
     var movedEndDt;
     //console.log("Units moved "+ Math.ceil(datesMoved));
     //add end date to itemmeta;
     await this.calcEndLoction(itemmeta,datesMoved);
     this.events.ItemResizedEnd(itemmeta.item,itemmeta.item.start,movedEndDt);
   }
 
   async calcEndLoction(itemmeta,datesMoved){
     return new Promise(  (res, rej)  => {
       var movedEndDt;
       for(let i=0;i<=this.itemHold.length;i++){
         //console.log("Itemhold is "+this.itemHold[i].id)
         if(this.itemHold[i].id== itemmeta.item.id){
           //console.log("Found item1- "+this.itemHold[i].end);
           movedEndDt = moment(itemmeta.item.end).add(Math.ceil(datesMoved),'days').endOf('day');
           this.itemHold[i].end = moment(itemmeta.item.end).add(Math.ceil(datesMoved),'days').endOf('day');
           // console.log("Found item2- "+this.itemHold[i].end);
           break;
         }//end of if
       }//end of for  
       this.refreshView();
       //console.log("Calculation done");
       res({'status':'done'})
     });
 
   }
 
   onResizeStart(event: ResizeEvent,itemmeta): void {
     //console.log('Element start resized' +  JSON.stringify(event) + " , itemmeta "+ JSON.stringify(itemmeta) + " , section "+ JSON.stringify(sectionitem));
    let dtstart = moment(itemmeta.item.start);
    let dtend = moment(itemmeta.item.end);
     
    //in case the items are ovelapping
    if(dtstart< this.start){
     dtstart=this.start;
    }
  
    let daysinbtween= Number(dtend.diff(dtstart,'days') +1);
    //console.log("days in between are-"+daysinbtween);
    let rectwwidth= Number(event.rectangle.width);
    //console.log("Rect width is "+rectwwidth + " , each sec is "+ (rectwwidth/daysinbtween));
    //to calculate how far the item was dragged
    this.sectionwidth=rectwwidth/daysinbtween;
    this.prevright =  Number(event.rectangle.right);
   // this.events.ItemResizeStart(itemmeta.item);
   }



   test(sectionItem : any){
    console.log("++++++++++++++++++++++++++++sectionItem++++++++++++++++++++++++")

     console.log(sectionItem)
   }
}