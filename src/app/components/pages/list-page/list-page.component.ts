import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, TemplateRef } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, bagAdd, clipboard, remove } from 'ionicons/icons';
import {
  IAppState,
  IGlobalItem,
  IShoppingItem,
  IStorageItem,
  TAllItemTypes,
  TColor,
  TItemListCategory,
  TItemListId,
  TItemListMode,
  TItemListSortType,
} from '../../../@types/types';
import { ItemListActions } from '../../../state/@shared/item-list.actions';
import {
  selectListCategories,
  selectListItems,
  selectListSearchResult,
  selectListState,
  selectListStateFilter,
} from '../../../state/@shared/item-list.selector';
import { DialogsActions } from '../../../state/dialogs/dialogs.actions';
import { ItemListEmptyComponent } from '../../item-list/item-list-empty/item-list-empty.component';
import { ItemListQuickaddComponent } from '../../item-list/item-list-quick-add/item-list-quickadd.component';
import { ItemListSearchResultComponent } from '../../item-list/item-list-search-result/item-list-search-result.component';
import { ItemListSearchbarComponent } from '../../item-list/item-list-searchbar/item-list-searchbar.component';
import { ItemListToolbarComponent } from '../../item-list/item-list-toolbar/item-list-toolbar.component';
import { ItemListComponent } from '../../item-list/item-list.component';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'app-list-page',
  standalone: true,
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
  imports: [
    AsyncPipe,
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    ItemListComponent,
    ItemListEmptyComponent,
    ItemListQuickaddComponent,
    ItemListSearchResultComponent,
    ItemListSearchbarComponent,
    ItemListToolbarComponent,
    PageHeaderComponent,
    TranslateModule,
  ],
})
export class ListPageComponent<T extends TAllItemTypes> {
  readonly #store = inject(Store<IAppState>);

  @Input({ required: true }) listId!: TItemListId;
  @Input({ required: true }) itemTemplate!: TemplateRef<any>;
  @Input({ required: true }) color!: TColor;
  @Input({ required: true }) listHeader!: string;
  @Input({ required: true }) pageHeader!: string;

  rxState$ = this.#store.select(selectListState);
  rxFilter$ = this.#store.select(selectListStateFilter);
  rxItems$ = this.#store.select(selectListItems);
  rxSearchResult$ = this.#store.select(selectListSearchResult);
  rxCategories$ = this.#store.select(selectListCategories);

  constructor() {
    addIcons({ add, remove, clipboard, bagAdd });
  }

  async addItemFromSearch() {
    this.#store.dispatch(ItemListActions.addItemFromSearch(this.listId));
  }

  searchFor(searchTerm: string) {
    this.#store.dispatch(ItemListActions.updateSearch(this.listId, searchTerm));
  }

  setDisplayMode(mode: TItemListMode) {
    this.#store.dispatch(ItemListActions.updateMode(this.listId, mode));
  }

  setSortMode(type: TItemListSortType) {
    this.#store.dispatch(
      ItemListActions.updateSort(this.listId, type, 'toggle')
    );
  }

  selectCategory(category: TItemListCategory) {
    this.#store.dispatch(ItemListActions.updateFilter(this.listId, category));
  }

  addGlobalItem(item: IGlobalItem) {
    this.#store.dispatch(ItemListActions.addGlobalItem(this.listId, item));
  }

  addStorageItem(item: IStorageItem) {
    this.#store.dispatch(ItemListActions.addStorageItem(this.listId, item));
  }

  addShoppingItem(item: IShoppingItem) {
    this.#store.dispatch(ItemListActions.addShoppingItem(this.listId, item));
  }

  showCreateDialog() {
    this.#store.dispatch(
      DialogsActions.showCreateDialogWithSearch(this.listId)
    );
  }

  showCreateGlobalDialog() {
    this.#store.dispatch(
      DialogsActions.showCreateAndAddGlobalDialog(this.listId)
    );
  }

  showEditDialog(item: IShoppingItem) {
    this.#store.dispatch(DialogsActions.showEditDialog(item, this.listId));
  }
}
