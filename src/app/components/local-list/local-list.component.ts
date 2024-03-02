import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemReorderEventDetail, SearchbarCustomEvent } from '@ionic/angular';
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
import * as dayjs from 'dayjs';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import {
  IBaseItem,
  IGlobalItem,
  IItemCategory,
  IItemList,
  ILocalItem,
  TColor,
  TIonDragEvent,
} from '../../@types/types';
import { createLocalItem } from '../../app.factory';
import {
  checkItemOptionsOnDrag,
  getCategoriesFromList,
  getCategoryItemsFromList,
} from '../../app.utils';
import { CategoriesPipe } from '../../pipes/categories.pipe';
import { DatabaseService } from '../../services/database.service';
import { CreateItemComponent } from '../create-item/create-item.component';
import { GlobalItemComponent } from '../global-item/global-item.component';
import { LocalItemComponent } from '../local-item/local-item.component';

@Component({
  selector: 'app-local-list',
  templateUrl: 'local-list.component.html',
  styleUrls: ['local-list.component.scss'],
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
    LocalItemComponent,
    CategoriesPipe,
    IonNote,
    GlobalItemComponent,
    CreateItemComponent,
  ],
})
export class LocalListComponent implements OnInit {
  readonly #database = inject(DatabaseService);

  @Input() itemList!: IItemList<ILocalItem>;
  @Input() search: 'full' | 'name-only' = 'full';

  @Input() header?: string;
  @Input() headerColor?: TColor;
  @Input() itemHelper?: string;
  @Input() itemColor?: TColor;
  @Input({ transform: booleanAttribute }) canAddTemporary = true;
  @Input({ transform: booleanAttribute }) canReorder = false;
  @Input({ transform: booleanAttribute }) canDelete = false;
  @Input({ transform: booleanAttribute }) canMove = false;

  @Output() addItem = new EventEmitter<ILocalItem>();
  @Output() createItem = new EventEmitter<IBaseItem>();
  @Output() selectItem = new EventEmitter<ILocalItem>();
  @Output() altItem = new EventEmitter<IGlobalItem>();
  @Output() deleteItem = new EventEmitter<ILocalItem>();
  @Output() emptyItem = new EventEmitter<void>();
  @Output() moveItem = new EventEmitter<ILocalItem>();

  categories: IItemCategory[] = [];
  items: ILocalItem[] = [];
  alternatives: IGlobalItem[] = [];
  mode: 'alphabetical' | 'categories' = 'alphabetical';
  sortBy?: 'alphabetical' | 'bestbefore';
  sortDir: 'asc' | 'desc' = 'asc';
  searchTerm?: string | null;
  currentCategory?: IItemCategory;

  reorderDisabled = true;

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  ngOnInit(): void {
    this.items = this.itemList.items;
    this.updateCategories();
    this.searchTerm = undefined;
  }

  // needs to be called on changes inside the itemList
  updateCategories() {
    this.categories = getCategoriesFromList(this.itemList);
    if (this.currentCategory) {
      this.currentCategory = this.categories.find(
        (cat) => cat.name === this.currentCategory?.name
      );
      this.items = getCategoryItemsFromList(
        this.currentCategory,
        this.itemList
      );
    }
  }

  chooseCategory(category: IItemCategory) {
    this.currentCategory = category;
    this.items = this.itemList.items.filter((item) =>
      category.items.includes(item)
    );
    this.mode = 'alphabetical';
  }

  searchTermChange(ev: SearchbarCustomEvent) {
    this.searchItem(ev.detail.value);
  }

