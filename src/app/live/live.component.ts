import {Component, ElementRef, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {VideoPlayer} from "@tech-forge-innovate/tfi-chat-sdk";

@Component({
  selector: 'app-live',
  imports: [],
  templateUrl: './live.component.html',
  styleUrl: './live.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class LiveComponent {
  @ViewChild('target', {static: true}) target!: ElementRef<HTMLVideoElement>;

  constructor(
    private elementRef: ElementRef,
  ) {

  }

  ngOnInit() {
    const player = new VideoPlayer({
      videoElement: this.target.nativeElement,
      webinarId: 'my-secret-key',
      autoplay: true,
      fallbackImage: 'https://images.unsplash.com/photo-1515542706656-8e6ef17a1521?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHpvb20lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww'
    });
  }

  // Dispose the player OnDestroy
  ngOnDestroy() {

  }
}
