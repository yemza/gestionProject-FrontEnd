import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRoutingModule } from './application-routing.module';
import { SharedModule } from '../_shared/shared.module';
import { TestComponentComponent } from './test-component/test-component.component';
import { AddFormEventComponent } from './add-form-event/add-form-event.component';
import { NgxTimeSchedulerModule } from './ngx-time-scheduler/ngx-time-scheduler.module';
import { ProfileComponent } from '../_shared/profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { CalenderComponent } from './calender/calender.component';
import { HomeComponent } from './home/home.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { ShowComponent } from './task/show/show.component';
import { AddComponent } from './task/add/add.component';
import { ListComponent } from './task/list/list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    TestComponentComponent,
    AddFormEventComponent,
    CalenderComponent,
    HomeComponent,
    ProfileComponent ,
    BoardUserComponent ,
    BoardModeratorComponent ,
    BoardAdminComponent ,
    AddComponent,
    ShowComponent,
    ListComponent,
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    SharedModule,
    NgxTimeSchedulerModule,
    MatDialogModule,
    MatNativeDateModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
  ],

  exports: [
    HomeComponent,
    ReactiveFormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,

  ], providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }]
})
export class ApplicationModule { }
