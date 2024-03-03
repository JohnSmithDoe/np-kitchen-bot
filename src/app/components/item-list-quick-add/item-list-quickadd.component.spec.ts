import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListQuickaddComponent } from './item-list-quickadd.component';

describe('Tab2Page', () => {
  let component: ItemListQuickaddComponent;
  let fixture: ComponentFixture<ItemListQuickaddComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ItemListQuickaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
