import { JsonPipe, registerLocaleData } from '@angular/common';
import * as de from '@angular/common/locales/de';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
} from '@capacitor-mlkit/barcode-scanning';
import { Share } from '@capacitor/share';
import {
  AlertController,
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { selectShoppingItems } from './state/shopping/shopping.selector';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    JsonPipe,
    IonButton,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    RouterLink,
    IonMenuToggle,
    TranslateModule,
  ],
})
export class AppComponent implements OnInit {
  readonly #alertController = inject(AlertController);
  readonly #store = inject(Store);

  isSupported = false;
  barcodes: Barcode[] = [];

  constructor() {
    registerLocaleData(de.default);
  }

  async ngOnInit() {
    this.isSupported = (await BarcodeScanner.isSupported()).supported;
  }

  async isGoogleBarcodeScannerModuleAvailable() {
    const { available } =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    return available;
  }

  async installGoogleBarcodeScannerModule() {
    BarcodeScanner.addListener(
      'googleBarcodeScannerModuleInstallProgress',
      (ev) => {
        console.log(ev.progress, ev.state);
        if (ev.progress ?? 0 >= 100) {
          console.log('did install module now scanning');
          document.querySelector('body')?.classList.add('scanner-active');
          BarcodeScanner.scan()
            .then((result) => {
              console.log(result);
              this.barcodes.push(...result.barcodes);
            })
            .catch((err) => console.error(err));
        }
      }
    );
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  async scan(): Promise<void> {
    if (this.isSupported) {
      console.log('check permissions');
      const granted = await this.#requestPermissions();
      if (!granted) {
        await this.#presentAlert();
        return;
      }
      console.log(this.isSupported);
      const hasModule = await this.isGoogleBarcodeScannerModuleAvailable();
      console.log(hasModule, 'hase mod but starting it');
      document.querySelector('body')?.classList.add('scanner-active');
      await BarcodeScanner.startScan({ formats: [BarcodeFormat.Ean13] });
      // if (!hasModule) {
      //   console.log(hasModule, 'installing module');
      //   await this.installGoogleBarcodeScannerModule();
      //   console.log('after await');
      //
      // }
    }
  }

  async shareShoppingList() {
    const list = await firstValueFrom(this.#store.select(selectShoppingItems));
    const text =
      list?.map((item) => item.quantity + ' x ' + item.name).join('\n') ??
      'Nix drin';
    await Share.share({
      title: 'Einkaufsliste',
      text,
      dialogTitle: 'Share with buddies',
    });
  }

  async #requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async #presentAlert(): Promise<void> {
    const alert = await this.#alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
