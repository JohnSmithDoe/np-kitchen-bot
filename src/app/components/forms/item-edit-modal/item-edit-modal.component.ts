import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonModal,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { IBaseItem, TItemListId } from '../../../@types/types';
import { DialogsActions } from '../../../state/dialogs/dialogs.actions';
import {
  selectEditItem,
  selectEditState,
} from '../../../state/dialogs/dialogs.selector';
import { ItemNameInputComponent } from '../item-name-input/item-name-input.component';

@Component({
  selector: 'app-item-edit-modal',
  standalone: true,
  templateUrl: './item-edit-modal.component.html',
  styleUrls: ['./item-edit-modal.component.scss'],
  imports: [
    IonItem,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    ItemNameInputComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class ItemEditModalComponent {
  readonly #store = inject(Store);

  readonly rxState$ = this.#store.select(selectEditState);
  readonly rxItem$ = this.#store.select(selectEditItem);

  @Input({ required: true }) listId!: TItemListId;
  @Input() listItems?: IBaseItem[] | null;

  constructor() {}

  cancelChanges() {
    this.#store.dispatch(DialogsActions.abortChanges());
  }

  closedDialog() {
    this.#store.dispatch(DialogsActions.hideDialog());
  }

  submitChanges() {
    this.#store.dispatch(DialogsActions.confirmChanges());
  }

  updateName(value: string) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        name: value,
      })
    );
  }
}
