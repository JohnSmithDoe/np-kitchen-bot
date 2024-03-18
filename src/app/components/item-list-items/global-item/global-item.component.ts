import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonReorder,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { IGlobalItem, TColor, TIonDragEvent } from '../../../@types/types';
import { checkItemOptionsOnDrag } from '../../../app.utils';
import { CategoryNoteDirective } from '../../../directives/category-note.directive';

@Component({
  selector: 'app-global-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    IonAvatar,
    IonChip,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonText,
    CategoryNoteDirective,
  ],
})
export class GlobalItemComponent implements OnInit {
  @Input() item!: IGlobalItem;

  @Input() color?: TColor;
  @Input({ required: true }) ionList!: IonList;

  @Output() selectItem = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    if (!this.item) throw new Error('Item must be set');
  }

  async handleItemOptionsOnDrag(ev: TIonDragEvent) {
    if (checkItemOptionsOnDrag(ev) === 'end') {
      return this.emitDeleteItem();
    }
  }

  async emitDeleteItem() {
    await this.ionList.closeSlidingItems();
    this.deleteItem.emit();
  }
}
