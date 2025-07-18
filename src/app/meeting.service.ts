import { Injectable } from '@angular/core';
import {RoomClient} from "tfi-chat-sdk";

@Injectable({
  providedIn: 'root'
}) 
export class MeetingService {
  client: RoomClient | null = null;
  constructor() {
    this.client = new RoomClient({
      apiHost: '<API HOST>', // Replace with your actual API host
      roomId: '<ROOM ID>', // Replace with your actual room ID
      websocketKey: '<WS KEY>', // Replace with your actual WebSocket key
      apiKey: '',
    });
    this.client.onChatMessage((message: any) => {
      console.log('Received chat message:', message);
    });
  }
} 
