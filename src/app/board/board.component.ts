import { AfterViewChecked, AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { BoardService } from './board.service';
import { ImageComponent } from '../gadgets/image/image.component';
import { BoardGridDirective } from './boardgrid.directive';
import { ProductComponent } from '../gadgets/product/product.component';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit{

  @ViewChild(BoardGridDirective, {static: true}) gadgetGridHost!: BoardGridDirective;

  boardData: any;

  constructor(private boardService: BoardService, private componentFactoryResolver: ComponentFactoryResolver) {
    this.boardData = this.boardService.getDefaultData();
  }

  ngOnInit(): void {
    this.createGadgetInstance();
  }

  drop(event: CdkDragDrop<string[]>) {
    //console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.updateDataModel(event.container, event.previousContainer);
  }

  createGadgetInstance(){

    const gridHost = this.gadgetGridHost.viewContainerRef;
    gridHost.clear();

    //todo create a gadget based on the incoming data
    gridHost.createComponent(ProductComponent);
    gridHost.createComponent(ImageComponent);


    //set instance config

  }

  getColumnIndexAsString(idx: number) {
    return '' + idx;
  }

  updateDataModel(container: CdkDropList, previousContainer: CdkDropList) {
    let cIdx = parseInt(container.id);
    let pIdx = parseInt(previousContainer.id);

    //this means a component was moved from one column to another
    if (cIdx != pIdx) {
      this.boardData[pIdx].gadgetNames = previousContainer.data;
    }

    this.boardData[cIdx].gadgetNames = container.data;

    //persist the change
    this.boardService.write(this.boardData);
  }
}
