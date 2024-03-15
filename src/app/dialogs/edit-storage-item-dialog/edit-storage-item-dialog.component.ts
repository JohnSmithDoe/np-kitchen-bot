import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputCustomEvent } from '@ionic/angular';
import {
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
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import { parseNumberInput } from '../../app.utils';
import { CategoryInputComponent } from '../../components/forms/category-input/category-input.component';
import { DateInputComponent } from '../../components/forms/date-input/date-input.component';
import { ItemEditModalComponent } from '../../components/forms/item-edit-modal/item-edit-modal.component';
import { ItemNameInputComponent } from '../../components/forms/item-name-input/item-name-input.component';
import { NumberInputComponent } from '../../components/forms/number-input/number-input.component';
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import {
  selectEditStorageItem,
  selectEditStorageState,
} from '../../state/dialogs/dialogs.selector';
import { selectStorageListItems } from '../../state/storage/storage.selector';

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
    IonLabel,
    IonIcon,
    TranslateModule,
    IonSelect,
    IonSelectOption,
    CurrencyPipe,
    IonDatetime,
    DatePipe,
    IonPopover,
    IonText,
    AsyncPipe,
    ReactiveFormsModule,
    CategoryInputComponent,
    ItemNameInputComponent,
    NumberInputComponent,
    DateInputComponent,
    ItemEditModalComponent,
  ],
  templateUrl: './edit-storage-item-dialog.component.html',
  styleUrl: './edit-storage-item-dialog.component.scss',
})
export class EditStorageItemDialogComponent {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectEditStorageState);
  rxItem$ = this.#store.select(selectEditStorageItem);
  rxStorageItems$ = this.#store.select(selectStorageListItems);

  constructor() {
    addIcons({ closeCircle });
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

  updateQuantity(ev: InputCustomEvent) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        quantity: parseNumberInput(ev),
      })
    );
  }

  updateBestBefore(value: string | undefined) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        bestBefore: value,
      })
    );
  }

  updateMinAmount(value: number) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        minAmount: value,
      })
    );
  }
}
