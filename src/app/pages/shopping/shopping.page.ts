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
import { IonViewWillEnter, IShoppingItem } from '../../@types/types';
import { ShoppingItemComponent } from '../../components/item-list-items/shopping-item/shopping-item.component';
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
import { EditShoppingItemDialogComponent } from '../../dialogs/edit-shopping-item-dialog/edit-shopping-item-dialog.component';
import { ShoppingActionSheetComponent } from '../../dialogs/shopping-action-sheet/shopping-action-sheet.component';
import { CategoriesPipe } from '../../pipes/categories.pipe';
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import { ShoppingActions } from '../../state/shopping/shopping.actions';

@Component({
  selector: 'app-page-shopping',
  templateUrl: 'shopping.page.html',
  styleUrls: ['shopping.page.scss'],
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
    ShoppingItemComponent,
    EditShoppingItemDialogComponent,
    CategoriesPipe,
    AsyncPipe,
    ItemListSearchResultComponent,
    IonButton,
    IonButtons,
    IonIcon,
    ShoppingActionSheetComponent,
    ListPageComponent,
  ],
})
export class ShoppingPage implements IonViewWillEnter {
  readonly #store = inject(Store);

  ionViewWillEnter(): void {
    this.#store.dispatch(ShoppingActions.enterPage());
  }

  removeItem(item: IShoppingItem) {
    this.#store.dispatch(ShoppingActions.removeItem(item));
  }

  showEditDialog(item: IShoppingItem) {
    this.#store.dispatch(DialogsActions.showEditDialog(item, '_shopping'));
  }

  changeQuantity(item: IShoppingItem, diff: number) {
    this.#store.dispatch(
      ShoppingActions.updateItem({
        ...item,
        quantity: Math.max(0, item.quantity + diff),
      })
    );
  }

  buyItem(item: IShoppingItem) {
    this.#store.dispatch(ShoppingActions.buyItem(item));
  }
}
