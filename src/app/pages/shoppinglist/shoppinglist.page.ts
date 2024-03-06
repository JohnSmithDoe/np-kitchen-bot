import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  IGlobalItem,
  IItemCategory,
  IItemList,
  ISearchResult,
  IShoppingItem,
  IStorageItem,
} from '../../@types/types';
import {
  createGlobalItem,
  createShoppingItem,
  createShoppingItemFromGlobal,
  createShoppingItemFromStorage,
} from '../../app.factory';
import { getItemsFromCategory } from '../../app.utils';
import { ShoppingItemComponent } from '../../components/item-list-items/shopping-item/shopping-item.component';
import { TextItemComponent } from '../../components/item-list-items/text-item/text-item.component';
import { ItemListEmptyComponent } from '../../components/item-list/item-list-empty/item-list-empty.component';
import { ItemListQuickaddComponent } from '../../components/item-list/item-list-quick-add/item-list-quickadd.component';
import { ItemListSearchbarComponent } from '../../components/item-list/item-list-searchbar/item-list-searchbar.component';
import { ItemListToolbarComponent } from '../../components/item-list/item-list-toolbar/item-list-toolbar.component';
import { ItemListComponent } from '../../components/item-list/item-list.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditShoppingItemDialogComponent } from '../../dialogs/edit-shopping-item-dialog/edit-shopping-item-dialog.component';
import { CategoriesPipe } from '../../pipes/categories.pipe';
import { DatabaseService } from '../../services/database.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-page-shopping-list',
  templateUrl: 'shoppinglist.page.html',
  styleUrls: ['shoppinglist.page.scss'],
  standalone: true,
  imports: [
    PageHeaderComponent,
    IonContent,
    ItemListSearchbarComponent,
    ItemListToolbarComponent,
    ItemListQuickaddComponent,
    ItemListComponent,
    TranslateModule,
    ItemListEmptyComponent,
    TextItemComponent,
    IonModal,
    EditGlobalItemDialogComponent,
    ShoppingItemComponent,
    EditShoppingItemDialogComponent,
    CategoriesPipe,
    AsyncPipe,
  ],
})
export class ShoppinglistPage implements OnInit {
  @ViewChild(ItemListSearchbarComponent, { static: true })
  listSearchbar?: ItemListSearchbarComponent;

