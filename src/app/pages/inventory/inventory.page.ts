import {Component, inject, OnInit} from '@angular/core';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {StorageItem, StorageItemList} from "../../@types/types";
import {StorageListComponent} from "../../components/np-list/storage-list.component";
import {AddItemDialog} from "../../dialogs/add-item-dialog/add-item.dialog";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-page-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  standalone: true,
  imports: [StorageListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle, AddItemDialog],
})
export class InventoryPage implements OnInit{
  readonly #database = inject(DatabaseService);
  inventory!: StorageItemList;
  isAdding = false;

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    this.inventory = this.#database.storage;
  }


  async addItem(item?: StorageItem) {
    this.isAdding = false;
    if (item) {
      // check duplicates
      const foundItem = this.inventory.items.find(aItem => aItem.id === item.id);
      if (foundItem) {
        foundItem.quantity++;
      } else {
        item.quantity = 1;
        this.inventory.items.push(item)
        await this.#database.save();
      }
    }
  }

  deleteItem(item: StorageItem) {
    return this.#database.save();
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
