import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PckLineComponent } from './pck-line.component';

describe('PckLineComponent', () => {
  let component: PckLineComponent;
  let fixture: ComponentFixture<PckLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PckLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PckLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
