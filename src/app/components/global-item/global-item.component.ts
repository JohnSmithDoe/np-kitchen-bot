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
} from '@ionic/angular/standalone';
import { Color } from '@ionic/core/dist/types/interface';
import { TranslateModule } from '@ngx-translate/core';
import { IGlobalItem } from '../../@types/types';
import { CategoriesPipe } from '../../pipes/categories.pipe';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-global-item',
  standalone: true,
  templateUrl: './global-item.component.html',
  styleUrls: ['./global-item.component.scss'],
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
  ],
})
export class GlobalItemComponent implements OnInit, OnChanges {
  @Input() item!: IGlobalItem;
  @Input() header?: string;
  @Input() label?: string;
  @Input() color?: Color;
  @Input() category?: string;
  @Input() categoryAlt?: string;
  @Input() helper?: string = 'Click here to add...';

  @Output() selectItem = new EventEmitter<IGlobalItem>();
  @Output() cartItem = new EventEmitter<IGlobalItem>();

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
      this.item = DatabaseService.createGlobalItem(this.label, this.category);
    }
  }
}
