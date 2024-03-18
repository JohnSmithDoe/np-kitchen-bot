import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import {
  TColor,
  TIonDragEvent,
  TItemListCategory,
} from '../../../@types/types';
import { checkItemOptionsOnDrag } from '../../../app.utils';
import { CategoryNoteDirective } from '../../../directives/category-note.directive';

@Component({
  selector: 'app-category-item',
  standalone: true,
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
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
    DatePipe,
  ],
})
export class CategoryItemComponent {
  @Input({ required: true }) category!: TItemListCategory;
  @Input({ required: true }) count!: number;
  @Input({ required: true }) ionList!: IonList;

  @Input() color?: TColor;

  @Output() selectCategory = new EventEmitter<void>();
  @Output() deleteCategory = new EventEmitter<void>();

  constructor() {}

  async handleItemOptionsOnDrag(ev: TIonDragEvent) {
    if (checkItemOptionsOnDrag(ev) === 'end') {
      return this.emitDeleteItem();
    }
  }

  async emitDeleteItem() {
    await this.ionList.closeSlidingItems();
    this.deleteCategory.emit();
  }
}
