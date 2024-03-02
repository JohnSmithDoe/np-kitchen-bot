import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { IGlobalItem, IItemList, ILocalItem } from '../../@types/types';
import { createGlobalItemFrom, createLocalItemFrom } from '../../app.factory';
import { GlobalListComponent } from '../../components/global-list/global-list.component';
import { LocalListComponent } from '../../components/local-list/local-list.component';
import { AddItemDialog } from '../../dialogs/add-item-dialog/add-item.dialog';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditLocalItemDialogComponent } from '../../dialogs/edit-local-item-dialog/edit-local-item-dialog.component';
import { DatabaseService } from '../../services/database.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-page-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  standalone: true,
  imports: [
    LocalListComponent,
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
    TranslateModule,
    IonModal,
    EditLocalItemDialogComponent,
    EditGlobalItemDialogComponent,
    GlobalListComponent,
  ],
})
export class InventoryPage implements OnInit {
  @ViewChild(LocalListComponent, { static: true })
  listComponent!: LocalListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);

  inventory!: IItemList<ILocalItem>;

  isAdding = false;
  isCreating = false;
  createNewItem: IGlobalItem | null | undefined;

  isEditing = false;
  editItem: ILocalItem | null | undefined;
  editMode: 'update' | 'create' = 'create';

  constructor() {
    addIcons({ add, remove });
  }

  ngOnInit(): void {
    this.inventory = this.#database.storage;
    this.createNewItem = null;
  }

  showCreateDialog(newItem: ILocalItem) {
    this.isAdding = false;
    this.isCreating = true;
    this.createNewItem = createGlobalItemFrom(newItem);
  }

  showEditDialog(item?: ILocalItem) {
    this.isAdding = false;
    this.isCreating = false;
    this.isEditing = true;
    this.editItem = item;
    this.editMode = item ? 'update' : 'create';
  }

  showAddDialog() {
    this.isAdding = true;
    this.isEditing = false;
    this.isCreating = false;
  }

  async updateInventoryItem(item?: ILocalItem) {
    this.isEditing = false;
    this.editItem = null;
    await this.#database.addOrUpdateLocalItem(item, this.inventory);
    console.log(item, this.inventory);
    this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('inventory.page.toast.update', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }

  async addItemToInventory(item?: ILocalItem) {
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
      const copy = createLocalItemFrom(item);
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
    if (item) {
      const litem = await this.#database.addItem(item, this.inventory);
      this.listComponent.refresh();
      await this.#uiService.showToast(
        this.translate.instant('inventory.page.toast.added', {
          name: litem?.name,
        })
      );
    }
  }

  async removeItemFromInventory(item: ILocalItem) {
    await this.#database.deleteItem(item, this.inventory);
    this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('inventory.page.toast.remove', {
        name: item?.name,
      })
    );
  }

  async copyToShoppingList(item?: ILocalItem) {
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
