import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonActionsSheetComponent } from './common-actions-sheet.component';

describe('CommonActionsSheetComponent', () => {
  let component: CommonActionsSheetComponent;
  let fixture: ComponentFixture<CommonActionsSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonActionsSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonActionsSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
