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
import { add, duplicate, remove } from 'ionicons/icons';
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
    IonHeader,
    IonToolbar,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonTitle,
    AddItemDialog,
    IonMenuButton,
    IonButtons,
    IonButton,
    IonLabel,
    TranslateModule,
    IonModal,
    EditGlobalItemDialogComponent,
    EditShoppingItemDialogComponent,
    ShoppingListComponent,
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
  isEditing = false;
  isCreating = false;
  createNewItem: IGlobalItem | null | undefined;

  constructor() {
    addIcons({ add, remove, duplicate });
  }

  ngOnInit(): void {
    this.shoppingList = this.#database.shoppinglist();
    this.createNewItem = null;
  }

  async addGlobalItemToShoppingList(item?: IGlobalItem) {
    if (!item) return;
    let litem: IShoppingItem | undefined = createShoppingItemFromGlobal(
      item,
      1
    );
    return this.addItemToShoppingList(litem);
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

  showEditDialog() {
    this.isEditing = true;
  }

  showCreateDialog(newItem: IBaseItem) {
    this.isAdding = false;
    this.isCreating = true;
    this.createNewItem = createGlobalItemFrom(newItem);
  }

  async createItemAndAddToShoppingList(item?: IGlobalItem) {
    this.isCreating = false;
    this.createNewItem = null;

    if (item?.name.length) {
      await this.#database.addOrUpdateGlobalItem(item);
      const litem = createShoppingItemFromGlobal(item, 1);
      await this.#database.addItem(litem, this.shoppingList);
      this.listComponent.refresh();
      await this.#uiService.showToast(
        this.translate.instant('shoppinglist.page.toast.created', {
          name: litem?.name,
        })
      );
    }
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
