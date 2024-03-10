import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IGlobalItem,
  IShoppingItem,
  TItemListCategory,
  TItemListMode,
  TItemListSortType,
} from '../../@types/types';
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
import { EditShoppingItemActions } from '../../state/edit-shopping-item/edit-shopping-item.actions';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.#store.dispatch(EditShoppingItemActions.showDialog(item));
  }

  searchFor(searchTerm: string) {
    this.#store.dispatch(ShoppingListActions.updateSearch(searchTerm));
  }

  setDisplayMode(mode: TItemListMode) {
    this.#store.dispatch(ShoppingListActions.updateMode(mode));
  }
  setSortMode(type: TItemListSortType) {
    this.#store.dispatch(ShoppingListActions.updateSort(type, 'toggle'));
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

  showCreateGlobalDialog() {
    this.#store.dispatch(ShoppingListActions.createGlobalItem());
  }

  closeCreateGlobalDialog() {
    this.#store.dispatch(ShoppingListActions.endCreateGlobalItem());
  }

  createAndAddGlobalItem(data: Partial<IGlobalItem>) {
    this.#store.dispatch(ShoppingListActions.createGlobalAndAddAsItem(data));
  }

  async buyItem(item: IShoppingItem) {
    this.#store.dispatch(ShoppingListActions.buyItem(item));
  }
}
