import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputCustomEvent, SelectCustomEvent } from '@ionic/angular';
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
  IonNote,
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
import { TBestBeforeTimespan, TItemListCategory } from '../../@types/types';
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
  selectEditGlobalItem,
  selectEditGlobalState,
} from '../../state/dialogs/dialogs.selector';
import {
  selectGlobalListItems,
  selectGlobalsState,
} from '../../state/globals/globals.selector';

@Component({
  selector: 'app-edit-global-item-dialog',
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
    TranslateModule,
    IonSelect,
    IonSelectOption,
    CurrencyPipe,
    IonDatetime,
    DatePipe,
    IonPopover,
    IonNote,
    IonText,
    AsyncPipe,
    ReactiveFormsModule,
    CategoryInputComponent,
    ItemNameInputComponent,
    NumberInputComponent,
    ItemEditModalComponent,
  ],
  templateUrl: './edit-global-item-dialog.component.html',
  styleUrl: './edit-global-item-dialog.component.scss',
})
export class EditGlobalItemDialogComponent {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectEditGlobalState);
  rxItem$ = this.#store.select(selectEditGlobalItem);
  rxCategory$ = this.#store.select(selectCategoriesState);
  rxGlobalItems$ = this.#store.select(selectGlobalListItems);
  rxGlobalState$ = this.#store.select(selectGlobalsState);

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

  setBestBeforeTimespan(ev: SelectCustomEvent<TBestBeforeTimespan>) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        bestBeforeTimespan: ev.detail.value,
        bestBeforeTimevalue: ev.detail.value === 'forever' ? undefined : 1,
      })
    );
  }

  async showCategoryDialog() {
    this.#store.dispatch(CategoriesActions.showDialog());
  }

  setBestBeforeTimevalue(value: number) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        bestBeforeTimevalue: value,
      })
    );
  }
}
