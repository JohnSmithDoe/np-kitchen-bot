import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
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
  IonListHeader,
  IonNote,
  IonReorder,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import * as dayjs from 'dayjs';
import { ITaskItem, TColor, TIonDragEvent } from '../../../@types/types';
import { checkItemOptionsOnDrag } from '../../../app.utils';
import { CategoryNoteDirective } from '../../../directives/category-note.directive';
import { ItemListComponent } from '../../item-list/item-list.component';

@Component({
  selector: 'app-task-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
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
export class TaskItemComponent {
  @Input({ required: true }) item!: ITaskItem;
  @Input({ required: true }) itemList!: ItemListComponent;

  @Input() color?: TColor;

  @Output() selectItem = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<void>();

  constructor() {}

  async handleItemOptionsOnDrag(ev: TIonDragEvent) {
    if (checkItemOptionsOnDrag(ev) === 'end') {
      return this.emitDeleteItem();
    }
  }

  async emitDeleteItem() {
    await this.itemList.closeSlidingItems();
    this.deleteItem.emit();
  }

  getColor(): TColor {
    let result: TColor = 'success';
    if (this.item.dueAt) {
      if (dayjs(this.item.dueAt).isBefore()) {
        result = 'danger';
      } else if (dayjs(this.item.dueAt).isBefore(dayjs().add(3, 'days'))) {
        result = 'warning';
      }
    }
    return result;
  }
}
