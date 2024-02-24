import {Component, inject, OnInit, ViewChild} from '@angular/core';
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
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {TranslateModule} from "@ngx-translate/core";
import {addIcons} from "ionicons";
import {add, duplicate, remove} from "ionicons/icons";
import {StorageItem, StorageItemList} from "../../@types/types";
import {StorageListComponent} from "../../components/storage-list/storage-list.component";
import {AddItemDialog} from "../../dialogs/add-item-dialog/add-item.dialog";
import {NewItemDialogComponent} from "../../dialogs/new-item-dialog/new-item-dialog.component";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-page-shopping-list',
  templateUrl: 'shoppinglist.page.html',
  styleUrls: ['shoppinglist.page.scss'],
  standalone: true,
  imports: [StorageListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle, AddItemDialog, IonMenuButton, IonButtons, IonButton, IonLabel, TranslateModule, IonModal, NewItemDialogComponent],
})
export class ShoppinglistPage implements OnInit{

  @ViewChild(StorageListComponent, {static: true}) storageList!: StorageListComponent;

  readonly #database = inject(DatabaseService);
  shoppingList!: StorageItemList;

  isAdding = false;
  isCreating = false;
  createNewItem: StorageItem | null | undefined;

  constructor() {
    addIcons({add, remove, duplicate})
  }

  ngOnInit(): void {
    this.shoppingList = this.#database.shoppinglist();
    this.createNewItem = null;
  }

  async addItemToShoppingList(item?: StorageItem) {
    this.isAdding = false;
    item = await this.#database.addItem(item, this.shoppingList);
    this.storageList.refresh(true);
    await this.#database.showToast(`Added 1 x ${item?.name} (Total: ${item?.quantity})`);
  }

  showCreateDialog(newItem: StorageItem) {
    this.isAdding = false;
    this.isCreating = true;
    this.createNewItem = newItem;
  }

  async createItemAndAddToShoppingList(item?: StorageItem) {
    this.isCreating = false;
    this.createNewItem = null;

    if (item?.name.length) {
      this.#database.addToAllItems(item);
      await this.#database.addItem(item, this.shoppingList);
      this.storageList.refresh();
      await this.#database.showToast(`Created ${item?.name} and added`);
    }
  }

  async removeItemFromShoppingList(item: StorageItem) {
    await this.#database.deleteItem(item, this.shoppingList);
    this.storageList.refresh();
    await this.#database.showToast(`Removed ${item?.name}`);
  }

  // what should happen if we buy an item?
  // some kind of state for now
  async buyItem(item: StorageItem) {
    item.state = 'bought'
    await this.#database.save();
    await this.#database.showToast(`Bought ${item?.name}`);
  }

}
