import {JsonPipe} from "@angular/common";
import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
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
export class NewItemDialogComponent implements OnInit {
  readonly #database = inject(DatabaseService);
  @Input() isOpen = false;
  @Output() createItem: EventEmitter<StorageItem> = new EventEmitter<StorageItem>();
  @Input() value!: StorageItem;

  ngOnInit(): void {
    if (!this.value) {
      this.value = this.#database.createNewStorageItem()
    }
  }

  close() {
    this.isOpen = false;
    this.createItem.emit(this.value);
  }

}
