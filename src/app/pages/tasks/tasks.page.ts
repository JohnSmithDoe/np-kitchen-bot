import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonButton, IonContent, IonModal } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IonViewWillEnter,
  ITaskItem,
  TItemListSortType,
} from '../../@types/types';
import { TaskItemComponent } from '../../components/item-list-items/task-item/task-item.component';
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
import { EditTaskItemDialogComponent } from '../../dialogs/edit-task-item-dialog/edit-task-item-dialog.component';
import { CategoriesPipe } from '../../pipes/categories.pipe';
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import { TasksActions } from '../../state/tasks/tasks.actions';

@Component({
  selector: 'app-page-task',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss'],
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
    TaskItemComponent,
    EditTaskItemDialogComponent,
    CategoriesPipe,
    IonButton,
    AsyncPipe,
    ItemListSearchResultComponent,
    ListPageComponent,
  ],
})
export class TasksPage implements IonViewWillEnter {
  readonly #store = inject(Store);

  constructor() {
    addIcons({ add, remove });
  }

  ionViewWillEnter(): void {
    this.#store.dispatch(TasksActions.enterPage());
  }

  removeItem(item: ITaskItem) {
    this.#store.dispatch(TasksActions.removeItem(item));
  }

  showEditDialog(item: ITaskItem) {
    this.#store.dispatch(DialogsActions.showEditDialog(item, '_tasks'));
  }

  setSortMode(type: TItemListSortType) {
    this.#store.dispatch(TasksActions.updateSort(type, 'toggle'));
  }
}
