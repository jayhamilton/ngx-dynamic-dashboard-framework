import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetOperationComponent } from './gadget-operation.component';

describe('GadgetOperationComponent', () => {
  let component: GadgetOperationComponent;
  let fixture: ComponentFixture<GadgetOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GadgetOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
