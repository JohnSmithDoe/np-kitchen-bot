import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
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
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import { CategoryInputComponent } from '../../components/forms/category-input/category-input.component';
import { DateInputComponent } from '../../components/forms/date-input/date-input.component';
import { ItemEditModalComponent } from '../../components/forms/item-edit-modal/item-edit-modal.component';
import { NumberInputComponent } from '../../components/forms/number-input/number-input.component';
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import {
  selectEditTaskItem,
  selectEditTaskState,
} from '../../state/dialogs/dialogs.selector';
import {
  selectTasksListItems,
  selectTasksState,
} from '../../state/tasks/tasks.selector';

@Component({
  selector: 'app-edit-task-item-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonButton,
    AsyncPipe,
    IonLabel,
    IonIcon,
    IonChip,
    IonItem,
    IonInput,
    FormsModule,
    IonList,
    IonContent,
    TranslateModule,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonModal,
    NgClass,
    ReactiveFormsModule,
    DatePipe,
    IonDatetime,
    CategoryInputComponent,
    ItemEditModalComponent,
    DateInputComponent,
    NumberInputComponent,
  ],
  templateUrl: './edit-task-item-dialog.component.html',
  styleUrl: './edit-task-item-dialog.component.scss',
})
export class EditTaskItemDialogComponent {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectEditTaskState);
  rxItem$ = this.#store.select(selectEditTaskItem);
  rxTasksState$ = this.#store.select(selectTasksState);
  rxTasksItems = this.#store.select(selectTasksListItems);

  constructor() {
    addIcons({ closeCircle });
  }

  updatePrio(value: number) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        prio: value,
      })
    );
  }

  updateDueAt(value?: string) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        dueAt: value,
      })
    );
  }
}
