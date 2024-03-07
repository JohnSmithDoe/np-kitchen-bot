import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonButton, IonContent, IonModal } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IGlobalItem,
  IStorageItem,
  TItemListCategory,
  TItemListMode,
} from '../../@types/types';
import {
  createStorageItem,
  createStorageItemFromGlobal,
} from '../../app.factory';
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
import { StorageActions } from '../../state/storage/storage.actions';
import {
  selectStorageListCategories,
  selectStorageListItems,
  selectStorageListSearchResult,
  selectStorageState,
} from '../../state/storage/storage.selector';

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
    JsonPipe,
  ],
})
export class StoragePage implements OnInit {
  readonly #dataService = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectStorageState);
  rxItems$ = this.#store.select(selectStorageListItems);
  rxCategories$ = this.#store.select(selectStorageListCategories);
  rxSearchResult$ = this.#store.select(selectStorageListSearchResult);

  constructor() {
    addIcons({ add, remove });
  }

  ngOnInit(): void {
    console.log('init');
  }

  async addItem(item?: IStorageItem) {
    // do not add an already contained item (could be triggered by a shortcut)
    // if (this.searchResult?.exactMatch) {
    //   await this.#uiService.showToast(
    //     this.translate.instant('toast.add.item.error.contained', {
    //       name: item?.name,
    //     }),
    //     'storage'
    //   );
    // } else
    if (!!item) {
      console.log('dispatch addddddddddddddddd');
      this.#store.dispatch(StorageActions.addItem(item));

      await this.#uiService.showToast(
        this.translate.instant('toast.add.item', {
          name: item?.name,
          total: item?.quantity,
        })
      );
    }
  }

  async updateItem(item?: Partial<IStorageItem>) {
    console.log('updateItem dispatch ennnnnnnnnnnnnnnnd');
    this.#store.dispatch(StorageActions.endEditItem(item));
    await this.#uiService.showToast(
      this.translate.instant('toast.update.item', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }
  async removeItem(item: IStorageItem) {
    this.#store.dispatch(StorageActions.removeItem(item));
    // await this.#database.deleteItem(item, this.itemList);
    // this.#refreshItems();
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
    // if (!this.searchResult?.hasSearchTerm) return;
    const litem = createStorageItem('hmm');
    return this.addItem(litem);
  }

  async createGlobalItem(item?: IGlobalItem) {
    if (item?.name.length) {
      // await this.#database.addOrUpdateItem(item, this.#database.all);
      const copy = createStorageItemFromGlobal(item);
      // const litem = await this.#database.addItem(copy, this.itemList);
      this.#clearSearch();
      await this.#uiService.showToast(
        this.translate.instant('toast.created.item', {
          name: item?.name,
        })
      );
    }
  }

  async copyToShoppingList(item?: IStorageItem) {
    if (!item) return;
    // item = this.#database.cloneItem(item);
    // item.quantity = 0;
    // item = await this.#database.addItem(item, this.#database.shoppinglist());
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

  setDisplayMode(mode: TItemListMode | 'bestBefore') {
    console.log('dispatch mode');
    mode = mode === 'bestBefore' ? 'alphabetical' : mode;
    this.#store.dispatch(StorageActions.updateMode(mode));
  }

  selectCategory(category: TItemListCategory) {
    this.#store.dispatch(StorageActions.updateFilter(category));
  }

  changeQuantity(item: IStorageItem, diff: number) {
    this.#store.dispatch(
      StorageActions.updateItem({
        id: item.id,
        quantity: Math.max(0, item.quantity + diff),
      })
    );
  }

  showCreateGlobalDialog() {
    // this.isCreating = true; // show create dialog with the new item
    // this.createNewItem = createGlobalItem('');
  }

  showEditDialog(item?: IStorageItem) {
    this.#store.dispatch(StorageActions.startEditItem(item));
  }

  closeEditDialog(data?: Partial<IStorageItem>) {
    this.#store.dispatch(StorageActions.endEditItem(data));
  }

  searchFor(searchTerm: string) {
    this.#store.dispatch(StorageActions.updateSearch(searchTerm));
  }

  #clearSearch() {
    this.#store.dispatch(StorageActions.updateSearch());
  }

  closeCreateGlobalDialog() {
    //
  }
}
