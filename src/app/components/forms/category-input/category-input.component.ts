import { Component, inject, Input } from '@angular/core';
import {
  IonChip,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import { TItemListCategory } from '../../../@types/types';
import { CategoriesDialogComponent } from '../../../dialogs/categories-dialog/categories-dialog.component';
import {
  CategoriesActions,
  DialogsActions,
} from '../../../state/dialogs/dialogs.actions';

@Component({
  selector: 'app-category-input',
  standalone: true,
  templateUrl: './category-input.component.html',
  styleUrls: ['./category-input.component.scss'],
  imports: [
    IonInput,
    IonItem,
    IonLabel,
    IonChip,
    IonIcon,
    TranslateModule,
    CategoriesDialogComponent,
  ],
})
export class CategoryInputComponent {
  readonly #store = inject(Store);
  @Input() categories?: TItemListCategory[];

  constructor() {
    addIcons({ closeCircle });
  }

  removeCategory(cat: TItemListCategory) {
    this.#store.dispatch(DialogsActions.removeCategory(cat));
  }

  showCategoryDialog() {
    this.#store.dispatch(CategoriesActions.showDialog());
  }
}
