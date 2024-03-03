import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListSearchbarComponent } from './item-list-searchbar.component';

describe('Tab2Page', () => {
  let component: ItemListSearchbarComponent;
  let fixture: ComponentFixture<ItemListSearchbarComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ItemListSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
