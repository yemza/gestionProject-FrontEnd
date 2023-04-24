import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponentComponent } from './test-component/test-component.component';
import { ProfileComponent } from '../_shared/profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { CalenderComponent } from './calender/calender.component';
import { HomeComponent } from './home/home.component';
import { AddComponent } from './task/add/add.component';

const routes: Routes = [

   {path : "" ,
   component: TestComponentComponent},
  { path: 'calendar', component: CalenderComponent},
 // { path: 'AddTask', component: AddComponent},
  {
    path: 'task',
    children: [{path: 'add',component: AddComponent,}, ], },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'mod', component: BoardModeratorComponent },
  { path: 'admin', component: BoardAdminComponent },
 // { path: 'home', redirectTo: 'home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
