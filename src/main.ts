import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';

import { routes } from './app/app.routes';
import { DatabaseService } from './app/services/database.service';
import { ApplicationEffects } from './app/state/application.effects';
import { CategoriesEffects } from './app/state/categories/categories.effects';
import { categoriesReducer } from './app/state/categories/categories.reducer';
import { editGlobalItemReducer } from './app/state/edit-global-item/edit-global-item.reducer';
import { editShoppingItemReducer } from './app/state/edit-shopping-item/edit-shopping-item.reducer';
import { editStorageItemReducer } from './app/state/edit-storage-item/edit-storage-item.reducer';
import { GlobalsEffects } from './app/state/globals/globals.effects';
import { globalsReducer } from './app/state/globals/globals.reducer';
import { MessageEffects } from './app/state/message.effects';
import { quickAddReducer } from './app/state/quick-add/quick-add.reducer';
import { SettingsEffects } from './app/state/settings/settings.effects';
import { settingsReducer } from './app/state/settings/settings.reducer';
import { ShoppingEffects } from './app/state/shopping/shopping.effects';
import { shoppingReducer } from './app/state/shopping/shopping.reducer';
import { StorageEffects } from './app/state/storage/storage.effects';
import { storageReducer } from './app/state/storage/storage.reducer';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

void bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ animated: true, mode: 'md' }),
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: 'np-kitchen-helper',
        dbKey: 'npKitchenHelper',
        description: 'np-kitchen-helper storage and shopping management',
        storeName: 'npKitchenHelper',
      })
    ),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'de',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    provideStore({
      settings: settingsReducer,
      storage: storageReducer,
      shopping: shoppingReducer,
      globals: globalsReducer,
      categories: categoriesReducer,
      editStorageItem: editStorageItemReducer,
      editShoppingItem: editShoppingItemReducer,
      editGlobalItem: editGlobalItemReducer,
      quickadd: quickAddReducer,
    }),
    {
      provide: LOCALE_ID,
      useValue: 'de-DE',
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (db: DatabaseService) => () => db.initialize(),
      multi: true,
      deps: [DatabaseService],
    },
    provideEffects(
      ApplicationEffects,
      MessageEffects,
      SettingsEffects,
      StorageEffects,
      ShoppingEffects,
      GlobalsEffects,
      CategoriesEffects
    ),
  ],
});
