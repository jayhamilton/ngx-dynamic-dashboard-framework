import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { GadgetHeaderComponent } from '../common/gadget-common/gadget-header/gadget-header.component';

// Matches an 11-char YouTube video ID out of any of the URL shapes YouTube
// hands out (watch?v=, youtu.be/, /embed/, /shorts/). The video ID itself is
// never trusted verbatim into the iframe src — the embed URL below is always
// rebuilt from the extracted ID, and VALID_ID further constrains its charset.
const YOUTUBE_URL_PATTERN =
  /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&/].*)?$/;
const VALID_ID = /^[A-Za-z0-9_-]{11}$/;

@Component({
    selector: 'app-video-gadget',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, CdkDrag, GadgetHeaderComponent, MatCardContent]
})
export class VideoComponent extends GadgetBase implements OnInit {
  videoUrl: string = '';
  autoplay: boolean = false;
  embedUrl: SafeResourceUrl | null = null;

  constructor(
    private eventService: EventService,
    private boardService: BoardService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadProperties();
  }

  override initializeConfiguration(gadgetData: any) {
    super.initializeConfiguration(gadgetData);
    this.loadProperties();
  }

  private loadProperties(): void {
    if (!this.propertyPages) return;
    this.propertyPages.forEach((page) => {
      page.properties.forEach((property: any) => {
        if (property.key === 'videoUrl') this.videoUrl = property.value || '';
        if (property.key === 'autoplay') this.autoplay = !!property.value;
      });
    });
    this.render();
  }

  private render(): void {
    const videoId = this.extractVideoId(this.videoUrl);
    if (!videoId) {
      this.embedUrl = null;
      return;
    }
    const params = this.autoplay ? '?autoplay=1&mute=1' : '';
    // youtube-nocookie.com defers tracking cookies until playback starts.
    const url = `https://www.youtube-nocookie.com/embed/${videoId}${params}`;
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private extractVideoId(input: string): string | null {
    const trimmed = input.trim();
    const urlMatch = trimmed.match(YOUTUBE_URL_PATTERN);
    if (urlMatch) return urlMatch[1];
    // Also accept a bare video ID pasted without a surrounding URL.
    return VALID_ID.test(trimmed) ? trimmed : null;
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }

  propertyChangeEvent(propertiesJSON: string) {
    const props = JSON.parse(propertiesJSON);

    if (props.title != undefined) this.title = props.title;
    if (props.subtitle != undefined) this.subtitle = props.subtitle;
    if (props.videoUrl != undefined) this.videoUrl = props.videoUrl;
    if (props.autoplay != undefined) this.autoplay = !!props.autoplay;
    this.render();

    this.boardService.savePropertyPageConfigurationToDestination(propertiesJSON, this.instanceId);
  }
}
