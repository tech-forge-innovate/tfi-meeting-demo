import {Component, ElementRef, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import  videojs from 'video.js';

@Component({
  selector: 'app-live',
  imports: [],
  templateUrl: './live.component.html',
  styleUrl: './live.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class LiveComponent {
  @ViewChild('target', {static: true}) target!: ElementRef;

  // See options: https://videojs.com/guides/options
  @Input() options!: {
    fluid: boolean,
    aspectRatio: string,
    autoplay: boolean,
    sources: {
      src: string,
      type: string,
    }[],
  };

  player: any;

  constructor(
    private elementRef: ElementRef,
  ) {
    this.options = {
      fluid: true,
      aspectRatio: '16:9',
      autoplay: true,
      sources: [
        {
          src: 'https://webinar-cdn.techforgeinnovate.com/0/stream.m3u8',
          type: 'application/x-mpegURL',
        },
      ],
    }
  }

  // Instantiate a Video.js player OnInit
  ngOnInit() {
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });
  }

  // Dispose the player OnDestroy
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
