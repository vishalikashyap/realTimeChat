import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chatservice } from '../service/chatservice';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as bootstrap from 'bootstrap';
import { FilterPipe } from '../filter.pipe';
 import { PickerModule } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule,PickerModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnDestroy {
  message = '';
  messages: { sender: string; message: string; created_at: any }[] = [];
  groupedMessages: any[] = [];

  users: any[] = [];
  groups: any[] = [];
  onlineUsers: string[] = [];

  currentUser = '';
  selectedUser: any;
  chatType: 'one_to_one' | 'group' = 'one_to_one';
  roomId = '';
  groupId = 0;

  groupName = '';
  selectedMembers: string[] = [];
  searchText = '';

  suggestions: string[] = [
  'Hello 👋',
  'How are you?',
  'What’s up?',
  'Let’s meet at 5 PM',
  'Good morning!',
  'Thank you!',
  'See you soon 😊'
];
filteredSuggestions: string[] = [];


  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private chatService: Chatservice) {}

  get receiverName(): string {
    return this.chatType === 'one_to_one'
      ? this.selectedUser?.username
      : this.selectedUser?.group_name;
  }

  ngOnInit() {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    this.currentUser = authData.user?.username;

    this.chatService.emitUserOnline(this.currentUser);

    this.chatService
      .listenOnlineUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.onlineUsers = users;
      });

    this.listenForMessages();
    this.getUsers();
    this.getGroups();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUsers() {
    this.http.get<any[]>('http://localhost:3000/auth/users').subscribe(data => {
      this.users = data.filter(user => user.username !== this.currentUser);
      if (this.users.length > 0) {
        this.selectUser(this.users[0], 'one_to_one');
      }
    });
  }

  getGroups() {
    this.http.get<any[]>(`http://localhost:3000/api/${this.currentUser}`).subscribe({
      next: res => (this.groups = res),
      error: err => console.error('Error fetching groups:', err),
    });
  }

  listenForMessages() {
    this.chatService
      .receiveMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (Array.isArray(data)) {
          this.messages = data;
        } else {
          this.messages.push(data);
        }
        this.groupMessagesByDate();
        this.scrollToBottom();
      });
  }

  groupMessagesByDate() {
    const grouped: { [date: string]: any[] } = {};

    this.messages.forEach(msg => {
      const date = new Date(msg.created_at).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(msg);
    });

    this.groupedMessages = Object.entries(grouped).map(([date, messages]) => ({
      date,
      messages,
    }));
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatBox = document.getElementById('chatBox');
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
  }

  sendMessage() {
    const trimmed = this.message.trim();
     this.showEmojiPicker = false;
    if (!trimmed) return;

    if (this.chatType === 'one_to_one') {
      const payload = {
        roomId: this.roomId,
        sender: this.currentUser,
        message: trimmed,
      };
      this.chatService.sendMessage(payload);
    } else {
      this.chatService.sendGroupMessage(this.groupId, this.currentUser, trimmed);
    }

    this.message = '';
  }
filterUsers(searchText:any) {
  const search = searchText.toLowerCase();
  console.log(search,"s")
  if(search !=''){
    console.log("hiiiiiiiiiiiiiiiiiii")
 this.users=this.users.filter(user =>
    user.username.toLowerCase().includes(search)
  );
}else{
   console.log("hiiiiiiiiiiiiiiiiiii__________________hiiiiiiiiiiiiiiiiiiiii")
this.getUsers()
}
  console.log(this.users)
}
  selectUser(user: any, type: 'one_to_one' | 'group') {
    this.chatType = type;
    this.message='';
    this.messages = [];
    this.groupedMessages = [];
    this.showEmojiPicker = false;
    if (type === 'one_to_one') {
      this.selectedUser = user;
      this.roomId = this.generateRoomId(this.currentUser, user.username);
      this.chatService.joinRoom(this.roomId);
    } else {
      this.selectedUser = user;
      this.groupId = user.group_id;
      this.chatService.joinGroupRoom(this.groupId, this.currentUser);
    }
  }

  generateRoomId(user1: string, user2: string): string {
    return [user1, user2].sort().join('_');
  }

  toggleUserSelection(username: string) {
    const index = this.selectedMembers.indexOf(username);
    if (index > -1) {
      this.selectedMembers.splice(index, 1);
    } else {
      this.selectedMembers.push(username);
    }
  }

  createGroup() {
    if (!this.groupName || this.selectedMembers.length === 0) {
      alert('Please enter group name and select at least one member.');
      return;
    }

    if (!this.selectedMembers.includes(this.currentUser)) {
      this.selectedMembers.push(this.currentUser);
    }

    const groupPayload = {
      group_name: this.groupName,
      created_by: this.currentUser,
      members: this.selectedMembers,
    };

    this.http.post('http://localhost:3000/api/groups/create', groupPayload).subscribe({
      next: () => {
        alert(`Group "${this.groupName}" created successfully!`);
        this.groupName = '';
        this.selectedMembers = [];
        this.getGroups();

        const modalElement = document.getElementById('groupModal');
        if (modalElement) {
          const instance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
          instance.hide();
        }
      },
      error: err => {
        console.error('Error creating group:', err);
        alert('Failed to create group.');
      },
    });
  }

showEmojiPicker = false;

toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
}

addEmoji(event: any) {
  this.message += event.emoji.native;
}
onEmojiSelect(event: any) {
  console.log('Selected emoji:', event);
}

startAudioCall() {
  console.log('Audio call started with', this.receiverName);
  // Add call logic here
}

startVideoCall() {
  console.log('Video call started with', this.receiverName);

}
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    console.log('Selected file:', file);
  
  }
}

// Filter suggestions based on input
filterSuggestions(input: string): void {
  if (!input) {
    this.filteredSuggestions = [];
    return;
  }

  const lowerInput = input.toLowerCase();
  this.filteredSuggestions = this.suggestions
    .filter(s =>
      s.toLowerCase().includes(lowerInput) &&
      s.toLowerCase() !== lowerInput
    )
    .slice(0, 5);
}

// Select a suggestion from list
selectSuggestion(suggestion: string): void {
  this.message = suggestion;
  this.filteredSuggestions = [];
}

}
