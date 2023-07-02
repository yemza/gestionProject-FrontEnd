import { Component, ViewEncapsulation } from '@angular/core';
import { PreloaderService } from 'src/app/_core/_services/preloader.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom

})
export class SpinnerComponent {
  constructor(public Preloader : PreloaderService){}
}
