import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IBaseItem,
  IGlobalItem,
  IItemList,
  IShoppingItem,
  IStorageItem,
} from '../../@types/types';
import {
  createGlobalItemFrom,
  createShoppingItem,
  createShoppingItemFromGlobal,
  createShoppingItemFromStorage,
} from '../../app.factory';
import { GlobalItemComponent } from '../../components/global-item/global-item.component';
import { ItemListQuickaddComponent } from '../../components/item-list-quick-add/item-list-quickadd.component';
import { ItemListSearchbarComponent } from '../../components/item-list-searchbar/item-list-searchbar.component';
import { ItemListToolbarComponent } from '../../components/item-list-toolbar/item-list-toolbar.component';
import { ItemListComponent } from '../../components/item-list/item-list.component';
import { ShoppingItemComponent } from '../../components/shopping-item/shopping-item.component';
import { ShoppingListComponent } from '../../components/shopping-list/shopping-list.component';
import { StorageItemComponent } from '../../components/storage-item/storage-item.component';
import { AddItemDialog } from '../../dialogs/add-item-dialog/add-item.dialog';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditShoppingItemDialogComponent } from '../../dialogs/edit-shopping-item-dialog/edit-shopping-item-dialog.component';
import { DatabaseService } from '../../services/database.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-page-shopping-list',
  templateUrl: 'shoppinglist.page.html',
  styleUrls: ['shoppinglist.page.scss'],
  standalone: true,
  imports: [
    ShoppingListComponent,
    IonHeader,
    IonToolbar,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonTitle,
    AddItemDialog,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonLabel,
    TranslateModule,
    IonModal,
    EditShoppingItemDialogComponent,
    EditGlobalItemDialogComponent,
    ShoppingItemComponent,
    ItemListComponent,
    GlobalItemComponent,
    StorageItemComponent,
    IonSearchbar,
    ItemListToolbarComponent,
    ItemListSearchbarComponent,
    ItemListQuickaddComponent,
  ],
})
export class ShoppinglistPage implements OnInit {
  @ViewChild(ItemListSearchbarComponent, { static: true })
  listSearchbar?: ItemListSearchbarComponent;

  @ViewChild('shoppinglist', { static: true })
  listComponent!: ItemListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);

  shoppingList!: IItemList<IShoppingItem>;

  isAdding = false;
  isCreating = false;
  createNewItem: IGlobalItem | null | undefined;

  isEditing = false;
  editItem: IShoppingItem | null | undefined;
  editMode: 'update' | 'create' = 'create';
  items: IShoppingItem[] = [];

  searchResult?: {
    listItems: IShoppingItem[];
    hasSearchTerm: boolean;
    searchTerm: string;
    globalItems: IGlobalItem[];
    storageItems: IStorageItem[];
  };

  constructor() {
    addIcons({ add, remove });
  }

  ngOnInit(): void {
    this.shoppingList = this.#database.shoppinglist();
    this.items = this.shoppingList.items;
    this.createNewItem = null;
  }

  showCreateDialog(newItem: IBaseItem) {
    this.isAdding = false;
    this.isCreating = true;
    this.createNewItem = createGlobalItemFrom(newItem);
  }

  showEditDialog(item?: IShoppingItem) {
    this.isAdding = false;
    this.isCreating = false;
    this.isEditing = true;
    this.editItem =
      item ?? createShoppingItem(this.searchResult?.searchTerm ?? '');
    this.editMode = item ? 'update' : 'create';
  }

  async updateShoppingItem(item?: IShoppingItem) {
    this.isEditing = false;
    this.editItem = null;
    await this.#database.addOrUpdateStorageItemShipping(
      item,
      this.shoppingList
    );
    // this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('inventory.page.toast.update', {
        name: item?.name,
        total: item?.quantity,
      })
    );
    this.clearSearch();
  }

  async addItemToShoppingList(item?: IShoppingItem) {
    this.isAdding = false;
    item = await this.#database.addItemShopping(item, this.shoppingList);
    this.refreshItems();
    // this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('shoppinglist.page.toast.add', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }

  async createItemAndAddToShoppingList(item?: IGlobalItem) {
    this.isCreating = false;
    this.createNewItem = null;

    if (item?.name.length) {
      await this.#database.addOrUpdateGlobalItem(item);
      const copy = createShoppingItemFromGlobal(item);
      const litem = await this.#database.addItem(copy, this.shoppingList);

      // this.listComponent.refresh();
      await this.#uiService.showToast(
        this.translate.instant('shoppinglist.page.toast.created', {
          name: litem?.name,
        })
      );
    }
  }

  addStorageItemToShoppingList(item: IStorageItem) {
    const litem = createShoppingItemFromStorage(item);
    return this.addItemToShoppingList(litem);
  }

  async addGlobalItemToShoppingList(item?: IGlobalItem) {
    if (!item) return;
    let litem: IShoppingItem | undefined = createShoppingItemFromGlobal(
      item,
      1
    );
    return this.addItemToShoppingList(litem);
  }
  addItemFromSearchTerm() {
    if (!this.searchResult?.hasSearchTerm) return;
    const litem = createShoppingItem(this.searchResult.searchTerm);
    return this.addItemToShoppingList(litem);
  }

  async removeItemFromShoppingList(item: IShoppingItem) {
    await this.#database.deleteItem(item, this.shoppingList);
    this.listComponent?.closeSlidingItems();
    this.refreshItems();
    // this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('shoppinglist.page.toast.remove', {
        name: item?.name,
      })
    );
  }

  // what should happen if we buy an item?
  async buyItem(item: IShoppingItem) {
    console.log(this.listComponent, 'kdsfj');
    this.listComponent?.closeSlidingItems();
    item.state = 'bought';
    await this.#database.save();
    await this.#uiService.showToast(
      this.translate.instant('shoppinglist.page.toast.move', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }

  changeQuantity(item: IShoppingItem, diff: number) {
    item.quantity = Math.max(0, item.quantity + diff);
    return this.#database.save();
  }

  searchFor(searchTerm: string) {
    const listItems = this.shoppingList.items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const globalItems = this.#database.all.items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const storageItems = this.#database.storage.items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.searchResult = searchTerm.length
      ? {
          searchTerm,
          hasSearchTerm: !!searchTerm.length,
          listItems,
          globalItems,
          storageItems,
        }
      : undefined;
  }

  private clearSearch() {
    this.searchResult = undefined;
    this.listSearchbar?.clear();
    this.items = [...this.shoppingList.items];
  }

  private refreshItems() {
    this.clearSearch();
  }
}
