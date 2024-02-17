import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddItemDialog} from './add-item.dialog';

describe('AddItemDialogComponent', () => {
  let component: AddItemDialog;
  let fixture: ComponentFixture<AddItemDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItemDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
