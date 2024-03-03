import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListEmptyComponent } from './item-list-empty.component';

describe('Tab2Page', () => {
  let component: ItemListEmptyComponent;
  let fixture: ComponentFixture<ItemListEmptyComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ItemListEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
