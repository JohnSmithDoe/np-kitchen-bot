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
import {NewItemDialogComponent} from "../../dialogs/new-item-dialog/new-item-dialog.component";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-page-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  standalone: true,
  imports: [StorageListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle, AddItemDialog, IonButtons, IonMenuButton, IonButton, TranslateModule, IonModal, NewItemDialogComponent],
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
    await this.#database.addItem(item, this.inventory);
    this.storageList.refresh();
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
      this.#database.addToAllItems(item);
      await this.#database.addItem(item, this.inventory);
      this.storageList.refresh();
    }
  }

  async removeItemFromInventory(item: StorageItem) {
    await this.#database.deleteItem(item, this.inventory);
    this.storageList.refresh();
  }

  async moveToShoppingList(item: StorageItem) {
    this.isAdding = false;
    if (item) {
      // check duplicates
      const foundItem = this.#database.shoppinglist().items.find(aItem => aItem.id === item.id);
      if (foundItem) {
        foundItem.quantity++;
      } else {
        const newItem = {...item};
        newItem.quantity = 1;
        this.#database.shoppinglist().items.push(newItem)
        await this.#database.save();
      }
    }

  }
}
