import {Component} from '@angular/core';
import {IonButton, IonButtons, IonContent, IonHeader, IonList, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-actions-page',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonButtons, IonButton],
})
export class TasksPage {
  constructor() {}
}
