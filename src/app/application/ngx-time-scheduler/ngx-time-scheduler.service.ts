import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Item, Section} from './ngx-time-scheduler.model';

@Injectable({
  providedIn: 'root'
})
export class NgxTimeSchedulerService {

  public item = new Subject<Item>();
  public itemAdd = new Subject<Item>();
  public itemId = new Subject<number>();
  public section = new Subject<Section>();
  public sectionId = new Subject<number>();
  public refreshView = new Subject();

  constructor() {
  }

  public itemPush(item: Item): void {
    this.itemAdd.next(item);
  }

  public refresh(): void {
    this.refreshView.next(null);
  }
 
  
}