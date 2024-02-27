import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
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
import { StorageItem, StorageItemList } from '../../@types/types';
import { StorageListComponent } from '../../components/storage-list/storage-list.component';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  imports: [
    IonButton,
    NgTemplateOutlet,
    StorageListComponent,
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
export class AddItemDialog implements OnInit {
  readonly #database = inject(DatabaseService);
  @Input() itemList!: StorageItemList;

  @Output() addItem = new EventEmitter<StorageItem>();
  @Output() createItem = new EventEmitter<StorageItem>();
  @Output() cancel = new EventEmitter();

  ngOnInit(): void {
    this.itemList ??= this.#database.all;
  }

  close() {
    this.cancel.emit();
  }

  selectItem(item?: StorageItem) {
    this.addItem.emit(item);
  }

  createNewItem(item?: StorageItem) {
    this.createItem.emit(item);
  }
}
