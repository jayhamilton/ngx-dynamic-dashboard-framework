import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabRbacComponent } from './rbac.component';

describe('RbacComponent', () => {
  let component: TabRbacComponent;
  let fixture: ComponentFixture<TabRbacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabRbacComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabRbacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
