import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShoppingActionSheetComponent } from './shopping-action-sheet.component';

describe('ShoppingActionSheetComponent', () => {
  let component: ShoppingActionSheetComponent;
  let fixture: ComponentFixture<ShoppingActionSheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingActionSheetComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingActionSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
