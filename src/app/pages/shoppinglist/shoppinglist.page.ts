import {Component, inject, OnInit} from '@angular/core';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {StorageItem, StorageItemList} from "../../@types/types";
import {StorageListComponent} from "../../components/np-list/storage-list.component";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-page-shopping-list',
  templateUrl: 'shoppinglist.page.html',
  styleUrls: ['shoppinglist.page.scss'],
  standalone: true,
    imports: [StorageListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle],
})
export class ShoppinglistPage implements OnInit{

  readonly #database = inject(DatabaseService);
  items!: StorageItemList;

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    this.items = this.#database.shoppinglist();
  }

  // what should happen if we buy an item?
  // some kind of state for now
  buyItem(item: StorageItem) {
    item.state = 'bought'
  }
}
