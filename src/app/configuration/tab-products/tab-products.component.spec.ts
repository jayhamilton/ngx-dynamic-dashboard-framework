import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabProductsComponent } from './tab-products.component';

describe('TabProductsComponent', () => {
  let component: TabProductsComponent;
  let fixture: ComponentFixture<TabProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
