import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IBaseItem,
  IGlobalItem,
  IItemList,
  IStorageItem,
} from '../../@types/types';
import {
  createGlobalItemFrom,
  createStorageItemFromGlobal,
} from '../../app.factory';
import { StorageListComponent } from '../../components/storage-list/storage-list.component';
import { AddItemDialog } from '../../dialogs/add-item-dialog/add-item.dialog';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditStorageItemDialogComponent } from '../../dialogs/edit-storage-item-dialog/edit-storage-item-dialog.component';
import { DatabaseService } from '../../services/database.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-page-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  standalone: true,
  imports: [
    StorageListComponent,
    IonHeader,
    IonToolbar,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonTitle,
    AddItemDialog,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonLabel,
    TranslateModule,
    IonModal,
    EditStorageItemDialogComponent,
    EditGlobalItemDialogComponent,
  ],
})
export class InventoryPage implements OnInit {
  @ViewChild(StorageListComponent, { static: true })
  listComponent!: StorageListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);

  inventory!: IItemList<IStorageItem>;

  isAdding = false;
  isCreating = false;
  createNewItem: IGlobalItem | null | undefined;

  isEditing = false;
  editItem: IStorageItem | null | undefined;
  editMode: 'update' | 'create' = 'create';

  constructor() {
    addIcons({ add, remove });
  }

  ngOnInit(): void {
    this.inventory = this.#database.storage;
    this.createNewItem = null;
  }

  showCreateDialog(newItem: IBaseItem) {
    this.isAdding = false;
    this.isCreating = true;
    this.createNewItem = createGlobalItemFrom(newItem);
  }

  showEditDialog(item?: IStorageItem) {
    this.isAdding = false;
    this.isCreating = false;
    this.isEditing = true;
    this.editItem = item;
    this.editMode = item ? 'update' : 'create';
  }

  async updateInventoryItem(item?: IStorageItem) {
    this.isEditing = false;
    this.editItem = null;
    await this.#database.addOrUpdateStorageItem(item, this.inventory);
    this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('inventory.page.toast.update', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }

  async addItemToInventory(item?: IStorageItem) {
    this.isAdding = false;
    const litem = await this.#database.addItem(item, this.inventory);
    this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('inventory.page.toast.add', {
        name: litem?.name,
        total: litem?.quantity,
      })
    );
  }

  async createItemAndAddToInventory(item?: IGlobalItem) {
    this.isEditing = false;
    this.isCreating = false;
    this.createNewItem = null;

    if (item?.name.length) {
      await this.#database.addOrUpdateGlobalItem(item);
      const copy = createStorageItemFromGlobal(item);
      const litem = await this.#database.addItem(copy, this.inventory);

      this.listComponent.refresh();
      await this.#uiService.showToast(
        this.translate.instant('inventory.page.toast.created', {
          name: litem?.name,
        })
      );
    }
  }

  async addGlobalItemToInventory(item?: IGlobalItem) {
    if (!item) return;
    let litem: IStorageItem | undefined = createStorageItemFromGlobal(item);
    return this.addItemToInventory(litem);
  }

  async removeItemFromInventory(item: IStorageItem) {
    await this.#database.deleteItem(item, this.inventory);
    this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('inventory.page.toast.remove', {
        name: item?.name,
      })
    );
  }

  async copyToShoppingList(item?: IStorageItem) {
    if (!item) return;
    item.quantity--;
    item = this.#database.cloneItem(item);
    item.quantity = 1;
    item = await this.#database.addItem(item, this.#database.shoppinglist());
    await this.#uiService.showToast(
      this.translate.instant('inventory.page.toast.move', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }
}
