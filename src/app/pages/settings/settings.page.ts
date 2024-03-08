import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonContent,
  IonItem,
  IonList,
  IonListHeader,
  IonToggle,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { UiService } from '../../services/ui.service';
import { selectSettingsState } from '../../state/settings/settings.selector';

@Component({
  selector: 'app-page-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    IonContent,
    TranslateModule,
    IonList,
    IonItem,
    IonToggle,
    IonListHeader,
    AsyncPipe,
  ],
})
export class SettingsPage {
  readonly #store = inject(Store);
  readonly #uiService = inject(UiService);
  readonly translate = inject(TranslateService);
  readonly settings$ = this.#store.select(selectSettingsState);

  constructor() {
    addIcons({ add, remove });
  }

  async save() {
    await this.#uiService.showToast(
      this.translate.instant('toast.save.setting')
    );
    // this.#database.saveSettings();
  }

  toggleQuickAdd() {
    // this.settings.showQuickAdd = !this.settings.showQuickAdd;
    return this.save();
  }
  toggleQuickAddGlobal() {
    // this.settings.showQuickAddGlobal = !this.settings.showQuickAddGlobal;
    return this.save();
  }
}
