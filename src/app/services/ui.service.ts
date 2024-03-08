import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { TColor } from '../@types/types';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  readonly #toastController = inject(ToastController);
  readonly #translate = inject(TranslateService);

  async showToast(message: string, color: TColor = 'success') {
    const toast = await this.#toastController.create({
      position: 'bottom',
      duration: 1500,
      color,
      message,
    });
    await toast.present();
  }

  showAddItemToast(name: string, quantity?: number) {
    const msg = this.#translate.instant('toast.add.item', {
      name,
      quantity,
    });
    return this.showToast(msg);
  }

  showUpdateItemToast(name: string) {
    const msg = this.#translate.instant('toast.update.item', {
      name,
    });
    return this.showToast(msg);
  }
  showRemoveItemToast(name: string) {
    const msg = this.#translate.instant('toast.remove.item', {
      name,
    });
    return this.showToast(msg, 'warning');
  }
}
