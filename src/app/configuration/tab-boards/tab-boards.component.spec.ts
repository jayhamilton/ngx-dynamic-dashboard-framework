import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabBoardsComponent } from './tab-boards.component';

describe('TabBoardsComponent', () => {
  let component: TabBoardsComponent;
  let fixture: ComponentFixture<TabBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabBoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
