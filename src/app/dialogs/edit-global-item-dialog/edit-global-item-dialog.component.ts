import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectCustomEvent } from '@ionic/angular';
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
import { TBestBeforeTimespan } from '../../@types/types';
import { CategoryInputComponent } from '../../components/forms/category-input/category-input.component';
import { ItemEditModalComponent } from '../../components/forms/item-edit-modal/item-edit-modal.component';
import { ItemNameInputComponent } from '../../components/forms/item-name-input/item-name-input.component';
import { NumberInputComponent } from '../../components/forms/number-input/number-input.component';
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import { selectEditGlobalItem } from '../../state/dialogs/dialogs.selector';
import { selectGlobalListItems } from '../../state/globals/globals.selector';

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

  rxItem$ = this.#store.select(selectEditGlobalItem);
  rxGlobalItems$ = this.#store.select(selectGlobalListItems);

  constructor() {
    addIcons({ closeCircle });
  }

  setBestBeforeTimespan(ev: SelectCustomEvent<TBestBeforeTimespan>) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        bestBeforeTimespan: ev.detail.value,
        bestBeforeTimevalue: ev.detail.value === 'forever' ? undefined : 1,
      })
    );
  }

  setBestBeforeTimevalue(value: number) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        bestBeforeTimevalue: value,
      })
    );
  }
}
