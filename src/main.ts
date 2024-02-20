import {APP_INITIALIZER, enableProdMode, importProvidersFrom} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouteReuseStrategy} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {IonicStorageModule} from "@ionic/storage-angular";
import {AppComponent} from './app/app.component';

import {routes} from './app/app.routes';
import {DatabaseService} from "./app/services/database.service";
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({animated: true, mode: "md"}),
    importProvidersFrom(IonicStorageModule.forRoot({name: 'np-kitchen-helper', dbKey: 'npKitchenHelper', description: 'np-kitchen-helper storage', storeName:'npKitchenHelper'})),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: (db: DatabaseService) => () => db.initialize(),
      multi: true,
      deps: [DatabaseService]
    }
  ],
});
