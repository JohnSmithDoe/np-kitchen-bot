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
import { IGlobalItem, IItemList, ILocalItem } from '../../@types/types';
import { createGlobalItemFrom } from '../../app.factory';
import { LocalListComponent } from '../../components/local-list/local-list.component';
import { AddItemDialog } from '../../dialogs/add-item-dialog/add-item.dialog';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditLocalItemDialogComponent } from '../../dialogs/edit-local-item-dialog/edit-local-item-dialog.component';
import { DatabaseService } from '../../services/database.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-page-shopping-list',
  templateUrl: 'shoppinglist.page.html',
  styleUrls: ['shoppinglist.page.scss'],
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
    IonMenuButton,
    IonButtons,
    IonButton,
    IonLabel,
    TranslateModule,
    IonModal,
    EditGlobalItemDialogComponent,
    EditLocalItemDialogComponent,
  ],
})
export class ShoppinglistPage implements OnInit {
  @ViewChild(LocalListComponent, { static: true })
  listComponent!: LocalListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);

  shoppingList!: IItemList<ILocalItem>;

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

  async addItemToShoppingList(item?: ILocalItem) {
    this.isAdding = false;
    item = await this.#database.addItem(item, this.shoppingList);
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

  showCreateDialog(newItem: ILocalItem) {
    this.isAdding = false;
    this.isCreating = true;
    this.createNewItem = createGlobalItemFrom(newItem);
  }

  async createItemAndAddToShoppingList(item?: IGlobalItem) {
    this.isCreating = false;
    this.createNewItem = null;

    if (item?.name.length) {
      await this.#database.addOrUpdateGlobalItem(item);
      await this.#database.addItem(item, this.shoppingList);
      this.listComponent.refresh();
      await this.#uiService.showToast(
        this.translate.instant('shoppinglist.page.toast.created', {
          name: item?.name,
        })
      );
    }
  }

  async removeItemFromShoppingList(item: ILocalItem) {
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

  async buyItem(item: ILocalItem) {
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
