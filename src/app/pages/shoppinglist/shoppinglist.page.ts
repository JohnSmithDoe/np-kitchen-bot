import {Component, OnInit} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {NPIonDragEvent, ShoppingCart, ShoppingCartItem} from "../../@types/types";

@Component({
  selector: 'app-tab1',
  templateUrl: 'shoppinglist.page.html',
  styleUrls: ['shoppinglist.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonButtons, IonButton, IonFabButton, IonIcon, IonFab, IonItemSliding, IonLabel, IonItemOptions, IonItemOption],
})
export class ShoppinglistPage implements OnInit{

  cart?: ShoppingCart;

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    const test = [
      { name: 'Äpfel' },
      { name: 'Ananas' },
      { name: 'Avocado' },
      { name: 'Bananen' },
      { name: 'Bier' },
      { name: 'Blumenkohl' },
      { name: 'Brot' },
      { name: 'Brokkoli' },
      { name: 'Butter' },
      { name: 'Cola' },
      { name: 'Cornflakes' },
      { name: 'Eier' },
      { name: 'Erdbeeren' },
      { name: 'Erdnussbutter' },
      { name: 'Essig' },
      { name: 'Fisch' },
      { name: 'Garnelen' },
      { name: 'Gemüsebrühe' },
      { name: 'Gewürze' },
      { name: 'Gurken' },
      { name: 'Haferflocken' },
      { name: 'Hähnchen' },
      { name: 'Himbeeren' },
      { name: 'Honig' },
      { name: 'Honigmelone' },
      { name: 'Hummus' },
      { name: 'Hülsenfrüchte' },
      { name: 'Hüftsteak' },
      { name: 'Hühnerbrust' },
      { name: 'Hühnerflügel' },
      { name: 'Hühnerkeulen' },
      { name: 'Hühnerleber' },
      { name: 'Joghurt' },
      { name: 'Karotten' },
      { name: 'Kartoffeln' },
      { name: 'Käse' },
      { name: 'Ketchup' },
      { name: 'Kiwi' },
      { name: 'Knoblauch' },
      { name: 'Kräuter' },
      { name: 'Lachs' },
      { name: 'Limonde' },
      { name: 'Mango' },
      { name: 'Marmelade' },
      { name: 'Mayonnaise' },
      { name: 'Mehl' },
      { name: 'Milch' },
      { name: 'Müsli' },
      { name: 'Müsli-Riegel' },
      { name: 'Nudeln' },
      { name: 'Nüsse' },
      { name: 'Orangen' },
      { name: 'Paprika' },
      { name: 'Pfirsiche' },
      { name: 'Pflaumen' },
      { name: 'Pilze' },
      { name: 'Putensbrust' },
      { name: 'Quark' },
      { name: 'Reis' },
      { name: 'Rindfleisch' },
      { name: 'Rinderherz' },
      { name: 'Rinderleber' },
      { name: 'Rinderzunge' },
      { name: 'Rosinen' },
      { name: 'Salami' },
      { name: 'Salz' },
      { name: 'Schinken' },
      { name: 'Schokolade' },
      { name: 'Schweinefleisch' },
      { name: 'Schweinehaxen' },
      { name: 'Schweineleber' },
      { name: 'Senf' },
      { name: 'Seitan' },
      { name: 'Sojasauce' },
      { name: 'Spinat' },
      { name: 'Tomaten' },
      { name: 'Tomatensauce' },
      { name: 'Tofu' },
      { name: 'Trauben' },
      { name: 'Wasser' },
      { name: 'Walnüsse' },
      { name: 'Wein' },
      { name: 'Wurst' },
      { name: 'Zitronen' },
      { name: 'Zucker' },
      { name: 'Zwiebeln' }] as const;
    this.cart = {      items: []      };
    let i=0;
    for (const testElement of test) {
      const newItem = {ean: (i++ + 7).toString(), name: testElement.name};
      this.cart.items.push({item: newItem, quantity: 0})
    }
  }

  async deleteOnDrag($event: NPIonDragEvent, item: ShoppingCartItem, list: IonList) {
    console.log($event.detail);
    if($event.detail.amount > 250) {
      await list.closeSlidingItems();
      this.cart?.items.splice(this.cart?.items.indexOf(item), 1);
    }
  }
}
