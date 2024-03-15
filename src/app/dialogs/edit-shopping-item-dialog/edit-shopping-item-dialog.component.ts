import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { TItemListCategory } from '../../@types/types';
import { CategoryInputComponent } from '../../components/forms/category-input/category-input.component';
import { ItemEditModalComponent } from '../../components/forms/item-edit-modal/item-edit-modal.component';
import { ItemNameInputComponent } from '../../components/forms/item-name-input/item-name-input.component';
import { NumberInputComponent } from '../../components/forms/number-input/number-input.component';
import {
  CategoriesActions,
  DialogsActions,
} from '../../state/dialogs/dialogs.actions';
import {
  selectCategoriesState,
  selectEditShoppingItem,
  selectEditShoppingState,
} from '../../state/dialogs/dialogs.selector';
import {
  selectShoppingItems,
  selectShoppingState,
} from '../../state/shopping/shopping.selector';

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
    NgClass,
    ReactiveFormsModule,
    CategoryInputComponent,
    NumberInputComponent,
    ItemNameInputComponent,
    ItemEditModalComponent,
  ],
  templateUrl: './edit-shopping-item-dialog.component.html',
  styleUrl: './edit-shopping-item-dialog.component.scss',
})
export class EditShoppingItemDialogComponent {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectEditShoppingState);
  rxItem$ = this.#store.select(selectEditShoppingItem);
  rxCategory$ = this.#store.select(selectCategoriesState);
  rxShoppingItems$ = this.#store.select(selectShoppingItems);
  rxShoppingState$ = this.#store.select(selectShoppingState);

  constructor() {
    addIcons({ closeCircle });
  }

  cancelChanges() {
    this.#store.dispatch(DialogsActions.abortChanges());
  }

  closedDialog() {
    this.#store.dispatch(DialogsActions.hideDialog());
  }

  submitChanges() {
    this.#store.dispatch(DialogsActions.confirmChanges());
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
      DialogsActions.updateItem({
        price: priceValue,
      })
    );
  }

  removeCategory(cat: TItemListCategory) {
    this.#store.dispatch(DialogsActions.removeCategory(cat));
  }

  updateName(value: string) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        name: value,
      })
    );
  }

  updateQuantity(value: number) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        quantity: value,
      })
    );
  }

  showCategoryDialog() {
    this.#store.dispatch(CategoriesActions.showDialog());
  }
}
