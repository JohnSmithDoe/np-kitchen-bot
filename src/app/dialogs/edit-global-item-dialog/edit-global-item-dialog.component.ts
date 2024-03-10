import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import {
  IBaseItem,
  IGlobalItem,
  TBestBeforeTimespan,
  TItemListCategory,
  TItemUnit,
  TPackagingUnit,
  TUpdateDTO,
} from '../../@types/types';
import { selectCategoriesState } from '../../state/categories/categories.selector';
import { EditGlobalItemActions } from '../../state/edit-global-item/edit-global-item.actions';
import { selectEditGlobalState } from '../../state/edit-global-item/edit-global-item.selector';
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
  ],
  templateUrl: './edit-global-item-dialog.component.html',
  styleUrl: './edit-global-item-dialog.component.scss',
})
export class EditGlobalItemDialogComponent implements OnInit {
  readonly translate = inject(TranslateService);
  readonly #store = inject(Store);
  /**  [mode]="(rxState$|async)?.editMode ?? 'create'"
 (cancel)="closeEditDialog()"
 (saveItem)="updateItem($event)"
 [item]="(rxState$|async)?.data"
 [categories]="(rxCategories$ | async) ?? []"
*/
  rxState$ = this.#store.select(selectEditGlobalState);
  rxCategory$ = this.#store.select(selectCategoriesState);
  //TODO: state...
  @Input() item?: TUpdateDTO<IGlobalItem> | null;
  @Input() items?: IBaseItem[] | null;
  @Input() mode: 'update' | 'create' = 'create';

  @Output() saveItem = new EventEmitter<Partial<IGlobalItem>>();
  @Output() cancel = new EventEmitter();

  selectCategories = false;
  dialogTitle = '';
  saveButtonText = '';
  currencyCode: 'EUR' | 'USD' = 'EUR';

  nameValue?: string;
  categoryValue: TItemListCategory[] | undefined;
  priceValue?: number;

  bestBeforeTimespanValue?: TBestBeforeTimespan;
  bestBeforeTimeValue: undefined | number;
  packagingValue?: TPackagingUnit;
  unitValue?: TItemUnit;

  submitChanges() {
    this.saveItem.emit({
      ...this.item,
      name: this.nameValue,
      category: this.categoryValue,
      price: this.priceValue,
    });
  }

  constructor() {
    addIcons({ closeCircle });
  }

  ngOnInit(): void {
    this.currencyCode = this.translate.currentLang !== 'en' ? 'EUR' : 'USD';

    this.nameValue = this.item?.name;
    this.categoryValue = this.item?.category;
    this.priceValue = this.item?.price;
    this.bestBeforeTimespanValue = this.item?.bestBeforeTimespan;
    this.bestBeforeTimeValue = this.item?.bestBeforeTimevalue;
    this.packagingValue = this.item?.packaging;
    this.unitValue = this.item?.unit;

    this.saveButtonText =
      this.mode === 'create'
        ? this.translate.instant('edit.global.item.dialog.button.create')
        : this.translate.instant('edit.global.item.dialog.button.update');

    this.dialogTitle =
      this.mode === 'create'
        ? this.translate.instant('edit.global.item.dialog.title.create')
        : this.translate.instant('edit.global.item.dialog.title.update');
  }

  setCategories(categories?: TItemListCategory[]) {
    this.selectCategories = false;
    this.categoryValue = categories;
  }

  removeCategory(cat: TItemListCategory) {
    this.categoryValue?.splice(this.categoryValue?.indexOf(cat), 1);
    // update object reference
    this.categoryValue = this.categoryValue
      ? [...this.categoryValue]
      : undefined;
  }

  setUnit(ev: SelectCustomEvent<TItemUnit>) {
    this.unitValue = ev.detail.value;
    if (this.unitValue === 'ml') {
      this.packagingValue = 'bottle';
    } else if (this.packagingValue === 'bottle') {
      this.packagingValue = 'loose';
    }
  }

  setPackaging(ev: SelectCustomEvent<TPackagingUnit>) {
    this.packagingValue = ev.detail.value;
  }

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
    this.priceValue = Number.parseFloat(numberInput);
  }

  setBestBeforeTimespan(ev: SelectCustomEvent<TBestBeforeTimespan>) {
    this.bestBeforeTimespanValue = ev.detail.value;
    this.bestBeforeTimeValue =
      this.bestBeforeTimespanValue === 'forever' ? undefined : 1;
  }

  closedDialog() {
    this.#store.dispatch(EditGlobalItemActions.hideDialog());
  }
}
