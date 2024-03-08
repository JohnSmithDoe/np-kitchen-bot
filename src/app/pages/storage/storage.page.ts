import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonButton, IonContent, IonModal } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IGlobalItem,
  IStorageItem,
  TItemListCategory,
  TItemListMode,
} from '../../@types/types';
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
export class StoragePage {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectStorageState);
  rxItems$ = this.#store.select(selectStorageListItems);
  rxCategories$ = this.#store.select(selectStorageListCategories);
  rxSearchResult$ = this.#store.select(selectStorageListSearchResult);

  constructor() {
    addIcons({ add, remove });
  }

  async removeItem(item: IStorageItem) {
    this.#store.dispatch(StorageActions.removeItem(item));
  }

  async addItemFromSearch() {
    this.#store.dispatch(StorageActions.addItemFromSearch());
  }

  showCreateDialog() {
    this.#store.dispatch(StorageActions.createAndEditItem());
  }

  showEditDialog(item: IStorageItem) {
    this.#store.dispatch(StorageActions.editItem(item));
  }

  closeEditDialog() {
    this.#store.dispatch(StorageActions.endEditItem());
  }

  async updateItem(item: Partial<IStorageItem>) {
    this.#store.dispatch(StorageActions.endEditItem(item));
  }

  searchFor(searchTerm: string) {
    this.#store.dispatch(StorageActions.updateSearch(searchTerm));
  }

  setDisplayMode(mode: TItemListMode | 'bestBefore') {
    mode = mode === 'bestBefore' ? 'alphabetical' : mode;
    this.#store.dispatch(StorageActions.updateMode(mode));
  }

  selectCategory(category: TItemListCategory) {
    this.#store.dispatch(StorageActions.updateFilter(category));
  }

  changeQuantity(item: IStorageItem, diff: number) {
    this.#store.dispatch(
      StorageActions.updateItem({
        ...item,
        quantity: Math.max(0, item.quantity + diff),
      })
    );
  }

  showCreateGlobalDialog() {
    this.#store.dispatch(StorageActions.createGlobalItem());
  }

  closeCreateGlobalDialog() {
    this.#store.dispatch(StorageActions.endCreateGlobalItem());
  }

  async createAndAddGlobalItem(data: Partial<IGlobalItem>) {
    this.#store.dispatch(StorageActions.createGlobalAndAddAsItem(data));
  }

  async copyToShoppingList(item?: IStorageItem) {
    if (!item) return;
    // item = this.#database.cloneItem(item);
    // item.quantity = 0;
    // item = await this.#database.addItem(item, this.#database.shoppinglist());
    if (item) {
      item.quantity++;
    }

    // await this.#uiService.showToast(
    //   this.translate.instant('storage.page.toast.move', {
    //     name: item?.name,
    //     total: item?.quantity,
    //   })
    // );
  }
}
