import {NgTemplateOutlet} from "@angular/common";
import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ItemReorderEventDetail, SearchbarCustomEvent} from "@ionic/angular";
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
  IonToolbar
} from '@ionic/angular/standalone';
import {TranslateModule} from "@ngx-translate/core";
import {addIcons} from "ionicons";
import {add, cart, list, remove} from "ionicons/icons";
import {NPIonDragEvent, StorageCategory, StorageItem, StorageItemList} from "../../@types/types";
import {CategoriesPipe} from "../../pipes/categories.pipe";
import {DatabaseService} from "../../services/database.service";
import {getCategoriesFromList} from "../../utils";
import {StorageItemComponent} from "../storage-item/storage-item.component";

@Component({
  selector: 'app-storage-list',
  templateUrl: 'storage-list.component.html',
  styleUrls: ['storage-list.component.scss'],
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
    StorageItemComponent,
    CategoriesPipe,
    IonNote,
  ]
})
export class StorageListComponent implements OnInit {
  readonly #database = inject(DatabaseService);

  @Input() header?: string;
  @Input() itemList!: StorageItemList;
  @Input() type: 'simple' | 'extended' = 'simple';
  @Input() search: 'full' | 'name-only' = 'full';

  @Output() createItem = new EventEmitter<StorageItem>();
  @Output() selectItem = new EventEmitter<StorageItem>();
  @Output() deleteItem = new EventEmitter<StorageItem>();
  @Output() emptyItem = new EventEmitter<void>();
  @Output() moveItem = new EventEmitter<StorageItem>();

  categories: { items: StorageItem[]; name: string }[] = [];
  items: StorageItem[] = [];
  alternatives: StorageItem[] = [];
  mode: 'alphabetical' | 'categories' = 'alphabetical';
  searchTerm?: string | null;
  currentCategory?: StorageCategory;

  reorderDisabled = false;

  constructor() {
    addIcons({add, remove, cart, list})
  }

  ngOnInit(): void {
    this.items = this.itemList.items;
    this.updateCategories();
    this.searchTerm = undefined;
  }
  // needs to be called on changes inside the itemList
  updateCategories() {
    this.categories = getCategoriesFromList(this.itemList);
    if(this.currentCategory) {
      this.currentCategory =
        this.categories.find(cat => cat.name === this.currentCategory?.name);
      this.items = this.currentCategory?.items ?? this.itemList.items;
    }
  }

  chooseCategory(category: StorageCategory) {
    this.currentCategory = category;
    this.items = category.items;
    this.mode = 'alphabetical';
  }

  searchTermChange(ev: SearchbarCustomEvent) {
    this.searchItem(ev.detail.value)
  }

  searchItem(searchTerm?: string|null) {
    this.searchTerm = searchTerm;
    if (this.searchTerm) {
      const searchFor = this.searchTerm.toLowerCase();
      this.items = this.itemList.items.filter(item => {
        let foundByName = item.name.toLowerCase().indexOf(searchFor) >= 0;
        // or by category
        foundByName ||= this.search === 'full'
          && ((item.category?.findIndex(cat => cat.toLowerCase().indexOf(searchFor) >= 0) ?? -1) >= 0);
        return foundByName;
      });
      this.alternatives = this.items.length
        ? []
        : this.#database.all.items.filter(item => {
          let foundByName = item.name.toLowerCase().indexOf(searchFor) >= 0;
          // or by category
          foundByName ||= ((item.category?.findIndex(cat => cat.toLowerCase().indexOf(searchFor) >= 0) ?? -1) >= 0);
          return foundByName;
        });
    } else {
      this.items = this.itemList.items;
      this.alternatives = [];
    }
  }

  setDisplayMode(mode: 'alphabetical' | 'categories') {
    this.items = this.itemList.items;
    this.mode = mode;
    this.currentCategory = undefined;
  }

  async handleItemOptionsOnDrag(ev: NPIonDragEvent, item: StorageItem, list: IonList) {
    // doubble the length or 250px
    if (ev.detail.ratio > 2 || ev.detail.amount > 250) {
      await this.deleteItemFromList(list, item);
    }else if (ev.detail.ratio < -2 || ev.detail.amount < -250) {
      await this.moveItemFromList(list, item);
    }
  }

  async deleteItemFromList(list: IonList, item: StorageItem) {
    await list.closeSlidingItems();
    this.deleteItem.emit(item);
  }
  async moveItemFromList(list: IonList, item: StorageItem) {
    await list.closeSlidingItems();
    this.moveItem.emit(item);
  }

  async handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to, this.currentCategory);
    if(!this.currentCategory) {
      console.log('reordering index', ev.detail.from, 'to', ev.detail.to);
      await this.#database.reorder(this.itemList, ev.detail.from, ev.detail.to);
    }
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete(!this.currentCategory);
  }

  async addTemporaryItem(item: StorageItem) {
    await this.#database.addItem(item, this.itemList);
    this.refresh();
    this.searchItem(null);
  }

  refresh() {
    this.updateCategories();
  }
}

