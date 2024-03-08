import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { IGlobalItem, IItemList } from '../../@types/types';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonButton,
    NgTemplateOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonModal,
    IonButtons,
    IonContent,
    TranslateModule,
  ],
  templateUrl: './add-item.dialog.html',
  styleUrl: './add-item.dialog.scss',
})
export class AddItemDialog {
  readonly #database = inject(DatabaseService);
  @Input() itemList!: IItemList<IGlobalItem>;

  @Output() addItem = new EventEmitter<IGlobalItem>();
  @Output() createItem = new EventEmitter<IGlobalItem>();
  @Output() cancel = new EventEmitter();

  close() {
    this.cancel.emit();
  }

  selectItem(item?: IGlobalItem) {
    this.addItem.emit(item);
  }

  createNewItem(item?: IGlobalItem) {
    this.createItem.emit(item);
  }
}
