import { Injectable } from '@angular/core';
import {ChatMessage, RoomClient} from "@tech-forge-innovate/tfi-chat-sdk";


@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  client: RoomClient | null = null;
  constructor() {
    this.client = new RoomClient({
      apiHost: 'http://localhost:3005', // Replace with your actual API host
      roomId: '36c70283-d426-4c7d-a78e-a685c8f19811', // Replace with your actual room ID
      websocketKey: 'd8f3321eew5f3218xwse0f12e3c4d5', // Replace with your actual WebSocket key
      apiKey: '',
    });
    this.client.onChatMessage((message: ChatMessage) => {
      console.log('Received chat message:', message);
    });
  }
} 
