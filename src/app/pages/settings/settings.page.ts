import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonItem,
  IonList,
  IonListHeader,
  IonToggle,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { ISettings } from '../../@types/types';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { DatabaseService } from '../../services/database.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-page-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [
    PageHeaderComponent,
    IonContent,
    TranslateModule,
    IonList,
    IonItem,
    IonToggle,
    IonListHeader,
  ],
})
export class SettingsPage {
  readonly #database = inject(DatabaseService);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);
  readonly settings: ISettings;

  constructor() {
    addIcons({ add, remove });
    this.settings = this.#database.settings;
  }

  async save() {
    await this.#uiService.showToast(
      this.translate.instant('toast.save.setting')
    );
    return this.#database.save();
  }

  toggleQuickAdd() {
    this.settings.showQuickAdd = !this.settings.showQuickAdd;
    return this.save();
  }
  toggleQuickAddGlobal() {
    this.settings.showQuickAddGlobal = !this.settings.showQuickAddGlobal;
    return this.save();
  }
}
