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
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {addIcons} from "ionicons";
import {closeCircle} from "ionicons/icons";
import {StorageItem} from "../../@types/types";
import {DatabaseService} from "../../services/database.service";
import {CategoriesDialogComponent} from "../categories-dialog/categories-dialog.component";

@Component({
  selector: 'app-edit-item-dialog',
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
  templateUrl: './edit-item-dialog.component.html',
  styleUrl: './edit-item-dialog.component.scss'
})
export class EditItemDialogComponent implements OnInit {
  readonly #database = inject(DatabaseService);
  readonly translate = inject(TranslateService);
  @Input() item?: StorageItem | null;
  @Input() mode: 'update' | 'create' = 'create';
  @Input() value!: StorageItem;


  @Output() saveItem = new EventEmitter<StorageItem>();
  @Output() cancel = new EventEmitter();
  selectCategories = false;
  dialogTitle = '';
  saveButtonText = '';

  constructor() {
    addIcons({closeCircle});
  }

  ngOnInit(): void {
    this.saveButtonText = this.mode === 'create'
      ? this.translate.instant('new.item.dialog.button.create')
      : this.translate.instant('new.item.dialog.button.update');

    this.dialogTitle = this.mode === 'create'
      ? this.translate.instant('new.item.dialog.title.create')
      : this.translate.instant('new.item.dialog.title.update');

    this.value = this.item
      ? this.#database.cloneStorageItem(this.item)
      : this.#database.createNewStorageItem('')
  }


  setCategories(categories?: string[]) {
    this.selectCategories = false;
    this.value.category = categories;
  }

  removeCategory(cat: string) {
    this.value.category?.splice(this.value.category?.indexOf(cat),1);
    // update object reference
    this.value.category = this.value.category ? [...this.value.category] : undefined;
  }
}
