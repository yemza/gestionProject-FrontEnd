import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SharedModule } from '../_shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingInterceptor } from './interceptor/loading.interceptor';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
  

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
  },
  {
    provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
  },
 
]
})
export class CoreModule { }
