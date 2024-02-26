import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonModal,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {StorageItem, StorageItemList} from "../../@types/types";
import {StorageListComponent} from "../../components/storage-list/storage-list.component";
import {AddItemDialog} from "../../dialogs/add-item-dialog/add-item.dialog";
import {EditItemDialogComponent} from "../../dialogs/edit-item-dialog/edit-item-dialog.component";
import {DatabaseService} from "../../services/database.service";
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-page-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  standalone: true,
  imports: [StorageListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle, AddItemDialog, IonButtons, IonMenuButton, IonButton, TranslateModule, IonModal, EditItemDialogComponent],
})
export class InventoryPage implements OnInit{
  @ViewChild(StorageListComponent, {static: true}) storageList!: StorageListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);

  inventory!: StorageItemList;

  isAdding = false;
  isCreating = false;
  createNewItem: StorageItem | null | undefined;

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    this.inventory = this.#database.storage;
    this.createNewItem = null;
  }

  async addItemToInventory(item?: StorageItem) {
    this.isAdding = false;
    item = await this.#database.addItem(item, this.inventory);
    this.storageList.refresh();
    await this.#uiService.showToast(this.translate.instant('inventory.page.toast.add', {name: item?.name, total: item?.quantity}));
  }

  showCreateDialog(newItem: StorageItem) {
    this.isAdding = false;
    this.isCreating = true;
    this.createNewItem = newItem;
  }

  showAddDialog() {
    this.isAdding = true;
    this.isCreating = false;
  }

  async createItemAndAddToInventory(item?: StorageItem) {
    this.isCreating = false;
    this.createNewItem = null;
    if (item?.name.length) {
      await this.#database.addOrUpdateItem(item);
      item = await this.#database.addItem(item, this.inventory);
      this.storageList.refresh();
      await this.#uiService.showToast(this.translate.instant('inventory.page.toast.created', {name: item?.name}));
    }
  }

  async removeItemFromInventory(item: StorageItem) {
    await this.#database.deleteItem(item, this.inventory);
    this.storageList.refresh();
    await this.#uiService.showToast(this.translate.instant('inventory.page.toast.remove', {name: item?.name}));
  }

  async moveToShoppingList(item?: StorageItem) {
    this.isAdding = false;
    item = await this.#database.addItem(item, this.#database.shoppinglist())
    console.log(item);
    await this.#uiService.showToast(this.translate.instant('inventory.page.toast.move', {name: item?.name, total: item?.quantity}));
  }

}
