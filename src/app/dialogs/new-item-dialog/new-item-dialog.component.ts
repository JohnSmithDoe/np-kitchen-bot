import {JsonPipe} from "@angular/common";
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {StorageItem} from "../../@types/types";

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
export class NewItemDialogComponent {
  @Input() isOpen = false;
  @Output() createItem: EventEmitter<StorageItem> = new EventEmitter<StorageItem>();
  inputVal = {name:'Hello World'};

  close() {
    this.isOpen = false;
    this.createItem.emit();
  }

}
