import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class Notifications {
  notifications = [
    {
      name: 'Alex Standll',
      message: 'Hey, is the design completed ?',
      time: '2 hr ago',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Mona Griffin',
      message: 'What’s the project report update ?',
      time: '2 hr ago',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  ];
}
