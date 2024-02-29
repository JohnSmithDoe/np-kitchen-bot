import { NgTemplateOutlet } from '@angular/common';
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
} from '@ionic/angular/standalone';
import { Color } from '@ionic/core/dist/types/interface';
import { TranslateModule } from '@ngx-translate/core';
import { ILocalItem } from '../../@types/types';
import { CategoriesPipe } from '../../pipes/categories.pipe';
import { DatabaseService } from '../../services/database.service';

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
  ],
})
export class LocalItemComponent implements OnInit, OnChanges {
  @Input() item!: ILocalItem;
  @Input() label?: string;
  @Input() color?: Color;
  @Input() category?: string;
  @Input() categoryAlt?: string;
  @Input() helper?: string = 'Click here to add...';

  @Output() selectItem = new EventEmitter<ILocalItem>();
  @Output() cartItem = new EventEmitter<ILocalItem>();

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
      this.item = DatabaseService.createLocalItem(this.label, this.category);
    }
  }
}
