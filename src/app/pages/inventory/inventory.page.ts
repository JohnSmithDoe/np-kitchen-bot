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
import {TranslateModule} from "@ngx-translate/core";
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {StorageItem, StorageItemList} from "../../@types/types";
import {StorageListComponent} from "../../components/storage-list/storage-list.component";
import {AddItemDialog} from "../../dialogs/add-item-dialog/add-item.dialog";
import {EditItemDialogComponent} from "../../dialogs/edit-item-dialog/edit-item-dialog.component";
import {DatabaseService} from "../../services/database.service";

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
    await this.#database.showToast(`Added 1 x ${item?.name} (Total: ${item?.quantity})`);
  }

  showCreateDialog(newItem: StorageItem) {
    this.isAdding = false;
    this.isCreating = true;
    this.createNewItem = newItem;
  }

  async createItemAndAddToInventory(item?: StorageItem) {
    this.isCreating = false;
    this.createNewItem = null;
    if (item?.name.length) {
      await this.#database.addOrUpdateItem(item);
      item = await this.#database.addItem(item, this.inventory);
      this.storageList.refresh();
      await this.#database.showToast(`Created ${item?.name} and added`);
    }
  }

  async removeItemFromInventory(item: StorageItem) {
    await this.#database.deleteItem(item, this.inventory);
    this.storageList.refresh();
    await this.#database.showToast(`Removed ${item?.name}`);
  }

  async moveToShoppingList(item?: StorageItem) {
    this.isAdding = false;
    item = await this.#database.addItem(item, this.#database.shoppinglist())
    await this.#database.showToast(`Added 1 x ${item?.name} to the shopping list (Total: ${item?.quantity})`);
  }

}
