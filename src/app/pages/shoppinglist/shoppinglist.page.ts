import { AsyncPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IGlobalItem,
  IShoppingItem,
  TItemListCategory,
  TItemListMode,
} from '../../@types/types';
import { createShoppingItemFromGlobal } from '../../app.factory';
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
import { ShoppingListActions } from '../../state/shoppinglist/shopping-list.actions';
import {
  selectShoppingListCategories,
  selectShoppingListItems,
  selectShoppingListSearchResult,
  selectShoppinglistState,
} from '../../state/shoppinglist/shopping-list.selector';

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
export class ShoppinglistPage {
  @ViewChild(ItemListSearchbarComponent, { static: true })
  listSearchbar?: ItemListSearchbarComponent;

  readonly translate = inject(TranslateService);
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectShoppinglistState);
  rxItems$ = this.#store.select(selectShoppingListItems);
  rxCategories$ = this.#store.select(selectShoppingListCategories);
  rxSearchResult$ = this.#store.select(selectShoppingListSearchResult);

  constructor() {
    addIcons({ add, remove });
  }

  async removeItem(item: IShoppingItem) {
    this.#store.dispatch(ShoppingListActions.removeItem(item));
  }

  async addItemFromSearch() {
    this.#store.dispatch(ShoppingListActions.addItemFromSearch());
  }

  showCreateDialog() {
    this.#store.dispatch(ShoppingListActions.createItem());
  }

  showEditDialog(item: IShoppingItem) {
    this.#store.dispatch(ShoppingListActions.editItem(item));
  }

  closeEditDialog() {
    this.#store.dispatch(ShoppingListActions.endEditItem());
  }

  async updateItem(item: Partial<IShoppingItem>) {
    this.#store.dispatch(ShoppingListActions.endEditItem(item));
  }

  searchFor(searchTerm: string) {
    this.#store.dispatch(ShoppingListActions.updateSearch(searchTerm));
  }

  setDisplayMode(mode: TItemListMode | 'bestBefore') {
    mode = mode === 'bestBefore' ? 'alphabetical' : mode;
    this.#store.dispatch(ShoppingListActions.updateMode(mode));
  }

  selectCategory(category: TItemListCategory) {
    this.#store.dispatch(ShoppingListActions.updateFilter(category));
  }

  changeQuantity(item: IShoppingItem, diff: number) {
    this.#store.dispatch(
      ShoppingListActions.updateItem({
        ...item,
        quantity: Math.max(0, item.quantity + diff),
      })
    );
  }

  async addGlobalItem(item?: IGlobalItem) {
    // TODO
    // this.#store.dispatch(ShoppingListActions.addItemFromGlobal(item))
    if (!item) return;
    let litem: IShoppingItem | undefined = createShoppingItemFromGlobal(item);
    this.#store.dispatch(ShoppingListActions.addItem(litem));
  }

  async createGlobalItem(item?: any) {
    if (item?.name?.length) {
      // await this.#database.addOrUpdateItem(item, this.#database.all);
      // const litem = await this.#database.addItem(copy, this.itemList);
      // this.#clearSearch();
      // await this.#uiService.showToast(
      //   this.translate.instant('toast.created.item', {
      //     name: item?.name,
      //   })
      // );
    }
  }

  showCreateGlobalDialog() {
    // this.isCreating = true; // show create dialog with the new item
    // this.createNewItem = createGlobalItem('');
  }

  closeCreateGlobalDialog() {
    //
  }

  buyItem(item: any) {
    console.log('dis is not ready');
  }
}
