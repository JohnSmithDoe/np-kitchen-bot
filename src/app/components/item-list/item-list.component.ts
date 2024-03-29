import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemReorderEventDetail } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent,
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
  IonReorderGroup,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import { IBaseItem, TColor, TItemListCategory } from '../../@types/types';
import { EditCategoryDialogComponent } from '../../dialogs/edit-category-dialog/edit-category-dialog.component';
import { CategoryItemComponent } from '../item-list-items/category-item/category-item.component';
import { GlobalItemComponent } from '../item-list-items/global-item/global-item.component';
import { TextItemComponent } from '../item-list-items/text-item/text-item.component';

@Component({
  selector: 'app-item-list',
  templateUrl: 'item-list.component.html',
  styleUrls: ['item-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // changeDetection: ChangeDetectionStrategy.OnPush, TODO: seems to work :D
  imports: [
    IonSearchbar,
    IonToolbar,
    IonButtons,
    IonButton,
    IonList,
    IonReorderGroup,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonIcon,
    IonReorder,
    IonItemOptions,
    IonItemOption,
    IonListHeader,
    NgTemplateOutlet,
    IonContent,
    IonText,
    FormsModule,
    TranslateModule,
    IonNote,
    GlobalItemComponent,
    TextItemComponent,
    IonTitle,
    CategoryItemComponent,
    EditCategoryDialogComponent,
  ],
})
export class ItemListComponent {
  @ViewChild('ionList', { static: true }) ionList?: IonList;

  @Input({ required: true }) itemTemplate!: TemplateRef<any>;
  @Input({ required: true }) items?: ReadonlyArray<IBaseItem> | null;
  @Input() categories?: ReadonlyArray<{
    category: TItemListCategory;
    count: number;
  }> | null;
  @Input() mode: 'alphabetical' | 'categories' = 'alphabetical';

  @Output() selectCategory = new EventEmitter<TItemListCategory>();
  @Output() deleteCategory = new EventEmitter<TItemListCategory>();

  @Output() reorder = new EventEmitter<ItemReorderEventDetail>();

  @Input() header?: string;
  @Input({ transform: booleanAttribute }) listHeader: boolean = false;
  @Input() headerColor?: TColor;

  @Input() reorderDisabled = true;

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  async closeSlidingItems() {
    await this.ionList?.closeSlidingItems();
  }

  async handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.reorder.emit(ev.detail);
    // Finish the reorder and position the item in the DOM
    ev.detail.complete();
  }
}
