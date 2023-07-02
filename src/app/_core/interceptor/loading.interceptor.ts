import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PreloaderService } from '../_services/preloader.service';


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(
    private Preloading: PreloaderService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('caught')
    this.totalRequests++;
    this.Preloading.setLoading(true);
    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests == 0) {
          this.Preloading.setLoading(false);
        }
      })
    );
  }
}