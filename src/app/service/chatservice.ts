import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
interface Message {
  sender: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class Chatservice {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  //Start One to One
  joinRoom(roomId: string): void {
    this.socket.emit('join', roomId);
  }

  sendMessage(data: { roomId: string; sender: string; message: string }): void {
    this.socket.emit('sendMessage', data);
  }

  receiveMessages(): Observable<Message> {
    return new Observable<Message>((observer) => {
      const handler = (data: Message | Message[]) => {
        if (Array.isArray(data)) {
          data.forEach((msg) => observer.next(msg));
        } else {
          observer.next(data);
        }
      };

      this.socket.on('receiveMessage', handler);

      // Cleanup to prevent multiple subscriptions
      return () => {
        this.socket.off('receiveMessage', handler);
      };
    });
  }
  // End One to One

  // Start One to One 
   joinGroupRoom(groupId: number, username: string) {
    this.socket.emit('joinGroupRoom', { groupId, username });
  }

  sendGroupMessage(groupId: number, sender: string, message: string) {
    this.socket.emit('sendGroupMessage', { groupId, sender, message });
  }

  onReceiveMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receiveMessage', data => observer.next(data));
    });
  }

  onUnauthorized(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('unauthorized', () => observer.next('unauthorized'));
    });
  }
  emitUserOnline(username: string) {
  this.socket.emit('userOnline', username);
}

listenOnlineUsers() {
  return new Observable<string[]>(observer => {
    this.socket.on('onlineUsers', (data: string[]) => {
      observer.next(data);
    });
  });
}
}
