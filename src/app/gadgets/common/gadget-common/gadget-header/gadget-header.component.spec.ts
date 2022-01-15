import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetHeaderComponent } from './gadget-header.component';

describe('GadgetHeaderComponent', () => {
  let component: GadgetHeaderComponent;
  let fixture: ComponentFixture<GadgetHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GadgetHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
