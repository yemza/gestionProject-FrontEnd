import { NgModule } from '@angular/core';
import { NgxTimeSchedulerComponent } from './ngx-time-scheduler.component';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';
import { SharedModule } from 'src/app/_shared/shared.module';

@NgModule({
  declarations: [NgxTimeSchedulerComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ResizableModule,
    SharedModule
  ],
  exports: [NgxTimeSchedulerComponent]
})
export class NgxTimeSchedulerModule { }