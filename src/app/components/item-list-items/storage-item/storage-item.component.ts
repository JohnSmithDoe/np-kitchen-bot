import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonListHeader,
  IonNote,
  IonReorder,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { IStorageItem, TColor, TIonDragEvent } from '../../../@types/types';
import { checkItemOptionsOnDrag } from '../../../app.utils';
import { CategoryNoteDirective } from '../../../directives/category-note.directive';

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
    IonAvatar,
    IonChip,
    DatePipe,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonText,
    CategoryNoteDirective,
  ],
})
export class StorageItemComponent implements OnInit {
  @Input() item!: IStorageItem;
  @Input() color?: TColor;

  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
  @Output() selectItem = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<void>();
  @Output() cartItem = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    if (!this.item) throw new Error('Item must be set');
  }

  // inner button click
  incrementQuantity(ev: MouseEvent) {
    this.increment.emit();
    ev.stopPropagation();
  }

  // inner button click
  decrementQuantity(ev: MouseEvent) {
    this.decrement.emit();
    ev.stopPropagation();
  }

  handleItemOptionsOnDrag(ev: TIonDragEvent) {
    switch (checkItemOptionsOnDrag(ev)) {
      case 'end':
        this.deleteItem.emit();
        break;
      case 'start':
        this.cartItem.emit();
        break;
    }
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