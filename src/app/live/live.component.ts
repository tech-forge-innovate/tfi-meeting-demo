import {Component, ElementRef, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import flvjs from 'flv.js';

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
    autoplay: boolean,
    src: string,
    type: string,
  };

  flvPlayer: flvjs.Player | null = null;


  constructor(
    private elementRef: ElementRef,
  ) {
    this.options = {
      autoplay: true,
      src: 'https://webinar-cdn.techforgeinnovate.com/my-secret-key.flv',
      type: 'flv',
    };
  }

  ngOnInit() {
    if (flvjs.isSupported()) {
      this.flvPlayer = flvjs.createPlayer({
        type: this.options.type,
        url: this.options.src,
      });
      this.flvPlayer.attachMediaElement(this.target.nativeElement);
      this.flvPlayer.load();
      if (this.options.autoplay) {
        this.flvPlayer.play();
      }
    }
  }

  // Dispose the player OnDestroy
  ngOnDestroy() {
    if (this.flvPlayer) {
      this.flvPlayer.destroy();
      this.flvPlayer = null;
    }
  }
}