  @ViewChild('shoppinglistComponent', { static: true })
  listComponent!: ItemListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);

  itemList!: IItemList<IShoppingItem>;

  isCreating = false;
  createNewItem: IGlobalItem | null | undefined;

  isEditing = false;
  editItem: IShoppingItem | null | undefined;
  editMode: 'update' | 'create' = 'create';

  #items = new BehaviorSubject<IShoppingItem[]>([]);
  items$: Observable<IShoppingItem[]> = this.#items.asObservable();

  searchResult?: ISearchResult<IShoppingItem>;
  mode: 'alphabetical' | 'categories' = 'alphabetical';

  sortBy?: 'alphabetical';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor() {
    addIcons({ add, remove });
  }

  ngOnInit(): void {
    this.itemList = this.#database.shoppinglist();
    this.#items.next([...this.itemList.items]); // TODO: sub here and pipe search?
    this.createNewItem = null;
  }

  async addItem(item?: IShoppingItem) {
    // do not add an already contained item (could be triggered by a shortcut)
    if (
      this.itemList.items.find(
        (aItem) => aItem.name.toLowerCase() === item?.name
      )
    ) {
      await this.#uiService.showToast(
        this.translate.instant('toast.add.item.error.contained', {
          name: item?.name,
        }),
        'shopping'
      );
    } else {
      item = await this.#database.addItem(item, this.itemList);
      this.#refreshItems();
      await this.#uiService.showToast(
        this.translate.instant('toast.add.item', {
          name: item?.name,
          total: item?.quantity,
        })
      );
    }
  }

  async updateItem(item?: IShoppingItem) {
    this.isEditing = false;
    this.editItem = null;
    await this.#database.addOrUpdateItem(item, this.itemList);
    this.#refreshItems();
    await this.#uiService.showToast(
      this.translate.instant('toast.update.item', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }

  async removeItem(item: IShoppingItem) {
    await this.listComponent?.closeSlidingItems();
    await this.#database.deleteItem(item, this.itemList);
    this.#refreshItems();
    await this.#uiService.showToast(
      this.translate.instant('toast.remove.item', {
        name: item?.name,
      })
    );
  }

  async addGlobalItem(item?: IGlobalItem) {
    if (!item) return;
    let litem: IShoppingItem | undefined = createShoppingItemFromGlobal(item);
    return this.addItem(litem);
  }

  async quickAddItem() {
    if (!this.searchResult?.hasSearchTerm) return;
    const litem = createShoppingItem(this.searchResult.searchTerm);
    return this.addItem(litem);
  }

  async createGlobalItem(item?: IGlobalItem) {
    this.isCreating = false;
    this.createNewItem = null;

    if (item?.name.length) {
      await this.#database.addOrUpdateItem(item, this.#database.all);
      const copy = createShoppingItemFromGlobal(item);
      const litem = await this.#database.addItem(copy, this.itemList);
      this.#refreshItems();
      await this.#uiService.showToast(
        this.translate.instant('toast.created.item', {
          name: litem?.name,
        })
      );
    }
  }

  async addStorageItem(item: IStorageItem) {
    const litem = createShoppingItemFromStorage(item);
    return this.addItem(litem);
  }

  // what should happen if we buy an item?

  async buyItem(item: IShoppingItem) {
    await this.listComponent?.closeSlidingItems();
    item.state = 'bought';
    await this.#database.addOrUpdateItem(item, this.itemList);
    this.#items.next(
      this.#sortList([...this.itemList.items], 'alphabetical', false)
    );
    await this.#uiService.showToast(
      this.translate.instant('shoppinglist.page.toast.move', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }

  setDisplayMode(mode: 'alphabetical' | 'categories') {
    this.#items.next(
      this.#sortList([...this.itemList.items], 'alphabetical', true)
    );
    this.#refreshItems();
    this.mode = mode;
  }

  selectCategory(category: IItemCategory) {
    this.#items.next([...getItemsFromCategory(category, this.itemList)]);
    this.mode = 'alphabetical';
  }

  async changeQuantity(item: IShoppingItem, diff: number) {
    item.quantity = Math.max(0, item.quantity + diff);
    return this.#database.save();
  }

  showCreateGlobalDialog() {
    this.isCreating = true; // show create dialog with the new item
    this.createNewItem = createGlobalItem(this.searchResult?.searchTerm ?? '');
  }

  showEditDialog(item?: IShoppingItem) {
    this.isEditing = true;
    this.editItem =
      item ?? createShoppingItem(this.searchResult?.searchTerm ?? '');
    this.editMode = item ? 'update' : 'create';
  }

  searchFor(searchTerm: string) {
    this.searchResult = this.#database.search(this.itemList, searchTerm);

    this.#items.next(
      this.#sortList(
        this.searchResult?.listItems || [...this.itemList.items],
        'alphabetical',
        false
      )
    );
  }

  #clearSearch() {
    this.searchResult = undefined;
    this.listSearchbar?.clear();
    this.#items.next([...this.itemList.items]);
  }

  #refreshItems() {
    this.#clearSearch();
  }

  #sortList(items: IShoppingItem[], mode: 'alphabetical', toggleDir = true) {
    if (toggleDir) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sortBy = mode;
    const sortFn = (a: IShoppingItem, b: IShoppingItem) => {
      if (!(a.state === 'bought' || b.state === 'bought')) {
        switch (mode) {
          case 'alphabetical':
            return this.sortDir === 'asc'
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
        }
      } else {
        return a.state === 'bought' ? 1 : -1;
      }
    };
    return items.sort(sortFn);
  }
}
