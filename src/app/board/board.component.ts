import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {

  columns = [
    {
      width: 30,
      gadgetNames:['image1', 'image2'],
      gadgets: [
        {
          name: 'image1',
        },
        {
          name: 'image2',
        },
      ],
    },
    {
      width: 30,
      gadgetNames:['image3', 'image4'],
      gadgets: [
        {
          name: 'image3',
        },
        {
          name: 'image4',
        },
      ],
    },
    {
      width: 30,
      gadgetNames:['image5', 'image6'],
      gadgets: [
        {
          name: 'image5',
        },
        {
          name: 'image6',
        },
      ],
    }
  ];

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
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
  }

  getImage(colIdx: number, gadgetIdx: number){
    return "/assets/images/img" + gadgetIdx;
  }
}
