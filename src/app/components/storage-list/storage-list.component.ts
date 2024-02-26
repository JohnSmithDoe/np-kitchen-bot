import {NgTemplateOutlet} from "@angular/common";
import {booleanAttribute, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
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
import {Color} from "@ionic/core/dist/types/interface";
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

  @Input() itemList!: StorageItemList;
  @Input() search: 'full' | 'name-only' = 'full';

  @Input() header?: string;
  @Input() headerColor: Color = 'secondary';
  @Input() itemHelper?: string;
  @Input() itemColor?: Color;
  @Input() itemType: 'simple' | 'extended' = 'extended';
  @Input({transform: booleanAttribute}) canAddTemporary = true;
  @Input({transform: booleanAttribute}) canReorder = false;
  @Input({transform: booleanAttribute}) canDelete = false;
  @Input({transform: booleanAttribute}) canMove = false;

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

  reorderDisabled = true;

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
      this.items = this.itemList.items
                       .filter(item => item.name.toLowerCase().indexOf(searchFor) >= 0)
                       .concat(
                         ...this.itemList.items
                                .filter(item => {
                                  return this.search === 'full'
                                    && ((item.category?.findIndex(cat => cat.toLowerCase()
                                                                            .indexOf(searchFor) >= 0) ?? -1) >= 0)
                                })
                       )
      const others = this.#database.all.items
                         .filter(dbItem => !this.items.find(aItem => aItem.id === dbItem.id));
      this.alternatives = others
        .filter(item => item.name.toLowerCase().indexOf(searchFor) >= 0)
        .concat(
          ...others
            .filter(item => ((item.category?.findIndex(cat => cat.toLowerCase()
                                                                 .indexOf(searchFor) >= 0) ?? -1) >= 0))
        );
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
    // tripple the length or 250px
    const MAX_DRAG_RATIO = 3;
    if (ev.detail.ratio > MAX_DRAG_RATIO || ev.detail.amount > 250) {
      await this.deleteItemFromList(list, item);
    }else if (ev.detail.ratio < -MAX_DRAG_RATIO || ev.detail.amount < -250) {
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
    this.refresh(true);
  }

  refresh(resetSearch = true) {
    this.updateCategories();
    this.searchItem(resetSearch ? null : this.searchTerm);
  }

  includedInOthers() {
    const toLowerCaseSearchTerm = this.searchTerm?.toLowerCase();
    return !!this.alternatives.find(item => item.name.toLowerCase() === toLowerCaseSearchTerm)
      || !!this.items.find(item => item.name.toLowerCase() === toLowerCaseSearchTerm);
  }
  toggleReorder() {
    this.reorderDisabled = !this.reorderDisabled;
    this.setDisplayMode('alphabetical');
  }
}

