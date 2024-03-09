import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
import { ItemListComponent } from '../../item-list/item-list.component';

@Component({
  selector: 'app-storage-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  @Input({ required: true }) itemList!: ItemListComponent;

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

  async handleItemOptionsOnDrag(ev: TIonDragEvent) {
    switch (checkItemOptionsOnDrag(ev)) {
      case 'end':
        return this.emitDeleteItem();
      case 'start':
        return this.emitCartItem();
    }
  }

  async emitDeleteItem() {
    await this.itemList.closeSlidingItems();
    this.deleteItem.emit();
  }

  async emitCartItem() {
    await this.itemList.closeSlidingItems();
    this.cartItem.emit();
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
