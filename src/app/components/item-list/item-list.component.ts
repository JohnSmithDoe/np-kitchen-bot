import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
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
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import { IBaseItem, TColor, TItemListCategory } from '../../@types/types';
import { GlobalItemComponent } from '../item-list-items/global-item/global-item.component';
import { TextItemComponent } from '../item-list-items/text-item/text-item.component';

@Component({
  selector: 'app-item-list',
  templateUrl: 'item-list.component.html',
  styleUrls: ['item-list.component.scss'],
  standalone: true,
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
  ],
})
export class ItemListComponent implements OnChanges {
  @ViewChild('ionList', { static: true }) ionList?: IonList;

  @Input() itemTemplate!: TemplateRef<any>;
  @Input({ required: true }) items?: ReadonlyArray<IBaseItem> | null;
  @Input() mode: 'alphabetical' | 'categories' = 'alphabetical';

  categories: TItemListCategory[] = [];
  // searchTerm?: string | null;

  @Output() selectCategory = new EventEmitter<TItemListCategory>();
  @Output() reorder = new EventEmitter<ItemReorderEventDetail>();

  @Input() header?: string;
  @Input() headerColor?: TColor;

  reorderDisabled = true;

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
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
