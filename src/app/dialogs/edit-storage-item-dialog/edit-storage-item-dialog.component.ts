import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CategoryInputComponent } from '../../components/forms/category-input/category-input.component';
import { DateInputComponent } from '../../components/forms/date-input/date-input.component';
import { ItemEditModalComponent } from '../../components/forms/item-edit-modal/item-edit-modal.component';
import { ItemNameInputComponent } from '../../components/forms/item-name-input/item-name-input.component';
import { NumberInputComponent } from '../../components/forms/number-input/number-input.component';
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import { selectEditStorageItem } from '../../state/dialogs/dialogs.selector';
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

  rxItem$ = this.#store.select(selectEditStorageItem);
  rxStorageItems$ = this.#store.select(selectStorageListItems);

  constructor() {
    addIcons({ closeCircle });
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
