import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonListHeader,
  IonNote,
  IonReorder,
  IonRippleEffect,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { IStorageItem, TColor } from '../../@types/types';
import { createStorageItem } from '../../app.factory';
import { CategoriesPipe } from '../../pipes/categories.pipe';

@Component({
  selector: 'app-storage-item',
  standalone: true,
  templateUrl: './storage-item.component.html',
  styleUrls: ['./storage-item.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
    IonIcon,
    IonReorder,
    TranslateModule,
    NgTemplateOutlet,
    IonNote,
    IonListHeader,
    CategoriesPipe,
    IonAvatar,
    IonChip,
    IonRippleEffect,
    DatePipe,
    IonText,
  ],
})
export class StorageItemComponent implements OnInit, OnChanges {
  @Input() item!: IStorageItem;
  @Input() label?: string;
  @Input() color?: TColor;
  @Input() category?: string;
  @Input() categoryAlt?: string;
  @Input() helper?: string;

  @Output() selectItem = new EventEmitter<IStorageItem>();
  @Output() increment = new EventEmitter<IStorageItem>();
  @Output() decrement = new EventEmitter<IStorageItem>();

  constructor() {}

  ngOnInit() {
    if (!this.item && !this.label)
      throw new Error('Either label or item must be set');
    if (!this.item) {
      this.#updateItem();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('label') && this.label) {
      this.#updateItem();
    }
  }

  #updateItem() {
    if (this.label) {
      this.item = createStorageItem(this.label, this.category);
    }
  }

  // inner button click
  incrementQuantity(ev: MouseEvent) {
    this.increment.emit(this.item);
    ev.stopPropagation();
  }

  // inner button click
  decrementQuantity(ev: MouseEvent) {
    this.decrement.emit(this.item);
    ev.stopPropagation();
  }

  getColor(item: IStorageItem): TColor {
    let result: TColor = 'success';
    if (item.minAmount) {
      if (item.quantity === item.minAmount) {
        result = 'warning';
      } else if (item.quantity < item.minAmount) {
        result = 'danger';
      }
    }
    return result;
  }
}
