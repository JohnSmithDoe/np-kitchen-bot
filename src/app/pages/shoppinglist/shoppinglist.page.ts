import {JsonPipe} from "@angular/common";
import {Component, inject, OnInit} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {StorageItem, StorageItemList} from "../../@types/types";
import {StorageListComponent} from "../../components/storage-list/storage-list.component";
import {AddItemDialog} from "../../dialogs/add-item-dialog/add-item.dialog";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-page-shopping-list',
  templateUrl: 'shoppinglist.page.html',
  styleUrls: ['shoppinglist.page.scss'],
  standalone: true,
  imports: [StorageListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle, AddItemDialog, IonMenuButton, IonButtons, IonButton, JsonPipe],
})
export class ShoppinglistPage implements OnInit{

  readonly #database = inject(DatabaseService);
  shoppingList!: StorageItemList;
  isAdding = false;

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    this.shoppingList = this.#database.shoppinglist();
  }
  async addItem(item?: StorageItem) {
    this.isAdding = false;
    await this.#database.addItem(item, this.shoppingList);
  }
  // what should happen if we buy an item?
  // some kind of state for now
  async buyItem(item: StorageItem) {
    item.state = 'bought'
    await this.#database.save();
  }

}
