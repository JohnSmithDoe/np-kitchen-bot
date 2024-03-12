import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingPage } from './shopping.page';

describe('Tab1Page', () => {
  let component: ShoppingPage;
  let fixture: ComponentFixture<ShoppingPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ShoppingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
