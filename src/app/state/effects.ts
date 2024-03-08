import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { exhaustMap, map, take } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IDatastore } from '../@types/types';
import { DatabaseService } from '../services/database.service';
import { ApplicationActions } from './application.actions';
import { GlobalsActions } from './globals/globals.actions';
import { selectGlobalsState } from './globals/globals.selector';
import { SettingsActions } from './settings/settings.actions';
import { selectSettingsState } from './settings/settings.selector';
import { ShoppingListActions } from './shoppinglist/shopping-list.actions';
import { selectShoppinglistState } from './shoppinglist/shopping-list.selector';
import { StorageActions } from './storage/storage.actions';
import { selectStorageState } from './storage/storage.selector';

@Injectable({ providedIn: 'root' })
export class Effects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  initializeApplication$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ApplicationActions.load),
      exhaustMap(() =>
        fromPromise(this.#database.create()).pipe(
          map((data) => ApplicationActions.loadedSuccessfully(data))
        )
      )
    );
  });

  saveStorageOnChange$ = this.#createSaveEffect(
    'storage',
    selectStorageState,
    StorageActions.addItem,
    StorageActions.removeItem,
    StorageActions.updateItem
  );

  saveGlobalsOnChange$ = this.#createSaveEffect(
    'globals',
    selectGlobalsState,
    GlobalsActions.addItem,
    GlobalsActions.removeItem,
    GlobalsActions.updateItem
  );

  saveShoppinglistOnChange$ = this.#createSaveEffect(
    'shoppinglist',
    selectShoppinglistState,
    ShoppingListActions.addItem,
    ShoppingListActions.removeItem,
    ShoppingListActions.updateItem
  );

  saveSettingsOnChange$ = this.#createSaveEffect(
    'settings',
    selectSettingsState,
    SettingsActions.updateSettings
  );

  #createSaveEffect<T extends keyof IDatastore>(
    storageKey: T,
    select: (state: any) => IDatastore[T],
    ...events: ActionCreator<any>[]
  ) {
    return createEffect(
      () => {
        return this.#actions$.pipe(
          ofType(...events),
          exhaustMap(() =>
            this.#store.select(select).pipe(
              map((value) =>
                fromPromise(this.#database.save(storageKey, value))
              ),
              take(1) // TODO: this closes the obs i think... should be done by better piping i guess
            )
          )
        );
      },
      { dispatch: false }
    );
  }
}
