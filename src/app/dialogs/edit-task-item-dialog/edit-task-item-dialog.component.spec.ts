import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskItemDialogComponent } from './edit-task-item-dialog.component';

describe('NewItemDialogComponent', () => {
  let component: EditTaskItemDialogComponent;
  let fixture: ComponentFixture<EditTaskItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTaskItemDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTaskItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
