import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonModal,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {TranslateModule} from "@ngx-translate/core";
import {StorageCategory, StorageItem} from "../../@types/types";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-categories-dialog',
  standalone: true,
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.scss'],
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonSearchbar,
    IonContent,
    IonList,
    IonItem,
    IonCheckbox,
    FormsModule,
    TranslateModule

  ]
})
export class CategoriesDialogComponent implements OnInit {
  readonly #database = inject(DatabaseService);

  @Input() isOpen = false;
  @Input() item?: StorageItem;

  @Output() confirm = new EventEmitter<string[]>();

  items: StorageCategory[] = [];
  newCategories: StorageCategory[] = [];
  selection: string[] = [];
  searchFor?: string;

  constructor() {
  }

  ngOnInit() {
    this.items = this.#database.categories;
    this.searchFor = undefined;
    if (this.item) {
      this.selection = this.item.category ?? [];
    }
  }

  cancelChanges() {
    this.confirm.emit();
    this.isOpen = false;
  }

  confirmChanges() {
    this.confirm.emit(this.selection);
    this.isOpen = false;
  }

  searchbarInput(ev: any) {
    this.searchFor = ev.target.value;
    if (!this.searchFor || !this.searchFor.length) {
      this.items = [
        ...this.newCategories,
        ...this.#database.categories
      ]
    }else {
    this.items = [
      ...this.newCategories,
      ...this.#database.categories
    ].filter(
      cat => cat.name.toLowerCase().includes(this.searchFor!)
    )
  }
  }

  isChecked(item: StorageCategory) {
    return this.selection.find(selected => selected === item.name);
  }

  selectionChange(ev: any) {
    const {checked, value} = ev.detail;
    if (checked) {
      this.selection = [...this.selection, value.name];
    } else {
      this.selection = this.selection.filter((item) => item !== value.name);
    }
  }

  addNewCategory() {
    if (this.searchFor && !!this.searchFor.length) {
      this.newCategories.push({name: this.searchFor, items: []})
      this.selection = [...this.selection, this.searchFor];
      this.searchbarInput({target: {value: null}})
    }
  }
}
