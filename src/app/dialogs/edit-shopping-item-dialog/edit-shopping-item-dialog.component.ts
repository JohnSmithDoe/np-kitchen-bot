import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  ],
  templateUrl: './edit-shopping-item-dialog.component.html',
  styleUrl: './edit-shopping-item-dialog.component.scss',
})
export class EditShoppingItemDialogComponent {
  readonly #store = inject(Store);
  rxState$ = this.#store.select(selectEditShoppingState);
  rxItem$ = this.#store.select(selectEditShoppingItem);
  rxCategory$ = this.#store.select(selectCategoriesState);

  constructor() {
    addIcons({ closeCircle });
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
    this.#store.dispatch(
      EditShoppingItemActions.updateItem({
        quantity: Number.parseInt(ev.detail.value ?? '0', 10),
      })
    );
  }

  showCategoryDialog() {
    this.#store.dispatch(CategoriesActions.showDialog());
  }
}
