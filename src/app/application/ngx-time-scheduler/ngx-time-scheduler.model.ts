import * as moment from 'moment';

/*class Period: Représente une période de temps avec des propriétés telles que le nom, les classes CSS, la durée de la période,
 les en-têtes de temps, et les informations de tooltip optionnelles.*/
export class Period {
  name: string;
  classes: string;
  timeFramePeriod: number;
  timeFrameHeaders: string[];
  timeFrameHeadersTooltip?: string[];
  tooltip?: string;
  currentDate?: string[];
}
/*Item: Représente un élément ou une tâche planifiée avec des propriétés telles que l'identifiant, le nom, la date de début,
 la date de fin, les classes CSS, l'identifiant de section parente, et les informations de tooltip optionnelles.*/
export class Item {
  id: number;
  id_task:  string;
  name: string;
  start: moment.Moment;
  end: moment.Moment;
  classes: string;
  sectionID: number;
  tooltip?: string;
}
/*Section: Représente une section ou une catégorie d'éléments dans le planificateur, avec des propriétés telles que l'identifiant,
 le nom, et les informations de tooltip optionnelles.*/
export class Section {
  id: number;
  name: string;
  isEdit?: boolean=true;
  tooltip?: string;
  id_task: number;
}


/*Text: Une classe contenant des textes localisés pour les boutons et les titres du planificateur.*/
export class Text {
  TodayButton: string;
  SectionTitle: string;
  SectionProfile: string;

  constructor() {
 /* Text to use when creating the scheduler */
    this.TodayButton = "Aujourd'hui";
    this.SectionTitle = 'Ressources';
    this.SectionProfile= 'Profil';
  }
}
/*Events: Une classe contenant des définitions de fonctions de rappel pour les événements du planificateur,
 tels que le redimensionnement d'un élément, le déplacement d'un élément, le clic sur un élément ou une section, etc.*/
export class Events {
  [x: string]: any;

  ItemResizedEnd: (item: Item, start: any, end: any) => void;
  ItemResizeStart: (item: Item) => void;
  // ItemResized: (item: Item, start: any, end: any) => void;
  // ItemMovement: (item: Item, start: any, end: any) => void;
  // ItemMovementStart: (item: Item, start: any, end: any) => void;
  // ItemMovementEnd: (item: Item, start: any, end: any) => void;
  ItemDropped: (item: Item) => void;
  ItemClicked: (task: Task, event: MouseEvent) => void;
  ItemContextMenu: (item: Item, event: MouseEvent) => void;
  SectionClickEvent: (section: Section) => void;
  SectionContextMenuEvent: (section: Section, event: MouseEvent) => void;
  PeriodChange: (start: moment.Moment, end: moment.Moment) => void;
  newItemContextMenu:(section:Section, event:MouseEvent)=> void;

}
/*SectionItem: Représente une section avec des informations de présentation, 
telle que la hauteur minimale des lignes et les métadonnées d'éléments associées.*/
export class SectionItem {

  section: Section;
  minRowHeight: number;
  itemMetas: ItemMeta[];

  constructor() {
    this.itemMetas = new Array<ItemMeta>();
  }
}
/*ItemMeta: Représente les métadonnées d'un élément, telles que les classes CSS, 
les positions de style et les largeurs calculées.*/
export class ItemMeta {
  item: Item;
  isStart: boolean;
  isEnd: boolean;
  cssTop: number;
  cssLeft: number;
  cssWidth: number;

  constructor() {
    this.cssTop = 0;
    this.cssLeft = 0;
    this.cssWidth = 0;
  }
}

/*Header et HeaderDetails: Représentent les en-têtes de colonnes dans le planificateur, avec des propriétés 
telles que le nom, le nombre de colonnes fusionnées et les informations de tooltip optionnelles.*/
export class Header {
  headerDetails: HeaderDetails[];

  constructor() {
    this.headerDetails = new Array<HeaderDetails>();
  }
}

export class HeaderDetails {
  name: string;
  colspan: number;
  tooltip?: string;
  fullDate?: string;
  isToday: boolean;
}