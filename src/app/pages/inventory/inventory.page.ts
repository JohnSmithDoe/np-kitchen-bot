import {Component, OnInit} from '@angular/core';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {ListItem} from "../../@types/types";
import {NpListComponent} from "../../components/np-list/np-list.component";

@Component({
  selector: 'app-page-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  standalone: true,
  imports: [NpListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle],
})
export class InventoryPage implements OnInit{

  items: ListItem[] = [];

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    //
  }

  addItem() {
    this.items.push({id: this.items.length.toString(10), name: 'new', quantity: 1})
  }
}
