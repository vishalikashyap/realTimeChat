import { Component } from '@angular/core';
import { Chat } from '../../chat/chat';
import { CommonModule } from '@angular/common';
import { Profile } from "../profile/profile";
import { Notifications } from "../notifications/notifications";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Chat, CommonModule, Profile, Notifications],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  activeTab: string = 'profile';
  currentUser:string;
constructor(){
  const authData = JSON.parse(localStorage.getItem('authData') || '{}');
  this.currentUser = authData.user?.username;
}
  setActive(tab: string) {
    this.activeTab = tab;
  }
  logout() {
    localStorage.clear(); 
    window.location.href = 'auth/login';
  }
}
