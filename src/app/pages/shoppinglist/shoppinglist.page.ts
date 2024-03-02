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
  IShoppingItem,
} from '../../@types/types';
import {
  createGlobalItemFrom,
  createShoppingItemFromGlobal,
} from '../../app.factory';
import { ShoppingListComponent } from '../../components/shopping-list/shopping-list.component';
import { AddItemDialog } from '../../dialogs/add-item-dialog/add-item.dialog';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditShoppingItemDialogComponent } from '../../dialogs/edit-shopping-item-dialog/edit-shopping-item-dialog.component';
import { DatabaseService } from '../../services/database.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-page-shopping-list',
  templateUrl: 'shoppinglist.page.html',
  styleUrls: ['shoppinglist.page.scss'],
  standalone: true,
  imports: [
    ShoppingListComponent,
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
    EditShoppingItemDialogComponent,
    EditGlobalItemDialogComponent,
  ],
})
export class ShoppinglistPage implements OnInit {
  @ViewChild(ShoppingListComponent, { static: true })
  listComponent!: ShoppingListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);

  shoppingList!: IItemList<IShoppingItem>;

  isAdding = false;
  isCreating = false;
  createNewItem: IGlobalItem | null | undefined;

  isEditing = false;
  editItem: IShoppingItem | null | undefined;
  editMode: 'update' | 'create' = 'create';

  constructor() {
    addIcons({ add, remove });
  }

  ngOnInit(): void {
    this.shoppingList = this.#database.shoppinglist();
    this.createNewItem = null;
  }

  showCreateDialog(newItem: IBaseItem) {
    this.isAdding = false;
    this.isCreating = true;
    this.createNewItem = createGlobalItemFrom(newItem);
  }

  showEditDialog(item?: IShoppingItem) {
    this.isAdding = false;
    this.isCreating = false;
    this.isEditing = true;
    this.editItem = item;
    this.editMode = item ? 'update' : 'create';
  }

  async updateShoppingItem(item?: IShoppingItem) {
    this.isEditing = false;
    this.editItem = null;
    await this.#database.addOrUpdateStorageItemShipping(
      item,
      this.shoppingList
    );
    this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('inventory.page.toast.update', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }

  async addItemToShoppingList(item?: IShoppingItem) {
    this.isAdding = false;
    item = await this.#database.addItemShopping(item, this.shoppingList);
    this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('shoppinglist.page.toast.add', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }

  async createItemAndAddToShoppingList(item?: IGlobalItem) {
    this.isCreating = false;
    this.createNewItem = null;

    if (item?.name.length) {
      await this.#database.addOrUpdateGlobalItem(item);
      const copy = createShoppingItemFromGlobal(item);
      const litem = await this.#database.addItem(copy, this.shoppingList);

      this.listComponent.refresh();
      await this.#uiService.showToast(
        this.translate.instant('shoppinglist.page.toast.created', {
          name: litem?.name,
        })
      );
    }
  }

  async addGlobalItemToShoppingList(item?: IGlobalItem) {
    if (!item) return;
    let litem: IShoppingItem | undefined = createShoppingItemFromGlobal(
      item,
      1
    );
    return this.addItemToShoppingList(litem);
  }

  async removeItemFromShoppingList(item: IShoppingItem) {
    await this.#database.deleteItem(item, this.shoppingList);
    this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('shoppinglist.page.toast.remove', {
        name: item?.name,
      })
    );
  }
  // what should happen if we buy an item?

  // some kind of state for now

  async buyItem(item: IShoppingItem) {
    item.state = 'bought';
    await this.#database.save();
    await this.#uiService.showToast(
      this.translate.instant('shoppinglist.page.toast.move', {
        name: item?.name,
        total: item?.quantity,
      })
    );
  }
}
