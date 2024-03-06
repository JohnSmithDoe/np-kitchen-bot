import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonButton, IonContent, IonModal } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as dayjs from 'dayjs';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IGlobalItem,
  IItemCategory,
  IItemList,
  ISearchResult,
  IStorageItem,
} from '../../@types/types';
import {
  createGlobalItem,
  createStorageItem,
  createStorageItemFromGlobal,
} from '../../app.factory';
import { getItemsFromCategory } from '../../app.utils';
import { StorageItemComponent } from '../../components/item-list-items/storage-item/storage-item.component';
import { TextItemComponent } from '../../components/item-list-items/text-item/text-item.component';
import { ItemListEmptyComponent } from '../../components/item-list/item-list-empty/item-list-empty.component';
import { ItemListQuickaddComponent } from '../../components/item-list/item-list-quick-add/item-list-quickadd.component';
import { ItemListSearchbarComponent } from '../../components/item-list/item-list-searchbar/item-list-searchbar.component';
import { ItemListToolbarComponent } from '../../components/item-list/item-list-toolbar/item-list-toolbar.component';
import { ItemListComponent } from '../../components/item-list/item-list.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditStorageItemDialogComponent } from '../../dialogs/edit-storage-item-dialog/edit-storage-item-dialog.component';
import { CategoriesPipe } from '../../pipes/categories.pipe';
import { DatabaseService } from '../../services/database.service';
import { UiService } from '../../services/ui.service';
import { selectStorageList } from '../../state/storage.selector';

@Component({
  selector: 'app-page-storage',
  templateUrl: 'storage.page.html',
  styleUrls: ['storage.page.scss'],
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
    StorageItemComponent,
    EditStorageItemDialogComponent,
    CategoriesPipe,
    IonButton,
    AsyncPipe,
  ],
})
export class StoragePage implements OnInit {
  @ViewChild(ItemListSearchbarComponent, { static: true })
  listSearchbar?: ItemListSearchbarComponent;

  @ViewChild('storageListComponent', { static: true })
  listComponent!: ItemListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);
  readonly #store = inject(Store);

  itemList!: IItemList<IStorageItem>;

  isCreating = false;
  createNewItem: IGlobalItem | null | undefined;

  isEditing = false;
  editItem: IStorageItem | null | undefined;
  editMode: 'update' | 'create' = 'create';
  items: IStorageItem[] = [];

  searchResult?: ISearchResult<IStorageItem>;
  mode: 'alphabetical' | 'categories' = 'alphabetical';

  sortBy?: 'alphabetical' | 'bestBefore';
  sortDir: 'asc' | 'desc' = 'asc';

  rxItems$ = this.#store.select(selectStorageList);

  constructor() {
    addIcons({ add, remove });
  }

  ngOnInit(): void {
    this.itemList = this.#database.storage;
    this.items = this.itemList.items;
    this.createNewItem = null;
    console.log(this.#store);
  }

  async addItem(item?: IStorageItem) {
    // do not add an already contained item (could be triggered by a shortcut)
    if (this.searchResult?.foundInList) {
      await this.#uiService.showToast(
        this.translate.instant('toast.add.item.error.contained', {
          name: this.searchResult?.foundInList.name,
        }),
        'storage'
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

  async updateItem(item?: IStorageItem) {
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

  async removeItem(item: IStorageItem) {
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
    let litem: IStorageItem | undefined = createStorageItemFromGlobal(item);
    return this.addItem(litem);
  }

  async quickAddItem() {
    if (!this.searchResult?.hasSearchTerm) return;
    const litem = createStorageItem(this.searchResult.searchTerm);
    return this.addItem(litem);
  }

  async createGlobalItem(item?: IGlobalItem) {
    this.isCreating = false;
    this.createNewItem = null;

    if (item?.name.length) {
      await this.#database.addOrUpdateItem(item, this.#database.all);
      const copy = createStorageItemFromGlobal(item);
      const litem = await this.#database.addItem(copy, this.itemList);
      this.#refreshItems();
      await this.#uiService.showToast(
        this.translate.instant('toast.created.item', {
          name: litem?.name,
        })
      );
    }
  }

  async copyToShoppingList(item?: IStorageItem) {
    await this.listComponent?.closeSlidingItems();
    if (!item) return;
    item = this.#database.cloneItem(item);
    item.quantity = 0;
    item = await this.#database.addItem(item, this.#database.shoppinglist());
    if (item) {
      item.quantity++;
    }

    await this.#uiService.showToast(
      this.translate.instant('storage.page.toast.move', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }

  setDisplayMode(mode: 'alphabetical' | 'categories' | 'bestBefore') {
    this.mode = mode === 'bestBefore' ? 'alphabetical' : mode;
    this.#sortList(mode === 'categories' ? 'alphabetical' : mode);
    this.#refreshItems();
  }

  selectCategory(category: IItemCategory) {
    this.items = getItemsFromCategory(category, this.itemList);
    this.mode = 'alphabetical';
  }

  changeQuantity(item: IStorageItem, diff: number) {
    item.quantity = Math.max(0, item.quantity + diff);
    return this.#database.save();
  }

  showCreateGlobalDialog() {
    this.isCreating = true; // show create dialog with the new item
    this.createNewItem = createGlobalItem(this.searchResult?.searchTerm ?? '');
  }

  showEditDialog(item?: IStorageItem) {
    this.isEditing = true;
    this.editItem =
      item ?? createStorageItem(this.searchResult?.searchTerm ?? '');
    this.editMode = item ? 'update' : 'create';
  }

  searchFor(searchTerm: string) {
    this.searchResult = this.#database.search(this.itemList, searchTerm);
    this.items = this.searchResult?.listItems || [...this.itemList.items];
  }

  #clearSearch() {
    this.searchResult = undefined;
    this.listSearchbar?.clear();
  }

  #refreshItems() {
    this.items = [...this.itemList.items];
    this.#clearSearch();
  }

  #sortList(mode: 'alphabetical' | 'bestBefore') {
    if (this.sortBy === mode) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDir = 'asc';
    }
    this.sortBy = mode;
    const sortFn = (a: IStorageItem, b: IStorageItem) => {
      const MAXDATE = '5000-1-1';
      switch (mode) {
        case 'alphabetical':
          return this.sortDir === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'bestBefore':
          return this.sortDir === 'asc'
            ? dayjs(a.bestBefore ?? MAXDATE).unix() -
                dayjs(b.bestBefore ?? MAXDATE).unix()
            : dayjs(b.bestBefore ?? MAXDATE).unix() -
                dayjs(a.bestBefore ?? MAXDATE).unix();
      }
    };
    this.itemList.items.sort(sortFn);
  }
}
