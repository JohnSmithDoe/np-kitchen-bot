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

  @Output() deleteItem = new EventEmitter<StorageItem>();
  @Output() moveItem = new EventEmitter<StorageItem>();

  categories: { items: StorageItem[]; name: string }[] = [];
  items: StorageItem[] = [];
  isCreating = false;
  mode: 'alphabetical' | 'categories' = 'alphabetical';
  searchTerm?: string | null;

  constructor() {
    addIcons({add, remove, cart})
  }

  ngOnInit(): void {
    this.isCreating = false;
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
        foundByName ||= (item.category?.toLowerCase().indexOf(searchFor) ?? -1) >= 0;
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

  selectItem(item: StorageItem) {
    // this.addItem.emit(item);
    // this.isOpen = false;
  }

  moveTo(item: StorageItem) {
    this.moveItem.emit(item);
  }
  async deleteOnDrag($event: NPIonDragEvent, item: StorageItem, list: IonList) {
    console.log($event.detail);
    // TODO: percent instead pixel
    if ($event.detail.amount > 250) {
      await list.closeSlidingItems();
      this.itemList.items.splice(this.itemList.items.indexOf(item), 1);
      this.deleteItem.emit(item);
    }
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  openNewDialog() {
    this.isCreating = true;
  }

  async createItem(item?: StorageItem) {
    if (item?.name.length) {
      await this.#database.saveItem(item);
      this.categories = getCategoriesFromList(this.itemList);
    }
    this.isCreating = false;
  }

}

