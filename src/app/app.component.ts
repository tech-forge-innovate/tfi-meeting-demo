import {Component} from '@angular/core';
import {MeetingService} from './meeting.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ScrollPanel} from "primeng/scrollpanel";
import {Card} from "primeng/card";
import {UIChart} from "primeng/chart";
import {Divider} from "primeng/divider";
import {TableModule} from "primeng/table";
import {RecipientType} from "@tech-forge-innovate/tfi-chat-sdk";

interface Poll {
  id: string;
  roomId: string;
  question: string;
  options: string[];
  published: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

@Component({
  selector: 'app-root',
  imports: [
    InputTextModule,
    ButtonModule,
    FormsModule,
    NgIf,
    ScrollPanel,
    NgClass,
    NgForOf,
    Card,
    UIChart,
    Divider,
    TableModule
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  email: string | null = null;
  name: string | null = null;
  showInput = false;
  inputEmail = '';
  inputName = '';
  poll?: Poll;
  polls: Poll[] = [];
  voted = false;
  waitingForResult = false;
  pollResult: any = null;
  votes = [
    { option: 'Angular', count: 25 },
    { option: 'React', count: 15 },
    { option: 'Vue', count: 10 }
  ];

  basicData: any;
  basicOptions: any;


  constructor(private meetingService: MeetingService) {}

  ngOnInit() {
    this.prepareChartData();
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    if (!this.email || !this.name) {
      this.showInput = true;
    } else {
      setTimeout(() => {
        this.connectToRoom();
      }, 2000);
    }
  }

  onSubmit() {
    if (this.inputEmail && this.inputName) {
      localStorage.setItem('email', this.inputEmail);
      localStorage.setItem('name', this.inputName);
      this.email = this.inputEmail;
      this.name = this.inputName;
      this.showInput = false;
      this.connectToRoom();
    }
  }

  private connectToRoom() {
    setTimeout(() => {
      this.meetingService.client!.connectToRoom({
        name: this.name!,
        participantType: 'participant',
        email: this.email!
      }).then((participant) => {
        console.log('Connected to room successfully');
        this.participantId = participant.id;
        this.meetingService.client!.getAllPolls().then((polls) => {
          console.log(polls);
          this.polls = [...polls  as unknown as Poll[]];
        })
        this.meetingService.client!.onChatMessage(msg => {
          this.messages.push(msg as any);
        });
        this.meetingService.client!.onPollStart((poll: any) => {
          this.poll = poll;
          this.voted = false;
          this.waitingForResult = false;
          this.pollResult = null;
        });
        this.meetingService.client!.onPollResult((result: any) => {
          this.waitingForResult = false;
          this.pollResult = result;
          this.updateChartWithResult(result);
        });
      }).catch((error) => {
        console.error('Error connecting to room:', error);
      });
    });
  }


  messages: any[] = [];

  inputMessage = '';
  participantId = '123'; // This should come from your `connectToRoom()` method

  sendMessage() {
    if (!this.inputMessage.trim()) return;
    this.meetingService.client!.sendChatMessage({
      message: this.inputMessage,
      messageType: 'text',
    }, RecipientType.ROOM).then(r => {
      console.log('Message sent successfully:', r);
    });
    this.inputMessage = '';
  }

  vote(selectedOption: string) {
    this.voted = true;
    this.waitingForResult = true;
    this.meetingService.client!.sendVote({
      option: selectedOption,
      pollId: this.poll!.id,
    }).then(r => {});
  }

  updateChartWithResult(result: any) {
    // result.options: [{ option: string, count: number }]
    const labels = result.results.map((o: any) => o.option);
    const data = result.results.map((o: any) => o.count);

    this.basicData = {
      labels,
      datasets: [
        {
          label: 'Votes',
          backgroundColor: '#42A5F5',
          data
        }
      ]
    };
  }

  prepareChartData() {
    const labels = this.votes.map(v => v.option);
    const data = this.votes.map(v => v.count);

    this.basicData = {
      labels,
      datasets: [
        {
          label: 'Votes',
          backgroundColor: '#42A5F5',
          data
        }
      ]
    };

    this.basicOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    };
  }

  publishPoll(pollId: string) {
    this.meetingService.client!.publishPoll(pollId).then(r => {});
  }

  publishPollResult(pollId: string) {
    this.meetingService.client!.publishResult(pollId).then(r => {});
  }
}
