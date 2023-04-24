import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_core/_services/token-storage.service';
import { AddFormEventComponent } from './application/add-form-event/add-form-event.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles!: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;

  username!: string;

  constructor(private tokenStorageService: TokenStorageService){}
 
  
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
function openDialog() {
  throw new Error('Function not implemented.');
}

