import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLocalItemDialogComponent } from './edit-local-item-dialog.component';

describe('NewItemDialogComponent', () => {
  let component: EditLocalItemDialogComponent;
  let fixture: ComponentFixture<EditLocalItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLocalItemDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditLocalItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
