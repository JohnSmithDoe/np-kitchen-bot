import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IGlobalItem,
  TItemListCategory,
  TItemListMode,
} from '../../@types/types';
import { GlobalItemComponent } from '../../components/item-list-items/global-item/global-item.component';
import { TextItemComponent } from '../../components/item-list-items/text-item/text-item.component';
import { ItemListEmptyComponent } from '../../components/item-list/item-list-empty/item-list-empty.component';
import { ItemListQuickaddComponent } from '../../components/item-list/item-list-quick-add/item-list-quickadd.component';
import { ItemListSearchbarComponent } from '../../components/item-list/item-list-searchbar/item-list-searchbar.component';
import { ItemListToolbarComponent } from '../../components/item-list/item-list-toolbar/item-list-toolbar.component';
import { ItemListComponent } from '../../components/item-list/item-list.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditStorageItemDialogComponent } from '../../dialogs/edit-storage-item-dialog/edit-storage-item-dialog.component';
import { GlobalsActions } from '../../state/globals/globals.actions';
import {
  selectGlobalsListCategories,
  selectGlobalsListItems,
  selectGlobalsListSearchResult,
  selectGlobalsState,
} from '../../state/globals/globals.selector';

@Component({
  selector: 'app-page-database',
  templateUrl: 'globals.page.html',
  styleUrls: ['globals.page.scss'],
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
    GlobalItemComponent,
    EditStorageItemDialogComponent,
    AsyncPipe,
  ],
})
export class GlobalsPage {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectGlobalsState);
  rxItems$ = this.#store.select(selectGlobalsListItems);
  rxCategories$ = this.#store.select(selectGlobalsListCategories);
  rxSearchResult$ = this.#store.select(selectGlobalsListSearchResult);

  constructor() {
    addIcons({ add, remove });
  }

  async removeItem(item: IGlobalItem) {
    this.#store.dispatch(GlobalsActions.removeItem(item));
  }

  async addItemFromSearch() {
    this.#store.dispatch(GlobalsActions.addItemFromSearch());
  }

  showCreateDialog() {
    this.#store.dispatch(GlobalsActions.createAndEditItem());
  }

  showEditDialog(item: IGlobalItem) {
    this.#store.dispatch(GlobalsActions.editItem(item));
  }

  closeEditDialog() {
    this.#store.dispatch(GlobalsActions.endEditItem());
  }

  async updateItem(item: Partial<IGlobalItem>) {
    this.#store.dispatch(GlobalsActions.endEditItem(item));
  }

  searchFor(searchTerm: string) {
    this.#store.dispatch(GlobalsActions.updateSearch(searchTerm));
  }

  setDisplayMode(mode: TItemListMode | 'bestBefore') {
    mode = mode === 'bestBefore' ? 'alphabetical' : mode;
    this.#store.dispatch(GlobalsActions.updateMode(mode));
  }

  selectCategory(category: TItemListCategory) {
    this.#store.dispatch(GlobalsActions.updateFilter(category));
  }
}
