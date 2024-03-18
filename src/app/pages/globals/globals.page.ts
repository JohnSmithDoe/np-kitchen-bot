import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IGlobalItem,
  IonViewWillEnter,
  IShoppingItem,
  IStorageItem,
  TItemListCategory,
  TItemListMode,
  TItemListSortType,
} from '../../@types/types';
import { GlobalItemComponent } from '../../components/item-list-items/global-item/global-item.component';
import { TextItemComponent } from '../../components/item-list-items/text-item/text-item.component';
import { ItemListEmptyComponent } from '../../components/item-list/item-list-empty/item-list-empty.component';
import { ItemListQuickaddComponent } from '../../components/item-list/item-list-quick-add/item-list-quickadd.component';
import { ItemListSearchResultComponent } from '../../components/item-list/item-list-search-result/item-list-search-result.component';
import { ItemListSearchbarComponent } from '../../components/item-list/item-list-searchbar/item-list-searchbar.component';
import { ItemListToolbarComponent } from '../../components/item-list/item-list-toolbar/item-list-toolbar.component';
import { ItemListComponent } from '../../components/item-list/item-list.component';
import { PageHeaderComponent } from '../../components/pages/page-header/page-header.component';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditStorageItemDialogComponent } from '../../dialogs/edit-storage-item-dialog/edit-storage-item-dialog.component';
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import { GlobalsActions } from '../../state/globals/globals.actions';
import {
  selectGlobalListItems,
  selectGlobalsListCategories,
  selectGlobalsListSearchResult,
  selectGlobalsState,
} from '../../state/globals/globals.selector';

@Component({
  selector: 'app-page-database',
  templateUrl: 'globals.page.html',
  styleUrls: ['globals.page.scss'],
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
    GlobalItemComponent,
    EditStorageItemDialogComponent,
    AsyncPipe,
    ItemListSearchResultComponent,
  ],
})
export class GlobalsPage implements IonViewWillEnter {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectGlobalsState);
  rxItems$ = this.#store.select(selectGlobalListItems);
  rxCategories$ = this.#store.select(selectGlobalsListCategories);
  rxSearchResult$ = this.#store.select(selectGlobalsListSearchResult);

  constructor() {
    addIcons({ add, remove });
  }

  ionViewWillEnter(): void {
    this.#store.dispatch(GlobalsActions.enterPage());
  }

  async removeItem(item: IGlobalItem) {
    this.#store.dispatch(GlobalsActions.removeItem(item));
  }

  async addItemFromSearch() {
    this.#store.dispatch(GlobalsActions.addItemFromSearch());
  }

  showCreateDialog() {
    this.#store.dispatch(DialogsActions.showCreateDialogWithSearch('_globals'));
  }

  showEditDialog(item: IGlobalItem) {
    this.#store.dispatch(DialogsActions.showEditDialog(item, '_globals'));
  }

  searchFor(searchTerm: string) {
    this.#store.dispatch(GlobalsActions.updateSearch(searchTerm));
  }

  setDisplayMode(mode: TItemListMode) {
    this.#store.dispatch(GlobalsActions.updateMode(mode));
  }

  setSortMode(type: TItemListSortType) {
    this.#store.dispatch(GlobalsActions.updateSort(type, 'toggle'));
  }

  selectCategory(category: TItemListCategory) {
    this.#store.dispatch(GlobalsActions.updateFilter(category));
  }

  addStorageItem(item: IStorageItem) {
    this.#store.dispatch(GlobalsActions.addStorageItem(item));
  }

  addShoppingItem(item: IShoppingItem) {
    this.#store.dispatch(GlobalsActions.addShoppingItem(item));
  }
}
