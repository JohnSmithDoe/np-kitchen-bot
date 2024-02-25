import {inject, Injectable} from '@angular/core';
import {ToastController} from "@ionic/angular/standalone";

@Injectable({
  providedIn: 'root'
})
export class UiService {

  readonly #toastController = inject(ToastController);

  async showToast(message: string) {
    const toast = await this.#toastController.create({
      position: 'bottom',
      duration: 1500,
      color: "success",
      message
    })
    await toast.present();
  }
}
