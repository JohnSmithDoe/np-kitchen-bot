import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonModal } from '@ionic/angular/standalone';
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
import { getItemsFromCategory } from '../../app.utils';
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

@Component({
  selector: 'app-page-database',
  templateUrl: 'database.page.html',
  styleUrls: ['database.page.scss'],
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
  ],
})
export class DatabasePage implements OnInit {
  @ViewChild(ItemListSearchbarComponent, { static: true })
  listSearchbar?: ItemListSearchbarComponent;

  @ViewChild('globalListComponent', { static: true })
  listComponent!: ItemListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);

  itemList!: IItemList<IGlobalItem>;

  isCreating = false;
  createNewItem: IGlobalItem | null | undefined;

  isEditing = false;
  editItem: IGlobalItem | null | undefined;
  editMode: 'update' | 'create' = 'create';
  items: IGlobalItem[] = [];

  searchResult?: ISearchResult<IGlobalItem>;
  mode: 'alphabetical' | 'categories' = 'alphabetical';

  constructor() {
    addIcons({ add, remove });
  }

  ngOnInit(): void {
    this.itemList = this.#database.all;
    this.items = this.itemList.items;
    this.createNewItem = null;
  }

  async addItem(item?: IGlobalItem) {
    if (!item) return;
    await this.#database.addOrUpdateItem(item, this.itemList);
    this.#refreshItems();
    await this.#uiService.showToast(
      this.translate.instant('toast.add.item', {
        name: item?.name,
      })
    );
  }

  async updateItem(item?: IGlobalItem) {
    if (!item) return;
    this.isEditing = false;
    this.editItem = null;
    await this.#database.addOrUpdateItem(item, this.itemList);
    await this.#uiService.showToast(
      this.translate.instant('toast.update.item', {
        name: item?.name,
      })
    );
  }

  async removeItem(item: IGlobalItem) {
    await this.#database.deleteItem(item, this.itemList);
    this.listComponent?.closeSlidingItems();
    this.#refreshItems();
    await this.#uiService.showToast(
      this.translate.instant('toast.remove.item', {
        name: item?.name,
      })
    );
  }

  async quickAddItem() {
    if (!this.searchResult?.hasSearchTerm) return;
    const litem = createGlobalItem(this.searchResult.searchTerm);
    return this.addItem(litem);
  }

  searchFor(searchTerm: string) {
    this.searchResult = this.#database.search(this.itemList, searchTerm);
    this.items = this.searchResult?.listItems || [...this.itemList.items];
  }

  showGlobalEditDialog() {
    this.isCreating = true; // show create dialog with the new item
    this.createNewItem = createGlobalItem(this.searchResult?.searchTerm ?? '');
  }

  showEditDialog(item?: IGlobalItem) {
    this.isEditing = true;
    this.editItem =
      item ?? createGlobalItem(this.searchResult?.searchTerm ?? '');
    this.editMode = item ? 'update' : 'create';
  }

  setDisplayMode(mode: 'alphabetical' | 'categories') {
    if (mode === 'categories') {
      this.items = [...this.itemList.items];
    }
    this.mode = mode;
  }

  selectCategory(category: IItemCategory) {
    this.items = getItemsFromCategory(category, this.itemList);
    this.mode = 'alphabetical';
  }

  #clearSearch() {
    this.searchResult = undefined;
    this.listSearchbar?.clear();
    this.items = [...this.itemList.items];
  }

  #refreshItems() {
    this.#clearSearch();
  }
}
