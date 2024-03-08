import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatetimeCustomEvent, InputCustomEvent } from '@ionic/angular';
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
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as dayjs from 'dayjs';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import {
  IStorageItem,
  TItemListCategory,
  TUpdateDTO,
} from '../../@types/types';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';

@Component({
  selector: 'app-edit-storage-item-dialog',
  standalone: true,
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
    IonText,
  ],
  templateUrl: './edit-storage-item-dialog.component.html',
  styleUrl: './edit-storage-item-dialog.component.scss',
})
export class EditStorageItemDialogComponent implements OnInit {
  readonly translate = inject(TranslateService);

  @Input() item?: TUpdateDTO<IStorageItem> | null;
  @Input() categories: string[] = [];
  @Input() mode: 'update' | 'create' = 'create';

  @Output() saveItem = new EventEmitter<Partial<IStorageItem>>();
  @Output() cancel = new EventEmitter();

  selectCategories = false;
  dialogTitle = '';
  saveButtonText = '';
  currencyCode: 'EUR' | 'USD' = 'EUR';

  nameValue?: string;
  categoryValue: TItemListCategory[] | undefined;
  quantityValue?: number;
  minAmountValue?: number;
  bestBeforeDate?: string;
  bestBeforeValue?: string;
  priceValue?: number;

  submitChanges() {
    this.saveItem.emit({
      ...this.item,
      name: this.nameValue,
      category: this.categoryValue,
      quantity: this.quantityValue,
      minAmount: this.minAmountValue,
      bestBefore: this.bestBeforeValue,
      price: this.priceValue,
    });
  }

  datePick(ev: DatetimeCustomEvent) {
    if (typeof ev.detail.value === 'string') {
      this.bestBeforeDate = ev.detail.value?.substring(0, 10);
      this.bestBeforeValue = dayjs(this.bestBeforeDate).format();
    } else {
      this.bestBeforeDate = undefined;
      this.bestBeforeValue = undefined;
    }
  }

  constructor() {
    addIcons({ closeCircle });
  }

  ngOnInit(): void {
    this.currencyCode = this.translate.currentLang !== 'en' ? 'EUR' : 'USD';

    this.nameValue = this.item?.name;
    this.categoryValue = this.item?.category;
    this.quantityValue = this.item?.quantity;
    this.minAmountValue = this.item?.minAmount;
    this.priceValue = this.item?.price;

    this.bestBeforeValue = this.item?.bestBefore;
    if (this.bestBeforeValue) {
      this.bestBeforeDate = dayjs(this.bestBeforeValue).format();
    }

    this.saveButtonText =
      this.mode === 'create'
        ? this.translate.instant('edit.item.dialog.button.create')
        : this.translate.instant('edit.item.dialog.button.update');

    this.dialogTitle =
      this.mode === 'create'
        ? this.translate.instant('edit.item.dialog.title.create')
        : this.translate.instant('edit.item.dialog.title.update');
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
}
