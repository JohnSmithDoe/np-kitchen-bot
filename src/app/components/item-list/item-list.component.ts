import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  OnInit,
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
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import { IBaseItem, IItemCategory, TColor } from '../../@types/types';
import { CategoriesPipe } from '../../pipes/categories.pipe';
import { BaseItemComponent } from '../base-item/base-item.component';
import { GlobalItemComponent } from '../global-item/global-item.component';

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
    CategoriesPipe,
    IonNote,
    GlobalItemComponent,
    BaseItemComponent,
  ],
})
export class ItemListComponent implements OnInit {
  @ViewChild('ionList', { static: true }) ionList?: IonList;

  @Input() itemTemplate!: TemplateRef<any>;
  @Input() items: IBaseItem[] = [];
  @Input({ transform: booleanAttribute }) showEmpty = true;

  categories: IItemCategory[] = [];
  mode: 'alphabetical' | 'categories' = 'alphabetical';
  // searchTerm?: string | null;

  @Output() selectCategory = new EventEmitter<IItemCategory>();
  @Output() reorder = new EventEmitter<ItemReorderEventDetail>();

  @Input() header?: string;
  @Input() headerColor?: TColor;

  @Output() emptyItem = new EventEmitter<void>();

  reorderDisabled = true;

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  ngOnInit(): void {
    //
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
