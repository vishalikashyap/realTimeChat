import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  user : any;
  constructor(){
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    this.user = authData.user;
  }
}
