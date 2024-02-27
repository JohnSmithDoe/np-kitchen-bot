import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPage } from './inventory.page';

describe('Tab1Page', () => {
  let component: InventoryPage;
  let fixture: ComponentFixture<InventoryPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(InventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
