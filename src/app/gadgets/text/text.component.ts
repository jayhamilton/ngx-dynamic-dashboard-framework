import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { marked } from 'marked';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { GadgetHeaderComponent } from '../common/gadget-common/gadget-header/gadget-header.component';

// Narrative/story gadget: renders a block of author-supplied markdown as
// HTML. Angular's [innerHTML] binding runs its own built-in sanitizer, so
// this doesn't need (and shouldn't add) an explicit DomSanitizer bypass.
@Component({
    selector: 'app-text-gadget',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, CdkDrag, GadgetHeaderComponent, MatCardContent]
})
export class TextComponent extends GadgetBase implements OnInit {
  content: string = '';
  renderedHtml: string = '';

  constructor(private eventService: EventService, private boardService: BoardService) {
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
        if (property.key === 'content') {
          this.content = property.value || '';
        }
      });
    });
    this.render();
  }

  private render(): void {
    // marked.parse() is synchronous unless async extensions are registered,
    // which this app doesn't use.
    this.renderedHtml = marked.parse(this.content, { async: false }) as string;
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }

  propertyChangeEvent(propertiesJSON: string) {
    const props = JSON.parse(propertiesJSON);

    if (props.title != undefined) this.title = props.title;
    if (props.subtitle != undefined) this.subtitle = props.subtitle;
    if (props.content != undefined) this.content = props.content;
    this.render();

    this.boardService.savePropertyPageConfigurationToDestination(propertiesJSON, this.instanceId);
  }
}
