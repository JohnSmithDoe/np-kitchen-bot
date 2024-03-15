import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxCustomEvent } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { TItemListCategory } from '../../@types/types';

import { CategoriesActions } from '../../state/dialogs/dialogs.actions';
import {
  selectCategories,
  selectCategoriesState,
  selectContainsSearchResult,
  selectSelectedCategories,
} from '../../state/dialogs/dialogs.selector';

@Component({
  selector: 'app-categories-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.scss'],
  imports: [
    FormsModule,
    TranslateModule,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonSearchbar,
    IonContent,
    IonList,
    IonItem,
    IonCheckbox,
    IonLabel,
    IonNote,
    AsyncPipe,
  ],
})
export class CategoriesDialogComponent {
  readonly #store = inject(Store);

  rxSearchContained$ = this.#store.select(selectContainsSearchResult);
  rxState$ = this.#store.select(selectCategoriesState);
  rxItems$ = this.#store.select(selectCategories);
  rxSelection$ = this.#store.select(selectSelectedCategories);

  constructor() {}

  searchbarInput(ev: any) {
    this.#store.dispatch(CategoriesActions.updateSearchQuery(ev.target.value));
  }

  isChecked(item: TItemListCategory) {
    return this.rxSelection$.pipe(map((selection) => selection.includes(item)));
  }

  selectionChange(ev: CheckboxCustomEvent<TItemListCategory>) {
    this.#store.dispatch(CategoriesActions.toggleCategory(ev.detail.value));
  }

  addNewCategory() {
    this.#store.dispatch(CategoriesActions.addCategory());
  }

  cancelChanges() {
    this.#store.dispatch(CategoriesActions.abortChanges());
  }

  closedDialog() {
    this.#store.dispatch(CategoriesActions.abortChanges());
  }

  confirmChanges() {
    this.#store.dispatch(CategoriesActions.confirmChanges());
  }
}
