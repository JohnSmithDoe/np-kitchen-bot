import {NgTemplateOutlet} from "@angular/common";
import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
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
  IonReorder,
  IonReorderGroup,
  IonSearchbar,
  IonText,
  IonToolbar
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, cart, remove} from "ionicons/icons";
import {NPIonDragEvent, StorageItem, StorageItemList} from "../../@types/types";
import {DatabaseService} from "../../services/database.service";
import {getCategoriesFromList} from "../../utils";

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
    IonText
  ]
})
export class StorageListComponent implements OnInit {
  readonly #database = inject(DatabaseService);

  @Input() header?: string;
  @Input() itemList!: StorageItemList;
  @Input() type: 'simple' | 'extended' = 'simple';
  @Input() search: 'full' | 'name-only' = 'full';

  @Output() createItem = new EventEmitter<string>();
  @Output() selectItem = new EventEmitter<StorageItem>();
  @Output() deleteItem = new EventEmitter<StorageItem>();
  @Output() moveItem = new EventEmitter<StorageItem>();

  categories: { items: StorageItem[]; name: string }[] = [];
  items: StorageItem[] = [];
  mode: 'alphabetical' | 'categories' = 'alphabetical';
  searchTerm?: string | null;

  constructor() {
    addIcons({add, remove, cart})
  }

  ngOnInit(): void {
    this.items = this.itemList.items;
    this.categories = getCategoriesFromList(this.itemList);
    this.searchTerm = undefined;
  }

  chooseCategory(category: { items: StorageItem[]; name: string }) {
    this.items = category.items;
    this.mode = 'alphabetical';
  }

  searchItem($event: SearchbarCustomEvent) {
    this.searchTerm = $event.detail.value;
    if (this.searchTerm) {
      const searchFor = this.searchTerm.toLowerCase();
      this.items = this.itemList.items.filter(item => {
        let foundByName = item.name.toLowerCase().indexOf(searchFor) >= 0;
        // or by category
        foundByName ||= this.search === 'full' && (item.category?.toLowerCase().indexOf(searchFor) ?? -1) >= 0;
        return foundByName;
      });
    } else {
      this.items = this.itemList.items;
    }
  }


  setDisplayMode(mode: 'alphabetical' | 'categories') {
    this.items = this.itemList.items;
    this.mode = mode;
  }

  async deleteOnDrag($event: NPIonDragEvent, item: StorageItem, list: IonList) {
    // doubble the length or 250px
    if ($event.detail.ratio > 2 || $event.detail.amount > 250) {
      await this.deleteFromList(list, item);
    }
  }

  async deleteFromList(list: IonList, item: StorageItem) {
    await list.closeSlidingItems();
    this.deleteItem.emit(item);
  }

  async handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    await this.#database.reorder(this.itemList, ev.detail.from, ev.detail.to);
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }
}

