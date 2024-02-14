import {Component, Input, OnInit} from '@angular/core';
import {ItemReorderEventDetail} from "@ionic/angular";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonReorder,
  IonReorderGroup,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {ListItem, NPIonDragEvent} from "../../@types/types";

@Component({
  selector: 'app-list',
  templateUrl: 'np-list.component.html',
  styleUrls: ['np-list.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonReorderGroup, IonItemSliding, IonItem, IonLabel, IonButtons, IonButton, IonReorder, IonItemOptions, IonItemOption, IonIcon]
})
export class NpListComponent implements OnInit{
  @Input() header?: string;
  @Input() items: ListItem[] = [];

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
//
  }

  async deleteOnDrag($event: NPIonDragEvent, item: ListItem, list: IonList) {
    console.log($event.detail);
    if ($event.detail.amount > 250) {
      await list.closeSlidingItems();
      this.items.splice(this.items.indexOf(item), 1);
    }
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }
}