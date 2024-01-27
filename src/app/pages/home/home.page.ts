import {Component, EnvironmentInjector, inject} from '@angular/core';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonLabel,
    IonTabBar,
    IonTabButton, IonTabs
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {ellipse, square, triangle} from "ionicons/icons";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs],
})
export class HomePage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ triangle, ellipse, square });
  }
}
