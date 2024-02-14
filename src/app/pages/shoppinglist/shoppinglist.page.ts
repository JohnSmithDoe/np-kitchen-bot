import {Component, OnInit} from '@angular/core';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {ListItem} from "../../@types/types";
import {NpListComponent} from "../../components/np-list/np-list.component";

@Component({
  selector: 'app-page-shopping-list',
  templateUrl: 'shoppinglist.page.html',
  styleUrls: ['shoppinglist.page.scss'],
  standalone: true,
  imports: [NpListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle],
})
export class ShoppinglistPage implements OnInit{

  items: ListItem[] = [];

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    const test = [
      {name: 'Äpfel'},
      {name: 'Ananas'},
      {name: 'Avocado'},
      {name: 'Bananen'},
      {name: 'Bier'},
      {name: 'Blumenkohl'},
      {name: 'Brot'},
      {name: 'Brokkoli'},
      {name: 'Butter'},
      {name: 'Cola'},
      {name: 'Cornflakes'},
      {name: 'Eier'},
      {name: 'Erdbeeren'},
      {name: 'Erdnussbutter'},
      {name: 'Essig'},
      {name: 'Fisch'},
      {name: 'Garnelen'},
      {name: 'Gemüsebrühe'},
      {name: 'Gewürze'},
      {name: 'Gurken'},
      {name: 'Haferflocken'},
      {name: 'Hähnchen'},
      {name: 'Himbeeren'},
      {name: 'Honig'},
      {name: 'Honigmelone'},
      {name: 'Hummus'},
      {name: 'Hülsenfrüchte'},
      {name: 'Hüftsteak'},
      {name: 'Hühnerbrust'},
      {name: 'Hühnerflügel'},
      {name: 'Hühnerkeulen'},
      {name: 'Hühnerleber'},
      {name: 'Joghurt'},
      {name: 'Karotten'},
      {name: 'Kartoffeln'},
      {name: 'Käse'},
      {name: 'Ketchup'},
      {name: 'Kiwi'},
      {name: 'Knoblauch'},
      {name: 'Kräuter'},
      {name: 'Lachs'},
      {name: 'Limonde'},
      {name: 'Mango'},
      {name: 'Marmelade'},
      {name: 'Mayonnaise'},
      {name: 'Mehl'},
      {name: 'Milch'},
      {name: 'Müsli'},
      {name: 'Müsli-Riegel'},
      {name: 'Nudeln'},
      {name: 'Nüsse'},
      {name: 'Orangen'},
      {name: 'Paprika'},
      {name: 'Pfirsiche'},
      {name: 'Pflaumen'},
      {name: 'Pilze'},
      {name: 'Putensbrust'},
      {name: 'Quark'},
      {name: 'Reis'},
      {name: 'Rindfleisch'},
      {name: 'Rinderherz'},
      {name: 'Rinderleber'},
      {name: 'Rinderzunge'},
      {name: 'Rosinen'},
      {name: 'Salami'},
      {name: 'Salz'},
      {name: 'Schinken'},
      {name: 'Schokolade'},
      {name: 'Schweinefleisch'},
      {name: 'Schweinehaxen'},
      {name: 'Schweineleber'},
      {name: 'Senf'},
      {name: 'Seitan'},
      {name: 'Sojasauce'},
      {name: 'Spinat'},
      {name: 'Tomaten'},
      {name: 'Tomatensauce'},
      {name: 'Tofu'},
      {name: 'Trauben'},
      {name: 'Wasser'},
      {name: 'Walnüsse'},
      {name: 'Wein'},
      {name: 'Wurst'},
      {name: 'Zitronen'},
      {name: 'Zucker'},
      {name: 'Zwiebeln'}] as const;
    this.items = [];
    let i = 0;
    for (const testElement of test) {
      this.items.push({id: (i++ + 7).toString(), name: testElement.name, quantity: 0})
    }
  }
}
