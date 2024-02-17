import {Component, OnInit} from '@angular/core';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {StorageItem} from "../../@types/types";
import {NpListComponent} from "../../components/np-list/np-list.component";
import {AddItemDialog} from "../../dialogs/add-item-dialog/add-item.dialog";

@Component({
  selector: 'app-page-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  standalone: true,
  imports: [NpListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle, AddItemDialog],
})
export class InventoryPage implements OnInit{

  items: StorageItem[] = [];
  isAdding = false;

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    //
  }


  addItem(item?: StorageItem) {
    this.isAdding = false;
    console.log(item);
    //this.items.push({id: this.items.length.toString(10), name: 'new', quantity: 1})
  }
}
