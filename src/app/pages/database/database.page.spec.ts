import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabasePage } from './database.page';

describe('Tab1Page', () => {
  let component: DatabasePage;
  let fixture: ComponentFixture<DatabasePage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(DatabasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
