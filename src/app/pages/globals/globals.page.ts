import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IGlobalItem,
  IItemCategory,
  IItemList,
  ISearchResult,
} from '../../@types/types';
import { createGlobalItem } from '../../app.factory';
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
import { DatabaseService } from '../../services/database.service';
import { UiService } from '../../services/ui.service';
import { GlobalsActions } from '../../state/globals/globals.actions';
import { selectGlobalsList } from '../../state/globals/globals.selector';

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
export class GlobalsPage implements OnInit {
  @ViewChild(ItemListSearchbarComponent, { static: true })
  listSearchbar?: ItemListSearchbarComponent;

  readonly #dataService = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);
  readonly #store = inject(Store);

  itemList!: IItemList<IGlobalItem>;

  isCreating = false;
  createNewItem: IGlobalItem | null | undefined;

  isEditing = false;
  editItem: IGlobalItem | null | undefined;
  editMode: 'update' | 'create' = 'create';

  searchResult?: ISearchResult<IGlobalItem>;
  mode: 'alphabetical' | 'categories' = 'alphabetical';

  sortBy?: 'alphabetical';
  sortDir: 'asc' | 'desc' = 'asc';

  rxItems$ = this.#store.select(selectGlobalsList);

  constructor() {
    addIcons({ add, remove });
  }

  ngOnInit(): void {
    this.createNewItem = null;
  }

  async addItem(item?: IGlobalItem) {
    // do not add an already contained item (could be triggered by a shortcut)
    if (this.searchResult?.foundInList) {
      await this.#uiService.showToast(
        this.translate.instant('toast.add.item.error.contained', {
          name: item?.name,
        }),
        'shopping'
      );
    } else if (!!item) {
      console.log('dispatch addddddddddddddddd');
      this.#store.dispatch(GlobalsActions.addItem(item));

      await this.#uiService.showToast(
        this.translate.instant('toast.add.item', {
          name: item?.name,
        })
      );
    }
  }

  async updateItem(item?: IGlobalItem) {
    if (!item) return;
    this.isEditing = false;
    this.editItem = null;
    console.log('hmmmmmmm what item', item);
    this.#store.dispatch(GlobalsActions.updateItem(item));
    await this.#uiService.showToast(
      this.translate.instant('toast.update.item', {
        name: item?.name,
      })
    );
  }

  async removeItem(item: IGlobalItem) {
    this.#store.dispatch(GlobalsActions.removeItem(item));
    // await this.#database.deleteItem(item, this.itemList);
    // this.#refreshItems();
    await this.#uiService.showToast(
      this.translate.instant('toast.remove.item', {
        name: item?.name,
      })
    );
  }

  async quickAddItem() {
    // if (!this.searchResult?.hasSearchTerm) return;
    const litem = createGlobalItem('this.searchResult.searchTerm');
    return this.addItem(litem);
  }

  showGlobalEditDialog() {
    this.isCreating = true; // show create dialog with the new item
    this.createNewItem = createGlobalItem(this.searchResult?.searchTerm ?? '');
  }
  setDisplayMode(mode: 'alphabetical' | 'categories') {
    this.mode = mode;
    this.#sortList('alphabetical');
    this.#clearSearch();
  }

  selectCategory(category: IItemCategory) {
    //TODO: dispatch select category
    //this.items = getItemsFromCategory(category, this.itemList);
    //this.mode = 'alphabetical';
  }

  showEditDialog(item?: IGlobalItem) {
    this.isEditing = true;
    this.editItem =
      item ?? createGlobalItem(this.searchResult?.searchTerm ?? '');
    this.editMode = item ? 'update' : 'create';
  }

  searchFor(searchTerm: string) {
    // this.searchResult = this.#database.search(this.itemList, searchTerm);
    // this.items = this.searchResult?.listItems || [...this.itemList.items];
  }

  #clearSearch() {
    this.searchResult = undefined;
    this.listSearchbar?.clear();
  }

  #sortList(mode: 'alphabetical', toggleDir = true) {
    if (toggleDir) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sortBy = mode;
    const sortFn = (a: IGlobalItem, b: IGlobalItem) => {
      switch (mode) {
        case 'alphabetical':
          return this.sortDir === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
      }
    };
    this.itemList.items.sort(sortFn);
  }
}
