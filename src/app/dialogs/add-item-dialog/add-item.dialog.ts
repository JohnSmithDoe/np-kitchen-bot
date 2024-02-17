import {NgTemplateOutlet} from "@angular/common";
import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IonicModule, SearchbarCustomEvent} from "@ionic/angular";
import {StorageItem} from "../../@types/types";
import {DatabaseService} from "../../services/database.service";
import {NewItemDialogComponent} from "../new-item-dialog/new-item-dialog.component";

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  imports: [
    IonicModule,
    NewItemDialogComponent,
    NgTemplateOutlet
  ],
  templateUrl: './add-item.dialog.html',
  styleUrl: './add-item.dialog.scss'
})
export class AddItemDialog implements OnChanges {
  readonly #database = inject(DatabaseService);
  @Input() isOpen = false;
  @Output() addItem: EventEmitter<StorageItem> = new EventEmitter<StorageItem>();
  categories: { items: StorageItem[]; name: string }[] = [];
  items: StorageItem[] = [];
  isCreating = false;
  mode: 'alphabetical' | 'categories' = 'alphabetical';

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.hasOwnProperty('isOpen') && this.isOpen) {
      this.isCreating = false;
      this.categories = this.#database.categories;
      this.items = this.#database.items;
    }
  }

  close() {
    this.isOpen = false;
    this.addItem.emit();
  }

  chooseCategory(category: { items: StorageItem[]; name: string } ) {
    this.items = category.items;
    this.mode = 'alphabetical';
  }

  searchItem($event: SearchbarCustomEvent) {
    if ($event.detail.value) {
      const searchFor = $event.detail.value.toLowerCase();
      this.items = this.#database.items.filter(item => item.name.toLowerCase().indexOf(searchFor) >= 0);
    } else {
      this.items = this.#database.items;
    }
    if (!this.items.length) {
      this.isCreating = true;
    }
  }

  async createItem(item: StorageItem) {
    if (item.name.length) {
      await this.#database.saveItem(item);
      this.categories = this.#database.categories;
    }
  }

  setDisplayMode(mode: 'alphabetical' | 'categories') {
    this.items = this.#database.items;
    this.mode = mode;
  }

  selectItem(item: StorageItem) {
    this.addItem.emit(item);
    this.isOpen = false;
  }
}
