import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {StorageItem} from "../../@types/types";
import {NewItemDialogComponent} from "../new-item-dialog/new-item-dialog.component";

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  imports: [
    IonicModule,
    NewItemDialogComponent
  ],
  templateUrl: './add-item.dialog.html',
  styleUrl: './add-item.dialog.scss'
})
export class AddItemDialog implements OnChanges {
  @Input() isOpen = false;
  @Output() addItem: EventEmitter<StorageItem> = new EventEmitter<StorageItem>();
  categories: { id: string; name: string }[] = [];
  isCreating = false;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.hasOwnProperty('isOpen') && this.isOpen) {
      this.isCreating = false;
      this.categories = [
        {id: '1', name: 'Gemüse'},
        {id: '2', name: 'Obst'},
        {id: '3', name: 'Fleisch'},
        {id: '4', name: 'Käse'},
      ]
    }
  }

  close() {
    this.isOpen = false;
    this.addItem.emit();
  }

  chooseCategory(category: { id: string; name: string }) {
    this.categories = [
      {id: '5', name:'Birnen'}
    ]
  }

  searchItem($event: any) {
    console.log($event);
    this.isCreating = true;
  }
}
