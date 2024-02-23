import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {TranslateModule} from "@ngx-translate/core";
import {addIcons} from "ionicons";
import {closeCircle} from "ionicons/icons";
import {StorageItem} from "../../@types/types";
import {DatabaseService} from "../../services/database.service";
import {CategoriesDialogComponent} from "../categories-dialog/categories-dialog.component";

@Component({
  selector: 'app-new-item-dialog',
  standalone: true,
  imports: [
    IonButton,
    FormsModule,
    IonToolbar,
    IonHeader,
    IonModal,
    IonTitle,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonChip,
    IonAvatar,
    IonLabel,
    IonIcon,
    CategoriesDialogComponent,
    TranslateModule,
  ],
  templateUrl: './new-item-dialog.component.html',
  styleUrl: './new-item-dialog.component.scss'
})
export class NewItemDialogComponent implements OnInit {
  readonly #database = inject(DatabaseService);
  @Input() itemName?: string | null;
  @Input() value!: StorageItem;

  @Output() createItem= new EventEmitter<StorageItem>();
  @Output() cancel = new EventEmitter();
  selectCategories = false;

  constructor() {
    addIcons({closeCircle})
  }

  ngOnInit(): void {
        this.value = this.#database.createNewStorageItem(this.itemName ?? '')
  }


  setCategories(categories?: string[]) {
    this.selectCategories = false;
    if(categories) {
      this.value.category = categories;
    }
  }

  removeCategory(cat: string) {
    this.value.category?.splice(this.value.category?.indexOf(cat),1);
  }
}
