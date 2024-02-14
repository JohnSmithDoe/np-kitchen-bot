import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NpListComponent} from './np-list.component';

describe('Tab2Page', () => {
  let component: NpListComponent;
  let fixture: ComponentFixture<NpListComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(NpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
