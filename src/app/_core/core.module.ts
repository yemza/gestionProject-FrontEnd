import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SharedModule } from '../_shared/shared.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,

  ],
  providers: [AuthInterceptor]
})
export class CoreModule { }
