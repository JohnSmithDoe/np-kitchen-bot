import {CurrencyPipe} from "@angular/common";
import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {InputCustomEvent, SelectCustomEvent} from "@ionic/angular";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {addIcons} from "ionicons";
import {closeCircle} from "ionicons/icons";
import {StorageItem, TItemUnit, TPackagingUnit} from "../../@types/types";
import {DatabaseService} from "../../services/database.service";
import {CategoriesDialogComponent} from "../categories-dialog/categories-dialog.component";

@Component({
  selector: 'app-edit-item-dialog',
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
  ],
  templateUrl: './edit-item-dialog.component.html',
  styleUrl: './edit-item-dialog.component.scss'
})
export class EditItemDialogComponent implements OnInit {
  readonly #database = inject(DatabaseService);
  readonly translate = inject(TranslateService);

  @Input() item?: StorageItem | null;
  @Input() mode: 'update' | 'create' = 'create';
  @Input() value!: StorageItem;

  @Output() saveItem = new EventEmitter<StorageItem>();
  @Output() cancel = new EventEmitter();

  selectCategories = false;
  dialogTitle = '';
  saveButtonText = '';
  currencyCode: 'EUR' | 'USD' = 'EUR';

  constructor() {
    addIcons({closeCircle});
  }

  ngOnInit(): void {
    this.currencyCode = this.translate.currentLang !== 'en' ? 'EUR' : 'USD';
    this.saveButtonText = this.mode === 'create'
      ? this.translate.instant('new.item.dialog.button.create')
      : this.translate.instant('new.item.dialog.button.update');

    this.dialogTitle = this.mode === 'create'
      ? this.translate.instant('new.item.dialog.title.create')
      : this.translate.instant('new.item.dialog.title.update');

    this.value = this.item
      ? this.#database.cloneStorageItem(this.item)
      : DatabaseService.createStorageItem('')
  }


  setCategories(categories?: string[]) {
    this.selectCategories = false;
    this.value.category = categories;
  }

  removeCategory(cat: string) {
    this.value.category?.splice(this.value.category?.indexOf(cat),1);
    // update object reference
    this.value.category = this.value.category ? [...this.value.category] : undefined;
  }

  setUnit(ev: SelectCustomEvent<TItemUnit>) {
    this.value.unit = ev.detail.value;
    if(this.value.unit === 'ml') {
      this.value.packaging = 'bottle';
    }else if( this.value.packaging === 'bottle') {
      this.value.packaging = 'loose'
    }
  }

  setPackaging(ev: SelectCustomEvent<TPackagingUnit>) {
    this.value.packaging = ev.detail.value;
  }

  updatePrice(ev: InputCustomEvent<FocusEvent>) {
    let inputValue = ev.target.value as string;
    // get rid of all non-numeric chars
    inputValue = inputValue.replace(/[^0-9,.-]+/g,"");

    // if entered in english -> german e.g. 12.34 -> 12,34
    if((/[0-9].*\.[0-9]{1,2}$/).test(inputValue)) {
      inputValue = inputValue.replace(/\./g, 'X');
      inputValue = inputValue.replace(/,/g, '.');
      inputValue = inputValue.replace(/X/g, ',');
    }
    // only numbers , and - (points are removed) e.g. 1.234,34 € -> 1234,34
    const cleanInput = inputValue.replace(/[^0-9,-]+/g,"");
    // swap german , with . e.g. 1234,34 -> 1234.34
    const numberInput = cleanInput.replace(/,+/g,".");
    this.value.price = Number.parseFloat(numberInput);
  }
}
