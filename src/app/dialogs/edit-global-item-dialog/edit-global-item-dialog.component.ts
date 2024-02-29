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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import {
  IGlobalItem,
  TBestBeforeTimespan,
  TItemUnit,
  TPackagingUnit,
} from '../../@types/types';
import { DatabaseService } from '../../services/database.service';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';

@Component({
  selector: 'app-edit-global-item-dialog',
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
    IonNote,
    IonText,
  ],
  templateUrl: './edit-global-item-dialog.component.html',
  styleUrl: './edit-global-item-dialog.component.scss',
})
export class EditGlobalItemDialogComponent implements OnInit {
  readonly #database = inject(DatabaseService);
  readonly translate = inject(TranslateService);

  @Input() item?: IGlobalItem | null;
  @Input() mode: 'update' | 'create' = 'create';
  @Input() value!: IGlobalItem;

  @Output() saveItem = new EventEmitter<IGlobalItem>();
  @Output() cancel = new EventEmitter();

  selectCategories = false;
  dialogTitle = '';
  saveButtonText = '';
  currencyCode: 'EUR' | 'USD' = 'EUR';

  date_event: any;

  datePick() {
    console.log(this.date_event);
    this.date_event = this.date_event.substring(0, 10);
  }
  constructor() {
    addIcons({ closeCircle });
  }

  ngOnInit(): void {
    this.currencyCode = this.translate.currentLang !== 'en' ? 'EUR' : 'USD';
    this.saveButtonText =
      this.mode === 'create'
        ? this.translate.instant('edit.global.item.dialog.button.create')
        : this.translate.instant('edit.global.item.dialog.button.update');

    this.dialogTitle =
      this.mode === 'create'
        ? this.translate.instant('edit.global.item.dialog.title.create')
        : this.translate.instant('edit.global.item.dialog.title.update');

    this.value = this.item
      ? this.#database.cloneItem(this.item)
      : DatabaseService.createGlobalItem('');
  }

  setCategories(categories?: string[]) {
    this.selectCategories = false;
    this.value.category = categories;
  }

  removeCategory(cat: string) {
    this.value.category?.splice(this.value.category?.indexOf(cat), 1);
    // update object reference
    this.value.category = this.value.category
      ? [...this.value.category]
      : undefined;
  }

  setUnit(ev: SelectCustomEvent<TItemUnit>) {
    this.value.unit = ev.detail.value;
    if (this.value.unit === 'ml') {
      this.value.packaging = 'bottle';
    } else if (this.value.packaging === 'bottle') {
      this.value.packaging = 'loose';
    }
  }

  setPackaging(ev: SelectCustomEvent<TPackagingUnit>) {
    this.value.packaging = ev.detail.value;
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
    this.value.price = Number.parseFloat(numberInput);
  }

  setBestBeforeTimespan(ev: SelectCustomEvent<TBestBeforeTimespan>) {
    this.value.bestBeforeTimespan = ev.detail.value;
    this.value.bestBeforeTimevalue =
      this.value.bestBeforeTimespan === 'forever' ? undefined : 1;
  }
}
