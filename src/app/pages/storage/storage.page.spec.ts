import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoragePage } from './storage.page';

describe('Tab1Page', () => {
  let component: StoragePage;
  let fixture: ComponentFixture<StoragePage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(StoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
