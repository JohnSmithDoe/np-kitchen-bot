import {JsonPipe} from "@angular/common";
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
import {add, remove} from "ionicons/icons";
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
  imports: [StorageListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle, AddItemDialog, IonMenuButton, IonButtons, IonButton, JsonPipe, IonLabel, TranslateModule, IonModal, NewItemDialogComponent],
})
export class ShoppinglistPage implements OnInit{

  @ViewChild(StorageListComponent, {static: true}) storageList!: StorageListComponent;

  readonly #database = inject(DatabaseService);
  shoppingList!: StorageItemList;

  isAdding = false;
  isCreating = false;
  createNewItem: StorageItem | null | undefined;

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    this.shoppingList = this.#database.shoppinglist();
    this.createNewItem = null;
  }

  async addItemToShoppingList(item?: StorageItem) {
    this.isAdding = false;
    await this.#database.addItem(item, this.shoppingList);
    this.storageList.refresh();
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
    }
  }

  async removeItemFromShoppingList(item: StorageItem) {
    await this.#database.deleteItem(item, this.shoppingList);
    this.storageList.refresh();
  }

  // what should happen if we buy an item?
  // some kind of state for now
  async buyItem(item: StorageItem) {
    item.state = 'bought'
    await this.#database.save();
  }
}
