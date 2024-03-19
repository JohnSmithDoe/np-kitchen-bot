import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputCustomEvent } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import { CategoriesActions } from '../../state/dialogs/dialogs.actions';
import {
  selectCategoriesState,
  selectEditState,
} from '../../state/dialogs/dialogs.selector';

@Component({
  selector: 'app-edit-category-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './edit-category-dialog.component.html',
  styleUrl: './edit-category-dialog.component.scss',
})
export class EditCategoryDialogComponent {
  readonly #store = inject(Store);
  rxState$ = this.#store.select(selectEditState);
  rxCategoryState$ = this.#store.select(selectCategoriesState);

  constructor() {
    addIcons({ closeCircle });
  }

  updateCategory(ev: InputCustomEvent) {
    this.#store.dispatch(
      CategoriesActions.updateCategory(ev.detail.value ?? '')
    );
  }

  submitChanges() {
    this.#store.dispatch(CategoriesActions.confirmEditChanges());
  }

  cancelChanges() {
    this.#store.dispatch(CategoriesActions.abortEditChanges());
  }

  closedDialog() {
    this.cancelChanges();
  }
}
