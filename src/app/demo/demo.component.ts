import {Component} from '@angular/core';
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
import {RouterOutlet} from "@angular/router";
import {MeetingService} from "../meeting.service";

interface Poll {
  id: string;
  roomId: string;
  question: string;
  options: {
    value: string,
    id: string
  }[];
  published: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

@Component({
  selector: 'app-demo',
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
    TableModule,
  ],
  standalone: true,
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
})
export class DemoComponent {
  email: string | null = null;
  name: string | null = null;
  showInput = false;
  inputEmail = '';
  inputName = '';
  poll?: Poll;
  polls: Poll[] = [];
  voted = false;
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
          this.pollResult = null;
        });
        this.meetingService.client!.onPollResult((result: any) => {
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
    }, RecipientType.HOST).then(r => {
    });
    this.inputMessage = '';
  }

  vote(selectedOption: {
    id: string,
    value: string
  }) {
    this.voted = true;
    this.meetingService.client!.sendVote({
      option: selectedOption,
      pollId: this.poll!.id,
    }, (updates) => {
      // Update chart immediately with live updates
      const labels = this.poll?.options.map(o => o.value);
      const data = this.poll?.options.map(o => updates.counts[o.id]);
      this.updateChartWithResult({
        labels, data
      });
      // Optionally, store the latest counts as pollResult if needed elsewhere
      this.pollResult = { labels, data };
    }).then(r => {});
  }

  updateChartWithResult(result: any) {
    this.basicData = {
      labels: result.labels,
      datasets: [
        {
          label: 'Votes',
          backgroundColor: '#42A5F5',
          data: result.data
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
