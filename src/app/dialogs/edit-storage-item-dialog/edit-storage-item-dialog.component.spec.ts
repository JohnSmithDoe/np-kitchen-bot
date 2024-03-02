import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStorageItemDialogComponent } from './edit-storage-item-dialog.component';

describe('NewItemDialogComponent', () => {
  let component: EditStorageItemDialogComponent;
  let fixture: ComponentFixture<EditStorageItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStorageItemDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditStorageItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
