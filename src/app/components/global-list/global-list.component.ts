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
import { Color } from '@ionic/core/dist/types/interface';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import {
  IGlobalItem,
  IItemCategory,
  IItemList,
  TIonDragEvent,
} from '../../@types/types';
import { CategoriesPipe } from '../../pipes/categories.pipe';
import { DatabaseService } from '../../services/database.service';
import { checkItemOptionsOnDrag, getCategoriesFromList } from '../../utils';
import { GlobalItemComponent } from '../global-item/global-item.component';
import { LocalItemComponent } from '../local-item/local-item.component';

@Component({
  selector: 'app-global-list',
  templateUrl: 'global-list.component.html',
  styleUrls: ['global-list.component.scss'],
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
    LocalItemComponent,
    GlobalItemComponent,
  ],
})
export class GlobalListComponent implements OnInit {
  readonly #database = inject(DatabaseService);

  @Input() itemList!: IItemList<IGlobalItem>;
  @Input() search: 'full' | 'name-only' = 'full';

  @Input() header?: string;
  @Input() headerColor: Color = 'secondary';
  @Input() itemHelper?: string;
  @Input() itemColor?: Color;
  @Input({ transform: booleanAttribute }) canReorder = false;
  @Input({ transform: booleanAttribute }) canDelete = false;
  @Input({ transform: booleanAttribute }) canMove = false;

  @Output() createItem = new EventEmitter<IGlobalItem>();
  @Output() selectItem = new EventEmitter<IGlobalItem>();
  @Output() deleteItem = new EventEmitter<IGlobalItem>();
  @Output() emptyItem = new EventEmitter<void>();
  @Output() moveItem = new EventEmitter<IGlobalItem>();

  categories: IItemCategory<IGlobalItem>[] = [];
  items: IGlobalItem[] = [];
  mode: 'alphabetical' | 'categories' = 'alphabetical';
  searchTerm?: string | null;
  currentCategory?: IItemCategory<IGlobalItem>;

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
      this.items =
        (this.currentCategory?.items as IGlobalItem[]) ?? this.itemList.items;
    }
  }

  chooseCategory(category: IItemCategory<IGlobalItem>) {
    this.currentCategory = category;
    this.items = category.items;
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
    } else {
      this.items = this.itemList.items;
    }
  }

  setDisplayMode(mode: 'alphabetical' | 'categories') {
    this.items = this.itemList.items;
    this.mode = mode;
    this.currentCategory = undefined;
  }

  async handleItemOptionsOnDrag(
    ev: TIonDragEvent,
    item: IGlobalItem,
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

  async deleteItemFromList(list: IonList, item: IGlobalItem) {
    await list.closeSlidingItems();
    this.deleteItem.emit(item);
  }

  async moveItemFromList(list: IonList, item: IGlobalItem) {
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
    return !!this.items.find(
      (item) => item.name.toLowerCase() === toLowerCaseSearchTerm
    );
  }

  toggleReorder() {
    this.reorderDisabled = !this.reorderDisabled;
    this.setDisplayMode('alphabetical');
  }
}
