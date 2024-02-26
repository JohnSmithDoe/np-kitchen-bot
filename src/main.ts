import {HttpClient, HttpClientModule} from "@angular/common/http";
import {APP_INITIALIZER, enableProdMode, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouteReuseStrategy} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {IonicStorageModule} from "@ionic/storage-angular";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AppComponent} from './app/app.component';

import {routes} from './app/app.routes';
import {DatabaseService} from "./app/services/database.service";
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

void bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({animated: true, mode: "md"}),
    importProvidersFrom(IonicStorageModule.forRoot({
      name: 'np-kitchen-helper',
      dbKey: 'npKitchenHelper',
      description: 'np-kitchen-helper storage',
      storeName: 'npKitchenHelper'
    }),),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'de',
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }),
    ),
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (db: DatabaseService) => () => db.initialize(),
      multi: true,
      deps: [DatabaseService]
    }
  ],
});
