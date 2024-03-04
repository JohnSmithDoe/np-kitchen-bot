import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
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
import { IBaseItem, IItemCategory, TColor } from '../../@types/types';
import { getCategoriesFromList } from '../../app.utils';
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
export class ItemListComponent implements OnInit, OnChanges {
  @ViewChild('ionList', { static: true }) ionList?: IonList;

  @Input() itemTemplate!: TemplateRef<any>;
  @Input() items: IBaseItem[] = [];
  @Input() mode: 'alphabetical' | 'categories' = 'alphabetical';

  categories: IItemCategory[] = [];
  // searchTerm?: string | null;

  @Output() selectCategory = new EventEmitter<IItemCategory>();
  @Output() reorder = new EventEmitter<ItemReorderEventDetail>();

  @Input() header?: string;
  @Input() headerColor?: TColor;

  reorderDisabled = true;

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  ngOnInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('items')) {
      this.categories = getCategoriesFromList({
        items: this.items,
        id: '',
        title: '',
      });
    }
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