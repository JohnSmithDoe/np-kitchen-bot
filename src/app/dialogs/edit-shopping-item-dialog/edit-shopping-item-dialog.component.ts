import { CurrencyPipe, DatePipe } from '@angular/common';
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
import { InputCustomEvent } from '@ionic/angular';
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
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import {
  IShoppingItem,
  TItemListCategory,
  TUpdateDTO,
} from '../../@types/types';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';

@Component({
  selector: 'app-edit-shopping-item-dialog',
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
    IonText,
  ],
  templateUrl: './edit-shopping-item-dialog.component.html',
  styleUrl: './edit-shopping-item-dialog.component.scss',
})
export class EditShoppingItemDialogComponent implements OnInit {
  readonly translate = inject(TranslateService);

  @Input() item?: TUpdateDTO<IShoppingItem> | null;
  @Input() categories: string[] = [];
  @Input() mode: 'update' | 'create' = 'create';

  @Output() saveItem = new EventEmitter<Partial<IShoppingItem>>();
  @Output() cancel = new EventEmitter();

  selectCategories = false;
  dialogTitle = '';
  saveButtonText = '';
  currencyCode: 'EUR' | 'USD' = 'EUR';

  nameValue?: string;
  categoryValue: TItemListCategory[] | undefined;
  quantityValue?: number;
  priceValue?: number;

  submitChanges() {
    this.saveItem.emit({
      ...this.item,
      name: this.nameValue,
      category: this.categoryValue,
      quantity: this.quantityValue,
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
    this.quantityValue = this.item?.quantity;
    this.priceValue = this.item?.price;

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
