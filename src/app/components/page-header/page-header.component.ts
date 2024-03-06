import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { TColor } from '../../@types/types';

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  imports: [
    IonToolbar,
    IonHeader,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonIcon,
    TranslateModule,
  ],
})
export class PageHeaderComponent {
  @Input() label = '';
  @Input() color?: TColor;
  @Input({ transform: booleanAttribute }) hideButtons = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Output() addItem = new EventEmitter<void>();

  constructor() {
    addIcons({ add });
  }
}
