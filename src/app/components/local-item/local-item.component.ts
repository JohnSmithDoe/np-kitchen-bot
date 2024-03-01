import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonListHeader,
  IonNote,
  IonReorder,
  IonRippleEffect,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ILocalItem, TColor } from '../../@types/types';
import { createLocalItem } from '../../app.factory';
import { CategoriesPipe } from '../../pipes/categories.pipe';

@Component({
  selector: 'app-local-item',
  standalone: true,
  templateUrl: './local-item.component.html',
  styleUrls: ['./local-item.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
    IonIcon,
    IonReorder,
    TranslateModule,
    NgTemplateOutlet,
    IonNote,
    IonListHeader,
    CategoriesPipe,
    IonAvatar,
    IonChip,
    IonRippleEffect,
    DatePipe,
    IonText,
  ],
})
export class LocalItemComponent implements OnInit, OnChanges {
  @Input() item!: ILocalItem;
  @Input() label?: string;
  @Input() color?: TColor;
  @Input() category?: string;
  @Input() categoryAlt?: string;
  @Input() helper?: string;

  @Output() selectItem = new EventEmitter<ILocalItem>();
  @Output() increment = new EventEmitter<ILocalItem>();
  @Output() decrement = new EventEmitter<ILocalItem>();

  constructor() {}

  ngOnInit() {
    if (!this.item && !this.label)
      throw new Error('Either label or item must be set');
    if (!this.item) {
      this.#updateItem();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('label') && this.label) {
      this.#updateItem();
    }
  }

  #updateItem() {
    if (this.label) {
      this.item = createLocalItem(this.label, this.category);
    }
  }

  // inner button click
  incrementQuantity(ev: MouseEvent) {
    this.increment.emit(this.item);
    ev.stopPropagation();
  }

  // inner button click
  decrementQuantity(ev: MouseEvent) {
    this.decrement.emit(this.item);
    ev.stopPropagation();
  }
}
