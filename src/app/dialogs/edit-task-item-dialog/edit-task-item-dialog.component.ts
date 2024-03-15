import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { DatetimeCustomEvent, InputCustomEvent } from '@ionic/angular';
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
import { combineLatestWith, Subscription } from 'rxjs';
import { TItemListCategory, TMarker } from '../../@types/types';
import { parseNumberInput, validateNameInput } from '../../app.utils';
import {
  CategoriesActions,
  DialogsActions,
} from '../../state/dialogs/dialogs.actions';
import {
  selectCategoriesState,
  selectEditTaskItem,
  selectEditTaskState,
} from '../../state/dialogs/dialogs.selector';
import { selectTasksState } from '../../state/tasks/tasks.selector';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';

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
    CategoriesDialogComponent,
    NgClass,
    ReactiveFormsModule,
    DatePipe,
    IonDatetime,
  ],
  templateUrl: './edit-task-item-dialog.component.html',
  styleUrl: './edit-task-item-dialog.component.scss',
})
export class EditTaskItemDialogComponent implements OnInit, OnDestroy {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectEditTaskState);
  rxItem$ = this.#store.select(selectEditTaskItem);
  rxCategory$ = this.#store.select(selectCategoriesState);
  rxTasksState$ = this.#store.select(selectTasksState);
  nameControl: FormControl = new FormControl('');
  readonly #subscription: Subscription[] = [];

  constructor() {
    addIcons({ closeCircle });
  }
  // TODO:
  /**
   * Still would not set the value to the control... hmm
   *   updateName(ev: InputCustomEvent) {
   *     this.#store.dispatch(
   *       DialogsActions.updateItem({
   *         name: ev.detail.value ?? undefined,
   *       })
   *     );
   *   }
   *     this.rxIsValidEditName$
   *         .subscribe((isValid) => {
   *
   *         this.nameControl.setError( isValid ? null : { duplicate: true })
   *             this.nameControl.markAsTouched();
   *             this.nameControl.updateValueAndValidity();
   *         })
   *
   */

  // dry -> maybe add a name control input hmmmmmmmmmm with the provide ControllerInputGroup wie in dem Video... would be nice
  // or even better? validate in effect and subscribe here to add the error to the input...
  async ngOnInit(): Promise<void> {
    // Hmm this seems a bit much only to get validation on the input.... but still no other solution found till now
    this.#subscription.push(
      // subscribe to the input changes and update the state
      this.nameControl.valueChanges.subscribe(
        (value: string | null | undefined) => {
          this.#store.dispatch(
            DialogsActions.updateItem({
              name: value ?? undefined,
            })
          );
        }
      ),
      // subscribe to the state changes and update the input value so we can have validation
      this.rxItem$
        .pipe(combineLatestWith(this.rxTasksState$))
        .subscribe(([item, state]) => {
          if (this.nameControl.value !== item?.name) {
            this.nameControl.setValue(item?.name);
            this.nameControl.markAsTouched();
            this.nameControl.setValidators(
              validateNameInput(state.items, item)
            );
            this.nameControl.updateValueAndValidity();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.#subscription.forEach((sub) => sub.unsubscribe());
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

  updatePrio(ev: InputCustomEvent) {
    this.#store.dispatch(
      DialogsActions.updateItem({
        quantity: parseNumberInput(ev),
      })
    );
  }

  showCategoryDialog() {
    this.#store.dispatch(CategoriesActions.showDialog());
  }

  updateDueAt(ev: DatetimeCustomEvent) {
    const dateValue =
      typeof ev.detail.value === 'string' ? ev.detail.value : undefined;
    this.#store.dispatch(
      DialogsActions.updateItem({
        dueAt: dateValue,
      })
    );
  }

  getErrorText(): TMarker {
    {
      return this.nameControl.hasError('duplicate')
        ? marker('edit.item.dialog.name.duplicate.error')
        : marker('edit.item.dialog.name.empty.error');
    }
  }
}
