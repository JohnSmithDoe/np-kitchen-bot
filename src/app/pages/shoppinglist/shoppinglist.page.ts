import {Component, inject, OnInit} from '@angular/core';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {StorageItem} from "../../@types/types";
import {NpListComponent} from "../../components/np-list/np-list.component";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-page-shopping-list',
  templateUrl: 'shoppinglist.page.html',
  styleUrls: ['shoppinglist.page.scss'],
  standalone: true,
    imports: [NpListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle],
})
export class ShoppinglistPage implements OnInit{

  readonly #database = inject(DatabaseService);
  items: StorageItem[] = [];

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    this.items = this.#database.shoppinglist;
  }
}
