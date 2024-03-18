import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonModal,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IonViewWillEnter,
  IStorageItem,
  TItemListSortType,
} from '../../@types/types';
import { StorageItemComponent } from '../../components/item-list-items/storage-item/storage-item.component';
import { TextItemComponent } from '../../components/item-list-items/text-item/text-item.component';
import { ItemListEmptyComponent } from '../../components/item-list/item-list-empty/item-list-empty.component';
import { ItemListQuickaddComponent } from '../../components/item-list/item-list-quick-add/item-list-quickadd.component';
import { ItemListSearchResultComponent } from '../../components/item-list/item-list-search-result/item-list-search-result.component';
import { ItemListSearchbarComponent } from '../../components/item-list/item-list-searchbar/item-list-searchbar.component';
import { ItemListToolbarComponent } from '../../components/item-list/item-list-toolbar/item-list-toolbar.component';
import { ItemListComponent } from '../../components/item-list/item-list.component';
import { ListPageComponent } from '../../components/pages/list-page/list-page.component';
import { PageHeaderComponent } from '../../components/pages/page-header/page-header.component';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditStorageItemDialogComponent } from '../../dialogs/edit-storage-item-dialog/edit-storage-item-dialog.component';
import { CategoriesPipe } from '../../pipes/categories.pipe';
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import { StorageActions } from '../../state/storage/storage.actions';

@Component({
  selector: 'app-page-storage',
  templateUrl: 'storage.page.html',
  styleUrls: ['storage.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    IonContent,
    ItemListSearchbarComponent,
    ItemListToolbarComponent,
    ItemListQuickaddComponent,
    ItemListComponent,
    TranslateModule,
    ItemListEmptyComponent,
    TextItemComponent,
    IonModal,
    EditGlobalItemDialogComponent,
    StorageItemComponent,
    EditStorageItemDialogComponent,
    CategoriesPipe,
    IonButton,
    AsyncPipe,
    ItemListSearchResultComponent,
    IonButtons,
    IonIcon,
    ListPageComponent,
  ],
})
export class StoragePage implements IonViewWillEnter {
  readonly #store = inject(Store);

  constructor() {
    addIcons({ add, remove });
  }

  ionViewWillEnter(): void {
    this.#store.dispatch(StorageActions.enterPage());
  }

  removeItem(item: IStorageItem) {
    this.#store.dispatch(StorageActions.removeItem(item));
  }

  showEditDialog(item: IStorageItem) {
    this.#store.dispatch(DialogsActions.showEditDialog(item, '_storage'));
  }

  setSortMode(type: TItemListSortType) {
    this.#store.dispatch(StorageActions.updateSort(type, 'toggle'));
  }

  changeQuantity(item: IStorageItem, diff: number) {
    this.#store.dispatch(
      StorageActions.updateItem({
        ...item,
        quantity: Math.max(0, item.quantity + diff),
      })
    );
  }

  copyToShoppingList(item: IStorageItem) {
    this.#store.dispatch(StorageActions.copyToShoppinglist(item));
  }
}
