import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { TAllItemTypes, TColor, TUpdateDTO } from '../@types/types';
import { hasQuantity } from '../app.utils';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  readonly #toastController = inject(ToastController);
  readonly translate = inject(TranslateService);

  async showToast(message: string, color: TColor = 'success') {
    const toast = await this.#toastController.create({
      position: 'bottom',
      positionAnchor: 'footer',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
        },
      ],
      duration: 1500,
      color,
      message,
    });
    await toast.present();
  }

  showAddItemToast(name: string) {
    const msg = this.translate.instant('toast.add.item', {
      name,
    });
    return this.showToast(msg);
  }

  showUpdateItemToast(item: TUpdateDTO<TAllItemTypes>) {
    const msg = hasQuantity(item)
      ? this.translate.instant('toast.update.item.with.quantity', {
          name: item.name,
          quantity: item.quantity,
        })
      : this.translate.instant('toast.update.item', {
          name: item.name,
        });

    return this.showToast(msg);
  }
  showRemoveItemToast(name: string) {
    const msg = this.translate.instant('toast.remove.item', {
      name,
    });
    return this.showToast(msg, 'warning');
  }
  showCopyToShoppingListToast(name: string, quantity: number) {
    const msg = this.translate.instant('toast.moved.item.shopping', {
      name,
      quantity,
    });
    return this.showToast(msg);
  }

  showItemContainedToast(name: string) {
    const msg = this.translate.instant('toast.add.item.failure', {
      name,
    });
    return this.showToast(msg, 'medium');
  }

  showMoveShoppingToStorage(count: number) {
    const msg = this.translate.instant('toast.add.shopping.to.storage', {
      count,
    });
    return this.showToast(msg, 'success');
  }
}
