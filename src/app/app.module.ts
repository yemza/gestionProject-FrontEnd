import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './_core/core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_core/interceptor/auth.interceptor';
import { NgxTimeSchedulerModule } from './application/ngx-time-scheduler/ngx-time-scheduler.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmationDialogComponent } from './application/task/confirmation-dialog/confirmation-dialog.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';

@NgModule({
  declarations: [
    AppComponent,

  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    AppRoutingModule,
    NgxTimeSchedulerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgScrollbarModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class AppModule { }
