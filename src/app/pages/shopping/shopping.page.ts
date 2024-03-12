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
import { ShoppingActions } from '../../state/shopping/shopping.actions';
import {
  selectShoppingCategories,
  selectShoppingItems,
  selectShoppingSearchResult,
  selectShoppingState,
} from '../../state/shopping/shopping.selector';

@Component({
  selector: 'app-page-shopping',
  templateUrl: 'shopping.page.html',
  styleUrls: ['shopping.page.scss'],
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
export class ShoppingPage {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectShoppingState);
  rxItems$ = this.#store.select(selectShoppingItems);
  rxCategories$ = this.#store.select(selectShoppingCategories);
  rxSearchResult$ = this.#store.select(selectShoppingSearchResult);

  constructor() {
    addIcons({ add, remove });
  }

  async removeItem(item: IShoppingItem) {
    this.#store.dispatch(ShoppingActions.removeItem(item));
  }

  async addItemFromSearch() {
    this.#store.dispatch(ShoppingActions.addItemFromSearch());
  }

  showCreateDialog() {
    this.#store.dispatch(ShoppingActions.createItem());
  }

  showEditDialog(item: IShoppingItem) {
    this.#store.dispatch(EditShoppingItemActions.showDialog(item));
  }

  searchFor(searchTerm: string) {
    this.#store.dispatch(ShoppingActions.updateSearch(searchTerm));
  }

  setDisplayMode(mode: TItemListMode) {
    this.#store.dispatch(ShoppingActions.updateMode(mode));
  }
  setSortMode(type: TItemListSortType) {
    this.#store.dispatch(ShoppingActions.updateSort(type, 'toggle'));
  }
  selectCategory(category: TItemListCategory) {
    this.#store.dispatch(ShoppingActions.updateFilter(category));
  }

  changeQuantity(item: IShoppingItem, diff: number) {
    this.#store.dispatch(
      ShoppingActions.updateItem({
        ...item,
        quantity: Math.max(0, item.quantity + diff),
      })
    );
  }

  showCreateGlobalDialog() {
    this.#store.dispatch(ShoppingActions.createGlobalItem());
  }

  closeCreateGlobalDialog() {
    this.#store.dispatch(ShoppingActions.endCreateGlobalItem());
  }

  createAndAddGlobalItem(data: Partial<IGlobalItem>) {
    this.#store.dispatch(ShoppingActions.createGlobalAndAddAsItem(data));
  }

  async buyItem(item: IShoppingItem) {
    this.#store.dispatch(ShoppingActions.buyItem(item));
  }
}
