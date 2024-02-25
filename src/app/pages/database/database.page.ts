import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonModal,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {addIcons} from "ionicons";
import {add, remove} from "ionicons/icons";
import {StorageItem, StorageItemList} from "../../@types/types";
import {StorageListComponent} from "../../components/storage-list/storage-list.component";
import {AddItemDialog} from "../../dialogs/add-item-dialog/add-item.dialog";
import {EditItemDialogComponent} from "../../dialogs/edit-item-dialog/edit-item-dialog.component";
import {DatabaseService} from "../../services/database.service";
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-page-database',
  templateUrl: 'database.page.html',
  styleUrls: ['database.page.scss'],
  standalone: true,
  imports: [StorageListComponent, IonHeader, IonToolbar, IonContent, IonFab, IonFabButton, IonIcon, IonTitle, AddItemDialog, IonButtons, IonMenuButton, IonButton, TranslateModule, IonModal, EditItemDialogComponent],
})
export class DatabasePage implements OnInit {
  @ViewChild(StorageListComponent, {static: true}) storageList!: StorageListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);

  items!: StorageItemList;

  isEditing = false;
  editItem: StorageItem | null | undefined;
  mode: 'update' | 'create' = 'create';

  constructor() {
    addIcons({add, remove})
  }

  ngOnInit(): void {
    this.items = this.#database.all;
    this.editItem = null;
  }

  async saveItemToDatabase(item?: StorageItem) {
    this.isEditing = false;
    if (!item) return;

    await this.#database.addOrUpdateItem(item);
    this.storageList.refresh();
    await this.#uiService.showToast(this.translate.instant('database.toast.add', {name: item.name, total: item.quantity}));

  }

  showEditDialog(item: StorageItem|null, mode: 'update' | 'create') {
    this.mode = mode;
    this.isEditing = true;
    this.editItem = item;
  }

  async removeItemFromDatabase(item: StorageItem) {
    await this.#database.deleteItem(item, this.items);
    this.storageList.refresh();
    await this.#uiService.showToast(this.translate.instant('database.toast.remove', {name: item.name}));
  }

}
