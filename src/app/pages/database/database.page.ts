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
import { IGlobalItem, IItemList } from '../../@types/types';
import { GlobalListComponent } from '../../components/global-list/global-list.component';
import { LocalListComponent } from '../../components/local-list/local-list.component';
import { AddItemDialog } from '../../dialogs/add-item-dialog/add-item.dialog';
import { EditGlobalItemDialogComponent } from '../../dialogs/edit-global-item-dialog/edit-global-item-dialog.component';
import { EditLocalItemDialogComponent } from '../../dialogs/edit-local-item-dialog/edit-local-item-dialog.component';
import { DatabaseService } from '../../services/database.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-page-database',
  templateUrl: 'database.page.html',
  styleUrls: ['database.page.scss'],
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
export class DatabasePage implements OnInit {
  @ViewChild(LocalListComponent, { static: true })
  listComponent!: LocalListComponent;

  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);

  items!: IItemList<IGlobalItem>;

  isEditing = false;
  editItem: IGlobalItem | null | undefined;
  mode: 'update' | 'create' = 'create';

  constructor() {
    addIcons({ add, remove });
  }

  ngOnInit(): void {
    this.items = this.#database.all;
    this.editItem = null;
  }

  async saveItemToDatabase(item?: IGlobalItem) {
    this.isEditing = false;
    if (!item) return;

    await this.#database.addOrUpdateGlobalItem(item);
    this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('database.toast.add', {
        name: item.name,
        total: item.quantity,
      })
    );
  }

  showEditDialog(item: IGlobalItem | null, mode: 'update' | 'create') {
    this.mode = mode;
    this.isEditing = true;
    this.editItem = item;
  }

  async removeItemFromDatabase(item: IGlobalItem) {
    await this.#database.deleteItem(item, this.items);
    this.listComponent.refresh();
    await this.#uiService.showToast(
      this.translate.instant('database.toast.remove', { name: item.name })
    );
  }
}
