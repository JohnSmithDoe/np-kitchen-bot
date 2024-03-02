import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShoppingItemDialogComponent } from './edit-shopping-item-dialog.component';

describe('NewItemDialogComponent', () => {
  let component: EditShoppingItemDialogComponent;
  let fixture: ComponentFixture<EditShoppingItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditShoppingItemDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditShoppingItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
