import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import {
  IGlobalItem,
  TBestBeforeTimespan,
  TItemListCategory,
} from '../../@types/types';
import { CategoriesActions } from '../../state/categories/categories.actions';
import { selectCategoriesState } from '../../state/categories/categories.selector';
import { EditGlobalItemActions } from '../../state/edit-global-item/edit-global-item.actions';
import {
  selectEditGlobalItem,
  selectEditGlobalState,
} from '../../state/edit-global-item/edit-global-item.selector';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';

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
    CategoriesDialogComponent,
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
  ],
  templateUrl: './edit-global-item-dialog.component.html',
  styleUrl: './edit-global-item-dialog.component.scss',
})
export class EditGlobalItemDialogComponent {
  readonly #store = inject(Store);
  rxState$ = this.#store.select(selectEditGlobalState);
  rxItem$ = this.#store.select(selectEditGlobalItem);
  rxCategory$ = this.#store.select(selectCategoriesState);

  @Output() saveItem = new EventEmitter<Partial<IGlobalItem>>();
  @Output() cancel = new EventEmitter();

  constructor() {
    addIcons({ closeCircle });
  }

  cancelChanges() {
    this.#store.dispatch(EditGlobalItemActions.abortChanges());
  }

  closedDialog() {
    this.#store.dispatch(EditGlobalItemActions.hideDialog());
  }

  submitChanges() {
    this.#store.dispatch(EditGlobalItemActions.confirmChanges());
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
      EditGlobalItemActions.updateItem({
        price: priceValue,
      })
    );
  }

  updateName(ev: InputCustomEvent) {
    this.#store.dispatch(
      EditGlobalItemActions.updateItem({
        name: ev.detail.value ?? undefined,
      })
    );
  }

  removeCategory(cat: TItemListCategory) {
    this.#store.dispatch(CategoriesActions.toggleCategory(cat));
  }

  setBestBeforeTimespan(ev: SelectCustomEvent<TBestBeforeTimespan>) {
    this.#store.dispatch(
      EditGlobalItemActions.updateItem({
        bestBeforeTimespan: ev.detail.value,
        bestBeforeTimevalue: ev.detail.value === 'forever' ? undefined : 1,
      })
    );
  }

  async showCategoryDialog() {
    this.#store.dispatch(CategoriesActions.showDialog());
  }

  setBestBeforeTimevalue(ev: InputCustomEvent) {
    this.#store.dispatch(
      EditGlobalItemActions.updateItem({
        bestBeforeTimevalue: Number.parseInt(ev.detail.value ?? '0', 10),
      })
    );
  }
}
