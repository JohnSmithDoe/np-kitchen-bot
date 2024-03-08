import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IonActionSheet,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { ellipse, square, triangle } from 'ionicons/icons';
import { CommonActionsSheetComponent } from '../../dialogs/common-actions-sheet/common-actions-sheet.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonLabel,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonActionSheet,
    IonButton,
    CommonActionsSheetComponent,
    TranslateModule,
  ],
})
export class HomePage {
  constructor() {
    addIcons({ triangle, ellipse, square });
  }
}
