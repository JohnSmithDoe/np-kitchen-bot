import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonButton, IonContent, IonModal } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { IGlobalItem, IonViewWillEnter } from '../../@types/types';
import { GlobalItemComponent } from '../../components/item-list-items/global-item/global-item.component';
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
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import { GlobalsActions } from '../../state/globals/globals.actions';
import { selectGlobalsState } from '../../state/globals/globals.selector';

@Component({
  selector: 'app-page-database',
  templateUrl: 'globals.page.html',
  styleUrls: ['globals.page.scss'],
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
    GlobalItemComponent,
    EditStorageItemDialogComponent,
    AsyncPipe,
    ItemListSearchResultComponent,
    IonButton,
    ListPageComponent,
  ],
})
export class GlobalsPage implements IonViewWillEnter {
  readonly #store = inject(Store);

  rxState$ = this.#store.select(selectGlobalsState);

  ionViewWillEnter(): void {
    this.#store.dispatch(GlobalsActions.enterPage());
  }

  async removeItem(item: IGlobalItem) {
    this.#store.dispatch(GlobalsActions.removeItem(item));
  }

  showEditDialog(item: IGlobalItem) {
    this.#store.dispatch(DialogsActions.showEditDialog(item, '_globals'));
  }
}
