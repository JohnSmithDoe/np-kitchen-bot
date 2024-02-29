import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGlobalItemDialogComponent } from './edit-global-item-dialog.component';

describe('NewItemDialogComponent', () => {
  let component: EditGlobalItemDialogComponent;
  let fixture: ComponentFixture<EditGlobalItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGlobalItemDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditGlobalItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
