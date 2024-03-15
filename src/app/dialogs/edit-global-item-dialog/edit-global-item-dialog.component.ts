import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { combineLatestWith, Subscription } from 'rxjs';
import { TBestBeforeTimespan, TItemListCategory } from '../../@types/types';
import { parseNumberInput, validateDuplicateName } from '../../app.utils';
import {
  CategoriesActions,
  DialogsActions,
} from '../../state/dialogs/dialogs.actions';
import {
  selectCategoriesState,
  selectEditGlobalItem,
  selectEditGlobalState,
} from '../../state/dialogs/dialogs.selector';
import { selectGlobalsState } from '../../state/globals/globals.selector';
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
    ReactiveFormsModule,
  ],
  templateUrl: './edit-global-item-dialog.component.html',
  styleUrl: './edit-global-item-dialog.component.scss',
})
export class EditGlobalItemDialogComponent implements OnInit, OnDestroy {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectEditGlobalState);
  rxItem$ = this.#store.select(selectEditGlobalItem);
  rxGlobalState$ = this.#store.select(selectGlobalsState);
  rxCategory$ = this.#store.select(selectCategoriesState);
  nameControl: FormControl = new FormControl('');
  readonly #subscription: Subscription[] = [];

  constructor() {
    addIcons({ closeCircle });
  }
  // dry -> maybe add a name control input hmmmmmmmmmm with the provide ControllerInputGroup wie in dem Video... would be nice
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
        .pipe(combineLatestWith(this.rxGlobalState$))
        .subscribe(([item, state]) => {
          if (this.nameControl.value !== item?.name) {
            this.nameControl.setValue(item?.name);
            this.nameControl.markAsTouched();
            this.nameControl.setValidators(
              validateDuplicateName(state.items, item)
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

  setBestBeforeTimespan(ev: SelectCustomEvent<TBestBeforeTimespan>) {
    this.#store.dispatch(
      DialogsActions.updateItem({
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
      DialogsActions.updateItem({
        bestBeforeTimevalue: parseNumberInput(ev),
      })
    );
  }
}
