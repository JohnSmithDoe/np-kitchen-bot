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
import { IGlobalItem, IItemList } from '../../@types/types';
import { GlobalListComponent } from '../../components/global-list/global-list.component';
import { LocalListComponent } from '../../components/local-list/local-list.component';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  imports: [
    IonButton,
    NgTemplateOutlet,
    LocalListComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonModal,
    IonButtons,
    IonContent,
    TranslateModule,
    GlobalListComponent,
  ],
  templateUrl: './add-item.dialog.html',
  styleUrl: './add-item.dialog.scss',
})
export class AddItemDialog implements OnInit {
  readonly #database = inject(DatabaseService);
  @Input() itemList!: IItemList<IGlobalItem>;

  @Output() addItem = new EventEmitter<IGlobalItem>();
  @Output() createItem = new EventEmitter<IGlobalItem>();
  @Output() cancel = new EventEmitter();

  ngOnInit(): void {
    this.itemList ??= this.#database.all;
  }

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
