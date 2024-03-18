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
  IonList,
  IonListHeader,
  IonNote,
  IonReorder,
  IonRippleEffect,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { IShoppingItem, TColor, TIonDragEvent } from '../../../@types/types';
import { checkItemOptionsOnDrag } from '../../../app.utils';
import { CategoryNoteDirective } from '../../../directives/category-note.directive';
import { ItemListComponent } from '../../item-list/item-list.component';

@Component({
  selector: 'app-shopping-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shopping-item.component.html',
  styleUrls: ['./shopping-item.component.scss'],
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
    IonRippleEffect,
    DatePipe,
    IonText,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    CategoryNoteDirective,
  ],
})
export class ShoppingItemComponent implements OnInit {
  @Input() item!: IShoppingItem;
  @Input() color?: TColor;
  @Input() itemList?: ItemListComponent;
  @Input({ required: true }) ionList!: IonList;

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
    if (this.itemList) await this.itemList.closeSlidingItems();
    else await this.ionList.closeSlidingItems();

    this.deleteItem.emit();
  }

  async emitCartItem() {
    if (this.itemList) await this.itemList.closeSlidingItems();
    else await this.ionList.closeSlidingItems();

    this.cartItem.emit();
  }
}
