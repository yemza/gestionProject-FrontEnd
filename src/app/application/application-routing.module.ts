import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponentComponent } from './test-component/test-component.component';
import { ProfileComponent } from '../_shared/profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { CalenderComponent } from './calender/calender.component';
import { AffaireUploadComponent } from './import/AffaireUploadComponent';
import { AuthGuard } from '../_core/interceptor/auth.guard';

const routes: Routes = [

   {path : "" , component: TestComponentComponent},
  { path: 'calendar', component: CalenderComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'import', component: AffaireUploadComponent },
  { path: 'user', component: BoardUserComponent, },
  { path: 'admin', component: BoardAdminComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
 
}) 
export class ApplicationRoutingModule { }
