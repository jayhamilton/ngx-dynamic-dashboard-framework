import { DataSource } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';


export interface ComponentItem {
  id: number;
  measure: number;
  description: string;
  product: string;

}

const ELEMENT_DATA: ComponentItem[] = [
  { id: 28462800, measure: 1.00, description: 'Rouge D\'Armani Beige 103', product: 'Armani'},
  { id: 61490200, measure: 1.00, description: 'Rouge D\'Armani Rouge 400', product: 'Armani'},
];
@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    standalone: false
})
export class ProductComponent extends GadgetBase implements OnInit {


  options: UntypedFormGroup;
  hideRequiredControl = new UntypedFormControl(false);
  floatLabelControl = new UntypedFormControl('auto');


  constructor( fb: UntypedFormBuilder, private eventService: EventService, private boardService: BoardService) {
    super();
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
  }

  ngOnInit(): void {}

  displayedColumns: string[] = ['id',  'measure', 'description', 'tools'];
  displayedColumns2: string[] = ['id',  'measure', 'description'];
  dataToDisplay = [...ELEMENT_DATA];

  dataSource = new ExampleDataSource(this.dataToDisplay);

  addData() {
    const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    this.dataToDisplay = [...this.dataToDisplay, ELEMENT_DATA[randomElementIndex]];
    this.dataSource.setData(this.dataToDisplay);

    this.create("test");
  }

  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
  }

  create(name: string) {
    if (name !== '') {
    }
  }

  edit(name: string) {
    "";
  }

  remove(){
    this.eventService.emitGadgetDeleteEvent({data: this.instanceId});

  }
  propertyChangeEvent(propertiesJSON: string) {
    //update internal props
    const updatedPropsObject = JSON.parse(propertiesJSON);

    if (updatedPropsObject.title != undefined) {
      this.title = updatedPropsObject.title;
    }
    if (updatedPropsObject.subtitle != undefined) {
      this.subtitle = updatedPropsObject.subtitle;
    }

    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }
}

class ExampleDataSource extends DataSource<ComponentItem> {
  private _dataStream = new ReplaySubject<ComponentItem[]>();

  constructor(initialData: ComponentItem[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<ComponentItem[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: ComponentItem[]) {
    this._dataStream.next(data);
  }


}
