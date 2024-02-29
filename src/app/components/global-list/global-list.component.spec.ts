import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalListComponent } from './global-list.component';

describe('Tab2Page', () => {
  let component: GlobalListComponent;
  let fixture: ComponentFixture<GlobalListComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(GlobalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
