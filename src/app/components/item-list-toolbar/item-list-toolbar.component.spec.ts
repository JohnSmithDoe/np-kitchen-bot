import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListToolbarComponent } from './item-list-toolbar.component';

describe('Tab2Page', () => {
  let component: ItemListToolbarComponent;
  let fixture: ComponentFixture<ItemListToolbarComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ItemListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
