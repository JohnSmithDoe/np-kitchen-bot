import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonListHeader,
  IonNote,
} from '@ionic/angular/standalone';
import { TColor } from '../../../@types/types';

@Component({
  selector: 'app-text-item',
  standalone: true,
  templateUrl: './text-item.component.html',
  styleUrls: ['./text-item.component.scss'],
  imports: [IonItem, IonLabel, IonListHeader, IonNote],
})
export class TextItemComponent {
  @Input() label?: string | null;
  @Input() color?: TColor;
  @Input() helper?: string;
  @Input() note?: string;

  @Output() selectItem = new EventEmitter<void>();

  constructor() {}

  selectCurrent() {
    this.selectItem.emit();
  }
}