  searchItem(searchTerm?: string | null) {
    this.searchTerm = searchTerm;
    if (this.searchTerm) {
      const searchFor = this.searchTerm.toLowerCase();
      const byName = this.itemList.items.filter(
        (item) => item.name.toLowerCase().indexOf(searchFor) >= 0
      );
      const byCat =
        this.search !== 'full'
          ? []
          : this.itemList.items.filter(
              (item) =>
                !byName.includes(item) &&
                (item.category?.findIndex(
                  (cat) => cat.toLowerCase().indexOf(searchFor) >= 0
                ) ?? -1) >= 0
            );
      this.items = [...byName, ...byCat];
      let others = this.#database.all.items.filter(
        (dbItem) => !this.items.find((aItem) => aItem.name === dbItem.name)
      );
      this.alternatives = others.filter(
        (item) => item.name.toLowerCase().indexOf(searchFor) >= 0
      );
      this.alternatives = this.alternatives.concat(
        ...others.filter(
          (item) =>
            !this.alternatives.includes(item) &&
            (item.category?.findIndex(
              (cat) => cat.toLowerCase().indexOf(searchFor) >= 0
            ) ?? -1) >= 0
        )
      );
    } else {
      this.items = this.itemList.items;
      this.alternatives = [];
    }
  }

  setDisplayMode(
    mode: 'alphabetical' | 'categories' | 'bestbefore',
    sortBy: 'alphabetical' | 'bestbefore' = 'alphabetical'
  ) {
    this.items = this.itemList.items;
    this.mode = mode === 'bestbefore' ? 'alphabetical' : mode;
    this.currentCategory = undefined;
    this.#sortList(sortBy);
  }

  async handleItemOptionsOnDrag(
    ev: TIonDragEvent,
    item: ILocalItem,
    list: IonList
  ) {
    switch (checkItemOptionsOnDrag(ev)) {
      case 'end':
        await this.deleteItemFromList(list, item);
        break;
      case 'start':
        await this.moveItemFromList(list, item);
        break;
    }
  }
  async deleteItemFromList(list: IonList, item: ILocalItem) {
    await list.closeSlidingItems();
    this.deleteItem.emit(item);
  }
  async moveItemFromList(list: IonList, item: ILocalItem) {
    await list.closeSlidingItems();
    this.moveItem.emit(item);
  }

  async handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    if (!this.currentCategory) {
      await this.#database.reorder(this.itemList, ev.detail.from, ev.detail.to);
    }
    // Finish the reorder and position the item in the DOM
    ev.detail.complete(!this.currentCategory);
  }

  refresh(resetSearch = true) {
    this.updateCategories();
    this.searchItem(resetSearch ? null : this.searchTerm);
  }

  includedInOthers() {
    const toLowerCaseSearchTerm = this.searchTerm?.toLowerCase();
    return (
      !!this.alternatives.find(
        (item) => item.name.toLowerCase() === toLowerCaseSearchTerm
      ) ||
      !!this.items.find(
        (item) => item.name.toLowerCase() === toLowerCaseSearchTerm
      )
    );
  }
  toggleReorder() {
    this.reorderDisabled = !this.reorderDisabled;
    this.setDisplayMode('alphabetical');
  }

  async changeQuantity(item: ILocalItem, diff: number) {
    item.quantity = Math.max(0, item.quantity + diff);
    await this.#database.save();
  }

  #sortList(mode: 'alphabetical' | 'bestbefore') {
    if (this.sortBy === mode) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDir = 'asc';
    }
    this.sortBy = mode;
    this.items.sort((a, b) => {
      const MAXDATE = '5000-1-1';
      switch (mode) {
        case 'alphabetical':
          return this.sortDir === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'bestbefore':
          return this.sortDir === 'asc'
            ? dayjs(a.bestBefore ?? MAXDATE).unix() -
                dayjs(b.bestBefore ?? MAXDATE).unix()
            : dayjs(b.bestBefore ?? MAXDATE).unix() -
                dayjs(a.bestBefore ?? MAXDATE).unix();
      }
    });
  }

  addTemporary(base: IBaseItem) {
    if (!this.searchTerm) return;
    this.addItem.emit(createLocalItem(base.name, base.category));
  }
}
