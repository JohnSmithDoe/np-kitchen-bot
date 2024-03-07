import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalsPage } from './globals.page';

describe('Tab1Page', () => {
  let component: GlobalsPage;
  let fixture: ComponentFixture<GlobalsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(GlobalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
