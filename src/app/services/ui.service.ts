import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { TColor } from '../@types/types';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  readonly #toastController = inject(ToastController);

  async showToast(message: string, color: TColor = 'success') {
    const toast = await this.#toastController.create({
      position: 'bottom',
      duration: 1500,
      color,
      message,
    });
    await toast.present();
  }
}
