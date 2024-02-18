import {Component, inject, OnInit} from '@angular/core';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {StorageItem} from "../../@types/types";
import {NpListComponent} from "../../components/np-list/np-list.component";
import {AddItemDialog} from "../../dialogs/add-item-dialog/add-item.dialog";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-page-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  standalone: true,
  imports: [NpListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle, AddItemDialog],
})
export class InventoryPage implements OnInit{
  readonly #database = inject(DatabaseService);
  items: StorageItem[] = [];
  isAdding = false;

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    this.items = this.#database.storage;
  }


  async addItem(item?: StorageItem) {
    this.isAdding = false;
    if (item) {
      // check duplicates
      const foundItem = this.items.find(aItem => aItem === item);
      if (foundItem) {
        foundItem.quantity++;
      } else {
        item.quantity = 1;
        this.items.push(item)
        await this.#database.save();
      }
    }
  }

  deleteItem(item: StorageItem) {
    return this.#database.save();
  }
}
