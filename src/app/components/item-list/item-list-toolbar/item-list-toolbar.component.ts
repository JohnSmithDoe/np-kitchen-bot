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
  IonIcon,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';

@Component({
  selector: 'app-item-list-toolbar',
  templateUrl: 'item-list-toolbar.component.html',
  styleUrls: ['item-list-toolbar.component.scss'],
  standalone: true,
  imports: [IonToolbar, IonButtons, IonButton, IonIcon],
})
export class ItemListToolbarComponent {
  @Input({ transform: booleanAttribute }) showToolbar = true;
  @Input({ transform: booleanAttribute }) showReorder = false;

  @Output() selectDisplayMode = new EventEmitter<
    'alphabetical' | 'categories'
  >();
  @Output() toggleReorder = new EventEmitter<void>();

  constructor() {
    addIcons({ add, remove, cart, list });
  }
}
