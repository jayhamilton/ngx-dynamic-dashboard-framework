import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabUserComponent } from './user.component';

describe('RbacComponent', () => {
  let component: TabUserComponent;
  let fixture: ComponentFixture<TabUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
