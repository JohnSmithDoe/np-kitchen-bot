import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
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
import { CategoriesActions } from '../../state/categories/categories.actions';
import {
  selectCategories,
  selectCategoriesState,
  selectContainsSearchResult,
  selectSelectedCategories,
} from '../../state/categories/categories.selector';

@Component({
  selector: 'app-categories-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.scss'],
  imports: [
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
    FormsModule,
    TranslateModule,
    IonLabel,
    IonNote,
    AsyncPipe,
  ],
})
export class CategoriesDialogComponent {
  #store = inject(Store);

  @Input() categories: TItemListCategory[] = [];
  @Input() itemCategories?: TItemListCategory[];

  @Output() confirm = new EventEmitter<string[]>();
  @Output() cancel = new EventEmitter();

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
    const { checked, value } = ev.detail;
    this.#store.dispatch(CategoriesActions.selectCategory(value));
  }

  addNewCategory() {
    this.#store.dispatch(CategoriesActions.addCategory());
  }

  cancelDialog() {
    this.#store.dispatch(CategoriesActions.abortChanges());
  }

  confirmDialog() {
    //TODO: hmmm
    this.confirm.emit();
    this.#store.dispatch(CategoriesActions.confirmChanges());
  }
}
