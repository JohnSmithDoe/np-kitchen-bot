import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalListComponent } from './local-list.component';

describe('Tab2Page', () => {
  let component: LocalListComponent;
  let fixture: ComponentFixture<LocalListComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(LocalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
