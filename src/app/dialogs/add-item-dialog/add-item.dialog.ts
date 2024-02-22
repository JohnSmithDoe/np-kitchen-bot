import {NgTemplateOutlet} from "@angular/common";
import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {StorageItem, StorageItemList} from "../../@types/types";
import {StorageListComponent} from "../../components/storage-list/storage-list.component";
import {DatabaseService} from "../../services/database.service";
import {NewItemDialogComponent} from "../new-item-dialog/new-item-dialog.component";

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  imports: [
    IonButton,
    NewItemDialogComponent,
    NgTemplateOutlet,
    StorageListComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonModal,
    IonButtons,
    IonContent,
  ],
  templateUrl: './add-item.dialog.html',
  styleUrl: './add-item.dialog.scss'
})
export class AddItemDialog implements OnChanges {
  readonly #database = inject(DatabaseService);
  @Input() isOpen = false;
  @Output() addItem: EventEmitter<StorageItem> = new EventEmitter<StorageItem>();
  @Input() itemList!: StorageItemList;
  isCreating = false;
  newItemName?: string | null;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.hasOwnProperty('isOpen') && this.isOpen) {
      this.isCreating = false;
      this.newItemName = null;
      this.itemList ??= this.#database.all;
    }
  }

  close() {
    this.isOpen = false;
    this.addItem.emit();
  }

  openNewDialog(newItemName: string) {
    this.newItemName = newItemName;
    this.isCreating = true;
  }

  async createItem(item?: StorageItem) {
    this.isCreating = false;
    if (item?.name.length) {
      this.#database.addToAllItems(item);
      await this.#database.save();
    this.newItemName = null;
    this.selectItem(item);
    }
  }

  selectItem(item?: StorageItem) {
    this.addItem.emit(item);
    this.isOpen = false;
  }
}
