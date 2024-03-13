import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatetimeCustomEvent, InputCustomEvent } from '@ionic/angular';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import { TItemListCategory } from '../../@types/types';
import { parseNumberInput } from '../../app.utils';
import { CategoriesActions } from '../../state/dialogs/categories.actions';
import { selectCategoriesState } from '../../state/dialogs/categories.selector';
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import {
  selectEditStorageItem,
  selectEditStorageState,
} from '../../state/dialogs/dialogs.selector';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';

@Component({
  selector: 'app-edit-storage-item-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonButton,
    FormsModule,
    IonToolbar,
    IonHeader,
    IonModal,
    IonTitle,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonChip,
    IonAvatar,
    IonLabel,
    IonIcon,
    CategoriesDialogComponent,
    TranslateModule,
    IonSelect,
    IonSelectOption,
    CurrencyPipe,
    IonDatetime,
    DatePipe,
    IonPopover,
    IonText,
    AsyncPipe,
  ],
  templateUrl: './edit-storage-item-dialog.component.html',
  styleUrl: './edit-storage-item-dialog.component.scss',
})
export class EditStorageItemDialogComponent {
  readonly translate = inject(TranslateService);
  readonly #store = inject(Store);
  rxState$ = this.#store.select(selectEditStorageState);
  rxItem$ = this.#store.select(selectEditStorageItem);
  rxCategory$ = this.#store.select(selectCategoriesState);

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

  updateName(ev: InputCustomEvent) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        name: ev.detail.value ?? undefined,
      })
    );
  }

  updateBestBefore(ev: DatetimeCustomEvent) {
    const dateValue =
      typeof ev.detail.value === 'string' ? ev.detail.value : undefined;
    this.#store.dispatch(
      DialogsActions.updateItem({
        bestBefore: dateValue,
      })
    );
  }

  removeCategory(cat: TItemListCategory) {
    console.log('should remove it');
    this.#store.dispatch(DialogsActions.removeCategory(cat));
  }

  changeMinAmount(ev: InputCustomEvent) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        minAmount: parseNumberInput(ev),
      })
    );
  }

  updateQuantity(ev: InputCustomEvent) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        quantity: parseNumberInput(ev),
      })
    );
  }

  showCategoryDialog() {
    this.#store.dispatch(CategoriesActions.showDialog());
  }
}
