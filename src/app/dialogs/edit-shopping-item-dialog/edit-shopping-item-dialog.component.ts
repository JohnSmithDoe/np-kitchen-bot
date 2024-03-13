import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputCustomEvent } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { TItemListCategory } from '../../@types/types';
import { parseNumberInput } from '../../app.utils';
import { CategoriesActions } from '../../state/categories/categories.actions';
import { selectCategoriesState } from '../../state/categories/categories.selector';
import { EditShoppingItemActions } from '../../state/edit-shopping-item/edit-shopping-item.actions';
import {
  selectEditShoppingItem,
  selectEditShoppingState,
} from '../../state/edit-shopping-item/edit-shopping-item.selector';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';

@Component({
  selector: 'app-edit-shopping-item-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonButton,
    AsyncPipe,
    IonLabel,
    IonIcon,
    IonChip,
    IonItem,
    IonInput,
    FormsModule,
    IonList,
    IonContent,
    TranslateModule,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonModal,
    CategoriesDialogComponent,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-shopping-item-dialog.component.html',
  styleUrl: './edit-shopping-item-dialog.component.scss',
})
export class EditShoppingItemDialogComponent implements OnDestroy {
  readonly #store = inject(Store);
  rxState$ = this.#store.select(selectEditShoppingState);
  rxItem$ = this.#store.select(selectEditShoppingItem);
  rxCategory$ = this.#store.select(selectCategoriesState);
  nameControl: FormControl = new FormControl('', Validators.maxLength(3));
  readonly #subscription: Subscription[];

  constructor() {
    addIcons({ closeCircle });
    // Hmm this seems a bit much only to get validation on the input....
    this.#subscription = [
      // subscribe to the input changes and update the state
      this.nameControl.valueChanges.subscribe((value: string | null) => {
        this.#store.dispatch(
          EditShoppingItemActions.updateItem({
            name: value ?? undefined,
          })
        );
      }),
      // subscribe to the state changes and update the input value so we can have validation
      this.rxItem$.subscribe((item) => {
        if (this.nameControl.value !== item?.name) {
          this.nameControl.setValue(item?.name);
          this.nameControl.markAsTouched();
        }
      }),
    ];
  }

  ngOnDestroy(): void {
    this.#subscription.forEach((sub) => sub.unsubscribe());
  }

  cancelChanges() {
    this.#store.dispatch(EditShoppingItemActions.abortChanges());
  }

  closedDialog() {
    this.#store.dispatch(EditShoppingItemActions.hideDialog());
  }

  submitChanges() {
    this.#store.dispatch(EditShoppingItemActions.confirmChanges());
  }
  // dry -> maybe pass the string to the update action... convert somewhere else
  updatePrice(ev: InputCustomEvent<FocusEvent>) {
    let inputValue = ev.target.value as string;
    // get rid of all non-numeric chars
    inputValue = inputValue.replace(/[^0-9,.-]+/g, '');

    // if entered in english -> german e.g. 12.34 -> 12,34
    if (/[0-9].*\.[0-9]{1,2}$/.test(inputValue)) {
      inputValue = inputValue.replace(/\./g, 'X');
      inputValue = inputValue.replace(/,/g, '.');
      inputValue = inputValue.replace(/X/g, ',');
    }
    // only numbers , and - (points are removed) e.g. 1.234,34 € -> 1234,34
    const cleanInput = inputValue.replace(/[^0-9,-]+/g, '');
    // swap german , with . e.g. 1234,34 -> 1234.34
    const numberInput = cleanInput.replace(/,+/g, '.');
    const priceValue = Number.parseFloat(numberInput);
    this.#store.dispatch(
      EditShoppingItemActions.updateItem({
        price: priceValue,
      })
    );
  }

  updateName(ev: InputCustomEvent) {
    this.#store.dispatch(
      EditShoppingItemActions.updateItem({
        name: ev.detail.value ?? undefined,
      })
    );
  }

  removeCategory(cat: TItemListCategory) {
    this.#store.dispatch(EditShoppingItemActions.removeCategory(cat));
  }

  updateQuantity(ev: InputCustomEvent) {
    const quantity = parseNumberInput(ev);
    this.#store.dispatch(
      EditShoppingItemActions.updateItem({
        quantity,
      })
    );
  }

  showCategoryDialog() {
    this.#store.dispatch(CategoriesActions.showDialog());
  }
}
