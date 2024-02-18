import {JsonPipe} from "@angular/common";
import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {StorageItem} from "../../@types/types";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-new-item-dialog',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    JsonPipe

  ],
  templateUrl: './new-item-dialog.component.html',
  styleUrl: './new-item-dialog.component.scss'
})
export class NewItemDialogComponent implements OnChanges {
  readonly #database = inject(DatabaseService);
  @Input() isOpen = false;
  @Input() itemName?: string | null;
  @Input() value!: StorageItem;

  @Output() createItem: EventEmitter<StorageItem> = new EventEmitter<StorageItem>();

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges-', this.itemName, changes);
    if(changes.hasOwnProperty('isOpen') && this.isOpen) {
        console.log('create -', this.itemName);
        this.value = this.#database.createNewStorageItem(this.itemName ?? '')
    }
  }

  close(doCreate: boolean) {
    this.isOpen = false;
    this.createItem.emit(doCreate ? this.value : undefined);
  }

}
